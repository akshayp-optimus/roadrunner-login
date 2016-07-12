define(['$'], function($) {
    var _parse = function($container) {
        var $currencySelect = $container.find('.gwt_currency_list_box');

        return {
            shipLocation: $container.find('.currentlySelectedCountry').text(),
            selectedCurrency: $currencySelect.find(':selected').text(),
            currencySelect: $currencySelect,
            currencySelectLabel: $currencySelect.prev('.gwt_currency_selection_text').text(),
            finePrint: $container.find('.gwt_country_changer_bottom_wwcm_spot').children()
        };
    };

    return {
        parse: _parse
    };
});
