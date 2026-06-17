module.exports = () => {
  return actor({
    /**
     * Clear input field using keyboard shortcuts
     */
    clearInputField: function(fieldName) {
      if (fieldName) {
        this.appendField(fieldName, '');
      }
      this.pressKey(['Control', 'a']);
      this.pressKey('Backspace');
    },

    /**
     * Dismiss any ad overlays (NOT application modals) that might block interactions
     */
    dismissAds: async function() {
      // Only remove ad-related elements, NOT application modals
      await this.executeScript(() => {
        // Remove Google ad iframes
        document.querySelectorAll('iframe[id*="google_ads"], iframe[id*="aswift"], ins.adsbygoogle').forEach(el => el.remove());
        // Remove ad containers (be specific to avoid removing app modals)
        document.querySelectorAll('[class*="ad-container"], [id*="ad-container"]').forEach(el => el.remove());
        // Remove fixed position ad overlays only
        document.querySelectorAll('div[style*="position: fixed"]').forEach(el => {
          const hasAdIframe = el.querySelector('iframe[src*="google"], iframe[id*="aswift"]');
          const isAdRelated = el.className && (el.className.includes('ad') || el.id && el.id.includes('ad'));
          if (hasAdIframe || isAdRelated) {
            el.remove();
          }
        });
      });
    },

    /**
     * Wait for element to be visible then click (handles ad overlays)
     */
    clickWhenClickable: async function(elementLocator, waitTime = 10) {
      await this.dismissAds();
      this.waitForVisible(elementLocator, waitTime);
      try {
        await this.click(elementLocator);
      } catch (e) {
        // If click fails due to overlay, dismiss ads and try force click
        if (e.message.includes('Timeout') || e.message.includes('intercept')) {
          await this.dismissAds();
          await this.forceClick(elementLocator);
        } else {
          throw e;
        }
      }
    },

    /**
     * Click and wait for element to disappear
     */
    clickAndWaitForInvisible: function(elementLocator, waitTime = 10) {
      this.clickWhenClickable(elementLocator, waitTime);
      this.waitForInvisible(elementLocator, waitTime);
    },

    /**
     * Click and wait for URL to change
     */
    clickAndWaitForNavigation: async function(elementLocator, waitTime = 10) {
      const currentUrl = await this.grabCurrentUrl();
      this.clickWhenClickable(elementLocator, waitTime);
      await this.waitForUrlToChange(currentUrl, waitTime);
    },

    /**
     * Wait for URL to change from current
     */
    waitForUrlToChange: async function(previousUrl, timeout = 10) {
      for (let i = 0; i < timeout * 2; i++) {
        const currentUrl = await this.grabCurrentUrl();
        if (currentUrl !== previousUrl) {
          return;
        }
        this.wait(0.5);
      }
      throw new Error(`URL did not change from "${previousUrl}" within ${timeout} seconds`);
    },

    /**
     * Clear session storage
     */
    clearSessionStorage: function() {
      this.executeScript(function() {
        sessionStorage.clear();
      });
    },

    /**
     * Set session storage item
     */
    setSessionStorage: function(key, value) {
      this.executeScript(({ k, v }) => sessionStorage.setItem(k, v), { k: key, v: value });
    },

    /**
     * Get session storage item
     */
    getFromSessionStorage: async function(key) {
      return this.executeScript(k => sessionStorage.getItem(k), key);
    },

    /**
     * Clear local storage
     */
    clearLocalStorage: function() {
      this.executeScript(function() {
        localStorage.clear();
      });
    },

    /**
     * Set local storage item
     */
    setLocalStorage: function(key, value) {
      this.executeScript(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
    },

    /**
     * Get local storage item
     */
    getFromLocalStorage: async function(key) {
      return this.executeScript(k => localStorage.getItem(k), key);
    },

    /**
     * Clear all browser storage
     */
    clearAllStorage: function() {
      this.clearSessionStorage();
      this.clearLocalStorage();
    },

    /**
     * Retry a condition function multiple times
     */
    retryCondition: async function(conditionFn, attempts = 5, message = '', interval = 2) {
      let currentAttempts = 0;
      for (let i = 1; i <= attempts; i++) {
        const result = await conditionFn.call();
        currentAttempts = i;
        if (result) {
          return true;
        } else {
          this.wait(interval);
          this.say(`Retry ${message}, attempt = ${i}`);
        }
      }
      throw new Error(`Condition failed after ${currentAttempts} attempts: ${message}`);
    },

    /**
     * Retry a failed action multiple times
     */
    retryFailedAction: async function(actionFn, attempts = 3, interval = 1) {
      let lastError;
      for (let i = 1; i <= attempts; i++) {
        try {
          await actionFn.call();
          return;
        } catch (error) {
          lastError = error;
          console.log(`Retry action, attempt ${i}: ${error.message}`);
          this.wait(interval);
        }
      }
      throw lastError;
    },

    /**
     * Wait for element and get its text
     */
    grabTextWhenVisible: async function(locator, waitTime = 10) {
      this.waitForVisible(locator, waitTime);
      return this.grabTextFrom(locator);
    },

    /**
     * Wait for element and get its attribute
     */
    grabAttributeWhenVisible: async function(locator, attribute, waitTime = 10) {
      this.waitForVisible(locator, waitTime);
      return this.grabAttributeFrom(locator, attribute);
    },

    /**
     * Scroll to element and click
     */
    scrollAndClick: async function(locator, waitTime = 10) {
      this.waitForVisible(locator, waitTime);
      this.scrollTo(locator);
      this.click(locator);
    },

    /**
     * Fill field after clearing it
     */
    fillFieldWithClear: function(locator, value) {
      this.clearField(locator);
      this.fillField(locator, value);
    },

    /**
     * Check if element exists on page
     */
    isElementPresent: async function(locator) {
      try {
        const count = await this.grabNumberOfVisibleElements(locator);
        return count > 0;
      } catch {
        return false;
      }
    },

    /**
     * Wait for URL to contain text
     */
    waitInUrl: async function(urlPart, timeout = 10) {
      for (let i = 0; i < timeout * 2; i++) {
        const currentUrl = await this.grabCurrentUrl();
        if (currentUrl.includes(urlPart)) {
          return;
        }
        this.wait(0.5);
      }
      throw new Error(`URL did not contain "${urlPart}" within ${timeout} seconds`);
    },

    /**
     * Assert element text equals expected
     */
    assertTextEquals: async function(locator, expectedText) {
      const actualText = await this.grabTextFrom(locator);
      this.assertEqual(actualText.trim(), expectedText.trim(), 
        `Expected text "${expectedText}" but got "${actualText}"`);
    },

    /**
     * Assert element text contains expected
     */
    assertTextContains: async function(locator, expectedText) {
      const actualText = await this.grabTextFrom(locator);
      this.assertContain(actualText, expectedText,
        `Expected text to contain "${expectedText}" but got "${actualText}"`);
    },

    /**
     * Get current date/time formatted for test data
     */
    getCurrentDateTime: function() {
      const now = new Date();
      return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    },

    /**
     * Generate unique string with timestamp
     */
    generateUniqueString: function(prefix = 'test') {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    },
  });
};
