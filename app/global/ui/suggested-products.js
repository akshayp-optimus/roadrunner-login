define([
    '$',
    'hijax',
    'dust!components/scroller/scroller',
    'global/parsers/product-tile-parser'
], function($, Hijax, ScrollerTmpl, productTileParser) {


    var buildSuggestedProducts = function(JSONData, title, $container) {
        var $heading = $('<h2 class="c-suggested-products-title c--small u-margin-bottom-md">').text(title);
        var currencyConversion = $('#gwt_international_conversion_rate').val();
        var productTileData = [];

        if (!JSONData) {
            return;
        }
        var parsedProducts = JSONData.products.map(function(product, _) {
            return productTileParser.parseFromJSON(product, currencyConversion);
        });

        var scrollerData = {
            slideshow: {
                productTiles: parsedProducts
            }
        };

        new ScrollerTmpl(scrollerData, function(err, html) {
            $container.empty().html(html);
        });

        $container.prepend($heading);
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'suggested-products-proxy',
            function(url) {
                return /RecommendationsJSONCmd/.test(url);
            },
            {
                complete: function(data, xhr) {
                    var JSONData = JSON.parse(data);
                    var suggestedProductsJSON = JSONData.requestResults[0];
                    var otherCustomerJSON = JSONData.requestResults[1];
                    buildSuggestedProducts(suggestedProductsJSON, 'You may also like', $('.js-suggested-products'));
                    buildSuggestedProducts(otherCustomerJSON, 'Customers also bought', $('.js-other-customer'));
                }
            }
        );
    };


    return {
        init: initHijax,
        buildSuggestedProducts: buildSuggestedProducts
    };
});
