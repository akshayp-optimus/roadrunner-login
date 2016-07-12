define([
    '$',
    'hijax',
    'global/utils/dom-operation-override',
    'global/ui/cart-item-ui',
    'global/utils',
    'components/sheet/sheet-ui',
    'global/ui/address-modal-ui',
    'global/ui/handle-form-fields',
    'global/utils/selector-extensions'
], function($, Hijax, DomOverride, cartItemUI, utils, sheet, AddressModal, handleFormFieldsUI) {

    var $changeAddressPinny = $('.js-change-address-pinny');
    var $paymentStep = $('.js-checkout-step.c--payment');
    var $reviewStep = $('.js-checkout-step.c--review');
    var $paymentBlock = $('.js-payment-block');
    var $reviewBlock = $('.js-review-block');
    var $giftPinny = $('.js-gift-pinny');
    var $serviceDeliveryOptionPinny = $('.js-service-delivery-option-pinny');
    var $whatThisToolTipPinny = $('.js-review-delivery-what-this-pinny');
    var $tenderTypePinny = $('.js-tender-type-pinny');
    var desktopOverridden = false;
    var overrideInterval;
    var changeAddressSheet;


    var _overrideDesktop = function() {
        if (!desktopOverridden && window.showAddressSelectModal) {
            var _showSelectModal = window.showAddressSelectModal;

            desktopOverridden = true;
            clearInterval(overrideInterval);

            window.showAddressSelectModal = function() {
                _showSelectModal.apply(this, arguments);
                AddressModal.showModal($('.ok-cancel-dlog'), true);
            };
        }
    };

    var _resetPlaceOrderButton = function() {
        $('.js-place-order .primary').removeClass('disabled').addClass('c-button c--full-width c--primary').removeAttr('disabled');
    };

    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');
        var $openPinny = $('.pinny.pinny--is-open');
        var $shade = $openPinny.siblings('.shade--is-open');
        // Remove the loader and revert back to the original btn text.

        // Reset pinny markup.
        $openPinny.appendTo($lockup);
        $shade.appendTo($lockup);
        $changeAddressPinny.parent().appendTo($lockup);
        _resetPlaceOrderButton();
    };



    var _onGiftClose = function() {
        _resetPlaceOrderButton();
        $giftPinny.find('.js-cancel span').click();
        $serviceDeliveryOptionPinny.find('.js-cancel span').click();
    };

    var _onWhatThisClose = function() {
        $whatThisToolTipPinny.find('.js-cancel span').click();
    };


    var _initPlugins = function() {
        var title = $('.js-menu-title').first().text();
        var $shippingPinny = $('.js-shipping-details-pinny');

        sheet.init($changeAddressPinny, {
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                cssClass: 'js-change-address-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: _onSheetClose
        });

        sheet.init($giftPinny, {
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                cssClass: 'js-change-address-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            },
            closed: _onGiftClose
        });

        sheet.init($serviceDeliveryOptionPinny, {
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                cssClass: 'js-change-address-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            },
            closed: _onGiftClose
        });

        sheet.init($whatThisToolTipPinny, {
            zIndex: 1100, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                cssClass: 'js-change-address-shade',
                zIndex: 1010 // Match our standard modal z-index from our CSS ($z3-depth)
            },
            closed: _onWhatThisClose
        });

        sheet.init($tenderTypePinny, {
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                cssClass: 'js-tender-type-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: _onSheetClose
        });

        changeAddressSheet = $changeAddressPinny.data('component');

        changeAddressSheet.setTitle(title);

        AddressModal.initSheet();

        AddressModal.addCloseCallback(_resetPlaceOrderButton);

        sheet.init($shippingPinny);

        $('.js-pinny-button').on('click', function() {
            var dataTarget = $(this).attr('data-target');
            $(dataTarget).pinny('open');
        });
    };
    var _bindGiftEvents = function() {
        $('.js-close-pinny').on('click', function(e) {
            $giftPinny.pinny('close');
            $serviceDeliveryOptionPinny.pinny('close');
        });
    };

    var _showGiftModal = function($modal) {
        var tooltipSheet = $giftPinny.data('component');
        if ($modal.hasClass('tc-confirm-dlog')) {
            tooltipSheet = $serviceDeliveryOptionPinny.data('component');
        }
        var $text = $modal.find('.dialogContent .gwt-HTML');
        var $ctas = $modal.find('.okCancelPanel');
        var title = $modal.find('.Caption').text();

        $text.addClass('u-margin-bottom-md');

        $ctas.find('.primary')
            .addClass('c-button c--primary c--full-width u-margin-bottom-md js-close-pinny')
            .prependTo($ctas);

        if ($modal.hasClass('tc-confirm-dlog')) {
            $ctas.find('.secondary').addClass('c--full-width js-close-pinny js-cancel');
            tooltipSheet.setTitle(title);
        } else {
            $ctas.find('.secondary').addClass('c-button c--outline c--full-width js-close-pinny js-cancel');
        }

        _bindGiftEvents();
        $modal.attr('hidden', 'true');
        tooltipSheet.setBody($text.add($ctas));
        tooltipSheet.open();
    };

    var _showTenderTypeModal = function($modal) {
        var sheet = $tenderTypePinny.data('component');
        var $ctas = $modal.find('.okCancelPanel');
        var $content = $('<div>');

        $ctas.find('.primary').addClass('c-button c--primary');
        $ctas.find('.secondary').addClass('c-button c--outline u-margin-bottom-sm');

        $content.append($('<h4>').html($modal.find('.Caption').text()));
        $content.append($('<p class="u-margin-top-md">').html($modal.find('.tender-type-modal-container').text()));
        $content.append($ctas);

        sheet.setBody($content);
        $modal.html($tenderTypePinny.parent());
        $modal.append($('.js-tender-type-shade'));
        sheet.open();
    };

    var _nodeInserted = function() {
        if (event.animationName === 'modalAddedForOrderConfirmation') {
            var $editAddressModal = $('#editAddressModal');
            var $addAddressModal = $('#addAddressModal');
            var $giftModal = $('#gift_box_reset_message_modal');
            var $serviceOptionModal = $('.tc-confirm-dlog');
            var $reviewDeliveryOptions = $('.js-review-delivery-options');
            var $reviewDeliveryOptionsModal = $('.termsCondModal');
            var $tenderTypeModal = $('.tender-type-confirmation-modal');

            _resetPlaceOrderButton();

            if ($editAddressModal.length) {
                AddressModal.showModal($editAddressModal);
            } else if ($addAddressModal.length) {
                AddressModal.showModal($addAddressModal);
            } else if ($giftModal.length) {
                _showGiftModal($giftModal);
            } else if ($serviceOptionModal.length) {
                _showGiftModal($serviceOptionModal);
            } else if ($reviewDeliveryOptionsModal.length) {
                AddressModal.showModal($reviewDeliveryOptionsModal);
                $('.js-read-delivery-terms').on('click', function() {
                    var $this = $(this);
                    $this.addClass('u--hide');
                    $('.c-read-delivery-terms-content').show();
                });
            } else if ($tenderTypeModal.length) {
                _showTenderTypeModal($tenderTypeModal);
            }
            // Update placeholders in inputs
            handleFormFieldsUI.updatePlaceholder();
        }
    };

    var _bindWhatThisEvents = function() {
        $('.js-close-pinny').on('click', function(e) {
            $whatThisToolTipPinny.pinny('close');
        });
    };

    var _showWhatThisToolTipModal = function($modal) {
        var tooltipSheet = $whatThisToolTipPinny.data('component');

        var $text = $modal.find('.popupContent .gwt-HTML');
        var $ctas = $modal.find('.okCancelPanel');

        $text.addClass('u-margin-bottom-md');

        $ctas.find('.primary').addClass('js-close-pinny js-cancel u--hide');

        _bindWhatThisEvents();
        $modal.attr('hidden', 'true');
        tooltipSheet.setBody($text.add($ctas));
        tooltipSheet.open();
    };

    var whatThisToolTip = function() {
        var hijax = new Hijax();
        hijax.set(
            'whatThisToolTip', function(url) {
                return /best_delivery_phone_number/.test(url);
            }, {
                beforeSend: function(xhr) {
                    $('.js-filter-loader').removeClass('u--hide');
                },
                complete: function() {
                    $('.js-filter-loader').addClass('u--hide');
                    var $whatThisToolTip = $('.best-phone-whats-this');
                    _showWhatThisToolTipModal($whatThisToolTip);
                }
            }
        );
    };

    var _bindEvents = function() {

        $('.js-change-dropdown').on('click', function(e) {
            var $button = $(this);
            var $targetContainer = $button.next('.js-change-menu');
            var $clickTarget = $targetContainer.find('td');

            $clickTarget[0].click();

            // We need to use both jQuery and Javascript native's click functions to
            // correctly trigger the desktop scripts
            // Except on android, which only needs Javascript's click function
            if (!$.os.android) {
                $clickTarget.click();
            }
        });

        $('body').on('click', '.js-dupeItem', function() {
            var $item = $(this);
            var $target = $($item.attr('data-target'));

            changeAddressSheet.close();

            $target.click();
            $target[0].click();
        });


        $('.js-shipping-option').on('click', function(e) {
            var $option = $(this);
            var $select = $option.closest('.js-option-container').find('select');

            $select.val($option.attr('data-value'));
            $select[0].dispatchEvent(new CustomEvent('change'));
        });

        $('.js-tender-type-pinny').on('click', '.c-sheet__header-close', function(e) {
            var $pinny = $(this).closest('.js-tender-type-pinny');

            $pinny.find('.js-cancel').triggerGWT('click');
        });

        document.addEventListener('animationStart', _nodeInserted);
        document.addEventListener('webkitAnimationStart', _nodeInserted);

        whatThisToolTip();
    };

    var _transformChangeAddressDropDown = function() {
        var $menu = $(arguments[0]).children();
        var $menuContent = $('<div class="t-payment-and-review__change-shi-add">');

        $menu.removeAttr('style');
        $menu.children('table').attr('hidden', 'true');

        $('body').append($menu.parent().attr('class', 'js-change-popup'));

        $menu.find('.gwt-MenuItem').each(function(i, menuItem) {
            var $menuItem = $(menuItem);
            var type = $menuItem.text().split(' ')[0];
            var menuItemText = menuItem.textContent;
            var $container = $('<div class="c-list-tile"><button class="c-list-tile__primary-tile js-dupeItem"><div class="c-list-tile__primary-content">' + menuItemText + '</div></button></div>');

            $container.find('.js-dupeItem').attr('data-target', '.js-' + type);
            $menuItem.addClass('needsclick js-' + type);

            $menuContent.append($container);
        });

        $changeAddressPinny.find('.js-change-address-content').html($menuContent);

        $menu.append($changeAddressPinny.parent());
        changeAddressSheet.open();
    };

    var _triggerPinnyClose = function() {
        $tenderTypePinny.pinny('close');
    };

    var _setUpSection = function() {
        cartItemUI();

        _bindEvents();
        _initPlugins();

        DomOverride.on('domAppend', '.gwt-MenuBarPopup', _transformChangeAddressDropDown);
        DomOverride.on('domRemove', '.tender-type-confirmation-modal', _triggerPinnyClose);

        overrideInterval = setInterval(_overrideDesktop, 500);

    };

    return {
        setUpSection: _setUpSection
    };
});
