define([
    '$',
    'pages/product-details/parsers/product-price-parser'
], function($, ProductPriceParser) {
    var chooseImage = function($img, widgetId) {
        for (var i = 0; i < $img.length; i++) {
            if (typeof $img.eq(i).attr('src') !== 'undefined') {
                return $img.eq(i);
            }
        }

        // If the images are not defined yet
        $img.eq(0)[0].onload = function() {
            Adaptive.$('.js-product-tile[data-widget-id="' + widgetId + '"] img').attr('src', Adaptive.$(this).attr('src'));
        };

        return $('<img>');
    };

    var _parse = function(widgets) {
        return $(widgets).map(function(_, item) {
            var $item = $(item);
            var itemId = $item.attr('id');

            var $discountedPrice  = $item.find('.gwt-now-price-holder, .gwt-pdp-main-stacked-price-now-label');
            var hasDiscount = $discountedPrice.length > 0;
            var $price;

            if (hasDiscount) {
                $price = $item.find('.gwt-was-price-holder, .gwt-pdp-main-stacked-price-was-label');
            } else {
                $price = $item.find('.gwt-product-detail-top-price, .gwt-product-detail-top-price');
            }

            return {
                widgetId: itemId,
                productImg: chooseImage($item.find('.iwc-main-img'), itemId),
                productTitle: $item.find('.gwt-product-title-panel h3').text(),
                productPrice: ProductPriceParser.parse($price, $discountedPrice),
                // This is required to achieve the Pinny functionality
                // Override default behavior of anchor
                productHref: '#'
            };
        });
    };

    return {
        parse: _parse
    };
});
