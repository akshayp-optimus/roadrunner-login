define([
    '$',
    'global/utils',
], function($, utils) {

    var _parse = function(productJSON) {
        if (!productJSON) {
            return;
        }

        var productImgFormat = 'http://grandinroad.scene7.com/is/image/frontgate/T_WithoutZoom?$<sizeType>$&$src=<productCode>_main';
        return productJSON.products.map(function(product) {
            return {
                productHorizontal: true,
                productImageSrc: utils.getCorrectImageURL(productImgFormat.replace('<productCode>', product.mfPartNumber)),
                // desktop JSON object is not properly escaping all special characters
                // Create jQuery object to leverage .text() to decode it
                productTitle: $('<div>' + product.name + '</div>').text(),
                productHref: product.productDetailTargetURL,
                moreColors: product.hasMoreAttributes,
                productPrice: {
                    additionalPriceClass: 'gwt-product-info-panel-avail'
                }
            };
        });
    };

    return {
        parse: _parse
    };
});
