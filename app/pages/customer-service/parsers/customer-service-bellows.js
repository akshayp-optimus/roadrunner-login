define(['$'], function($) {
    var parse = function() {
        var $customerServiceBellows = $('.contact-section').remove().find('dl dt');
        var customerServiceItems = $customerServiceBellows
            .map(function(index, item) {
                var $item = $(item);
                $item.next().find('h3').addClass('u-default-font-size');
                return {
                    sectionTitle: $item.addClass('u-margin-top-0 u-default-font-size'),
                    content: $item.next()
                };
            });
        return {
            items: customerServiceItems,
            accordionClass: 'c-customer-service-bellows'
        };
    };

    return {
        parse: parse
    };
});
