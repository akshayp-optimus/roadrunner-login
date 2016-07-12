define([
    '$',
    'global/utils',
    'translator',
    // Parsers
    'pages/product-details/parsers/product-image-parser',
    'pages/product-details-bundle/parsers/product-image-bundle-parser',
    'pages/product-details/parsers/carousel-parser',
    'pages/product-details/parsers/scroller-parser',
    'pages/product-details/parsers/product-options-parser',
    'pages/product-details/parsers/product-price-parser',
    'pages/product-details-bundle/parsers/product-widget-parser',
    'pages/product-details/ui/pdp-helpers-ui',
    // Templates
    'dust!components/pdp-stepper/pdp-stepper',
    'dust!components/product-image/product-image',
    'dust!pages/product-details-bundle/partials/product-image-bundle',
    'dust!components/scroller/scroller',
    'dust!components/carousel/carousel',
    'dust!components/product-options/product-options',
    'dust!components/price/price',
    'dust!components/bellows/bellows',
    'dust!components/pdp-widget/pdp-widget',
    'dust!pages/product-details/partials/personalization-control'
], function($, Utils, Translator,
    // Parsers
    ProductImageParser, ProductImageBundleParser, CarouselParser, ScrollerParser, ProductOptionsParser,
    ProductPriceParser, ProductWidgetParser,

    HelpersUI,
    // Templates
    StepperTmpl, ProductImageTmpl, ProductImageBundleTmpl, ScrollerTmpl, CarouselTmpl, ProductOptionsTmpl,
    PriceTmpl, BellowsTmpl, ProductWidgetTmpl, PersonalizationControl) {
    var HI_RES_PREFIX = 'http://grandinroad.scene7.com/is/image/';

    var _getSelectDropDown = function($options) {
        return {
            options: $options.map(function(index, item) {
                var $item = $(item);
                var text = $item.text();

                return {
                    value: $item.attr('value'),
                    dataId: $item.attr('data-id'),
                    text: text,
                    selected: $item.is(':selected')
                };
            })
        };
    };
    var _buildProductQuantityOption = function(qtySelectName, $sku, $desktopContainer) {
        if (!$desktopContainer) {
            $desktopContainer = $('.gwt-top-quantity-Cntl-btns .csb-quantity-listbox');
        }
        var $quantityContainer = $('<div>', {
            class: 't-product-details__quantity c-box-row'
        });
        var stepperHTML;

        $quantityContainer.append($('<label class="u-padding-left-tight">Quantity</label>'));

        var $options = $desktopContainer.find('option');

        // parser data
        var data = {
            decreaseIcon: 'minus',
            decreaseTitle: 'Reduce Quantity',
            increaseIcon: 'plus',
            isMin: $options.filter(':selected').text() === '0' ? true : false,
            increaseTitle: 'Increase Quantity',
            items: _getSelectDropDown($options)
        };

        new StepperTmpl(data, function(err, html) {
            // appending to existing options
            stepperHTML = html;
        });

        $quantityContainer
            .attr('data-bind-qty', qtySelectName)
            .append(stepperHTML)
            .append($sku);

        return $quantityContainer;
    };

    var buildProductWidgets = function() {
        var $container = $('.js-product-widget');

        // parser data
        var collection = {
            title: 'In this collection',
            subtitle: 'Select an item to view options and purchase',
            products: ProductWidgetParser.parse($('.gwt-product-detail-widget'))
        };

        new ProductWidgetTmpl(collection, function(err, html) {
            $container.empty().append(html);
        });
    };

    var buildProductHeroCarousel = function($desktopContainer, productThumbnails) {
        var $container = $('.js-product-hero-carousel');
        var $thumbnails = !!$desktopContainer && $desktopContainer.length !== 0 ? $desktopContainer.find('.iwc-thumbs-panel .carouselTile') : $('.iwc-thumbs-panel .carouselTile');

        // Replace low quality swatch image with high quality version
        $thumbnails.find('img').each(function(_, item) {
            var $item = $(item);
            if ($item.attr('src')) {
                var highQualityImgSrc = $item.attr('src').replace('$wgit', '$wgis');
                $item.attr('src', highQualityImgSrc);
            }
        });

        // If we have the complete list of thumbnails from scene7, update the parsed
        // images with any new images from this list. We do this because the scene7 list
        // never includes the 360 of video thumbnails.
        if (productThumbnails) {
            var $thumbnailTemplate = $thumbnails
                .first()
                .clone()
                .removeClass('selected');

            $.each(productThumbnails, function(index, image) {
                var $image = $thumbnails.filter(function() {
                    var $image = $(this).find('img');

                    return $image.length ? $image.attr('src').indexOf(image) > -1 : false;
                }).first();

                if (!$image.length) {
                    var $newThumb =
                        $thumbnailTemplate
                        .clone();

                    // Update the image source.
                    $newThumb.find('img')
                        .attr('src', HI_RES_PREFIX + image);

                    $thumbnails.push($newThumb[0]);
                }
            });
        }

        if ($thumbnails.length > 0) {

            // parser data
            var data = CarouselParser.parse($thumbnails);

            // Show Arrows
            data.showControls = $thumbnails.length > 1;

            new CarouselTmpl(data, function(err, html) {
                $container.empty().append(html);
            });

            // Only initialize if there is more than one image
            if ($thumbnails.length > 1) {
                $('.c-carousel').scooch({
                    autoHideArrows: true
                });
            }
        } else {
            $container.remove();
        }
    };

    var buildProductImages = function(isBundled, $container, $desktopContainer, isWidget) {
        if (!$container || !$container.length) {
            $container = $('.js-product-image');
        }

        // parser data
        var data = {};

        if (!isBundled) {
            if (isWidget) {
                buildProductHeroCarousel($desktopContainer, window._thumbnailSets[$desktopContainer.index()]);
            } else {
                buildProductHeroCarousel($('.gwt-product-detail'), window._thumbnailSets[0]);
            }
        } else {
            data = {
                bundle: ProductImageBundleParser.parse($('.gwt-product-detail'))
            };

            // Load and none-visible images from the bundleData data structure.
            var imageId = Adaptive.evaluatedContext.hiddenData.bundleData.partNumber.replace('_', '-');
            var allImages = Adaptive.evaluatedContext.hiddenData.bundleData.xImages;
            $.each(allImages, function(index, image) {

                var $images = $(data.bundle).filter(function() {
                    return this.imgSrc.indexOf(image.imageSuffix) > -1;
                });

                if (!$images.length) {
                    data.bundle.push({
                        imgSrc: HI_RES_PREFIX + 'frontgate/' + imageId + image.imageSuffix
                    });
                }
            });

            new ProductImageBundleTmpl(data, function(err, html) {
                // It's possible that we added an image above that doesn't exist,
                // so lets remove it if it fails to load.
                var $html = $(html);

                $html.find('img').each(function() {
                    var $image = $(this);
                    $image.on('error', function() {
                        $('img[src="' + $image.attr('src') + '"]').remove();
                    });
                });

                if (jQuery(html).find('.c-product-image__image').length > 3) {
                    $container.empty().append(html);

                    // GRRD-532: Bundle PDP images cut off
                    // Should show first three images
                    var height = 0;

                    $container.find('.c-product-image').slice(0, 3).each(function() {
                        var $this = $(this);

                        height += $this.height();
                    });

                    $container.parent().css('height', height);
                } else {
                    $('.c-product-image-wrapper').addClass('js-product-image').html(html);
                }
            });
        }
    };

    var trackValid = function(currentState, newState) {
        return currentState && newState ? true : false;
    };

    var validataSelect = function(optionText, regex) {
        var result = optionText.match(regex);
        return !result || (result && result.length === 0);
    };

    var validateAddToCart = function($parent) {
        var valid = true;
        $parent.find('.js-require-add-to-cart').each(function(_, option) {
            var $option = $(option);

            if ($option.is('.js-qty-container')) {
                valid = trackValid( valid, $option.find('select').val() !== '0');
            } else if ($option.find('select').length) {
                var selectedValue = $option.find('select').val();
                valid = trackValid( valid, validataSelect(selectedValue, /choose/i));
                valid = trackValid( valid, validataSelect(selectedValue, /unavailable/i));
                // Track unavailable item
                var $selectedOption = $option.find('option[value="' + selectedValue + '"]');
                valid = trackValid( valid, validataSelect($selectedOption.text(), /unavailable/i));
            } else if ($option.is('.c-swatch-selection-section')) {
                valid = trackValid( valid, $option.find('.c--is-selected').length === 1);
            }
        });

        // GRRD-701: Use an ATC flag to check when inventory check has occurred
        return valid && window.Adaptive.atcReady;
    };

    var updateAddToCartState = function($parent) {
        var $addToCartBtn = $parent.closest('.t-product-details-page, .js-widget-container').find('.js-add-to-cart');
        if (validateAddToCart($parent)) {
            $addToCartBtn.removeClass('c--is-disabled');
            $parent.find('.js-add-personalization-label').removeClass('c--is-disabled');
        } else {
            $addToCartBtn.addClass('c--is-disabled');
        }
    };

    var updateQtyState = function($parent, $desktopParent) {
        var currentQty = parseInt($parent.find('.js-qty-container select').val());
        var maxQty = parseInt($desktopParent.find('.csb-quantity-listbox option').last().text());

        if (currentQty === 1) {
            $parent.find('.js-stepper-decrease').addClass('c--disabled').attr('disabled', '');
        } else if (currentQty === maxQty) {
            $parent.find('.js-stepper-increase').addClass('c--disabled').attr('disabled', '');
        } else {
            $parent.find('.js-stepper-decrease, .js-stepper-increase').removeClass('c--disabled').removeAttr('disabled', '');
        }

        setTimeout(function() {
            HelpersUI.updatePrice();
        }, 1000);

        updateAddToCartState($parent);
    };

    var updateOptions = function($parent, $desktopParent) {
        if ($desktopParent.length === 0) {
            $desktopParent = $('#' + $parent.attr('data-widget-id'));
        }

        var $desktopSwatches = $desktopParent.find('.gwt-image-picker-option');
        $parent.find('.js-thumbnails').each(function(idx, swatch) {
            var $swatch = $(swatch);
            if ($desktopSwatches.eq(idx).is('.gwt-no-available-combination')) {
                $swatch.addClass('c--disabled');
            } else {
                $swatch.removeClass('c--disabled');
            }
        });
        $parent.find('.js-color-text').text($desktopParent.find('.gwt-product-option-panel-swatchbox .gwt-product-option-panel-chosen-selection').text());

        $parent.find('select.gwt-ListBox').each(function() {
            var $select = $(this);
            var $desktopSelect = $desktopParent.find('select[name="' + $select.attr('name') + '"]');
            var $desktopSelectOptions = $desktopSelect.find('option');

            $select.find('option').each(function(idx, option) {
                $(option).text($desktopSelectOptions.eq(idx).text());
            });

            $select.val($desktopSelect.val());
        });

        var $qtyContainer = $parent.find('.js-qty-container select');
        $qtyContainer.val($desktopParent.find('.csb-quantity-listbox').val());
        $qtyContainer.on('change', function() {
            updateQtyState($parent, $desktopParent);
        });
        updateQtyState($parent, $desktopParent);

        var $swatchGroups = $desktopParent.find('.gwt-image-picker');
        $swatchGroups.each(function(idx, swatchGroup) {
            var $swatchGroup = $(swatchGroup);
            var $selectedSwatch = $swatchGroup.find('.gwt-image-picker-option-image-selected, .gwt-image-picker-option-fill-selected img');

            $parent.find('.js-swatches').eq(idx).find('.c--is-selected').removeClass('c--is-selected');
            if ($selectedSwatch.length) {
                var $swatchContainer = $parent.find('.js-thumbnails[color="' + $selectedSwatch.attr('color') + '"]');
                if ($swatchContainer.length) {
                    $swatchContainer.eq(idx).addClass('c--is-selected');
                } else {
                    // GRRD-692: Some PDPs have the color attribute on the image and not the container
                    $parent.find('.js-thumbnails [color="' + $selectedSwatch.attr('color') + '"]').eq(idx).parent().addClass('c--is-selected');
                }
            }
        });

        $parent.find('.js-product-hero-carousel .m-item').eq(0).find('img').attr('src', $desktopParent.find('.iwc-main-img').attr('src'));
        updateAddToCartState($parent);
        HelpersUI.updateSpecialShipping($desktopParent);
    };

    var bindOptionsEvents = function($parent, $desktopParent) {
        $parent.find('select.gwt-ListBox').on('change', function() {
            var $select = $(this);
            var $desktopSelect = $desktopParent.find('select[name="' + $select.attr('name') + '"]');

            $desktopSelect.val($select.val()).triggerGWT('change');

            updateOptions($parent, $desktopParent);
        });

        $parent.find('.js-thumbnails').on('click', function() {
            var $swatch = $(this);
            var $swatchImg = $swatch.find('img');
            $parent.find('.c--is-selected').removeClass('c--is-selected');
            $swatch.addClass('c--is-selected');

            $desktopParent.find('.gwt-image-picker-option-image[color="' + $swatchImg.attr('color') + '"], .gwt-Image[color="' + $swatchImg.attr('color') + '"]').triggerGWT('click');

            updateOptions($parent, $desktopParent);
        });

        $parent.find('.js-stepper-decrease, .js-stepper-increase').on('click', function() {
            var $this = $(this);
            var $qty = $parent.find('.js-qty-container select');
            var $desktopQty = $desktopParent.find('.csb-quantity-listbox');
            var currentQty = parseInt($qty.val());
            var maxQty = parseInt($desktopQty.find('option').last().text());

            if ($this.is('.js-stepper-decrease') && currentQty !== 0) {
                currentQty--;
            } else if (currentQty < maxQty) {
                currentQty++;
            }

            $qty.val(currentQty);
            $desktopQty.val(currentQty).triggerGWT('change');

            updateQtyState($parent, $desktopParent);
        });

        $parent.find('.js-reveal-link').on('click', function() {
            var $this = $(this);
            var $container = $this.parents('.c-hide-reveal');
            $container.children('.js-content').removeClass('c--restricted-content');
            $this.addClass('u--hide');
        });
    };

    var buildPersonalization = function($container, $desktopParent) {
        if (!$desktopParent.is('.gwt-product-right-content-panel')) {
            $desktopParent = $desktopParent.find('.gwt-product-right-content-panel');
        }

        var $personalizationLink = $desktopParent.find('.gwt-product-detail-widget-personalization-panel > .gwt-personalize-link-style');
        var data;

        if (!$personalizationLink.length) {
            return;
        }

        if ($desktopParent.find('.gwt-product-detail-widget-personalization-chosen-values').text() !== '') {
            // Personalization Detail
            data = {
                additionalCost: $desktopParent.find('.gwt-personalize-cost-style'),
                personalizationDetail: $desktopParent.find('.gwt-product-detail-widget-personalization-chosen-values')
            };
        } else {
            // Personalization button
            data = {
                personalizationText: $personalizationLink.text()
            };
        }

        new PersonalizationControl(data, function(err, html) {
            $container
                .find('.js-personalization-container')
                .empty()
                .append(html)
                .removeAttr('hidden');

            $container.find('.js-personalization-edit').on('click', function() {
                $desktopParent.find('.gwt-personalize-edit-link-style').triggerGWT('click');
            });
            $container.find('.js-personalization-remove').on('click', function() {
                $desktopParent.find('.gwt-personalize-remove-link-style').triggerGWT('click');

                setTimeout(function() {
                    buildPersonalization($container, $desktopParent);
                }, 300);
            });
            $container.find('.js-add-personalization-label').on('click', function() {
                $desktopParent.find('.gwt-product-detail-widget-personalization-panel > .gwt-personalize-link-style').triggerGWT('click');
            });
            updateAddToCartState($container);
        });
    };

    var buildProductOptions = function($container, $desktopParent) {
        var productOptions = $desktopParent.find('.gwt-product-option-panel').children().map(function(_, option) {
            var $option = $(option);
            var label = $option.find('.gwt-product-options-panel-option-title').text().replace(/Choose\s*/, '');

            if ($option.is('.gwt-product-option-panel-swatchbox')) {
                var showToggle = false;
                var swatchesPerRow = Math.floor(($(document).width() - 50) / 52); // 50 is the paddings, 52 is size of a swatch
                var $swatches = $option.find('.gwt-image-picker .gwt-image-picker-option').clone().addClass('js-thumbnails');

                $swatches.removeClass('nodisplay').removeClass('gwt-image-picker-option');

                if ($swatches.length / swatchesPerRow > 2) {
                    showToggle = true;
                }

                var label = $option.find('.gwt-product-options-panel-option-title').text().replace(/Choose\s*/, '');
                if (showToggle) {
                    return {
                        swatches: true,
                        optionLabel: label,
                        showToggle: {
                            bodyContent: $('<div class="js-swatches c-color-swatches">').append($swatches),
                            revealIconName: 'chevron-large-down',
                            revealTextClass: 'u--hide'
                        }
                    };
                } else {
                    return {
                        optionLabel: label,
                        swatches: $swatches
                    };
                }
            } else {
                return {
                    optionLabel: label,
                    select: $option.find('select').clone()
                };
            }
        });

        new ProductOptionsTmpl({
            productOptions: productOptions,
            quantity: {
                decreaseIcon: 'minus',
                decreaseTitle: 'Reduce Quantity',
                increaseIcon: 'plus',
                isMin: true,
                increaseTitle: 'Increase Quantity',
                items: _getSelectDropDown($desktopParent.find('.csb-quantity-listbox option'))
            }
        }, function(err, html) {
            $container.empty().append(html);
            buildPersonalization($container, $desktopParent);

            var $desktopQty = $desktopParent.find('.csb-quantity-listbox');
            var $qty = $container.find('.js-qty-container select');
            if ($desktopQty.val() === '0') {
                $desktopQty.val('1').triggerGWT('change');
                $qty.val('1');
            } else {
                $qty.val($desktopQty.val());
            }

            bindOptionsEvents($container, $desktopParent);
            updateAddToCartState($container);
        });
    };

    var buildPrice = function($container, $productDetails ) {
        // var $container = $('.js-pdp-price');
        // var $productDetails = $('.gwt-product-detail-left-panel');
        var $discountedPrice = $productDetails.find('.gwt-pdp-main-stacked-price-now-label');
        var hasDiscount = $discountedPrice.length > 0;
        var $price;

        if (hasDiscount) {
            $price = $productDetails.find('.gwt-pdp-main-stacked-price-was-label');
        } else {
            $price = $productDetails.find('.gwt-product-detail-top-price');
        }

        var data = ProductPriceParser.parse($price, $discountedPrice);

        new PriceTmpl(data, function(err, html) {
            $container.empty().html(html);
        });
    };

    return {
        buildProductHeroCarousel: buildProductHeroCarousel,
        buildProductImages: buildProductImages,
        buildPrice: buildPrice,
        buildProductOptions: buildProductOptions,
        buildProductWidgets: buildProductWidgets,
        updateOptions: updateOptions,
        buildPersonalization: buildPersonalization
    };
});
