const Helper = require('codeceptjs').Helper;
const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Accessibility Helper for WCAG 2.2 AA, EAA, and ADA compliance testing
 * Uses axe-core for automated accessibility scanning
 */
class AccessibilityHelper extends Helper {
  /**
   * WCAG 2.2 AA rule tags for axe-core
   */
  static WCAG_22_AA_TAGS = [
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
    'best-practice',
  ];

  /**
   * Run full accessibility scan on current page
   * @param {Object} options - Scan options
   * @param {string[]} options.tags - axe-core tags to include (default: WCAG 2.2 AA)
   * @param {string[]} options.exclude - CSS selectors to exclude from scan
   * @param {string[]} options.include - CSS selectors to include in scan
   * @param {string[]} options.disableRules - Rule IDs to disable
   * @returns {Object} Accessibility scan results
   */
  async runAccessibilityScan(options = {}) {
    const { page } = this.helpers.Playwright;
    
    const tags = options.tags || AccessibilityHelper.WCAG_22_AA_TAGS;
    
    let axeBuilder = new AxeBuilder({ page })
      .withTags(tags);

    if (options.exclude && options.exclude.length > 0) {
      options.exclude.forEach(selector => {
        axeBuilder = axeBuilder.exclude(selector);
      });
    }

    if (options.include && options.include.length > 0) {
      options.include.forEach(selector => {
        axeBuilder = axeBuilder.include(selector);
      });
    }

    if (options.disableRules && options.disableRules.length > 0) {
      axeBuilder = axeBuilder.disableRules(options.disableRules);
    }

    const results = await axeBuilder.analyze();
    return results;
  }

  /**
   * Run WCAG 2.2 AA compliance scan
   * @param {Object} options - Additional scan options
   * @returns {Object} Scan results
   */
  async runWCAG22AAScan(options = {}) {
    return await this.runAccessibilityScan({
      ...options,
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    });
  }

  /**
   * Run EAA (European Accessibility Act) compliance scan
   * EAA aligns with EN 301 549 which references WCAG 2.1 AA
   * @param {Object} options - Additional scan options
   * @returns {Object} Scan results
   */
  async runEAAScan(options = {}) {
    return await this.runAccessibilityScan({
      ...options,
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
  }

  /**
   * Run ADA (Americans with Disabilities Act) compliance scan
   * ADA typically references WCAG 2.0/2.1 AA
   * @param {Object} options - Additional scan options
   * @returns {Object} Scan results
   */
  async runADAScan(options = {}) {
    return await this.runAccessibilityScan({
      ...options,
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
  }

  /**
   * Assert no accessibility violations
   * @param {Object} results - Scan results from runAccessibilityScan
   * @param {string[]} allowedImpacts - Impacts to allow (e.g., ['minor'])
   * @throws {Error} If violations are found
   */
  assertNoViolations(results, allowedImpacts = []) {
    const violations = results.violations.filter(
      v => !allowedImpacts.includes(v.impact)
    );

    if (violations.length > 0) {
      const violationDetails = this._formatViolations(violations);
      throw new Error(
        `Accessibility violations found:\n${violationDetails}`
      );
    }
  }

  /**
   * Assert no critical or serious violations
   * @param {Object} results - Scan results
   * @throws {Error} If critical/serious violations found
   */
  assertNoCriticalViolations(results) {
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      const violationDetails = this._formatViolations(criticalViolations);
      throw new Error(
        `Critical/Serious accessibility violations found:\n${violationDetails}`
      );
    }
  }

  /**
   * Get violation summary
   * @param {Object} results - Scan results
   * @returns {Object} Summary with counts by impact level
   */
  getViolationSummary(results) {
    const summary = {
      total: results.violations.length,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
    };

    results.violations.forEach(v => {
      if (summary[v.impact] !== undefined) {
        summary[v.impact]++;
      }
    });

    return summary;
  }

  /**
   * Check specific accessibility rule
   * @param {string} ruleId - axe-core rule ID (e.g., 'color-contrast')
   * @returns {Object} Results for specific rule
   */
  async checkRule(ruleId) {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([ruleId])
      .analyze();

    return {
      ruleId,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
    };
  }

  /**
   * Check color contrast compliance
   * @returns {Object} Color contrast check results
   */
  async checkColorContrast() {
    return await this.checkRule('color-contrast');
  }

  /**
   * Check keyboard accessibility
   * @returns {Object} Keyboard accessibility results
   */
  async checkKeyboardAccessibility() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'focus-order-semantics',
        'focusable-content',
        'focusable-disabled',
        'focusable-no-name',
        'frame-focusable-content',
        'scrollable-region-focusable',
        'skip-link',
        'tabindex',
      ])
      .analyze();

    return results;
  }

