var selectors = {
    plpBody: '.GUEST',
    pldList: '#content',
    pdpItem: function(index) {
        return '.c-product-tile-content .c-product-tile:nth-child(' + index + ') .c-product-tile__description a';
    }
};

var PLP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

PLP.prototype.navigateToPDP = function(productNum) {
    this.browser
        .log('Navigating to PDP')
        .waitForElementVisible(selectors.pdpItem(productNum))
        .click(selectors.pdpItem(productNum))
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation(3000);
    return this;
};

module.exports = PLP;
