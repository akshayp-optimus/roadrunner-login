define([
    '$',
    'global/utils/dom-operation-override',
    'global/utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'pages/product-details/ui/tell-a-friend-ui',
    'pages/product-details/ui/personalization-ui',
    'pages/product-details/ui/international-shipping-msg-ui',
    'components/hide-reveal/hide-reveal-ui',
    'global/ui/suggested-products',
    'components/notification/notification-ui',
    'pages/product-details/ui/handle-modals-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/bazaar-voice-handler-ui',
    'pages/product-details/ui/pdp-animation-handler-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-bind-events-helpers-ui',
], function($, DomOverride, Utils, Magnifik, translator, Hijax, bellows, sheet,
    // UI
    TellAFriendUI, PersonalizationUI, HideRevealUI, InternationalShippingMsgUI, SuggestedProductsUI,
    // Helpers & Handlers UI
    NotificationUI, HandleModalsUI, HelpersUI, BazaarVoiceHandlerUI, AnimationHandlerUI,
    BuildHelpersUI, BindEventsHelperUI) {

    var overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);
            var $errorPopup = $('#gwt-error-placement-div').attr('hidden', 'hidden');
            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));
            return result;
        };
    };

    var initPlugins = function() {
        $('.bellows').bellows();
        $('.magnifik').magnifik();
    };

    var _setInitialState = function() {
        var $parent = $('.js-product-detail-widget-pinny');
        var $desktopParent = $('#' + $parent.attr('data-widget-id'));

        var pdpSelector = $('.gwt-image-picker-option-image-selected').closest('[id*="gwt-product-detail-widget-id"]').attr('id');
        if (!pdpSelector) {
            return;
        }

        pdpSelector = '[data-widget-id="' + pdpSelector + '"]';

        var $pdp = $(pdpSelector);
        $pdp.click(); // opens pinny

        BuildHelpersUI.updateOptions($parent, $desktopParent);
    };

    var parseBundleProduct = function() {
        var $parent = $('.js-product-detail-widget-pinny');
        var $desktopParent = $('#' + $parent.attr('data-widget-id'));

        BuildHelpersUI.buildProductWidgets();

        // Bind Events
        BindEventsHelperUI.bindEvents(false);

        initPlugins();
        HelpersUI.productDetailsDecorators();

        $(document).on('addedToCart', function() {
            // GRRD-701: Reset ATC flag
            window.Adaptive.atcReady = false;

            BuildHelpersUI.updateOptions($parent, $desktopParent);
            BuildHelpersUI.buildPersonalization($parent, $desktopParent);
        });

        PersonalizationUI.init($parent, $desktopParent);
    };


    // not the best solution, but can't really find a function to hook onto
    // on when the script gets rendered
    var pollForProductImage = function() {
        var isExecuted = false;
        var _poll = window.setInterval(function() {
            var $pollTarget = $('.iwc-main-img');
            if ($pollTarget.length && $pollTarget.attr('src') && !isExecuted) {
                // wait for desktop scripts to execute first
                setTimeout(function() {
                    // build images-related stuff
                    BuildHelpersUI.buildProductImages(true);

                    TellAFriendUI.init();
                    HelpersUI.updateCarouselAnchors();

                    isExecuted = true;

                    setTimeout(function() {
                        _setInitialState();
                    }, 50);
                });

                window.clearInterval(_poll);
            }
        }, 300);
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'tell-a-friend-proxy',
            function(url) {
                return url.indexOf('SendTellAFriendEmail') > -1;
            }, {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        TellAFriendUI.closeModal();
                        Adaptive.notification.triggerSuccessMessage(translator.translate('share_successful'));
                    }
                }
            }
        );

        hijax.set(
            'shippingUpdate',
            function(url) {
                return url.indexOf('ProductInventoryJSONView') > -1;
            }, {
                complete: function(data, xhr) {
                    var $parent = $('.js-product-options-container');
                    var $desktopParent = $('.gwt-product-detail-widget');

                    // GRRD-701: ATC ready now that inventory is ready
                    window.Adaptive.atcReady = true;

                    BuildHelpersUI.updateOptions($parent, $desktopParent);
                }
            }
        );
    };

    var updatePersonalization = function() {
        var $parent = $('.js-product-detail-widget-pinny');
        var $desktopParent = $('#' + $parent.attr('data-widget-id'));

        setTimeout(function() {
            BuildHelpersUI.buildPersonalization($parent, $desktopParent);
        }, 500);
    };

    var productDetailsUI = function() {
        // Add any scripts you would like to run on the productDetails page only here
        pollForProductImage();

        // Bundle Products
        DomOverride.on('domAppend', '.gwt-product-detail-other-products-panel', parseBundleProduct);
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', updatePersonalization);
        $(document).on('pinny.confirmationModal.close', updatePersonalization);

        initHijax();

        var reviewSheet = sheet.init($('.js-product-review-pinny'));
        var questionSheet = sheet.init($('.js-product-question-pinny'));

        BazaarVoiceHandlerUI.init(reviewSheet, questionSheet);
        HideRevealUI.init();
        AnimationHandlerUI.bindAnimationListener();
        HandleModalsUI.initSheets();
        SuggestedProductsUI.init();
        InternationalShippingMsgUI.init();
        NotificationUI.init(true);
        // BindEventsHelperUI.bindProductImageOptionClick();
        BindEventsHelperUI.bindCustomEvents();

        // Desktop Override
        overrideShowErrors();
    };

    return productDetailsUI;
});
