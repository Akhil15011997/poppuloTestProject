const Helper = require('codeceptjs').Helper;

class PlaywrightHelper extends Helper {
  /**
   * Hook that runs before each test - blocks ads at network level
   */
  async _before() {
    const { page } = this.helpers.Playwright;
    if (page) {
      await this._setupAdBlocker(page);
    }
  }

  /**
   * Setup ad blocker by intercepting ad-related network requests
   */
  async _setupAdBlocker(page) {
    const adPatterns = [
      '**/googlesyndication.com/**',
      '**/googleadservices.com/**',
      '**/doubleclick.net/**',
      '**/google-analytics.com/**',
      '**/googletagmanager.com/**',
      '**/facebook.com/tr/**',
      '**/connect.facebook.net/**',
      '**/*.ads.*',
      '**/ads/**',
      '**/adserver/**',
      '**/pagead/**',
      '**/adsense/**',
    ];

    try {
      for (const pattern of adPatterns) {
        await page.route(pattern, route => route.abort());
      }
    } catch (e) {
      // Ignore if route already set
    }
  }

  /**
   * Remove ad elements from the page DOM
   */
  async removeAds() {
    const { page } = this.helpers.Playwright;
    await page.evaluate(() => {
      // Remove ad iframes
      document.querySelectorAll('iframe[src*="google"], iframe[id*="aswift"], iframe[id*="google_ads"]').forEach(el => el.remove());
      // Remove ad containers
      document.querySelectorAll('ins.adsbygoogle, [class*="ad-"], [id*="ad-"], [class*="ads-"]').forEach(el => el.remove());
      // Remove overlays
      document.querySelectorAll('.modal-backdrop, [class*="overlay"]').forEach(el => {
        if (el.style.position === 'fixed' || el.style.position === 'absolute') {
          el.remove();
        }
      });
    });
  }

  /**
   * Force click element using JavaScript (bypasses overlays)
   */
  async forceClick(locator) {
    const { page } = this.helpers.Playwright;
    const locatorString = this._getLocatorString(locator);
    const element = page.locator(locatorString).first();
    await element.evaluate(el => el.click());
  }

