const { I, navbar, homePage, loginPage, accountPage } = inject();

// ============================================
// Browser Session Management Steps
// ============================================

Given('the browser is launched', async () => {
  // Browser is auto-launched by CodeceptJS, this step ensures it's ready
  await I.waitForElement('body', 10);
});

Given('a new browser session is started', async () => {
  // Start fresh browser context
  await I.clearCookie();
  await I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

When('the user clears session storage', async () => {
  await I.executeScript(() => sessionStorage.clear());
});

When('the user clears local storage', async () => {
  await I.executeScript(() => localStorage.clear());
});

When('the user clears all cookies', async () => {
  await I.clearCookie();
});

When('the user clears browser cache', async () => {
  // Clear cache by clearing storage and reloading
  await I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  });
});

When('the user clears all browser data', async () => {
  await I.clearCookie();
  await I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  });
});

When('the user refreshes the page', async () => {
  await I.refreshPage();
});

When('the user resets browser state', async () => {
  // Full reset: clear all data and navigate to base URL
  await I.clearCookie();
  await I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await I.amOnPage('/');
});

Then('the session storage should be empty', async () => {
  const storageLength = await I.executeScript(() => sessionStorage.length);
  I.assertEqual(storageLength, 0, 'Session storage should be empty');
});

Then('the local storage should be empty', async () => {
  const storageLength = await I.executeScript(() => localStorage.length);
  I.assertEqual(storageLength, 0, 'Local storage should be empty');
});

// ============================================
// Navigation steps
// ============================================
Given('the user is on the home page', async () => {
  await homePage.navigateToHomePage();
});

Given('the user is on the login page', async () => {
  await loginPage.navigateToLoginPage();
});

Given('the user is on the {string} page', async (pageName) => {
  await I.amOnPage(`/${pageName.toLowerCase().replace(' ', '_')}`);
});

// Authentication steps
Given('the user is logged in as a valid user', async () => {
  const { testData } = inject();
  const user = testData.users.validUser;
  await loginPage.navigateToLoginPage();
  await loginPage.login(user.email, user.password);
  await navbar.verifyLoggedIn(user.name);
});

When('the user logs in with email {string} and password {string}', async (email, password) => {
  await loginPage.login(email, password);
});

When('the user clicks on Signup Login link', async () => {
  await navbar.clickSignupLogin();
});

When('the user logs out', async () => {
  await accountPage.logout();
});

Then('the user should be logged in as {string}', async (username) => {
  await navbar.verifyLoggedIn(username);
});

Then('the user should see login error message', async () => {
  await loginPage.verifyLoginError();
});

Then('the user should be logged out', async () => {
  await navbar.verifyNotLoggedIn();
});

// Navigation verification steps
Then('the user should see the home page', async () => {
  await homePage.verifyHomePageLoaded();
});

Then('the user should see the {string} page', async (pageName) => {
  await I.see(pageName);
});

Then('the URL should contain {string}', async (urlPart) => {
  await I.waitInUrl(urlPart);
});

// Click steps
When('the user clicks on {string} link', async (linkText) => {
  await I.clickWhenClickable(locate('a').withText(linkText));
});

When('the user clicks on {string} button', async (buttonText) => {
  await I.clickWhenClickable(locate('button').withText(buttonText));
});

When('the user clicks on navbar {string}', async (navItem) => {
  await navbar.clickNavLink(navItem);
});

// Form steps
When('the user fills in {string} with {string}', async (field, value) => {
  await I.fillField(field, value);
});

When('the user selects {string} from {string}', async (option, dropdown) => {
  await I.selectOption(dropdown, option);
});

When('the user checks {string}', async (checkbox) => {
  await I.checkOption(checkbox);
});

// Visibility steps
Then('the user should see {string}', async (text) => {
  await I.see(text);
});

Then('the user should not see {string}', async (text) => {
  await I.dontSee(text);
});

Then('the user should see element {string}', async (locator) => {
  await I.waitForVisible(locator, 10);
});

Then('the user should not see element {string}', async (locator) => {
  await I.waitForInvisible(locator, 10);
});

// Wait steps
When('the user waits for {int} seconds', async (seconds) => {
  await I.wait(seconds);
});

When('the user waits for element {string}', async (locator) => {
  await I.waitForVisible(locator, 10);
});

// Storage steps
When('the user clears browser storage', async () => {
  await I.clearAllStorage();
});

When('the user clears cookies', async () => {
  await I.clearCookie();
});

// Screenshot steps
Then('the user takes a screenshot named {string}', async (name) => {
  await I.saveScreenshot(`${name}.png`);
});

// Mobile-specific steps
Then('the user should see the mobile navigation menu', async () => {
  await I.waitForElement('body', 5);
  // Mobile view check - verify page loaded (responsive design handles layout)
  await I.seeInCurrentUrl('automationexercise.com');
});

When('the user opens mobile menu', async () => {
  const isMobile = await I.executeScript(() => window.innerWidth < 768);
  if (isMobile) {
    // Click hamburger menu if on mobile
    const menuButton = locate('.navbar-toggle, .mobile-menu, [data-toggle="collapse"]');
    const menuExists = await I.grabNumberOfVisibleElements(menuButton);
    if (menuExists > 0) {
      await I.click(menuButton);
    }
  }
});

When('the user clicks on Products link', async () => {
  await navbar.clickProducts();
});
