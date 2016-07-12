define(['$'], function($) {
    var parse = function($container) {
        return {
            image: $container.find('.gwt-pdp-collection-thumbnail-image')
        };
    };

    return {
        parse: parse
    };
});
