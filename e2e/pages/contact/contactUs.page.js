const { I } = inject();

module.exports = () => {
  return {
    // Locators
    contactUsHeader: locate('h2').withText('Get In Touch'),
    nameInput: locate('input').withAttr({ 'data-qa': 'name' }),
    emailInput: locate('input').withAttr({ 'data-qa': 'email' }),
    subjectInput: locate('input').withAttr({ 'data-qa': 'subject' }),
    messageTextarea: locate('textarea').withAttr({ 'data-qa': 'message' }),
    uploadFileInput: locate('input').withAttr({ name: 'upload_file' }),
    submitButton: locate('input').withAttr({ 'data-qa': 'submit-button' }),
    successMessage: locate('.alert-success'),
    homeButton: locate('a').withText('Home'),
    
    // Page URL
    pageUrl: '/contact_us',

    /**
     * Navigate to contact us page
     */
    async navigateToContactUsPage() {
      await I.amOnPage(this.pageUrl);
      await I.waitForVisible(this.contactUsHeader, 10);
    },

    /**
     * Verify contact us page is loaded
     */
    async verifyContactUsPageLoaded() {
      await I.waitForVisible(this.contactUsHeader, 10);
      await I.see('Get In Touch');
    },

    /**
     * Fill contact form
     */
    async fillContactForm(contactInfo) {
      await I.fillField(this.nameInput, contactInfo.name);
      await I.fillField(this.emailInput, contactInfo.email);
      await I.fillField(this.subjectInput, contactInfo.subject);
      await I.fillField(this.messageTextarea, contactInfo.message);
    },

    /**
     * Upload file
     */
    async uploadFile(filePath) {
      await I.attachFile(this.uploadFileInput, filePath);
    },

    /**
     * Submit contact form
     */
    async submitForm() {
      await I.clickWhenClickable(this.submitButton);
      // Handle alert if present
      await I.acceptPopup();
    },

    /**
     * Verify success message
     */
    async verifySuccessMessage() {
      await I.waitForVisible(this.successMessage, 10);
      await I.see('Success! Your details have been submitted successfully.');
    },

    /**
     * Click home button
     */
    async clickHomeButton() {
      await I.clickWhenClickable(this.homeButton);
    },

    /**
     * Complete contact form submission
     */
    async submitContactForm(contactInfo, filePath = null) {
      await this.fillContactForm(contactInfo);
      if (filePath) {
        await this.uploadFile(filePath);
      }
      await this.submitForm();
      await this.verifySuccessMessage();
    },

    /**
     * Get default test contact info
     */
    getTestContactInfo() {
      return {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for automation testing.',
      };
    },
  };
};
