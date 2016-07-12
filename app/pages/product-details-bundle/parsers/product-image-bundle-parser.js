define([
    '$'
], function($) {
    var _parse = function($pdpContainer) {

        // We need only first carousel's image
        return $pdpContainer
            .find('.tilePanel').first()
            .find('.iwc-thumb-img').map(function(_, item) {
                var $item = $(item);
                var isInteractive = false;
                $item.parent('.js-thumbnails');

                if (/alt_(360|video)/i.test($item.attr('src'))) {
                    isInteractive = true;
                }

                return {
                    isInteractive: isInteractive,
                    imgSrc: $item.attr('src').replace('$wfit$', '$wfih$')
                };
            });
    };

    return {
        parse: _parse
    };
});
