define(['$'], function($) {

    var parse = function($container) {
        var $carouselItems;
        if (!$container.products) {
            $carouselItems = $container.find('.tilePanel .carouselTile').map(function(_, item) {
                var $item = $(item);
                var $heading = $item.find('.gwt-we-suggest-panel-name-anchor');

                return {
                    img : $item.find('.gwt-we-suggest-panel-img-anchor img'),
                    heading: $heading.text(),
                    href: $heading.attr('href')
                };
            });
        } else {
            $container.products.map(function(product) {
                return {
                    img : $('<img />').attr('src', product.thumbNail),
                    heading: product.prodName,
                    href: product.productDetailTargetURL
                };
            });
        }


        return {
            items: $carouselItems,
            // carouselTitle:
        };
    };

    return {
        parse: parse
    };
});
