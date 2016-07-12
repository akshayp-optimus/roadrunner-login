define([
    '$'
], function($) {

    // Get prices for products
    var getPrices = function($priceContainer) {
        var templateData = {};
        var $priceLine = $priceContainer.find('.cin-price');

        if ($priceLine.length) {
            templateData = {
                price: $priceLine
            };
        } else {
            templateData = {
                priceNew: $priceContainer.find('.cin-price-now').text().replace('Now', ''),
                priceOld: $priceContainer.find('.cin-price-then').text().replace('Was', ''),
                priceDiscount: true
            };
        }

        return templateData;
    };


    var parse = function($products) {
        return $products.find('.cin-catalog-item').map(function(_, product) {
            var $product = $(product);
            var $productLink = $product.find('.cin-link.product-link');
            var $priceContainer = $productLink.find('.priceLine');
            var $calloutText = $priceContainer.next('div').text().trim();

            return {
                productLink: $productLink,
                productHref: $productLink.attr('href'),
                productImg: $product.find('.cin-image.b6f8c-product-image'),
                productTitle: $product.find('.cin-title.b6f8c-product-heading'),
                productPrice: getPrices($priceContainer),
                calloutText: $calloutText
            };
        });
    };

    return {
        parse: parse
    };
});
