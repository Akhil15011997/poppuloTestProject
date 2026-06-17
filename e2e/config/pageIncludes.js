exports.include = {
  // Actor
  I: './helpers/actorCapabilities.js',

  // Pages - Authentication
  loginPage: './pages/auth/login.page.js',
  registerPage: './pages/auth/register.page.js',

  // Pages - Products
  homePage: './pages/home/home.page.js',
  productsPage: './pages/products/products.page.js',
  productDetailPage: './pages/products/productDetail.page.js',

  // Pages - Cart & Checkout
  cartPage: './pages/cart/cart.page.js',
  checkoutPage: './pages/checkout/checkout.page.js',
  paymentPage: './pages/checkout/payment.page.js',

  // Pages - Account
  accountPage: './pages/account/account.page.js',
  contactUsPage: './pages/contact/contactUs.page.js',

  // Components
  navbar: './components/navbar.component.js',
  footer: './components/footer.component.js',
  modal: './components/modal.component.js',
  sidebar: './components/sidebar.component.js',

  // Services - API
  userService: './services/user.api.js',
  productService: './services/product.api.js',
  brandService: './services/brand.api.js',
  searchService: './services/search.api.js',
  cartService: './services/cart.api.js',
  emailService: './services/email.api.js',

  // Test Data
  testData: './data/testData.js',
  userGenerator: './data/userGenerator.js',
};
