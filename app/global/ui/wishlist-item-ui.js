define([
    '$',
    'global/utils',
    'global/ui/tooltip-ui',
    'hijax',
    'magnifik'
], function($, utils, tooltipUI, Hijax) {

    var _addOptions = function($optionContainer, $descriptionContainer) {
        var $options = $descriptionContainer.children('.gwt-HTML, .gr-item-message-panel').not('.gwt_gr_number_label, .clearboth');
        var optionsLength = $options.length;

        $options.each(function(i, option) {

            if (option.textContent.indexOf('This item ships via ') > -1) {
                $('<li class="u--show c-registry-truck-delivery"></li>').html(option).insertBefore($optionContainer.find('.js-item-color-option'));
            } else {
                // in case of  oversize handling fees, we don't need to replace text before colon

                if (option.textContent.indexOf('Oversize') > -1) {
                    $('<li>').text(option.textContent).insertBefore($optionContainer.find('.js-item-color-option'));
                } else {
                    $('<li>').text(option.textContent.replace(/^.+\:/, '')).insertBefore($optionContainer.find('.js-item-color-option'));
                }
            }

        });

    };

    var _transformPersonalization = function() {
        var $content = $(arguments[0]).clone();
        var $mainItemContainer = $(this).parents('.js-cart-item');


        $mainItemContainer.find('.js-personalization-content .js-details').append($content);
        $mainItemContainer.find('.js-personalization-label').removeAttr('hidden');
        $mainItemContainer.find('.js-personalization-tooltip').removeAttr('hidden');
    };

    var initMagnifik = function() {
        var $wishlistMagifik = $('.t-wishlist__magnifik');
        $wishlistMagifik.magnifik();
        $wishlistMagifik.on('magnifik:open', function(event) {
            var $magnifiedImage = $('.m-magnifikFull');
            $magnifiedImage.attr('src', $magnifiedImage.attr('src').replace(/\$[\w]+\$/, '$wgie$'));
        });
    };

    var _transformWishlistItem = function(itemPanel) {
        var $ = Adaptive.$;
        var $itemPanel = $(itemPanel);
        var $mainItemContainer = $(this).parents('.js-cart-item');
        var $detailsLink = $itemPanel.find('.gwt-gr-image-details-link');
        $detailsLink.text($detailsLink.text().toLowerCase());
        var $zoomLink = $itemPanel.find('.pdp-linkpanel a');
        var $imageContainer = $mainItemContainer.find('.js-product-image');
        var $availabilityMessage = $itemPanel.find('.gwt-gr-availability-message');

        if ($mainItemContainer.hasClass('js-rendered')) {
            return;
        }
        $mainItemContainer.addClass('js-rendered');
        // Add Image
        $imageContainer.append($itemPanel.find('.gwt-shoppingcart-thumbnail-image').addClass('t-wishlist__magnifik'));

        // Add options
        _addOptions($mainItemContainer.find('.js-options'), $itemPanel.find('.gwt_gr_details_panel'));

        // Add avilability
        $availabilityMessage.length ? $mainItemContainer.find('.js-availability').html($availabilityMessage.text()).removeClass('u--hide') : false;

        // Add details link
        $detailsLink.addClass('u--bold');
        $mainItemContainer.find('.js-details-link').append($detailsLink);
        $mainItemContainer.find('.js-details-link').removeClass('u-visually-hidden');

        // Add top five link
        $mainItemContainer.find('.js-top-five').append($itemPanel.find('.gwt_gr_top5_panel'));

        if ($mainItemContainer.is(':last-of-type')) {
            utils.overrideDomAppend('.gwt_gr_details_panel', _transformPersonalization);
        }

        initMagnifik();
    };

    var addPersonalizationOptions = function(options) {
        var $giftCards = $('.gwt_gr_details_panel').find('.gwt-HTML.clearboth[style*="display"]');
        if (!$giftCards.length) {
            return;
        }
        $giftCards.map(function(_, item) {
            var $item = $(item);
            var $optionContainer = $item.closest('.c-cart-item');
            var $options = $item.nextAll();
            if ($optionContainer.find('.js-options').hasClass('js-added-personalization-options')) {
                return;
            }
            $optionContainer.find('.js-options').addClass('js-added-personalization-options');
            $options.each(function(i, option) {
                $('<li>').text(option.textContent).insertBefore($optionContainer.find('.js-item-color-option'));
            });
        });
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'personalization-view',
            function(url) {
                return url.indexOf('PersonalizationJSONView') > -1;
            }, {
                complete: function() {
                    addPersonalizationOptions();
                }
            }
        );
    };


    var wishlistItemUI = function() {
        utils.overrideDomAppend('[id*="gwt_giftregistry_item_display"]', _transformWishlistItem);

        tooltipUI();
        initHijax();
    };

    return wishlistItemUI;
});
