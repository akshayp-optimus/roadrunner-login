define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    'global/utils/dom-operation-override',
    'global/ui/wishlist-item-ui',
    'dust!pages/gift-registry-manage/partials/gift-registry-manage-gift-card',
    'pages/gift-registry-manage/parsers/gift-registry-manage-gift-card',
    'global/ui/registry-form-parser-ui',
    'pages/gift-registry-create/gift-registry-create-ui',
    'translator',
    'global/ui/registry-ui',
    'global/ui/stepper-ui',
    'global/utils/ajax-reader',
    'global/utils/dom-operation-override',
    'pages/product-details/ui/more-information-ui',
    'pages/view-wishlist/view-wishlist-ui',
    'dust!components/bellows/bellows',
    'global/parsers/product-details-tab-parser',
    'velocity',
    'dust!components/notification/partials/cart-item'
],
function($, Utils, sheet, DomOverride, wishlistItemUI, GiftCardTemplate, giftCardParser,
    registryFormParser, giftRegistryCreateUI, Translator, registryUI, stepperUI, AjaxReaderParser, domOverride, moreInformationUI, viewWishlistUI, BellowsTemplate, productDetailsTabParser, Velocity, NotificationCartItemTemplate) {

    var $detailsPinny = $('.js-details-pinny');
    var $confirmationPinny = $('.js-confirmation-pinny');
    var $regEditPinny = $('.js-edit-reg-pinny');
    var $editSelectedAddresspinny = $('.js-edit-selected-address-pinny');
    var $coRegEditPinny = $('.js-edit-co-reg-pinny');
    var $toolTipPinny = $('.js-tool-tip-pinny');
    var $addressShade;
    var $addressConfirmationShade;
    var $addressRegisterEditShade;
    var $addressEditSelectedShade;
    var $addressCoRegisterEditShade;
    var $addressRegistrantIntoEditShade;
    var $addressDeleteRegistryShade;
    var $deleteRegistryPinny;
    var $RegistrantinfoEditPinny;
    var detailsSheet;


    var _updatePlaceholder = function() {
        $('.c-form-group').find('.c-box').map(function(_, item) {
            var $item = $(item);
            var $label = $item.find('label').clone();
            $label.find('.required').remove();

            if ($label.length && $label.attr('data-label')) {
                $item.find('input').attr('placeholder',  $label.attr('data-label').trim());
            }
        });
    };

    var _modalRemovedCallback = function(modal) {
        var $pinny = $(modal).find('.c-sheet');
        var $shade = $pinny.siblings('.shade');
        var $lockup = $('.lockup__container');

        $pinny.appendTo($lockup);
        $shade.appendTo($lockup);

        $pinny.children('.pinny__wrapper').data('component').close();

    };

    var _bindPinnyEvents = function() {
        DomOverride.on('domRemove', '.ok-cancel-dlog', _modalRemovedCallback);

        $('body').on('click', '.pinny__wrapper .pinny__close', function(e) {
            var $pinny = $(this).closest('.pinny__wrapper');
            $pinny.find('.js-close-modal').click();
            $pinny.find('.js-close-modal span').click();
        });

    };

    var _bindEvents = function() {
        $('body').find('.gr-top5-header').on('click', 'a', function(e) {
            var $content = $('.tooltip');
            $toolTipPinny.pinny('open');
            $content.removeClass('nodisplay');
            $content.removeAttr('style');
            $toolTipPinny.find('.js-tool-tip-pinny__body').html($content);
        });

        $('.c-show-registry-details').click(function() {
            $(this).toggleClass('c-show-registry-details-active');
            $('.js-registry-bellows').slideToggle('slow');
        });
    };


    var _showConfirmationModal = function($modal) {
        var $cancelButton = $modal.find('.button.secondary');
        var $title = $modal.find('.gwt-HTML');
        var $content = $modal.find('.dialogContent');

        $confirmationPinny.pinny('open');

        $modal.find('.button.primary')
           .addClass('c-button c--primary c--full-width js-ok-button').append(' >')
           .after($cancelButton);
        $cancelButton.addClass('c-button c--secondary c--outline js-cancel-button c--full-width c-cancel-button pinny__close js-close-modal');
        $cancelButton.append(' >');

        $confirmationPinny.find('.c-sheet__title').html($title);
        $confirmationPinny.find('.js-confirmation-pinny__body').html($content);
        $confirmationPinny.find('.okCancelPanel').closest('tr').nextAll().addClass('c-not-required-fields');
        $modal.html($confirmationPinny.parent());
        $modal.append($addressConfirmationShade);
    };

    var _bindErrorsViaClick = function() {
        $('body').find('.js-edit-reg-pinny__body').on('click', '.c-button.c--primary', function() {
            setTimeout(function() {
                var $errors = $('.js-errors');
                var $errorText = Adaptive.$('.errortxt');
                if (!$errors.text().trim().length) {
                    return;
                }
                $('.c--error').removeClass('c--error');
                $errorText.closest('.c-box-row').addClass('c--error-row');
                $errorText.next('.GR_create_event_date_panel.c-box-row').addClass('c--error-row');
                $errors.removeAttr('hidden');
                $errors.insertBefore($('.gwt-GR-Create-Panel'));
            }, 3000);
        });
    };


    var _showeditRegModal = function($modal) {
        var $maximumCharacters = $('<div class="c-maximum-characters">Maximum Of 40 characters</div>');
        var $cancelButton = $modal.find('.button.secondary').addClass('js-cancel-button');
        var $title = $modal.find('.GR_create_registry_info_label').text(Translator.translate('edit_registry_header'));
        var $content = $modal.find('.dialogContent');

        registryFormParser.transformContent($modal);
        registryFormParser.transformStep1($modal);
        $modal.find('.GR_creat_step1').addClass('c-form-group');
        _updatePlaceholder();

        $modal.find('.button.primary')
           .addClass('c-button u-margin-top-sm c--primary c--full-width js-ok-button').removeClass('u-margin-top-gt-md')
           .after($cancelButton);
        $cancelButton.addClass('js-close-modal');

        $regEditPinny.find('.c-sheet__title').html($title);
        $regEditPinny.find('.js-edit-reg-pinny__body').html($content);
        $regEditPinny.find('table td').addClass('u-no-border-bottom');
        $maximumCharacters.insertAfter($regEditPinny.find('.GR_create_reg_name_panel'));
        $modal.html($regEditPinny.parent());
        $modal.append($addressRegisterEditShade);
        $regEditPinny.pinny('open');

        $('.js-close-modal').on('click', function() {
            $regEditPinny.pinny('close');
        });
    };


    var _showEditselectedAddressModal = function($modal) {
        var $cancelButton = $modal.find('.button.secondary').addClass('c-button c--secondary c--outline u--bold js-cancel-button');
        var $title = $modal.find('.GR_shipping_address_label');
        var $content = $modal.find('.dialogContent');

        registryFormParser.transformContent($modal);
        registryFormParser.transformStep3($modal);

        $modal.find('.GR_creat_step3').addClass('c-form-group');
        _updatePlaceholder();

        $modal.find('.button.primary')
           .addClass('c-button c--primary c--full-width js-ok-button')
           .after($cancelButton);
        $cancelButton.addClass('js-close-modal');
        $editSelectedAddresspinny.find('.c-sheet__title').html($title);
        $editSelectedAddresspinny.find('.js-edit-selected-address-pinny__body').html($content);
        // $editSelectedAddresspinny.find('.okCancelPanel').closest('tr').nextAll().addClass('c-not-required-fields');
        $modal.html($editSelectedAddresspinny.parent());
        $modal.append($addressEditSelectedShade);
        $editSelectedAddresspinny.pinny('open');

        $('.js-close-modal').on('click', function() {
            $editSelectedAddresspinny.pinny('close');
        });

    };
    var _showcoRegEditModal = function($modal) {
        var $cancelButton = $modal.find('.button.secondary').addClass('c-button c--secondary c--outline js-cancel-button');
        var $content = $modal.find('.dialogContent');

        $coRegEditPinny.pinny('open');
        registryFormParser.transformContent($modal);
        registryFormParser.transformStep2($modal);

        $modal.find('.GR_creat_step2').addClass('c-form-group');
        _updatePlaceholder();

        $modal.find('.button.primary')
           .addClass('c-button c--primary c--full-width u-margin-top-sm js-ok-button').removeClass('u-margin-top-gt-md')
           .after($cancelButton);
        $cancelButton.addClass('c--full-width c-cancel-button js-close-modal');
        $coRegEditPinny.find('.js-edit-co-reg-pinny__body').html($content);
        $coRegEditPinny.find('.okCancelPanel').closest('tr').nextAll().addClass('c-not-required-fields').remove();
        $('.GR_create_progressBar_Step2').closest('tr').addClass('u--hide');
        $coRegEditPinny.find('table td').addClass('u-no-border-bottom');
        $modal.html($coRegEditPinny.parent());
        $modal.append($addressCoRegisterEditShade);

    };

    var _showdeleteRegistryModal = function($modal) {
        var $cancelButton = $modal.find('.button.secondary');
        var $title = $modal.find('.Caption');
        var $content = $modal.find('.dialogContent');

        $deleteRegistryPinny.pinny('open');

        $modal.find('.button.primary')
           .addClass('c-button c--primary u-margin-top-gt-md js-ok-button').append(' >')
           .after($cancelButton);
        $cancelButton.addClass('c--full-width c-cancel-button js-close-modal u-unstyle');

        $deleteRegistryPinny.find('.c-sheet__title').html($title);
        $deleteRegistryPinny.find('.js-delete-registry-confirmation-pinny__body').html($content);
        $deleteRegistryPinny.find('.okCancelPanel').closest('tr').nextAll().addClass('c-not-required-fields').remove();
        $deleteRegistryPinny.find('table td').addClass('u-no-border-bottom');
        $modal.html($deleteRegistryPinny.parent());
        $modal.append($addressDeleteRegistryShade);

        $('.js-close-modal, .js-ok-button').on('click', function() {
            $deleteRegistryPinny.pinny('close');
        });
    };

    var _onSuccessMoreInfo = function(data) {
        moreInformationUI.parse(data);
    };

    var _onErrorMoreInfo = function(data) {
        // Handler for error case
    };

    // Override more information links to display pinny instead of new tab popup
    var _overrideMoreInfoPopups = function() {
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
                    AjaxReaderParser.parse(url, _onSuccessMoreInfo, _onErrorMoreInfo);
                }

                return open;
            } else {
                return _open.apply(this, arguments);
            }
        };
    };


    var _initPinnies = function() {
        sheet.init($confirmationPinny,  {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-confirmation-shade',
                zIndex: 100,
                opacity: '0.5' // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });
        sheet.init($regEditPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-register-edit-shade',
                zIndex: 100,
                opacity: '0.5' // Match our standard modal z-index from our CSS ($z3-depth)
            },
            open: function() {
                return $('.GR_message_ForGuest_flag input').trigger('click');
            }
        });
        sheet.init($editSelectedAddresspinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-edit-selected--shade',
                zIndex: 100,
                opacity: '0.5' // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });
        sheet.init($coRegEditPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-co-register-edit-shade',
                zIndex: 100,
                opacity: '0.5'
            }
        });
        sheet.init($RegistrantinfoEditPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-registrant-into-edit-shade',
                zIndex: 100,
                opacity: '0.5'
            }
        });
        sheet.init($deleteRegistryPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-delete-registry-shade',
                zIndex: 100,
                opacity: '0.5'
            }
        });
        sheet.init($toolTipPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-shade',
                zIndex: 100,
                opacity: '0.5'
            }
        });

        detailsSheet = sheet.init($detailsPinny);

        $addressShade = $('.js-address-shade');
        $addressConfirmationShade = $('.js-address-confirmation-shade');
        $addressRegisterEditShade = $('.js-address-register-edit-shade');
        $addressEditSelectedShade = $('.js-address-edit-selected--shade');
        $addressCoRegisterEditShade = $('.js-address-co-register-edit-shade');
        $addressRegistrantIntoEditShade = $('.js-address-registrant-into-edit-shade');
        $addressDeleteRegistryShade = $('.js-address-delete-registry-shade');
        $deleteRegistryPinny = $('.js-delete-registry-confirmation-pinny');
        $RegistrantinfoEditPinny = $('.js-edit-registrant-pinny');

        _overrideMoreInfoPopups();

        _bindPinnyEvents();
    };


    var initBellows = function() {
        $('.js-details-pinny').find('.c-bellows__item').map(function(_, item) {
            var $item = $(item);
            var $icon = $item.find('.c-icon');
            if ($item.hasClass('bellows--is-open')) {
                $icon.attr('data-fallback', 'img/png/collapse.png');
                $icon.find('title').text('collapse');
                $icon.find('use').attr('xlink:href', '#icon-collapse');
            }
        });
    };

    var _getDetails = function($modal) {
        var templateContent = productDetailsTabParser.parse($modal);
        var $content;

        $modal.find('ul').addClass('c-list-bullets');

        new BellowsTemplate(templateContent, function(err, html) {
            $content = $(html);
            $content.find('.c-bellows__header').addClass('js-bellows-header');
            $content.bellows();
        });

        return $content;
    };



    var _animationListener = function() {
        if (event.animationName === 'modalAdded') {
            var $confirmationModal = $('.gwt-gift-registry-create-confirmation-dialog');

            var $editRegistryInfo = $('.giftRegistryStep1Dialog');
            var $editRegistrantInfo = $('.registrant_reg');
            var $editCoRegistrantInfo = $('.giftRegistryStep2Dialog.registrant_co_reg');

            var $editRegistrantShippingAddr = $('.giftRegistryStep3Dialog');

            var $deleteRegistryModal = $('.gwt-gr-delete-dialog');
            var $detailsModal = $('#gwt-product-detail-info-modal');

            if ($confirmationModal.length) {
                _showConfirmationModal($confirmationModal);
            } else if ($editRegistrantInfo.length) {
                _showcoRegEditModal($editRegistrantInfo);
                $coRegEditPinny.find('.c-sheet__title').text(Translator.translate('edit_registrant_header'));
            } else if ($editCoRegistrantInfo.length) {
                $coRegEditPinny.find('.c-sheet__title').text(Translator.translate('edit_co-registrant_header'));
                _showcoRegEditModal($editCoRegistrantInfo);
            } else if ($editRegistrantShippingAddr.length) {
                _showEditselectedAddressModal($editRegistrantShippingAddr);
            } else if ($editRegistryInfo.length) {
                _showeditRegModal($editRegistryInfo);
            } else if ($deleteRegistryModal.length) {
                _showdeleteRegistryModal($deleteRegistryModal);
            } else if ($detailsModal.length) {
                var $button = $detailsModal.find('.button');
                $button.click();
                $button.find('span').click();

                detailsSheet.setTitle($detailsModal.find('.Caption').text());
                detailsSheet.setBody(_getDetails($detailsModal));
                initBellows();
                detailsSheet.open();
            }
        } else if (event.animationName === 'errorAdded') {
            var $errorElements = $('.errortxt');
            var $errorContainer = $('.gwt-csb-error-panel');
            $errorElements.parents('.c-box-row').addClass('c--error-row');
        } else if (event.animationName === 'shoppingCartAdded') {
            if ($('.ok-cancel-dlog.gwt_addtocart_div').length && $('#gwt_minicart_div').find('.gwt-HTML').text().match(/\d/) !== null && !$('.js-cart-toggle.js--new-item').length) {
                Utils.animateCartIcon($('.js-cart-toggle'));
            }
        }
    };

    var _bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', _animationListener);
        document.addEventListener('webkitAnimationStart', _animationListener);
    };

    var giftRegistryManageUI = function() {
        _initPinnies();
        _bindEvents();
        _bindAnimationListener();
        _bindErrorsViaClick();
        registryUI();
        stepperUI();
        wishlistItemUI();
    };

    return giftRegistryManageUI;

});
