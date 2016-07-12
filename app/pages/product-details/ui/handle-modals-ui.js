define([
    '$',
    'translator',
    // Utils
    'global/utils/ajax-reader',
    'global/utils/dom-operation-override',
    'global/ui/wishlist-ui',
    'pages/product-details/ui/sign-in-ui',
    'pages/product-details/ui/ask-a-specialist-ui',
    'pages/product-details/ui/personalization-delete-ui',
    'pages/product-details/ui/add-to-cart-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/more-information-ui',
    'pages/product-details/ui/interactive-image-ui',
    'pages/product-details-bundle/ui/product-detail-widget-ui',

], function($, Translator,
    AjaxReaderParser, domOverride,
    wishlistUI, signInUI, askSpecialistUI, deletePersonalizationModalUI, addToCartUI,
    HelpersUI, moreInformationUI, interactiveImageUI, productDetailWidgetUI) {

    var onSuccessMoreInfo = function(data) {
        moreInformationUI.parse(data);
    };

    var onErrorMoreInfo = function(data) {
        // Handler for error case
    };

    // Override more information links to display pinny instead of new tab popup
    var overrideMoreInfoPopups = function() {
        var _open = window.open;
        window.open = function(url) {
            if (url.indexOf(window.location.origin) > -1 || url.indexOf('http') < 0) {
                // FRGT-402: Check that the URL either relative or on the same domain that we're on
                if ((/.jpg/ig).test(url)) {
                    // To pull the image from desktop from diagram link in hide reveal link
                    // as it is not having image tag
                    $('body').append('<img class="c-diagram-image">');
                    $('body').find('img.c-diagram-image').attr('src', url);
                    moreInformationUI.parse($('img.c-diagram-image'));
                } else {
                    AjaxReaderParser.parse(url, onSuccessMoreInfo, onErrorMoreInfo);
                }

                return open;
            } else {
                return _open.apply(this, arguments);
            }
        };
    };

    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $addWishlistModal = $('#gwt-add-to-gift-registry-modal');
            var $newWishlistModal = $('#gwt-wishlist-create-modal');
            var $signInModal = $('#gwt-sign-in-modal');
            var $forgotPasswordModal = $('#passwordReset');
            var $addToCartModal = $('.gwt_addtocart_div').addClass('u--hide');
            var $addedToWishlistModal = $('.gwt-added-to-wish-list-modal');
            var $deletePersonalizationModal = $('.ok-cancel-dlog');

            if ($addWishlistModal.length && !$addWishlistModal.children('.c-sheet').length) {
                wishlistUI.showAddToWishlistModal($addWishlistModal);
            } else if ($newWishlistModal.length) {
                wishlistUI.showNewWishlistModal($newWishlistModal);
            } else if ($signInModal.length) {
                signInUI.showSignInModal($signInModal);
            } else if ($forgotPasswordModal.length) {
                signInUI.showForgotPasswordModal($forgotPasswordModal);
            } else if ($addToCartModal.length) {
                addToCartUI.triggerNotification($addToCartModal);
                setTimeout(function() {
                    HelpersUI.disableAddToCartWishlist($('.js-add-to-cart'), $('.js-add-to-wishlist'));
                }, 0);
            } else if ($addedToWishlistModal.length && !$('.js-notification-pinny').parent().hasClass('pinny--is-open')) {
                wishlistUI.triggerWishlistNotification($addedToWishlistModal);
                setTimeout(function() {
                    HelpersUI.disableAddToCartWishlist($('.js-add-to-cart'), $('.js-add-to-wishlist'));
                }, 0);
            } else if ($deletePersonalizationModal.length && !$deletePersonalizationModal.children('.pinny').length) {
                // Handle Delete Modal
                deletePersonalizationModalUI.showRemovalConfirmationModal($deletePersonalizationModal);
            }
        }

        if (event.animationName === 'interactiveImageAdded') {
            // Open the sheet here.
            interactiveImageUI.showInteractiveImageModal();
        }
    };

    var animationListener = function() {
        if (event.animationName === 'moreInformationPopup') {
            var src = jQuery('#colorbox').find('iframe').attr('src');
            AjaxReaderParser.parse(src, onSuccessMoreInfo, onErrorMoreInfo);
        }
    };

    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    var initSheets = function() {
        wishlistUI.initSheet();
        signInUI.initSheet();
        askSpecialistUI.initSheet();
        deletePersonalizationModalUI.initSheet();
        productDetailWidgetUI.initSheet();
        interactiveImageUI.initSheet();
        overrideMoreInfoPopups();
        bindAnimationListener();

        domOverride.on('domAppend', '.gwt-site-feedback-main-panel', askSpecialistUI.showAskSpecialistModal);
        domOverride.on('domRemove', '#js-specialist', askSpecialistUI.closeSheet);

        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);
    };

    return {
        initSheets: initSheets
    };
});
