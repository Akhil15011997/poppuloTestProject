const { I, cartPage, checkoutPage, paymentPage, navbar } = inject();

// Navigation steps
When('the user navigates to cart page', async () => {
  await cartPage.navigateToCartPage();
});

When('the user clicks on cart in navbar', async () => {
  await navbar.clickCart();
});

Then('the user should see cart page', async () => {
  await cartPage.verifyCartPageLoaded();
});

// Cart verification steps
Then('the cart should be empty', async () => {
  await cartPage.verifyCartIsEmpty();
});

Then('the cart should not be empty', async () => {
  await cartPage.verifyCartIsNotEmpty();
});

Then('the cart should have {int} item(s)', async (count) => {
  const itemCount = await cartPage.getCartItemCount();
  I.assertEqual(itemCount, count, `Expected ${count} items in cart, got ${itemCount}`);
});

Then(/^the cart should have (\d+) items?$/, async (count) => {
  const itemCount = await cartPage.getCartItemCount();
  I.assertEqual(itemCount, parseInt(count), `Expected ${count} items in cart, got ${itemCount}`);
});

Then('the user should see {string} in cart', async (productName) => {
  await cartPage.verifyProductInCart(productName);
});

Then('the quantity of {string} should be {int}', async (productName, quantity) => {
  await cartPage.verifyProductQuantity(productName, quantity);
});

// Cart actions
When('the user removes item at index {int} from cart', async (index) => {
  await cartPage.deleteItemByIndex(index);
});

When('the user removes {string} from cart', async (productName) => {
  await cartPage.deleteItemByName(productName);
});

When('the user clears the cart', async () => {
  await cartPage.clearCart();
});

When('the user proceeds to checkout', async () => {
  await cartPage.clickProceedToCheckout();
});

// Checkout steps
Then('the user should see checkout page', async () => {
  await checkoutPage.verifyCheckoutPageLoaded();
});

Then('the user should see their delivery address', async () => {
  const address = await checkoutPage.getDeliveryAddressDetails();
  I.assertTrue(address.name !== '', 'Delivery address should have a name');
});

Then('the user should see {string} in order summary', async (productName) => {
  await checkoutPage.verifyProductInOrder(productName);
});

When('the user adds comment {string}', async (comment) => {
  await checkoutPage.addComment(comment);
});

When('the user places the order', async () => {
  await checkoutPage.clickPlaceOrder();
});

When('the user completes checkout with comment {string}', async (comment) => {
  await checkoutPage.completeCheckout(comment);
});

// Payment steps
Then('the user should see payment page', async () => {
  await paymentPage.verifyPaymentPageLoaded();
});

When('the user fills payment details', async () => {
  const paymentInfo = paymentPage.getTestPaymentInfo();
  await paymentPage.fillPaymentDetails(paymentInfo);
});

When('the user fills payment details with card {string}', async (cardNumber) => {
  const paymentInfo = {
    ...paymentPage.getTestPaymentInfo(),
    cardNumber,
  };
  await paymentPage.fillPaymentDetails(paymentInfo);
});

When('the user confirms payment', async () => {
  await paymentPage.clickPayAndConfirm();
});

When('the user completes payment', async () => {
  const paymentInfo = paymentPage.getTestPaymentInfo();
  await paymentPage.completePayment(paymentInfo);
});

Then('the user should see order placed message', async () => {
  await paymentPage.verifyOrderPlaced();
});

Then('the user should see order confirmation', async () => {
  await paymentPage.verifyOrderConfirmation();
});

When('the user downloads invoice', async () => {
  await paymentPage.downloadInvoice();
});

When('the user clicks continue after order', async () => {
  await paymentPage.clickContinue();
});

// Cart totals verification
Then('the cart totals should be correct', async () => {
  await cartPage.verifyCartTotalsCorrect();
});
