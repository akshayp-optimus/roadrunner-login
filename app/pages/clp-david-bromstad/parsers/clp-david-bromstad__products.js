define(['$'], function($) {

    // Get Bromstad Products
    var getBromstadProducts = function($container) {
        return $container.find('.pdpBox').map(function(_, item) {
            var $item = $(item);

            return {
                href: $item.find('a').attr('href'),
                img: $item.find('img')
            };
        });
    };
    var _parse = function() {
        return {
            heading: $('#Bromstad_SomethingForEveryRoom').find('h3').text(),
            items: getBromstadProducts($('#Bromstad_Products')),
        };

    };

    return {
        parse: _parse
    };
});
