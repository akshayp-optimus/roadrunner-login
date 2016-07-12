define([
    '$',
    'global/utils',
    'translator',
    // Parsers
    'pages/checkout-multi-address/parsers/shipping-item-parser',
    // UI
    'global/ui/address-modal-ui',
    // Tmpl
    'dust!pages/checkout-multi-address/partials/shipping-item',
    'dust!pages/checkout-multi-address/partials/shipping-content',
    'global/ui/handle-form-fields',
    'components/notification/notification-ui'
], function($,
    Utils,
    Translator,
    // Parser
    ShippingItemParser,
    // UI
    AddressModal,
    // Tmpl
    ShippingItemTmpl,
    ShippingContentTmpl,
    handleFormFieldsUI,
    NotificationUI) {

    var checkoutMultiAddressDecorator = function() {
        $('.js-shipping-item').last().find('hr').addClass('u-bleed');
    };

    var buildCta = function() {
        var bindId = Utils.generateUid();
        var $originalButton = $('.gwt-pdp-hl-center')
                                    .attr('data-bind-click', bindId);

        var $continueButton = $('<button>', {
            class: 'js-bind c-button c--primary c--full-width',
            'data-bind-click': bindId,
            text: 'Continue >'
        });

        $('.js-cta').append($continueButton);
    };

    var buildShippingData = function($shippingItems) {
        var shippingContentItems = [];

        // Get default shipping address
        var $select = $('.gwt-ListBox:first');
        var defaultRegex = /(default\s*shipping)$/ig;
        var $defaultOption = $select.find('option').filter(function() {
            return defaultRegex.test($(this).text());
        });

        if (!$defaultOption.length) {
            return;
        }

        var $defaultShippingLink = $('<span>', {
            class: 'js-set-default',
            text: Translator.translate('ship_to_default_shipping_address') + ' (' + $defaultOption.text().replace('Default Shipping', '').trim() + ')'
        });

        shippingContentItems.push({
            sectionTitle: $defaultShippingLink,
            multiAddressHeaderClass: 'js-default-shipping-address'
        });
        shippingContentItems.push({
            multiAddressContentClass: 'js-ship-to-multiple-Address',
            shipToMultipleAddressHeading: 'Ship to Multiple Addresses',
            shippingContent: true,
            content: $shippingItems
        });

        var shippingContentObj = {
            mainclass: 'js-shipping-items-bellows',
            items: shippingContentItems
        };

        new ShippingContentTmpl(shippingContentObj, function(err, html) {
            $('.js-multiple-address-container').append(html);
        });

        buildCta();

        var $bellows = $('.js-shipping-items-bellows').addClass('c--blue c--grey-bg c--radio').bellows({
            singleItemOpen: true
        });

        // open ship to other addresses first
        $bellows.bellows('open', 1);
    };

    var setDefaultOptions = function($container) {
        $container.find('select').each(function() {
            var $select = $(this);
            var defaultRegex = /(default\s*shipping)$/ig;
            var $defaultOption = $select.find('option').filter(function() {
                return defaultRegex.test($(this).text());
            });

            if (!$defaultOption.length) {
                return;
            }

            $select.val($defaultOption.val());
            $select[0].dispatchEvent(new CustomEvent('change'));
        });
    };

    var pollForOptions = function() {
        var _poll = window.setInterval(function() {
            if ($('.gwt-multiple-address-container').find('option').length) {
                window.clearInterval(_poll);

                var $shippingItems = $('.gwt-multiple-address-container').find('.gwt-multiple-address-row');
                var shippingItemsObj = {
                    shippingItems: ShippingItemParser.parse($shippingItems)
                };

                var $shippingItemsContainer;

                new ShippingItemTmpl(shippingItemsObj, function(err, html) {
                    $shippingItemsContainer = $(html);
                });

                buildShippingData($shippingItemsContainer);

                Utils.replaceWithPrototypeElementsForCheckout('#gwt_order_item_product_json');

                checkoutMultiAddressDecorator();
            }
        }, 300);
    };

    var bindClicks = function() {
        $('body').on('click', '.js-bind', function(e) {
            e.preventDefault();

            var $this = $(this);
            var bindId = $this.attr('data-bind-click');
            var $original = $('[data-bind-click="' + bindId + '"]').filter(function() {
                return !$(this).hasClass('js-bind');
            });

            $original[0].dispatchEvent(new CustomEvent('click'));
        });

        // set all select options to default shipping address
        $('body').on('click', '.js-default-shipping-address', function(e) {
            var $header = $(this);
            var $shipToMultipleAddressContainer = $('.js-ship-to-multiple-Address');
            if (!$header.hasClass('c--checked')) {
                $header.addClass('c--checked');
                setDefaultOptions($('.js-multiple-address-container'));
                $shipToMultipleAddressContainer.hide();
            } else {
                $header.removeClass('c--checked');
                $shipToMultipleAddressContainer.show();
            }
        });
    };

    var parseItemsTable = function($container) {
        // options are appended after select is created
        pollForOptions();
    };

    var nodeInserted = function() {
        if (event.animationName === 'modalAddedForOrderConfirmation') {
            var $editAddressModal = $('#editAddressModal');
            var $addAddressModal = $('#addAddressModal');

            if ($editAddressModal.length) {
                if ($editAddressModal.find('.js-address-pinny').length) {
                    return;
                } else {
                    AddressModal.showModal($editAddressModal);
                    // Update placeholders in inputs
                    handleFormFieldsUI.inputsHandler();
                }
            } else if ($addAddressModal.length) {
                if ($addAddressModal.find('.js-address-pinny').length) {
                    return;
                } else {
                    AddressModal.showModal($addAddressModal);
                    // Update placeholders in inputs
                    handleFormFieldsUI.inputsHandler();
                }
            }
        }

        if (event.animationName === 'checkoutMultiAddress') {
            parseItemsTable($('.gwt-multiple-address-container'));
        }
    };

    var checkoutMultiAddressUI = function() {
        // Add any scripts you would like to run on the checkoutMultiAddress page only here
        document.addEventListener('animationStart', nodeInserted);
        document.addEventListener('webkitAnimationStart', nodeInserted);

        bindClicks();
        AddressModal.initSheet();
    };

    return checkoutMultiAddressUI;
});
