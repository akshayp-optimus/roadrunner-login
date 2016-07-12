define(['$'], function($) {
    var _parse = function($container) {

        return {
            title: $container.find('.Caption')
        };
    };

    return {
        parse: _parse
    };
});
