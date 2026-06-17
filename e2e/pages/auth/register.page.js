const { I } = inject();

module.exports = () => {
  return {
    // Signup form locators
    signupNameInput: locate('input').withAttr({ 'data-qa': 'signup-name' }),
    signupEmailInput: locate('input').withAttr({ 'data-qa': 'signup-email' }),
    signupButton: locate('button').withAttr({ 'data-qa': 'signup-button' }),
    signupFormHeader: locate('h2').withText('New User Signup!'),
    
    // Account information form locators
    accountInfoHeader: locate('b').withText('Enter Account Information'),
    titleMrRadio: locate('input').withAttr({ id: 'id_gender1' }),
    titleMrsRadio: locate('input').withAttr({ id: 'id_gender2' }),
    passwordInput: locate('input').withAttr({ 'data-qa': 'password' }),
    daysDropdown: locate('select').withAttr({ 'data-qa': 'days' }),
    monthsDropdown: locate('select').withAttr({ 'data-qa': 'months' }),
    yearsDropdown: locate('select').withAttr({ 'data-qa': 'years' }),
    newsletterCheckbox: locate('input').withAttr({ id: 'newsletter' }),
    offersCheckbox: locate('input').withAttr({ id: 'optin' }),
    
    // Address information locators
    firstNameInput: locate('input').withAttr({ 'data-qa': 'first_name' }),
    lastNameInput: locate('input').withAttr({ 'data-qa': 'last_name' }),
    companyInput: locate('input').withAttr({ 'data-qa': 'company' }),
    address1Input: locate('input').withAttr({ 'data-qa': 'address' }),
    address2Input: locate('input').withAttr({ 'data-qa': 'address2' }),
    countryDropdown: locate('select').withAttr({ 'data-qa': 'country' }),
    stateInput: locate('input').withAttr({ 'data-qa': 'state' }),
    cityInput: locate('input').withAttr({ 'data-qa': 'city' }),
    zipcodeInput: locate('input').withAttr({ 'data-qa': 'zipcode' }),
    mobileNumberInput: locate('input').withAttr({ 'data-qa': 'mobile_number' }),
    
    // Submit button
    createAccountButton: locate('button').withAttr({ 'data-qa': 'create-account' }),
    
    // Success page
    accountCreatedHeader: locate('b').withText('Account Created!'),
    continueButton: locate('a').withAttr({ 'data-qa': 'continue-button' }),
    
    // Error messages
    emailExistsError: locate('p').withText('Email Address already exist!'),
    
    // Page URL
    pageUrl: '/login',

    /**
     * Navigate to signup page
     */
    async navigateToSignupPage() {
      await I.amOnPage(this.pageUrl);
      await I.waitForVisible(this.signupFormHeader, 10);
    },

    /**
     * Fill initial signup form (name and email)
     */
    async fillSignupForm(name, email) {
      await I.waitForVisible(this.signupNameInput, 10);
      await I.fillField(this.signupNameInput, name);
      await I.fillField(this.signupEmailInput, email);
    },

    /**
     * Click signup button
     */
    async clickSignupButton() {
      await I.clickWhenClickable(this.signupButton);
    },

    /**
     * Verify account information form is displayed
     */
    async verifyAccountInfoFormDisplayed() {
      await I.waitForVisible(this.accountInfoHeader, 10);
      await I.waitForVisible(this.passwordInput, 10);
    },

    /**
     * Select title (Mr/Mrs)
     */
    async selectTitle(title) {
      if (title.toLowerCase() === 'mr') {
        await I.clickWhenClickable(this.titleMrRadio);
      } else {
        await I.clickWhenClickable(this.titleMrsRadio);
      }
    },

    /**
     * Fill account information
     */
    async fillAccountInfo(userData) {
      await this.selectTitle(userData.title || 'Mr');
      await I.fillField(this.passwordInput, userData.password);
      
      // Date of birth
      if (userData.birthDate) {
        await I.selectOption(this.daysDropdown, userData.birthDate);
      }
      if (userData.birthMonth) {
        await I.selectOption(this.monthsDropdown, userData.birthMonth);
      }
      if (userData.birthYear) {
        await I.selectOption(this.yearsDropdown, userData.birthYear);
      }
      
      // Optional checkboxes
      if (userData.newsletter) {
        await I.checkOption(this.newsletterCheckbox);
      }
      if (userData.offers) {
        await I.checkOption(this.offersCheckbox);
      }
    },

    /**
     * Fill address information
     */
    async fillAddressInfo(userData) {
      await I.fillField(this.firstNameInput, userData.firstName);
      await I.fillField(this.lastNameInput, userData.lastName);
      
      if (userData.company) {
        await I.fillField(this.companyInput, userData.company);
      }
      
      await I.fillField(this.address1Input, userData.address1);
      
      if (userData.address2) {
        await I.fillField(this.address2Input, userData.address2);
      }
      
      await I.selectOption(this.countryDropdown, userData.country);
      await I.fillField(this.stateInput, userData.state);
      await I.fillField(this.cityInput, userData.city);
      await I.fillField(this.zipcodeInput, userData.zipcode);
      await I.fillField(this.mobileNumberInput, userData.mobileNumber);
    },

    /**
     * Click create account button
     */
    async clickCreateAccountButton() {
      await I.clickWhenClickable(this.createAccountButton);
    },

    /**
     * Verify account created successfully
     */
    async verifyAccountCreated() {
      await I.waitForVisible(this.accountCreatedHeader, 10);
      await I.see('ACCOUNT CREATED!');
    },

    /**
     * Click continue after account creation
     */
    async clickContinueButton() {
      await I.clickWhenClickable(this.continueButton);
    },

    /**
     * Complete full registration flow
     */
    async registerNewUser(userData) {
      await this.fillSignupForm(userData.name, userData.email);
      await this.clickSignupButton();
      await this.verifyAccountInfoFormDisplayed();
      await this.fillAccountInfo(userData);
      await this.fillAddressInfo(userData);
      await this.clickCreateAccountButton();
      await this.verifyAccountCreated();
      await this.clickContinueButton();
    },

    /**
     * Verify email already exists error
     */
    async verifyEmailExistsError() {
      await I.waitForVisible(this.emailExistsError, 10);
      await I.see('Email Address already exist!');
    },
  };
};
