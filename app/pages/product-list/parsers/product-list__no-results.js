define([
    '$',
    'translator',
    'pages/product-list/parsers/product-list__products'
], function($, Translator, productListProductsParser) {

    // Get search again form
    var getSearchResultForm = function($form) {
        var $inputTextBox = $form.find('#sli_search_1');
        $inputTextBox.attr({'placeholder': Translator.translate('search-again'), 'value': ''});
        return {
            form: $form,
            input: $inputTextBox.addClass('c-input-form-wrapper__input-text'),
            submitBtn: $form.find('input[type="submit"]').attr('value', Translator.translate('go'))
                .addClass('c-input-form-wrapper__button u--disabled')
        };
    };


    var parse = function($noResults) {
        var $searchTips =  $noResults.find('.cin-tips');
        return {
            noResultsMessage: $noResults.find('.cin-copy').text(),
            searchForm: getSearchResultForm($noResults.find('.cin-search')),
            searchTips: {
                items: {
                    sectionTitle: $searchTips.find('header').text(),
                    bellowsContent: $searchTips.find('p')
                }
            },
            popularProductsHeading: $noResults.find('.cin-subheadline header').text()
        };
    };

    return {
        parse: parse
    };
});
