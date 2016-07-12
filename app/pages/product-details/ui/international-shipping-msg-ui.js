define([
    '$'
], function($) {

    // Get shipping message for hidden container and display on the page as per the design
    // Hide add to cart and add t registry buttons
    var getInternaltionalShippingMsg = function() {
        var $internationalMsg = $('.js-desktop-pdp').find('.gwt-product-item-detail-international-product-restriction-panel').first();
        var $internationMsgContainer = $('.js-international-shipping-msg');

        if ($internationMsgContainer.hasClass('js-rendered')) {
            return;
        }

        if (!$internationalMsg.length) {
            return;
        }

        $internationMsgContainer.append($internationalMsg.find('p').removeAttr('style')).removeAttr('hidden').addClass('js-rendered');
        $('.js-cta').parent().attr('hidden', '');
        $('.js-product-options-container').attr('hidden', '');
    };

    var animationListener = function() {
        if (event.animationName === 'internationalShippingMsg') {
            getInternaltionalShippingMsg();
        }
    };

    var _init = function() {
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        init: _init
    };
});
