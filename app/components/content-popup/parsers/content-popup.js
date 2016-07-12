define(['$'], function($) {
    var _parse = function($container) {
        $container.find('br').remove();
        var $content = $container.find('.inst-copy');

        return {
            bodyContent: $content.length ? $container.find('.inst-copy') : $container.text()
        };
    };

    return {
        parse: _parse
    };
});
