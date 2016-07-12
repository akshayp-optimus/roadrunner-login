var selectors = {
    pdpBody: '.t-product-details-page',
    productTitle: '.c-title',
    productOption: '.c-swatch-selection-section',
    selectOption: '.c-swatch-selection-section .js-thumbnails img',
    addItem: '.c-add-to-cart-button',
    cartIcon: '.t-header__cart',
    miniCart: '.c-mini-cart-item',
    itemImage: '.c-mini-cart-item__image',
    checkout: '.c-checkout-button'
};

var PDP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

PDP.prototype.selectOption = function() {
    var self = this;
    this.browser
        .element('css selector', selectors.productOption, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Bundle PDP')
                    .waitForElementVisible(selectors.productOption)
                    .triggerTouch(selectors.selectOption)
                    .waitUntilMobified()
                    .waitForAnimation();
            } else {
                self.browser.log('Regular PDP');
            }
        });
    return this;
};

PDP.prototype.addItemToCart = function(browser) {
    this.browser
        .log('Adding item to cart')
        .waitForElementVisible(selectors.addItem)
        .triggerTouch(selectors.addItem)
        .waitUntilMobified()
        .waitForAjaxCompleted();
    return this;
};

PDP.prototype.navigateToMiniCart = function(browser) {
    this.browser
        .log('Navigating to Mini Cart')
        .waitForElementVisible(selectors.cartIcon)
        .click(selectors.cartIcon)
        .waitUntilMobified()
        .waitForAjaxCompleted();
    return this;
};

PDP.prototype.navigateToCart = function(browser) {
    this.browser
        .log('Navigating to Cart')
        .waitForElementVisible(selectors.checkout)
        .click(selectors.checkout)
        .waitUntilMobified()
        .waitForAjaxCompleted();
    return this;
};

module.exports = PDP;
