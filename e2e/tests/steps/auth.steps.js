const { I, loginPage, registerPage, accountPage, navbar, userService, userGenerator } = inject();
const testState = require('../../data/testState');

// Registration steps
Given('the user has a new user to register', async () => {
  testState.currentUser = userGenerator.generateUser();
});

When('the user navigates to signup page', async () => {
  await registerPage.navigateToSignupPage();
});

When('the user fills in signup form with name {string} and email {string}', async (name, email) => {
  await registerPage.fillSignupForm(name, email);
});

When('the user fills in signup form with generated user', async () => {
  await registerPage.fillSignupForm(testState.currentUser.name, testState.currentUser.email);
});

When('the user clicks signup button', async () => {
  await registerPage.clickSignupButton();
});

When('the user fills in account information', async () => {
  await registerPage.fillAccountInfo(testState.currentUser);
});

When('the user fills in address information', async () => {
  await registerPage.fillAddressInfo(testState.currentUser);
});

When('the user clicks create account button', async () => {
  await registerPage.clickCreateAccountButton();
});

When('the user completes the full registration flow', async () => {
  await registerPage.registerNewUser(testState.currentUser);
});

Then('the user should see account created message', async () => {
  await registerPage.verifyAccountCreated();
});

Then('the user should see email already exists error', async () => {
  await registerPage.verifyEmailExistsError();
});

// Login steps
When('the user navigates to login page', async () => {
  await loginPage.navigateToLoginPage();
});

When('the user logs in with valid credentials', async () => {
  const { testData } = inject();
  const user = testData.users.validUser;
  await loginPage.login(user.email, user.password);
});

When('the user logs in with generated user credentials', async () => {
  await loginPage.login(testState.currentUser.email, testState.currentUser.password);
});

When('the user logs in with invalid credentials', async () => {
  const { testData } = inject();
  const user = testData.users.invalidUser;
  await loginPage.login(user.email, user.password);
});

Then('the user should see login form', async () => {
  await loginPage.verifyLoginPageLoaded();
});

Then('the user should be logged in', async () => {
  await navbar.verifyLoggedIn();
});

Then('the user should be logged in as the generated user', async () => {
  await navbar.verifyLoggedIn(testState.currentUser.name);
});

// Account management steps
When('the user deletes their account', async () => {
  await accountPage.deleteAccountAndVerify();
});

When('the user clicks delete account', async () => {
  await accountPage.clickDeleteAccount();
});

Then('the user should see account deleted message', async () => {
  await accountPage.verifyAccountDeleted();
});

// API + UI combination steps
Given('the user creates a user via API', async () => {
  testState.currentUser = userGenerator.generateUser();
  const response = await userService.createAccount(testState.currentUser);
  userService.validateResponse(response, 201);
});

When('the user deletes the user via API', async () => {
  const response = await userService.deleteAccount(testState.currentUser.email, testState.currentUser.password);
  userService.validateResponse(response, 200);
});

When('the user verifies user exists via API', async () => {
  const response = await userService.getUserDetailByEmail(testState.currentUser.email);
  userService.validateResponse(response, 200);
});

// Note: 'the user verifies login via API' step is defined in api.steps.js

Then('the user should not exist via API', async () => {
  const response = await userService.getUserDetailByEmail(testState.currentUser.email);
  I.assertEqual(response.responseCode, 404, 'User should not exist');
});

// Store user for later use
When('the user stores the current user', async () => {
  // User is already stored in testState.currentUser variable
  console.log(`Stored user: ${testState.currentUser.email}`);
});

Given('the user has the stored user', async () => {
  if (!testState.currentUser) {
    throw new Error('No user has been stored');
  }
});
