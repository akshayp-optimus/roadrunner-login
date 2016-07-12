define([
    '$',
    'translator',
    'global/utils',
    'global/utils/dom-operation-override',
    'dust!components/price/partials/price-discount',
    'dust!components/cart-item/partials/upsell-modal-content',
    'components/sheet/sheet-ui'
], function($, Translator, utils, DomOverride, DiscountPriceTemplate, UpsellModalTemplate, Sheet) {

    var $upsellPinny = $('.js-upsell-pinny');
    var upsellSheet;

    var addOptions = function($optionContainer, $itemPanel) {
        var $options = $itemPanel.find('.ois-option-value');
        var $personlazationDesc = $itemPanel.find('.perzdesc');
        var optionsLength = $options.length;
        $options.each(function(i, option) {
            $('<li>').text($(option).text()).insertBefore($optionContainer.siblings('.js-item-color-option'));
        });
    };

    var transformPersonalizationInfo = function() {
        var $desktopPersContent = $(this).closest('.js-personalization');
        var $newPersContent = $desktopPersContent.closest('.js-personalization-content');
        var $personalizationInfo = $desktopPersContent.find('.personalization, .gwt-dynamic-personalization-panel').last().children().clone();

        // Add Image
        $newPersContent.find('.js-img').html($personalizationInfo.filter('.gwt-Image'));

        var $cartItem = $(this).closest('.c-cart-item');

        // Add Details
        $newPersContent.find('.js-details').html($personalizationInfo.last());

        if ($newPersContent.find('.js-details').text().length) {
            $cartItem.find('.js-personalize-list').removeClass('u--hide');
        }

    };

    var transformCartItem = function(itemPanel) {
        var $ = Adaptive.$;
        var $itemPanel = $(itemPanel);
        var $mainItemContainer = $(this).parents('.js-cart-item');
        // Add Image
        $mainItemContainer.find('.js-product-image').append($itemPanel.find('.gwt-shoppingcart-thumbnail-image'));
        addOptions($mainItemContainer.find('.js-options').find('.js-item-number-option'), $itemPanel);
    };

    var getPrices = function($priceContainer, $cartPriceContainer) {
        var regularPrice = $priceContainer.find('.gwt-HTML:first').text();

        // Display From in case of ranged products
        if (regularPrice) {
            if (regularPrice.match(/-/) !== null) {
                $cartPriceContainer.html(Translator.translate('from') + regularPrice.split('-')[0]);
            } else {
                $cartPriceContainer.html(regularPrice);
            }
        } else {
            var templateData = {
                priceNew: $priceContainer.find('.gwt-product-detail-widget-price-now').text().replace('Now', ''),
                priceOld: $priceContainer.find('.gwt-product-detail-widget-price-was').text().replace('Was', '')
            };

            new DiscountPriceTemplate(templateData, function(err, html) {
                $cartPriceContainer.html(html);
            });
        }
    };

    var buildAppendItem = function(selector, $element) {
        return {
            selector: selector,
            element: $element
        };
    };

    var buildUpsellAppendMap = function($widget) {
        return [
            buildAppendItem('.js-upsell-stepper', $widget.find('.csb-quantity-listbox')),
            buildAppendItem('.js-option', $widget.find('.gwt-product-detail-widget-options-column select')),
            buildAppendItem('.js-cta', $widget.find('.custom-add-to-cart-buttons')),
            buildAppendItem('.js-availability', $widget.find('.gwt-product-detail-widget-dynamic-info-panel')),
            buildAppendItem('.js-error', $widget.find('[id*="gwt-error-placement-div"]')),
            buildAppendItem('.js-swatch', $widget.find('.gwt-image-picker-option-image'))
        ];
    };

    var replaceItems = function(appendItems, $content) {
        $.each(appendItems, function(i, appendItem) {
            $content.find(appendItem.selector).each(function(j, item) {
                $(item).append(appendItem.element.eq(j));
            });
        });
    };

    var parseQty = function($quantitySelect) {
        var count = $quantitySelect.val();
        $quantitySelect.attr('hidden', 'true');
        $quantitySelect.addClass('js-qty-select');
        return {
            isMin: count === '1',
            isMax: count === '20',
            count: count,
            class: 'js-upsell-stepper t-cart__stepper',
            countClass: 'js-stepper-count'
        };
    };

    var transformRecommendedAccessory = function(widget) {
        var $widget = $(widget);
        var $desktopContainer = $(this);
        var $upsellModalContainer = $desktopContainer.closest('.js-upsell-desktop').siblings('.js-modal-content');
        var $accessoryContainer = $desktopContainer.parents('.js-recommended-accessory');
        var appendItems = buildUpsellAppendMap($widget);
        var $ctas = $widget.find('.custom-add-to-cart-buttons');
        var $swatches = $widget.find('.gwt-product-option-panel-swatchbox').remove();
        var templateContent = {
            productName: $widget.find('.gwt-product-detail-widget-name').text(),
            itemNumber: $widget.find('.gwt-product-detail-widget-title').last().text(),
            price: {
                price: $widget.find('.gwt-product-detail-widget-price-holder').text()
            },
            quantity: parseQty($widget.find('.csb-quantity-listbox')),
            hasOption: !!$widget.find('.gwt-product-option-panel-listbox-container select').length,
            hasSwatches: !!$swatches.length,
            optionLabels: $widget.find('.gwt-product-options-panel-option-title').map(function(i, label) {
                return label.textContent.replace(/Choose|:/g, '');
            }),
            swatches: {
                slideshow: {
                    class: 'c--swatches-small',
                    slides: $swatches.find('.gwt-image-picker-option-image').map(function(i, swatch) {
                        return {
                            class: 'js-swatch'
                        };
                    })
                }
            }
        };

        $ctas.find('.primary').addClass('c-button c--primary c--full-width');

        // Add Image
        $accessoryContainer.find('.js-recommended-accessory-product-image').append($widget.find('.gwt-pdp-collection-thumbnail-image'));

        // Add Price
        getPrices($widget.find('.gwt-product-detail-widget-price-holder'), $accessoryContainer.find('.js-price'));

        // Close Button
        $accessoryContainer.find('.js-recommended-accessory-hide')
            .append($widget.find('.cart-upsell-widget-close-button').addClass('u-unstyle u-text-capitalize').text(Translator.translate('hide')));

        new UpsellModalTemplate(templateContent, function(err, html) {
            var $content = $(html);

            replaceItems(appendItems, $content);
            $upsellModalContainer.html($content);
        });

    };

    var bindEvents = function() {
        // // Hide recommended accessory section
        $('.js-recommended-accessory-hide').on('click', function() {
            $(this).parents('.c-recommended-accessory').addClass('u--hide');
        });

        $('.js-add-promo-code, .js-enter-zip, .js-add-gift-card').on('click', '.c-ledger__number', function() {
            var $this = $(this);
            $this.addClass('u--hide');
            $this.parent().next().removeAttr('hidden');
        });
    };


    var closeUpsellModal = function() {
        var $activeUpsell = $('.js-recommended-accessory-content.js--active');

        $activeUpsell.removeClass('js--active');
        $activeUpsell.parent().append($upsellPinny.find('.js-modal-content').attr('hidden', 'true'));
    };

    var bindUpsell = function() {
        var pinny;
        upsellSheet = Sheet.init($upsellPinny, {});

        pinny = $upsellPinny.data('pinny');

        pinny.options.close = closeUpsellModal;

        $('body').on('click', '.js-upsell-modal-trigger', function(e) {
            var $trigger = $(this);
            var $productContainer = $trigger.parent();
            var $modalContent = $productContainer.siblings('.js-modal-content');
            var $image = $productContainer.find('.js-recommended-accessory-product-image img').clone();
            var $modalImageContainer = $modalContent.find('.js-product-image');

            $image.attr('src', $image.attr('src').replace(/\?.+$/, ''));

            if (!$modalImageContainer.find('img').length) {
                $modalImageContainer.append($image);
            }

            $modalContent.removeAttr('hidden');
            $productContainer.addClass('js--active');
            upsellSheet.setBody($modalContent);
            upsellSheet.open();
        });

        $upsellPinny.on('click', '.js-swatch', function() {
            var $swatch = $(this);
            var $image = $swatch.find('img');

            $swatch.siblings().removeClass('c--active');
            $swatch.addClass('c--active');

            $upsellPinny.find('.js-color-text').text($image.attr('alt'));
            $upsellPinny.find('.js-product-image img').attr('src', $image.attr('src').replace(/\?.+$/, ''));
        });
    };

    var cartUI = function() {
        if ($('[id*="gwt_order_item_uber_display"]').length) {
            DomOverride.on('domAppend', '', transformCartItem, '[id*="gwt_order_item_uber_display"]');
        } else {
            DomOverride.on('domAppend', '', transformCartItem, '[id*="gwt_order_item_display"]');
        }
        DomOverride.on('domAppend', '', transformPersonalizationInfo, '[id*="perzqty"]');
        DomOverride.on('domAppend', '', transformRecommendedAccessory, '[id*="manual_upsell_widget"]');

        bindEvents();

        if ($upsellPinny.length) {
            bindUpsell();
        }
    };

    return cartUI;
});
