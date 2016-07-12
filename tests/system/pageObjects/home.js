var selectors = {
    homeHeader: '.t-header',
    carousel: '.c-carousel',
    plpItem: '.c-hero:nth-child(1) .c-hero__img',
    subcategoryItem: '.subcategory-component:nth-child(2) img'
};

var Home = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Home.prototype.navigateToPLP = function(browser) {
    this.browser
        .log('Navigating to PLP')
        .waitForElementVisible(selectors.plpItem)
        .click(selectors.plpItem)
        .waitForElementVisible(selectors.subcategoryItem)
        .click(selectors.subcategoryItem)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Home;
