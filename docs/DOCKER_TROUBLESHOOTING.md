# Docker Troubleshooting Guide

## Volume Mount Permission Error

### Symptom

When running Docker Compose commands, you see errors like:

```bash
error while creating mount source path '.../e2e/<directory>': chown /path/to/e2e/<directory>: permission denied
```

Common directories affected:

- `output` (contains allure-results, screenshots, traces)
- `allure-report` (generated HTML report)

### Cause

Docker tries to create and change ownership of the mounted volume directory but lacks permission on the host filesystem.

### Solution

Pre-create all required directories with open permissions:

```bash
# Navigate to the e2e directory
cd /path/to/your/project/e2e

# Create all required directories and set permissions
# Note: allure-results is created inside output directory by the test framework
mkdir -p output allure-report
chmod 777 output allure-report
```

Then retry your command:

```bash
# Run tests
docker-compose up e2e-tests

# View Allure report
docker-compose up -d allure-report && open http://localhost:5050
```

### Alternative Solutions

If the issue persists:

1. **Reset Docker file sharing permissions:**
   - Open Docker Desktop
   - Go to **Settings → Resources → File Sharing**
   - Ensure your project path is included in the allowed paths

2. **Restart Docker Desktop:**
   - Sometimes a restart resolves permission caching issues

## Test Filtering in Docker

### Default Behavior

When running tests in Docker (`CI=true`), the following test types are **automatically excluded**:

- `@apiOnly` - API-only tests (no UI)
- `@performance` - Performance/response time tests
- `@playwrightMCP` - Playwright MCP browser tests
- `@mcp` - MCP-related tests

This ensures Docker runs only **UI tests** and **UI+API combination tests**.

### Running Specific Test Types

To override the default exclusions, set a custom PROFILE:

```bash
# Run all tests including API-only
PROFILE=local:@smoke:chromeHeadless:playwright:false: docker-compose up e2e-tests

# Run only API tests
PROFILE=local:@apiOnly:chromeHeadless docker-compose up e2e-tests
```

## Viewing Allure Reports

After tests complete, the Allure report is generated in `./allure-report`.

```bash
# Start the report server
docker-compose up -d allure-report

# Open in browser
open http://localhost:5050
```

**Note:** The report server serves static HTML files. Make sure tests have completed and generated the report before starting the server.

## Stale Allure Report Showing at localhost:5050

### Symptom

After deleting `allure-report/` or `allure-results/` locally, you still see old test results when visiting `http://localhost:5050` — including results from previous test runs (e.g., email tests) that you didn't just run.

### Cause

The `allure-report` service in `docker-compose.yml` is an `nginx:alpine` container that mounts `./allure-report` as a **read-only volume at startup**:

```yaml
allure-report:
  image: nginx:alpine
  ports:
    - "5050:80"
  volumes:
    - ./allure-report:/usr/share/nginx/html:ro
```

Deleting files locally **does not affect a running container** — the volume bind only takes effect when the container starts. If the nginx container is still running, it continues to serve whatever was mounted when it last started.

### Solution

Stop the container, clear the directory, then restart:

```bash
# Stop the allure-report container
docker-compose down

# Ensure allure-report directory is empty or regenerated
rm -rf allure-report && mkdir -p allure-report

# Restart only the report server
docker-compose up -d allure-report
```

The server will now reflect the current (empty or updated) state of `./allure-report`.

## Cleaning Up Docker Resources

To prevent memory overload, regularly clean up unused Docker resources.

### Quick Cleanup

```bash
# Stop and remove containers for this project
docker-compose down

# Remove the project's images
docker-compose down --rmi local
```

### Full Cleanup

```bash
# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Remove all unused resources (containers, images, networks, volumes)
docker system prune -f

# Nuclear option: Remove EVERYTHING including named volumes
docker system prune -a --volumes -f
```

### Rebuild Fresh

```bash
# Clean rebuild (removes old image first)
docker-compose down --rmi local && docker-compose build --no-cache

# Or just rebuild with cache
docker-compose build
```

### Check Docker Disk Usage

```bash
# See what's using space
docker system df

# Detailed breakdown
docker system df -v
```
