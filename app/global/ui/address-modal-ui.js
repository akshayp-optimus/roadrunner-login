define([
    '$',
    'components/sheet/sheet-ui',
    'global/utils',
    'global/utils/dom-operation-override',
    'translator'
], function($, sheet, Utils, DomOverride, Translator) {

    var $addressPinny = $('.js-address-pinny');
    var $addressButton;
    var $removeAddressPinny = $('.js-remove-address-pinny');
    var $addressShade;
    var $removeAddressShade;

    var _closeCallback = function() { return;};

    var _addCloseCallback = function(cb) {
        _closeCallback = cb;
    };

    var _resetPinny = function() {
        var $lockup = $('.lockup__container');
        $addressPinny.parent().appendTo($lockup);
        $addressShade.appendTo($lockup);

        $addressPinny.pinny('close');
        _closeCallback();
    };

    var desktopCloseCallback = function(removedElement) {
        _resetPinny();
    };

    var _bindEvents = function() {
        DomOverride.on('domRemove', '.ok-cancel-dlog', desktopCloseCallback);

        $('body').on('click', '.js-address-pinny .pinny__close', function(e) {
            $addressPinny.find('.js-close-modal').click();
            $addressPinny.find('.js-close-modal span').click();
        });

        $('body').on('click', '.js-remove-address-pinny .pinny__close', function(e) {
            $removeAddressPinny.find('.js-close-modal').click();
            $removeAddressPinny.find('.js-close-modal span').click();
        });
    };

    var _transformContent = function($content) {
        var $mainTable = $content.find('.form');
        var $newContainer = $('<div class="c-form-group">');

        // Mapping the field "spot" container
        $content.find('.spot').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();

            $labelField.attr('data-label', $labelField.text().replace('*', ''));
            var newLabel = Utils.updateFormLabels($labelField.text());
            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);
        });

        // First name/middle initial needs to be grouped together
        $mainTable.find('.AddrMNameSpot').removeClass('spot').addClass('c-box c--shrink c-middle-name');
        $mainTable.find('.AddrFNameSpot').after($mainTable.find('.AddrMNameSpot'));

        $newContainer.append($mainTable.find('.gwt-addr-edit-error-panel'));
        $newContainer.append($mainTable.find('#addr_addressTypeSpot .gwt-CheckBox'));
        $newContainer.append($mainTable.find('.group'));
        $newContainer.append($mainTable.find('.okCancelPanel'));

        $mainTable.replaceWith($newContainer);

        // styling transformations
        var $fieldContainer = $content.find('.spot');
        $content.find('.required').addClass('u-text-error');
        $fieldContainer.find('label').addClass('c-box__label c-arrange__item c--shrink');
        $fieldContainer.find('input').addClass('c-arrange__item');

        $fieldContainer.addClass('c-box c-arrange c--align-middle').wrap('<div class="c-box-row"></div>');
        // removes unnecessary "group" div
        $content.find('.c-box-row').unwrap();
        $content.find('.addrCitySpot').addClass('u-bleed-top');
        $content.find('.addrZipSpot input').attr('type', 'tel');
        $content.find('.addrPhone1Spot  input').attr('type', 'tel');
        $content.find('.addrPhone2Spot  input').attr('type', 'tel');
        $content.find('.gwt-TextBox.additional-name').attr('placeholder', 'MI').addClass('c-textbox-placeholder');
        $content.find('.addrCountrySpot label').addClass('c-address-country');

        // template select fields: must reconstruct instead of running thru dust to preserve
        // events
        var $chevronIcon = $('.c-select__icon').clone();
        $content.find('select')
            .wrap('<div class="c-select c-arrange__item"></div>')
            .parent()
            .append($chevronIcon);

        $content.find('.gwt-CheckBox')
            .addClass('c-box c-arrange c--align-middle')
            .wrap('<div class="c-box-row"></div>');


        $content.find('.AddrFNameSpot')
            .closest('.c-box-row')
            .addClass('c--3-4')
            // move middle name into same field row as first name
            .append($content.find('.AddrMNameSpot'));

        $('.c-box-row').map(function(i, boxRow) {
            var $boxRow = $(boxRow);
            if ($boxRow.find('.spot').is('[style*="none"]')) {
                $boxRow.attr('hidden', 'true');
            }
        });
        $content.find('.c-box-row').wrapAll('<div class="c-box-container"/>');
        var $cancelButton = $content.find('.button.secondary');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width')
            .append(' >')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width js-close-modal');
    };

    var _transformSelect = function($content) {
        var $mainTable = $content.children('table');
        var $newContainer = $('<div>');
        var $select = $mainTable.find('.gwt-ListBox');
        var $addressContent = $mainTable.find('.gwt-addr-disp').parent();

        $select.wrap('<div class="c-select c-arrange__item">');
        $select.after($('<svg class="c-icon-svg c-select__icon c--large" title="Arrow downs"><title>Arrow down</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-chevron-down"></use></svg>'));

        $addressContent.addClass('u-margin-top-md u-margin-bottom-md');

        $newContainer.append($select.parent());
        $newContainer.append($addressContent);
        $newContainer.append($mainTable.find('.primary').append(' >').addClass('c-button c--primary c--full-width'));
        $newContainer.append($mainTable.find('.secondary').addClass('c--full-width c-select-close-button js-close-modal'));
        $mainTable.replaceWith($newContainer);
    };

    var _transformReviewDeliverOptionsContent = function($content, $modal) {
        if (!$modal.find('.shipping_method.form').find('.gwt-RadioButton').length) {
            setTimeout(function() {
                _transformReviewDeliverOptionsContent($content, $modal);
            }, 0);
        } else {
            var $newProductOptionsContainer = $('<div>');
            /*eslint-disable*/
            var $readDeliveryTerms =
                $('<div class="c-hide-reveal__reveal-link c-read-delivery-terms js-read-delivery-terms"><span class="c-read-more-text">Read delivery terms<span></div>');
            /*eslint-enable*/
            var $headerInfo = $content.find('.gwt_t_c_modal .gwt-HTML').last();
            var $deliveryPhone = $content.find('.gwt-phone-wrapper');
            var $productContainer = $content.find('.data.lattice').last();
            var $productItem = $productContainer.find('.gwt-oid-panel');
            var $productOptions = $productContainer.find('.spot');
            var $secureCheckoutButton = $content.find('.okCancelPanel');
            var $deliveryPhoneNumberLabel = $deliveryPhone.find('.gwt-bestPhoneNumberLabel');
            var $whatThisAnchor = $deliveryPhone.find('#whatsThisAnchor');
            var $deliveryPhoneNumber = $deliveryPhone.find('.gwt-best-phone-number');
            var shippingMethodContainerClass = $content.find('.shipping_method.form').attr('class');

            $headerInfo.find('p').siblings().wrapAll('<div class="c-read-delivery-terms-content" />');
            $deliveryPhone.addClass('c-delivery-phone-number-wrapper');
            $('<div class="c-delevery-phone-message">' + Translator.translate('delivery_phone_number_message') + '</div>').insertAfter($deliveryPhoneNumber);
            $whatThisAnchor.insertAfter($deliveryPhoneNumberLabel);
            $deliveryPhoneNumberLabel.find('.required').addClass('u-text-error');
            $deliveryPhoneNumber.find('input').removeAttr('style');
            $deliveryPhoneNumber.find('label, a').wrapAll('<div class="c-delivery-phone-number" />');
            $whatThisAnchor
                .html('<svg class="c-icon" data-fallback="img/png/question.png"><title>question</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-question"></use></svg>');
            $deliveryPhone.find('.gwt-best-phone-number-message').remove();
            $readDeliveryTerms.insertAfter($headerInfo.find('p'));

            $productItem.each(function() {
                var $item = $(this);
                $item.find('.gwt-oid-description-panel').find('> div').not(':first').wrapAll('<div class="u-text-grey c-options u-margin-top-sm" />');
                $item.addClass('c-arrange c-cart-item');
                $item.find('.gwt-oid-image-panel').addClass('c-arrange__item c--shrink js-product-image');
                $item.find('.gwt-oid-description-panel').addClass('c-arrange__item u-padding-left u--tight');
            });

            $secureCheckoutButton.find('.primary').addClass('c-button c--primary c--full-width');
            $secureCheckoutButton.find('.primary span').text('continue >');

            $productOptions.map(function(_, item) {
                var $item = $(item);
                $newProductOptionsContainer.append($item);
            });

            $newProductOptionsContainer.find('> .spot').wrapAll('<div class="c-review-deliver-shipping-method u-border-grey ' + shippingMethodContainerClass + '" />');
            $newProductOptionsContainer = $newProductOptionsContainer.append($secureCheckoutButton);
            $content = $headerInfo.add($deliveryPhone).add($productItem).add($newProductOptionsContainer);

            var title = $modal.find('.Caption').text();
            $addressPinny.find('.c-sheet__title').html(title);
            $addressPinny.find('.js-address-pinny__body').html($content);
            $modal.html($addressPinny.parent().addClass('c-service-delivery-option-popup'));
            $modal.append($addressShade);
            $modal.removeAttr('hidden');
            $addressPinny.pinny('open');
        }
    };


    var _showModal = function($modal, isSelectAddress) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption').text();

        if (!$content.length || $content.parent().hasClass('pinny__content')) {
            return;
        }

        if (isSelectAddress) {
            _transformSelect($content);
        } else if ($modal.hasClass('termsCondModal')) {
            $modal.attr('hidden', 'true');
            _transformReviewDeliverOptionsContent($content, $modal);
        } else {
            _transformContent($content);
        }

        if (!$modal.hasClass('termsCondModal')) {
            $addressPinny.find('.c-sheet__title').html(title);
            $addressPinny.find('.js-address-pinny__body').html($content);

            $modal.html($addressPinny.parent());
            $modal.append($addressShade);
            $addressPinny.pinny('open');
        }
    };

    var _transformRemoveAddressContent = function($content) {
        var $mainTable = $content.find('.form');
        var $newContainer = $('<div>');

        $newContainer.append($mainTable.find('.okCancelPanel').addClass('u-margin-top-md'));

        $mainTable.replaceWith($newContainer);
        // removes unnecessary "group" div
        $content.find('.c-field-row').unwrap();

        var $cancelButton = $content.find('.button.secondary').addClass('c-button  c--secondary c--outline js-cancel-button');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width js-ok-button')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width c-cancel-button js-close-modal');

        $('.js-close-modal, .js-ok-button').on('click', function() {
            $removeAddressPinny.pinny('close');
        });
    };

    var _showRemoveAddressModal = function($modal) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption').text().toLowerCase();

        if (!$content.length || $content.parent().hasClass('pinny__content')) {
            return;
        }

        $removeAddressPinny.pinny('open');

        _transformRemoveAddressContent($content);

        $removeAddressPinny.find('.c-sheet__title').html(title);
        $removeAddressPinny.find('.js-remove-address-pinny__body').html($content);

        $modal.html($removeAddressPinny.parent());
        $modal.append($removeAddressShade);
    };

    var _initSheet = function() {
        sheet.init($addressPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-shade',
                zIndex: 100,
                color: '#fff',
                opacity: '0.5'// Match our standard modal z-index from our CSS ($z3-depth)
            }
        });

        sheet.init($removeAddressPinny, {
            shade: {
                cssClass: 'js-remove-address-shade',
                zIndex: 100,
                color: '#000',
                opacity: '0.5', // Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: function() {
                Adaptive.$('.js-remove-address-shade.shade--is-open').remove();
            }
        });

        $removeAddressPinny.parent().addClass('c--dialog');

        $addressShade = $('.js-address-shade');
        $removeAddressShade = $('.js-remove-address-shade');

        _bindEvents();


        $('.js-ok-button').one('click', '.js-remove-address-pinny', function(e) {
            $removeAddressPinny.pinny('close');
        });

    };


    return {
        initSheet: _initSheet,
        showModal: _showModal,
        showRemoveAddressModal: _showRemoveAddressModal,
        addCloseCallback: _addCloseCallback
    };
});