  /**
   * Check image accessibility (alt text, etc.)
   * @returns {Object} Image accessibility results
   */
  async checkImageAccessibility() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'image-alt',
        'image-redundant-alt',
        'input-image-alt',
        'role-img-alt',
        'svg-img-alt',
      ])
      .analyze();

    return results;
  }

  /**
   * Check form accessibility
   * @returns {Object} Form accessibility results
   */
  async checkFormAccessibility() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'autocomplete-valid',
        'form-field-multiple-labels',
        'label',
        'label-content-name-mismatch',
        'label-title-only',
        'select-name',
      ])
      .analyze();

    return results;
  }

  /**
   * Check heading structure
   * @returns {Object} Heading structure results
   */
  async checkHeadingStructure() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'empty-heading',
        'heading-order',
        'page-has-heading-one',
      ])
      .analyze();

    return results;
  }

  /**
   * Check ARIA usage
   * @returns {Object} ARIA compliance results
   */
  async checkARIACompliance() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'aria-allowed-attr',
        'aria-allowed-role',
        'aria-command-name',
        'aria-dialog-name',
        'aria-hidden-body',
        'aria-hidden-focus',
        'aria-input-field-name',
        'aria-meter-name',
        'aria-progressbar-name',
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent',
        'aria-roledescription',
        'aria-roles',
        'aria-text',
        'aria-toggle-field-name',
        'aria-tooltip-name',
        'aria-valid-attr',
        'aria-valid-attr-value',
      ])
      .analyze();

    return results;
  }

  /**
   * Check link accessibility
   * @returns {Object} Link accessibility results
   */
  async checkLinkAccessibility() {
    const { page } = this.helpers.Playwright;
    
    const results = await new AxeBuilder({ page })
      .withRules([
        'link-in-text-block',
        'link-name',
        'identical-links-same-purpose',
      ])
      .analyze();

    return results;
  }

  /**
   * Scan specific element/region
   * @param {string} selector - CSS selector for element to scan
   * @param {Object} options - Scan options
   * @returns {Object} Scan results for element
   */
  async scanElement(selector, options = {}) {
    const { page } = this.helpers.Playwright;
    
    const tags = options.tags || AccessibilityHelper.WCAG_22_AA_TAGS;
    
    const results = await new AxeBuilder({ page })
      .include(selector)
      .withTags(tags)
      .analyze();

    return results;
  }

  /**
   * Generate accessibility report
   * @param {Object} results - Scan results
   * @param {string} pageName - Name of the page being tested
   * @returns {Object} Formatted report
   */
  generateReport(results, pageName = 'Page') {
    const summary = this.getViolationSummary(results);
    
    return {
      pageName,
      timestamp: new Date().toISOString(),
      url: results.url,
      summary,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        wcagTags: v.tags.filter(t => t.startsWith('wcag')),
        nodes: v.nodes.length,
        elements: v.nodes.map(n => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.map(i => ({
        id: i.id,
        description: i.description,
        nodes: i.nodes.length,
      })),
    };
  }

  /**
   * Save accessibility report to file
   * @param {Object} results - Scan results
   * @param {string} filename - Output filename
   */
  async saveReport(results, filename) {
    const fs = require('fs');
    const path = require('path');
    
    const report = this.generateReport(results);
    const outputDir = './output/accessibility';
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filepath = path.join(outputDir, `${filename}.json`);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    console.log(`Accessibility report saved to: ${filepath}`);
    return filepath;
  }

  /**
   * Generate markdown accessibility report
   * @param {Object} results - Scan results
   * @param {string} pageName - Name of the page tested
   * @param {string} scanType - Type of scan (WCAG 2.2 AA, EAA, ADA)
   * @returns {string} Markdown formatted report
   */
  generateMarkdownReport(results, pageName = 'Page', scanType = 'WCAG 2.2 AA') {
    const summary = this.getViolationSummary(results);
    const timestamp = new Date().toISOString();
    
    let md = `## ${pageName} - ${scanType} Scan\n\n`;
    md += `**URL:** ${results.url}\n`;
    md += `**Timestamp:** ${timestamp}\n\n`;
    
    md += `### Summary\n\n`;
    md += `| Metric | Count |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Violations | ${summary.total} |\n`;
    md += `| Critical | ${summary.critical} |\n`;
    md += `| Serious | ${summary.serious} |\n`;
    md += `| Moderate | ${summary.moderate} |\n`;
    md += `| Minor | ${summary.minor} |\n`;
    md += `| Passes | ${summary.passes} |\n`;
    md += `| Incomplete | ${summary.incomplete} |\n\n`;
    
    if (results.violations.length > 0) {
      md += `### Violations\n\n`;
      
      results.violations.forEach((v, index) => {
        const impactEmoji = {
          critical: '🔴',
          serious: '🟠',
          moderate: '🟡',
          minor: '🟢',
        }[v.impact] || '⚪';
        
        md += `#### ${index + 1}. ${impactEmoji} [${v.impact.toUpperCase()}] ${v.id}\n\n`;
        md += `**Description:** ${v.help}\n\n`;
        md += `**WCAG:** ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}\n\n`;
        md += `**Help:** [${v.helpUrl}](${v.helpUrl})\n\n`;
        md += `**Affected Elements (${v.nodes.length}):**\n\n`;
        
        v.nodes.slice(0, 5).forEach(node => {
          md += `- \`${node.target.join(' > ')}\`\n`;
          if (node.failureSummary) {
            md += `  - ${node.failureSummary.split('\n')[0]}\n`;
          }
        });
        
        if (v.nodes.length > 5) {
          md += `- ... and ${v.nodes.length - 5} more elements\n`;
        }
        md += '\n';
      });
    } else {
      md += `### ✅ No Violations Found\n\n`;
    }
    
    md += `---\n\n`;
    return md;
  }

  /**
   * Append results to ACCESSIBILITY_REPORT.md
   * @param {Object} results - Scan results
   * @param {string} pageName - Name of the page tested
   * @param {string} scanType - Type of scan
   */
  appendToMarkdownReport(results, pageName = 'Page', scanType = 'WCAG 2.2 AA') {
    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join(__dirname, '..', 'ACCESSIBILITY_REPORT.md');
    const markdownContent = this.generateMarkdownReport(results, pageName, scanType);
    
    // Check if file exists and if this is a new test run
    const header = `# Accessibility Test Report\n\n`;
    const runHeader = `## Test Run: ${new Date().toLocaleString()}\n\n`;
    
    let existingContent = '';
    if (fs.existsSync(reportPath)) {
      existingContent = fs.readFileSync(reportPath, 'utf8');
    }
    
    // If file doesn't exist or is from a previous run, start fresh
    if (!existingContent || !existingContent.includes(runHeader.trim().substring(0, 20))) {
      fs.writeFileSync(reportPath, header + runHeader + markdownContent);
    } else {
      // Append to existing run
      fs.appendFileSync(reportPath, markdownContent);
    }
    
    console.log(`Accessibility report updated: ${reportPath}`);
  }

  /**
   * Initialize a fresh markdown report for a new test run
   */
  initializeMarkdownReport() {
    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join(__dirname, '..', 'ACCESSIBILITY_REPORT.md');
    const header = `# Accessibility Test Report\n\n`;
    const runInfo = `**Generated:** ${new Date().toLocaleString()}\n\n`;
    const divider = `---\n\n`;
    
    fs.writeFileSync(reportPath, header + runInfo + divider);
    console.log(`Initialized fresh accessibility report: ${reportPath}`);
  }

  /**
   * Format violations for error message
   * @private
   */
  _formatViolations(violations) {
    return violations.map(v => {
      const elements = v.nodes.map(n => `  - ${n.target.join(' > ')}`).join('\n');
      return `
[${v.impact.toUpperCase()}] ${v.id}: ${v.help}
WCAG: ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}
Help: ${v.helpUrl}
Affected elements (${v.nodes.length}):
${elements}`;
    }).join('\n---\n');
  }
}

module.exports = AccessibilityHelper;
