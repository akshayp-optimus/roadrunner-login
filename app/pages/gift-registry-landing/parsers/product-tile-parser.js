define([
    '$'
], function($) {

    var parse = function($products) {
        return $products.find('.col-xs-3').map(function(_, product) {
            var $product = $(product);
            var $productLink = $product.find('a');

            return {
                productLink: $productLink,
                productHref: $productLink.attr('href'),
                productImg: $product.find('img'),
                productTitle: $product.find('span').append(' >').addClass('c-product-title'),
            };
        });
    };

    return {
        parse: parse
    };
});
