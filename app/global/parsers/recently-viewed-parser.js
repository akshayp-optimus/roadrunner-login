define([
    '$',
    'global/utils/template-reader',
    'global/parsers/product-tile-parser'
],
function($, JSONTemplate, productTileParser) {

    var _parse = function($dataSourceContainer, $conversionRateContainer, $currencyIndicatorContainer) {
        if (!$dataSourceContainer.length) {
            return;
        }

        var currencyConversion = $conversionRateContainer.val();
        var currencyIndicator = $currencyIndicatorContainer.val();
        var JSONData = JSONTemplate.parse($dataSourceContainer);

        if (!JSONData || !JSONData.products) {
            return;
        }

        var parsedProducts = JSONData.products.map(function(product, _) {
            var product = productTileParser.parseFromJSON(product, currencyConversion, currencyIndicator);

            product.productHref += '?isRecentlyViewed=true';

            return product;
        });

        var scrollerData = {
            slideshow: {
                productTiles: parsedProducts
            }
        };

        return scrollerData;
    };

    return {
        parse: _parse
    };
});
