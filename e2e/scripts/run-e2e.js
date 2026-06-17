#!/usr/bin/env node

const { execSync } = require('node:child_process');

const args = process.argv.slice(2);
const profileArg = args[0] || 'local:@smoke:chrome';
const additionalArgs = args.slice(1).join(' ');

// Parse profile: env:tag:browser
const parts = profileArg.split(':');
const env = parts[0] || 'local';
const tag = parts[1] || '@smoke';
const browser = parts[2] || 'chrome';

// Build full profile string (add playwright helper)
const profile = `${env}:${tag}:${browser}:playwright`;

console.log('═══════════════════════════════════════════════════════════');
console.log('  E2E Test Runner');
console.log('═══════════════════════════════════════════════════════════');
console.log(`  Environment: ${env}`);
console.log(`  Tag:         ${tag}`);
console.log(`  Browser:     ${browser}`);
console.log(`  Profile:     ${profile}`);
console.log('═══════════════════════════════════════════════════════════\n');

// Build command
const cmd = `PROFILE="${profile}" codeceptjs run --features --steps --plugins allure --grep "${tag}" ${additionalArgs}`.trim();

console.log(`Executing: ${cmd}\n`);

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
} catch (error) {
  process.exit(error.status || 1);
}
