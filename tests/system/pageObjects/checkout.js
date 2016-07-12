var testData = require('./testData');

var selectors = {
    checkoutBody: '.t-checkout-sign-in-wrapper',
    guestCheckout: '#guestLogon',
    continueAsGuest: '#guestLogon button',
    billingShipping: '.t-shipping-address-wrapper',
    shippingAddress: '#gwt_shippingOption_panel',

    //registered checkout
    signInEmail: '#logonId',
    signInPassword: '#logonPassword',
    signIn: '#logonButton',

    continueToReview: '#gwt_billshipaddr_btn button',
    reviewAndPayment: '.t-order-review-and-payment-wrapper',
    deliveryOption: '.js-option-container',

    firstName: '#bill_fnbox',
    lastName: '#bill_lnbox',
    address: '#bill_sa1box',
    city: '#bill_citybox',
    state: '#bill_region',
    zipCode: '#bill_zipbox',
    phone: '#bill_phone1box',
    email: '#emailbox',
    confirmEmail: '#confirmEmailBox',

    creditCardNumber: '#accountcc',
    cardIDNum: '#card_id_number',
    cvv: '#cvv',
    expireMonth: '#expire_month',
    expireYear: '#expire_year',

    completeOrder: '#process',
    confirmMessage: '.order_confirmation_message'
};

var Checkout = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Checkout.prototype.continueAsGuest = function(browser) {
    this.browser
        .log('Navigating to Guest Checkout')
        .waitForElementVisible(selectors.continueAsGuest)
        .click(selectors.continueAsGuest)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

Checkout.prototype.signIn = function(browser) {
    this.browser
        .log('Navigating to Registered Checkout')
        .waitForElementVisible(selectors.signInEmail)
        .setValue(selectors.signInEmail, testData.signInEmail)
        .setValue(selectors.signInPassword, testData.signInPassword)
        .click(selectors.signIn)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

Checkout.prototype.fillShippingInfo = function(browser) {
    this.browser
        .log('Fill out Shipping Info form fields')
        .waitForElementVisible(selectors.firstName)
        .setValue(selectors.firstName, testData.firstName)
        .setValue(selectors.lastName, testData.lastName)
        .setValue(selectors.address, testData.address1)
        .setValue(selectors.city, testData.city)
        .setValue(selectors.state, testData.state)
        .setValue(selectors.zipCode, testData.zip)
        .setValue(selectors.phone, testData.telNumber)
        .setValue(selectors.email, testData.email)
        .setValue(selectors.confirmEmail, testData.email)
        .click(selectors.continueToReview)
        .waitUntilMobified();
    return this;
};

Checkout.prototype.fillPaymentDetails = function(browser) {
    this.browser
        .log('Fill out Payment Details form fields')
        .setValue(selectors.creditCardNumber, testData.creditCardNumber)
        .setValue(selectors.expireMonth, testData.creditCardExpiryMonth)
        .setValue(selectors.expireYear, testData.creditCardExpiryYear);
    return this;
};

//For Dev env - cvv is iframe
Checkout.prototype.fillCVVNum = function(browser) {
    this.browser
        .log('Fill out CVV#')
        .pause()
        .waitForElementVisible('#cvv_Tokenizer')
        .pause(5000)
        .frame(0)
        .waitForElementPresent(selectors.cvv, 30000)
        .setValue(selectors.cvv, testData.creditCardCcv)
        .frame(null);
    return this;
};

//For stage -  cvv is not iframe
Checkout.prototype.fillPCardIDNum = function(browser) {
    this.browser
        .log('Fill out CardID#')
        .setValue(selectors.cardIDNum, testData.creditCardCcv);
    return this;
};


Checkout.prototype.completePurchase = function(browser) {
    this.browser
        .log('Complete purchase')
        .waitForElementVisible(selectors.completeOrder)
        .click(selectors.completeOrder)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Checkout;
