define([
    '$',
    'translator'
], function($, Translator) {

    var disableAddToCartWishlist = function($addToCartButton, $wishlistButton) {
        $wishlistButton.addClass('c--is-disabled');
        // Make changes to adjust the UI while ATC is disabled
        $('.js-add-personalization-label').addClass('c--is-disabled');
        $('.js-personalization-trigger .js-pdp-price-total').addClass('u--hide');
    };

    var updateMainImageSrc = function($item, isWidget) {
        var $container = isWidget ? $('.js-widget-container') : $('.t-product-details-page');
        var $heroCarousel = $container.find('.js-product-hero-carousel > .c-carousel');
        var $productImage = $heroCarousel.find('.c-carousel__item:eq(0) img');
        var $item = $($item);
        var updatedProductSrc = '';

        var $thumbnailImage = $item.is('img') ? $item : $item.find('img');
        if ($heroCarousel.length && $thumbnailImage.length && $thumbnailImage.attr('src')) {
            $heroCarousel.scooch('move', 1);

            // Sometimes the thumbnail doesn't have an image, in this case we want to use
            // the image src from the first iamge in the carousel.
            if (/NoImageIcon/i.test($thumbnailImage.attr('src'))) {
                var productImageSrc = $productImage.attr('src');
                updatedProductSrc = productImageSrc.replace(/\/\d+(\_.*)\?/.exec(productImageSrc)[1], '_' + $thumbnailImage.parents('[color]').attr('color'));
            } else {
                updatedProductSrc = $thumbnailImage.attr('src');
            }
            // Looks like the user selected a thumbnails, not a color swatch.
            updatedProductSrc =  updatedProductSrc.replace(/\$(.*)\$/g, '$wgis$');

            $productImage.attr('src', updatedProductSrc);
            $productImage.attr('href', updatedProductSrc.replace(/\$(.*)\$/g, '$wgie$'));
        }
    };

    var updateSpecialShipping = function($desktopContainer) {
        if (!$desktopContainer) {
            $desktopContainer = Adaptive.$('.gwt-product-detail-widget-dynamic-info-panel .gwt-HTML:not([style*="none"]),' +
                '.gwt-product-bottom-col2-content-panel .gwt-product-detail-quantityrow');
        } else {
            $desktopContainer = $desktopContainer.find('.gwt-product-detail-widget-dynamic-info-panel .gwt-HTML:not([style*="none"]),' +
                '.gwt-product-bottom-col2-content-panel .gwt-product-detail-quantityrow');
        }

        var $shippingText = $desktopContainer.clone(true);
        var $shippingItem = $('.js-shipping-text');

        if ($.trim($shippingText.text()) !== '') {
            $shippingItem.html($shippingText).removeAttr('hidden');
        } else {
            $shippingItem.empty().attr('hidden', '');
        }
    };

    var updateProductImageCaption = function(swatchColor) {
        if (!swatchColor) {
            return;
        }

        var $container = $('.js-product-image');
        var $caption = $container.find('.js-product-image__caption');

        $caption
            .removeClass('u-visually-hidden')
            .text(swatchColor);
    };

    var updatePrice = function() {
        var $updatedPrice = $('#gwt_productdetail_json').find('.gwt-product-detail-widget-top-total-price-amount');
        $('.js-pdp-price-total').text($updatedPrice.text());
    };

    var updateDesktopSelect = function($qtySelect, count) {
        // $('.c-stepper').find('button')
        //     .removeClass('c--disabled')
        //     .removeAttr('disabled');

        if (count >= 2 && count < 20) {
            $('.c-stepper').find('button')
                .removeClass('c--disabled')
                .removeAttr('disabled');
        } else if (count <= 1) {
            $('.c-stepper').find('.js-stepper-decrease')
                .addClass('c--disabled')
                .attr('disabled', 'disabled');
        } else {
            $('.c-stepper').find('.js-stepper-increase')
                .addClass('c--disabled')
                .attr('disabled', 'disabled');
        }

        // update desktop div
        // need to use window dispatch event to trigger prototype events
        $qtySelect.val(count);
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', false, true);
        $qtySelect[0].dispatchEvent(evt);

        setTimeout(function() {
            updatePrice();
        }, 1000);
    };

    var productDetailsDecorators = function() {
        // after-render decorations
        var $container = $('.js-product-image');
        var $productImage = $container.find('.iwc-main-img');
        var $exclusiveTag = $('.gwt-product-detail-bold-label');

        $productImage.addClass('c-product-image__image');

        if ($productImage[0]) {
            $productImage[0].ontouchstart = undefined;
            $productImage[0].onclick = undefined;
        }

        if ($exclusiveTag.length) {
            $('.js-tag')
                .text($exclusiveTag.text())
                .removeAttr('hidden');
        }

        // fastclick causing issues where elements need to be double clicked
        // for clicks to register
        $('js-bind').addClass('needsclick');

        // if there are multiple product options, let's trigger the first qty to be selected
        if ($('.t-product-details-bundle').length) {
            $('.js-stepper-decrease').first().click();
        }

        // GH-130: Monogramming link missing on desktop markup, use hardcoded one instead
        var $monogramImg = $('.js-product-bellows').find('img').filter(function() {
            return /monogram/.test(jQuery(this).attr('src'));
        });

        var $monogramLink = $('<a>', {
            // either this or use custom asset
            href: location.origin + '/wcsstore/images/GarnetHill/sitewide/monogramcharts/sheets.html',
            text: 'Monogramming Sizing and Placement',
            target: '_blank'
        });

        if ($monogramImg.length) {
            $monogramImg.after($monogramLink);
        }
    };

    // Updates text of color
    var updateSwatchboxText = function($container, $desktopContainer) {
        if (!$container) {
            $container = $('.js-color-text');
        }
        if (!$desktopContainer) {
            $desktopContainer = Adaptive.$('.gwt-product-option-panel-swatchbox .gwt-product-option-panel-chosen-selection');
        }
        $container.text($desktopContainer.text());
    };

    var updateCTAs = function() {
        var $desktopCtas = $('.gwt-top-cart-gift-registry-btns').first();
        var $desktopAddToCart = $desktopCtas.find('.primary');
        var $addToCartButton = $('.js-add-to-cart');
        var $wishlistButton = $('.js-add-to-wishlist');

        if ($desktopCtas.find('.secondary').is('[style*="none"]')) {
            $wishlistButton.attr('hidden', 'true');
        }

        $addToCartButton.text($desktopAddToCart.text() + ' >');
    };

    var getWidgetDesktopContainer = function() {
        var $pinny = $('.js-product-detail-widget-pinny');
        return $('#' + $pinny.attr('data-widget-id'));
    };

    // / Handles the icons displayed when bellow is open and closed
    var initBellows = function() {
        $('.js-product-bellows').on('click', '.c-bellows__header', function(e) {
            var $target = $(this);

            var $icon = $target.find('.c-icon');

            if ($icon.find('title').text() === 'expand') {
                $icon.attr('data-fallback', 'img/png/collapse.png');
                $icon.find('title').text('collapse');
                $icon.find('use').attr('xlink:href', '#icon-collapse');
            } else {
                $icon.attr('data-fallback', 'img/png/expand.png');
                $icon.find('title').text('expand');
                $icon.find('use').attr('xlink:href', '#icon-expand');
            }
        });
    };

    // Update all the carousel anhors to have the coremetrics data in the hash.
    // TODO: Refactor this to be less susceptible to desktop changes, or carousel order changes.
    var updateCarouselAnchors = function() {
        var $carousels = $('.t-product-details__suggested-products .c-scroller');

        $carousels.each(function(index) {
            var $ourCarousel = $(this);
            var $theirCarousel = $('[class^="gwt-we-suggest-panel-products"]').eq(index);
            var $theirAnchor = $theirCarousel.find('a:first');

            var hash = $theirAnchor.attr('href').split('?')[1];

            // Update our product anchors by adding the sections ('recently viewed', 'may we suggest', etc) hash.
            if (hash) {
                $ourCarousel.find('a').each(function() {
                    var $anchor = $(this);

                    $anchor.attr('href', $anchor.attr('href') + '?' + hash);
                });
            }
        });

    };

    return {
        updatePrice: updatePrice,
        disableAddToCartWishlist: disableAddToCartWishlist,
        updateMainImageSrc: updateMainImageSrc,
        updateProductImageCaption: updateProductImageCaption,
        updateCTAs: updateCTAs,
        updateDesktopSelect: updateDesktopSelect,
        productDetailsDecorators: productDetailsDecorators,
        updateSwatchboxText: updateSwatchboxText,
        updateSpecialShipping: updateSpecialShipping,
        getWidgetDesktopContainer: getWidgetDesktopContainer,
        initBellows: initBellows,
        updateCarouselAnchors: updateCarouselAnchors
    };
});
