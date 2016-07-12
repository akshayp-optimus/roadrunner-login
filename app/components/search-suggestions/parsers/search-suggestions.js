define(['$'], function($) {

    var _parse = function($suggestionContainer) {
        var $termSuggestions = $suggestionContainer.find('.sli_ac_suggestions li');
        var $productSuggestions = $suggestionContainer.find('.sli_ac_products li');

        return {
            termSuggestions: $termSuggestions.map(function(i, suggestion) {
                return $(suggestion).find('.sli_ac_suggestion');
            }),

            productHeading: $suggestionContainer.find('.sli_ac_products h2'),

            productSuggestions: $productSuggestions.map(function(i, suggestion) {
                var $suggestion = $(suggestion);
                // var $productContainer = $suggestion.find('.sli_rac_container');

                // Replacing image size type from MiniThumb to LargeGrid
                // so that image does not gets blurred.
                var $changeImageSizeType = $suggestion.find('img');
                $changeImageSizeType.attr('src', $changeImageSizeType.attr('src').replace('SLI_MiniThumb', 'SLI_LargeGrid'));
                return {
                    img: $suggestion.find('.sli_ac_image').addClass('u-margin-right-md'),
                    productName: $suggestion.find('h3').html(),
                    priceContainer: $suggestion.find('.rac_priceLine')
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
