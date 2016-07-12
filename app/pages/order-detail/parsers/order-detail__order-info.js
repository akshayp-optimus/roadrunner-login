define(['$'], function($) {

    var getOrderNumberAndDate = function($container) {
        return $container.find('p').map(function(_, item) {
            var $item = $(item);
            return {
                label: $item.find('b').remove().text(),
                value: $item.text()
            };
        });
    };

    var getShippingInfo = function() {
        var address = '';
        address = $('.od-address-line').text() + ', ' + $('.od-city').text() + ' ' +
            $('.od-state').text() + ' ' + $('.od-zip').text() + ', ' + $('.od-country').text();
        return {
            label: $('.od-ship').text(),
            name: $('.od-name'),
            address: address
        };
    };

    var parse = function($container) {
        return {
            orderNumberAndDate: getOrderNumberAndDate($container),
            shippingInfo: getShippingInfo()
        };
    };

    return {
        parse: parse
    };
});
