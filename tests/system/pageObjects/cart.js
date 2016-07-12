var selectors = {
    cartBody: '.c-cart-item',
    itemPrice: '.c-cart-item-price-container',
    cartCheckout: '.c-chechout-button button:nth-child(2)'
};

var Cart = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Cart.prototype.navigateToCheckout = function(browser) {
    this.browser
        .log('Navigating to Checkout')
        .waitForElementVisible(selectors.cartCheckout)
        .click(selectors.cartCheckout)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Cart;
