define(['$'], function($) {

    // Get all related products
    var _parse = function($container) {
        var $relatedProducts = $container.find('.br-sf-widget').map(function(_, item) {
            var $item = $(item);
            var $heading = $item.find('.br-sf-widget-merchant-title');
            return {
                img : $item.find('.br-sf-widget-merchant-img img'),
                href: $heading.find('a').attr('href'),
                heading: $heading.text()
            };
        });

        return {
            items: $relatedProducts
        };
    };

    return {
        parse: _parse
    };
});
