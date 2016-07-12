define([
    '$',
    'translator',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-bind-events-helpers-ui'
], function($, Translator, HelpersUI, BuildHelpersUI, BindEventsHelperUI) {

    var animationListener = function() {

        if (event.animationName === 'priceUpdated') {
            var $updatedPrice = $('#gwt_productdetail_json').find('.gwt-product-detail-widget-top-total-price-amount');
            $('.js-pdp-price-total').removeClass('u--hide').text($updatedPrice.text());

            // Enable Add to Cart
            if ($updatedPrice.text()) {
                $('.js-pdp-price-total').addClass('c-price-text');
            }
        } else if (event.animationName === 'productOptionReset') {
            // PDP #1 and PDP #2
            if ($('#gwt-bundle-det-insp-see-coll').length === 0) {
                BuildHelpersUI.buildPrice($('.js-pdp-price'), $('.gwt-product-detail-left-panel'));
                BindEventsHelperUI.bindEvents(true);
            }
        } else if (event.animationName === 'errorAdded') {
            var $addToCartButton = $('.js-add-to-cart');

            HelpersUI.disableAddToCartWishlist($addToCartButton, $('.js-add-to-wishlist'));
            // $addToCartButton.html(translator.translate('add_to_cart'));
            $(document).trigger('addToCartError');
            $addToCartButton.removeClass('c--success c-add-to c--check js-to-cart c--added-to');
            $addToCartButton.addClass('c--primary');
        }
    };

    // Checks for animation to validate if price is updated
    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        bindAnimationListener: bindAnimationListener
    };
});
