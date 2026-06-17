# Use slim Node image instead of full Playwright image
FROM node:20-slim

WORKDIR /app

# Install system dependencies for Chromium + Java for Allure reports
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    fonts-liberation \
    default-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (skip browser download during npm install)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN pnpm install --frozen-lockfile

# Install only Chromium browser
RUN npx playwright install chromium

# Copy test files
COPY . .

# Set environment variables
ENV CI=true

# Default profile (can be overridden via docker run or docker-compose)
ENV PROFILE=local:@smoke:chromeHeadless

# Default command - uses PROFILE env var
# Usage: pnpm e2e <profile> or pnpm e2e:parallel <profile> <workers>
CMD ["sh", "-c", "pnpm e2e $PROFILE"]
