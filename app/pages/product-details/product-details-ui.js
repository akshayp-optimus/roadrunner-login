define([
    '$',
    'global/utils/dom-operation-override',
    'global/utils',
    'magnifik',
    'scooch',
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
    'scrollTo'
], function($, DomOverride, Utils, Magnifik, Scooch, translator, Hijax, bellows, sheet,
    // UI
    TellAFriendUI, PersonalizationUI, HideRevealUI, InternationalShippingMsgUI, SuggestedProductsUI,
    // Helpers & Handlers UI
    NotificationUI, HandleModalsUI, HelpersUI, BazaarVoiceHandlerUI, AnimationHandlerUI,
    BuildHelpersUI, BindEventsHelperUI) {
    var thumbnailSets = [];

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

    var _changeBellowsIcon = function($icon) {
        if ($icon.find('title').text() === 'expand') {
            $icon.attr('data-fallback', 'img/png/collapse.png');
            $icon.find('title').text('collapse');
            $icon.find('use').attr('xlink:href', '#icon-collapse');
        } else {
            $icon.attr('data-fallback', 'img/png/expand.png');
            $icon.find('title').text('expand');
            $icon.find('use').attr('xlink:href', '#icon-expand');
        }
    };

    // Handles the icons displayed when bellow is open and closed
    var initBellows = function() {
        $('.t-product-details-page').on('click', '.c-bellows__header', function(e) {
            var $target = $(this);

            var $icon = $target.find('.c-icon');

            _changeBellowsIcon($icon);
        });

        $('.js-product-review-pinny').on('click', '.c-bellows__header', function(e) {
            var $target = $(this);

            var $icon = $target.find('.c-icon');

            _changeBellowsIcon($icon);
        });
    };

    // not the best solution, but can't really find a function to hook onto
    // on when the script gets rendered
    var pollForProductImage = function() {
        var _poll = window.setInterval(function() {
            var $pollTarget = $('.iwc-main-img');
            if ($pollTarget.length && $pollTarget.attr('src')) {
                // wait for desktop scripts to execute first
                setTimeout(function() {
                    var $parent = $('.js-product-options-container');
                    var $desktopParent = $('.gwt-product-right-content-panel');
                    var $oosMessage = $desktopParent.find('.gwt-product-detail-widget-base-expired-label');

                    // build images-related stuff
                    BuildHelpersUI.buildProductImages();
                    //BuildHelpersUI.buildProductHeroCarousel(productThumbnails);

                    BuildHelpersUI.buildPrice($('.js-pdp-price'), $('.gwt-product-detail-left-panel'));

                    if ($oosMessage.length) {
                        // GRRD-705: Unavailable items shouldn't show product options or CTAs
                        $parent.siblings('.js-cta-container').attr('hidden', 'true');
                        $parent.html($oosMessage.first().text()).addClass('u-text-align-center u-padding-all u--tight u--less');
                    } else {
                        BuildHelpersUI.buildProductOptions($parent, $desktopParent);
                    }

                    // Update DOM
                    HelpersUI.updateCTAs();
                    HelpersUI.updateMainImageSrc(Adaptive.$('.iwc-main-img-wrapper'));

                    HelpersUI.updateSwatchboxText();
                    HelpersUI.updateCarouselAnchors();

                    // Bind Events
                    BindEventsHelperUI.bindEvents(false);
                    // Repalce with Prototype
                    Utils.replaceWithPrototypeElements();
                    TellAFriendUI.init();

                    initPlugins();
                    HelpersUI.productDetailsDecorators();

                    $(document).on('addedToCart', function() {
                        // GRRD-701: Reset ATC flag
                        window.Adaptive.atcReady = false;

                        BuildHelpersUI.updateOptions($parent, $desktopParent);
                        BuildHelpersUI.buildPersonalization($parent, $desktopParent);
                    });

                    PersonalizationUI.init($parent, $desktopParent);

                    // set initial state
                    BuildHelpersUI.updateOptions($parent, $desktopParent);
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
                    // HelpersUI.updateSpecialShipping($('.gwt-product-detail-widget'));

                    // GRRD-701: ATC ready now that inventory is ready
                    window.Adaptive.atcReady = true;

                    BuildHelpersUI.updateOptions($parent, $desktopParent);
                }
            }
        );
    };

    var updatePersonalization = function() {
        var $parent = $('.js-product-options-container');
        var $desktopParent = $('.gwt-product-right-content-panel');

        setTimeout(function() {
            BuildHelpersUI.buildPersonalization($parent, $desktopParent);
        }, 500);
    };

    var _transformSpecialShipping = function(descriptionPanel) {
        // wait for element to be appended to page first
        if ($(descriptionPanel).text().trim() !== '') {
            setTimeout(function() {
                HelpersUI.updateSpecialShipping();
            }, 600);
        }
    };

    var productDetailsUI = function() {
        // Add any scripts you would like to run on the productDetails page only here
        pollForProductImage();

        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', updatePersonalization);
        DomOverride.on('domAppend', '', _transformSpecialShipping, '.gwt-product-detail-widget-dynamic-info-panel');
        $(document).on('pinny.confirmationModal.close', updatePersonalization);

        initHijax();
        initBellows();

        HideRevealUI.init();
        AnimationHandlerUI.bindAnimationListener();
        HandleModalsUI.initSheets();
        SuggestedProductsUI.init();
        InternationalShippingMsgUI.init();
        NotificationUI.init(true);
        BindEventsHelperUI.bindProductImageOptionClick();
        BindEventsHelperUI.bindCustomEvents();

        var reviewSheet = sheet.init($('.js-product-review-pinny'));
        var questionSheet = sheet.init($('.js-product-question-pinny'));

        // Desktop Override
        overrideShowErrors();
        BazaarVoiceHandlerUI.init(reviewSheet, questionSheet);
    };

    return productDetailsUI;
});
