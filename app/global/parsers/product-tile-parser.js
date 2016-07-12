define([
    '$',
    'pages/product-details/parsers/product-price-parser',
], function($, ProductPriceParser) {

    var _parseFromJSON = function(productJSON, currencyConversion) {
        if (!productJSON) {
            return;
        }

        if (!currencyConversion) {
            currencyConversion = 1;
        }

        var minPrice = productJSON.minimumPrice * currencyConversion;
        var maxPrice = productJSON.maximumPrice * currencyConversion;
        var minListPrice = productJSON.minListPrice * currencyConversion;
        var maxListPrice = productJSON.maxListPrice * currencyConversion;
        var priceObj = ProductPriceParser.parseFromJSON(minPrice, maxPrice, minListPrice, maxListPrice);
        // scene7 image suffix
        var imgSuffix = '_main?$B_Subcat$';
        var imgPrefix = 'http://grandinroad.scene7.com/is/image/frontgate/';
        var imgSrc = imgPrefix + productJSON.mfPartNumber.replace(/\s/g, '_') + imgSuffix;

        return {
            productTitle: productJSON.prodName.replace('&amp;', '&'),
            productHref: productJSON.productDetailTargetURL,
            productImage: imgSrc,
            productPrice: priceObj
        };
    };

    var _parse = function($product) {

        if (!$product.length) {
            return;
        }

        var $discountedPrice  = $product.find('.gwt-now-price-holder');
        var hasDiscount = $discountedPrice.length > 0;
        var $price;

        if (hasDiscount) {
            $price = $product.find('.gwt-was-price-holder');
        } else {
            $price = $product.find('.gwt-product-detail-top-price');
        }

        return {
            productTitle: $product.find('.gwt-we-suggest-panel-name-anchor').text(),
            productHref: $product.find('.gwt-we-suggest-panel-name-anchor').attr('href'),
            productImage: $product.find('.gwt-we-suggest-panel-img').attr('src'),
            productPrice: ProductPriceParser.parse($price, $discountedPrice)
        };
    };

    return {
        parse: _parse,
        parseFromJSON: _parseFromJSON
    };
});
