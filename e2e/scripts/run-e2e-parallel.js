#!/usr/bin/env node

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const profileArg = args[0] || 'local:@smoke:chrome';
const workers = args[1] || '4';
const additionalArgs = args.slice(2).join(' ');

// Parse profile: env:tag:browser
const parts = profileArg.split(':');
const env = parts[0] || 'local';
const tag = parts[1] || '@smoke';
const browser = parts[2] || 'chrome';

// Build full profile string (add playwright helper)
const profile = `${env}:${tag}:${browser}:playwright`;

console.log('═══════════════════════════════════════════════════════════');
console.log('  E2E Test Runner (Parallel)');
console.log('═══════════════════════════════════════════════════════════');
console.log(`  Environment: ${env}`);
console.log(`  Tag:         ${tag}`);
console.log(`  Browser:     ${browser}`);
console.log(`  Workers:     ${workers}`);
console.log(`  Profile:     ${profile}`);
console.log('═══════════════════════════════════════════════════════════\n');

// Build command (run-workers doesn't support --steps flag)
const cmd = `PROFILE="${profile}" codeceptjs run-workers ${workers} --features --plugins allure --grep "${tag}" ${additionalArgs}`.trim();

console.log(`Executing: ${cmd}\n`);

const showReportInfo = () => {
  const e2eDir = path.join(__dirname, '..');
  const accessibilityReportPath = path.join(e2eDir, 'ACCESSIBILITY_REPORT.md');
  const isAccessibilityTest = tag.includes('@accessibility');
  
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 VIEW TEST REPORT:');
  console.log('   pnpm run allure:open');
  console.log('');
  console.log('📊 REGENERATE & VIEW REPORT:');
  console.log('   pnpm run allure:report');
  
  // Show accessibility report info if accessibility tests were run
  if (isAccessibilityTest && fs.existsSync(accessibilityReportPath)) {
    console.log('');
    console.log('♿ ACCESSIBILITY REPORT:');
    console.log(`   📄 ${accessibilityReportPath}`);
    console.log('   Open with: open ACCESSIBILITY_REPORT.md');
  }
  
  console.log('='.repeat(60));
};

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
  showReportInfo();
} catch (error) {
  showReportInfo();
  process.exit(error.status || 1);
}
