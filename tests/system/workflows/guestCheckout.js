var Home = require('../pageObjects/home');
var PLP = require('../pageObjects/plp');
var PDP = require('../pageObjects/pdp');
var Cart = require('../pageObjects/cart');
var Checkout = require('../pageObjects/checkout');

var home;
var plp;
var pdp;
var cart;
var checkout;

var PDP_POSITION = process.env.PDP_POSITION || 4;

module.exports = {
    '@tags': ['checkout'],

    before: function(browser) {
        home = new Home(browser);
        plp = new PLP(browser);
        pdp = new PDP(browser);
        cart = new Cart(browser);
        checkout = new Checkout(browser);
    },

    after: function(browser) {
        browser.end();
    },

    'Checkout - Guest - Step 1 - Navigate to Home': function(browser) {
        browser.preview();
        browser
            .waitForElementVisible(home.selectors.homeHeader)
            .assert.visible(home.selectors.carousel);
    },

    'Checkout - Guest - Step 2 - Navigate from Home to PLP': function(browser) {
        home.navigateToPLP();
        browser
            .waitForElementVisible(plp.selectors.plpBody)
            .assert.visible(plp.selectors.pldList);
    },

    'Checkout - Guest - Step 3 - Navigate from PLP to PDP': function(browser) {
        plp.navigateToPDP(PDP_POSITION);
        browser
            .waitForElementVisible(pdp.selectors.pdpBody)
            .assert.visible(pdp.selectors.productTitle);
    },

    'Checkout - Guest - Step 4 - Add item to Shopping Cart': function(browser) {
        pdp.selectOption();
        pdp.addItemToCart();
        pdp.navigateToMiniCart();
        browser
            .waitForElementVisible(pdp.selectors.miniCart)
            .assert.visible(pdp.selectors.itemImage);
    },

    'Checkout - Guest - Step 5 - Navigate from PDP to Shopping Cart': function(browser) {
        pdp.navigateToCart();
        browser
            .waitForElementVisible(cart.selectors.cartBody)
            .assert.visible(cart.selectors.itemPrice);
    },

    'Checkout - Guest - Step 6 - Navigate from Shopping Cart to Checkout Sign In or Continue as Guest page': function(browser) {
        cart.navigateToCheckout();
        browser
            .waitForElementVisible(checkout.selectors.checkoutBody)
            .assert.visible(checkout.selectors.guestCheckout);
    },

    'Checkout - Guest - Step 7 - Continue to Guest Checkout': function(browser) {
        checkout.continueAsGuest();
        browser
            .waitForElementVisible(checkout.selectors.billingShipping)
            .assert.visible(checkout.selectors.shippingAddress);
    },

    'Checkout - Guest - Step 8 - Fill out Guest Checkout Shipping Info form': function(browser) {
        checkout.fillShippingInfo();
        browser
            .waitForElementVisible(checkout.selectors.reviewAndPayment)
            .assert.visible(checkout.selectors.deliveryOption);
    },

    'Checkout - Guest - Step 9 - Fill out Guest Checkout Payment Details form': function(browser) {
        checkout.fillPaymentDetails();
        checkout.fillPCardIDNum();
    },

    'Checkout - Guest - Step 10 - Complete Purchase to Navigate to Confirmation page': function(browser) {
        checkout.completePurchase();
        browser
            .waitForElementVisible(checkout.selectors.confirmMessage)
            .assert.containsText(checkout.selectors.confirmMessage, 'Congratulations! Your order has been placed. You will receive an email confirmation verifying your order.');
    },

};