  /**
   * Wait for element to be visible and stable before interaction
   */
  async waitForStable(locator, timeout = 10) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.waitFor({ state: 'visible', timeout: timeout * 1000 });
    return element;
  }

  /**
   * Click element and wait for URL to change
   */
  async clickAndWaitForNavigation(locator, waitUntil = 'domcontentloaded') {
    const { page } = this.helpers.Playwright;
    const currentUrl = page.url();
    await this.helpers.Playwright.click(locator);
    await page.waitForURL(url => url.toString() !== currentUrl, { waitUntil });
  }

  /**
   * Click element and wait for specific URL pattern
   */
  async clickAndWaitForURL(locator, urlPattern, timeout = 10000) {
    const { page } = this.helpers.Playwright;
    await this.helpers.Playwright.click(locator);
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Click element and wait for a new tab to open
   */
  async clickAndWaitForNewTab(locator, state = 'domcontentloaded') {
    const { browserContext, page } = this.helpers.Playwright;
    const existingPages = await browserContext.pages();
    const existingCount = existingPages.length;

    await this.helpers.Playwright.click(locator);

    let newPage;
    for (let i = 0; i < 30; i++) {
      const currentPages = await browserContext.pages();
      if (currentPages.length > existingCount) {
        newPage = currentPages[currentPages.length - 1];
        break;
      }
      await page.waitForTimeout(500);
    }

    if (newPage) {
      await newPage.waitForLoadState(state);
      await this.helpers.Playwright._setPage(newPage);
      await newPage.bringToFront();
      return true;
    }
    return false;
  }

  /**
   * Switch to browser tab by position (1-indexed)
   */
  async switchToBrowserTab(tabPosition) {
    const { browserContext } = this.helpers.Playwright;
    const pages = await browserContext.pages();
    
    if (tabPosition > pages.length || tabPosition < 1) {
      throw new Error(`Tab position ${tabPosition} is out of range. Available tabs: ${pages.length}`);
    }
    
    const targetPage = pages[tabPosition - 1];
    await this.helpers.Playwright._setPage(targetPage);
    await targetPage.bringToFront();
  }

  /**
   * Close current tab and switch to another
   */
  async closeCurrentTab(switchToTab = 1) {
    const { browserContext, page } = this.helpers.Playwright;
    await page.close();
    
    const pages = await browserContext.pages();
    if (pages.length > 0) {
      const targetPage = pages[Math.min(switchToTab - 1, pages.length - 1)];
      await this.helpers.Playwright._setPage(targetPage);
      await targetPage.bringToFront();
    }
  }

  /**
   * Get number of open tabs
   */
  async getTabCount() {
    const { browserContext } = this.helpers.Playwright;
    const pages = await browserContext.pages();
    return pages.length;
  }

  /**
   * Navigate to URL with specific load state
   */
  async goTo(url, loadState = 'domcontentloaded') {
    const { page } = this.helpers.Playwright;
    await page.goto(url, { waitUntil: loadState });
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(locator) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Drag element to target
   */
  async dragToTarget(sourceLocator, targetLocator) {
    const { page } = this.helpers.Playwright;
    const source = await page.locator(this._getLocatorString(sourceLocator));
    const target = await page.locator(this._getLocatorString(targetLocator));
    await source.dragTo(target);
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(locator, timeout = 10) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.waitFor({ state: 'hidden', timeout: timeout * 1000 });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator) {
    const { page } = this.helpers.Playwright;
    try {
      const element = await page.locator(this._getLocatorString(locator));
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get element count
   */
  async getElementCount(locator) {
    const { page } = this.helpers.Playwright;
    const elements = await page.locator(this._getLocatorString(locator));
    return await elements.count();
  }

  /**
   * Wait for specific text to appear on page
   */
  async waitForTextOnPage(text, timeout = 10) {
    const { page } = this.helpers.Playwright;
    await page.waitForSelector(`text=${text}`, { timeout: timeout * 1000 });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    const { page } = this.helpers.Playwright;
    return page.url();
  }

  /**
   * Wait for URL to contain specific text
   */
  async waitForUrlContains(urlPart, timeout = 10) {
    const { page } = this.helpers.Playwright;
    await page.waitForURL(`**/*${urlPart}*`, { timeout: timeout * 1000 });
  }

  /**
   * Clear input field completely
   */
  async clearField(locator) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.fill('');
  }

  /**
   * Fill field with clear first
   */
  async fillFieldWithClear(locator, value) {
    await this.clearField(locator);
    await this.helpers.Playwright.fillField(locator, value);
  }

  /**
   * Select option by visible text
   */
  async selectOptionByText(locator, text) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.selectOption({ label: text });
  }

  /**
   * Get selected option text
   */
  async getSelectedOptionText(locator) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    return await element.evaluate(el => el.options[el.selectedIndex].text);
  }

  /**
   * Upload file to input
   */
  async uploadFile(locator, filePath) {
    const { page } = this.helpers.Playwright;
    const element = await page.locator(this._getLocatorString(locator));
    await element.setInputFiles(filePath);
  }

  /**
   * Take screenshot with custom name
   */
  async takeNamedScreenshot(name) {
    const { page } = this.helpers.Playwright;
    await page.screenshot({ path: `./output/${name}.png`, fullPage: true });
  }

  /**
   * Execute JavaScript on page
   */
  async executeOnPage(script, ...args) {
    const { page } = this.helpers.Playwright;
    return await page.evaluate(script, ...args);
  }

  /**
   * Get localStorage item
   */
  async getLocalStorageItem(key) {
    return await this.executeOnPage(k => localStorage.getItem(k), key);
  }

  /**
   * Set localStorage item
   */
  async setLocalStorageItem(key, value) {
    await this.executeOnPage((k, v) => localStorage.setItem(k, v), key, value);
  }

  /**
   * Clear all storage
   */
  async clearAllStorage() {
    await this.executeOnPage(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Start capturing network requests
   * Call this before navigating to capture all requests
   */
  async startNetworkCapture() {
    const { page } = this.helpers.Playwright;
    this.capturedRequests = [];
    this.capturedResponses = [];
    
    // Capture requests
    page.on('request', request => {
      this.capturedRequests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        resourceType: request.resourceType(),
        timestamp: new Date().toISOString(),
      });
    });
    
    // Capture responses
    page.on('response', async response => {
      try {
        const responseData = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          timing: response.timing ? response.timing() : null,
          timestamp: new Date().toISOString(),
        };
        
        // Try to get response body for API calls (JSON)
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json') && response.status() < 400) {
          try {
            responseData.body = await response.json();
          } catch (e) {
            // Body might not be available
          }
        }
        
        this.capturedResponses.push(responseData);
      } catch (e) {
        // Ignore errors for responses we can't capture
      }
    });
  }

  /**
   * Get captured network requests (filtered by type)
   * @param {string} filter - 'all', 'api', 'xhr', 'fetch', 'document', 'script', 'stylesheet', 'image'
   */
  getNetworkRequests(filter = 'all') {
    if (!this.capturedRequests) return [];
    
    if (filter === 'all') {
      return this.capturedRequests;
    }
    
    if (filter === 'api') {
      return this.capturedRequests.filter(r => 
        r.resourceType === 'xhr' || 
        r.resourceType === 'fetch' ||
        r.url.includes('/api/')
      );
    }
    
    return this.capturedRequests.filter(r => r.resourceType === filter);
  }

  /**
   * Get captured network responses (filtered)
   * @param {string} filter - 'all', 'api', 'errors', 'slow'
   * @param {number} slowThreshold - threshold in ms for 'slow' filter
   */
  getNetworkResponses(filter = 'all', slowThreshold = 1000) {
    if (!this.capturedResponses) return [];
    
    if (filter === 'all') {
      return this.capturedResponses;
    }
    
    if (filter === 'api') {
      return this.capturedResponses.filter(r => 
        r.url.includes('/api/') ||
        r.headers['content-type']?.includes('application/json')
      );
    }
    
    if (filter === 'errors') {
      return this.capturedResponses.filter(r => r.status >= 400);
    }
    
    if (filter === 'slow') {
      return this.capturedResponses.filter(r => {
        if (r.timing && r.timing.responseEnd) {
          return r.timing.responseEnd > slowThreshold;
        }
        return false;
      });
    }
    
    return this.capturedResponses;
  }

  /**
   * Get network summary for AI analysis
   */
  getNetworkSummary() {
    const requests = this.capturedRequests || [];
    const responses = this.capturedResponses || [];
    
    const apiResponses = responses.filter(r => 
      r.url.includes('/api/') || 
      r.headers['content-type']?.includes('application/json')
    );
    
    const errors = responses.filter(r => r.status >= 400);
    
    const summary = {
      totalRequests: requests.length,
      totalResponses: responses.length,
      apiCalls: apiResponses.length,
      errors: errors.length,
      byStatus: {},
      byType: {},
      errorDetails: errors.map(e => ({
        url: e.url,
        status: e.status,
        statusText: e.statusText,
      })),
      apiDetails: apiResponses.slice(0, 20).map(r => ({
        url: r.url.replace(/https?:\/\/[^/]+/, ''),
        status: r.status,
        method: requests.find(req => req.url === r.url)?.method || 'GET',
        hasBody: !!r.body,
      })),
    };
    
    // Count by status code
    responses.forEach(r => {
      const statusGroup = `${Math.floor(r.status / 100)}xx`;
      summary.byStatus[statusGroup] = (summary.byStatus[statusGroup] || 0) + 1;
    });
    
    // Count by resource type
    requests.forEach(r => {
      summary.byType[r.resourceType] = (summary.byType[r.resourceType] || 0) + 1;
    });
    
    return summary;
  }

  /**
   * Clear captured network data
   */
  clearNetworkCapture() {
    this.capturedRequests = [];
    this.capturedResponses = [];
  }

  /**
   * Helper to convert CodeceptJS locator to string
   */
  _getLocatorString(locator) {
    if (typeof locator === 'string') {
      return locator;
    }
    if (locator.css) {
      return locator.css;
    }
    if (locator.xpath) {
      return `xpath=${locator.xpath}`;
    }
    if (locator.id) {
      return `#${locator.id}`;
    }
    if (locator.name) {
      return `[name="${locator.name}"]`;
    }
    if (locator.dataTestId) {
      return `[data-testid="${locator.dataTestId}"]`;
    }
    return String(locator);
  }
}

module.exports = PlaywrightHelper;
