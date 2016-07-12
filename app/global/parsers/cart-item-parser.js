define([
    '$',
    'translator'
], function($, translator) {
    var shippingMethodCount = 0;

    // Gifting Options Page - Get Gift Wrap Choices
    var _getGiftWrapChoices = function($container) {
        if (!$container.length) {
            return;
        }
        return {
            giftWrapMessage: $container.find('.giftwrapchoice').length ? false : $container.text(),
            choices: $container.find('.giftwrapchoice').map(function(_, item) {
                var $item = $(item);
                // Removed NoWrap.jpg image
                var $giftWrapImage = $item.find('.gwimage img');
                var giftWrapImageSrc = $giftWrapImage.attr('x-src');
                if (!giftWrapImageSrc) {
                    giftWrapImageSrc = '';
                }

                return {
                    chekbox: $item.find('[type="radio"]'),
                    giftWrapImage: giftWrapImageSrc.match(/NoWrap/i) ? '' : $giftWrapImage,
                    label: $item.find('.gwlabel'),
                    price: $item.find('.gwprice').text()
                };
            })
        };
    };

    // Gifting Options Page - Get Gift Message
    var _getGiftMessage = function($container) {
        if (!$container.length) {
            return;
        }
        return {
            label: $container.find('.info p:first').text(),
            input: $container.find('textarea'),
            characterLimitMessage: $container.find('.giftWrapMessageDescTxt')
        };
    };

    // Get recommended accessory section
    var _getRecommendedAccessory = function($container) {
        var $upsellItemRow = $container.find('.cartUpSellRow').remove();

        if ($upsellItemRow.length) {
            var data = JSON.parse($upsellItemRow.find('.JSON').text()).pageProduct;
            return {
                title: $upsellItemRow.find('.contentLeaderText').text(),
                widget: $upsellItemRow.find('.cartUpSellWidget').remove(),
                itemName: data.prodName
            };
        }
    };

    var _createQtySelectDropdown = function(qtyArr, value) {
        return {
            options: $.map(qtyArr, function(i, item) {
                return {
                    value: i,
                    text: i,
                    selected: i === value ? true : false
                };
            })
        };
    };

    var _getQty = function(itemData, $item) {
        var $container = $item.find('[id*="gwt_quantity_control"]').addClass('u-visually-hidden');
        var value = parseInt($container.attr('data-initialquantity'));
        var maxQuantity = $container.attr('data-maxquantity');
        var qtyArr = [];

        for (var i = 1; i <= maxQuantity; i++) {
            qtyArr.push(i);
        }

        return {
            qtyLabel: 'Qty ',
            count: value,
            container: $container,
            isMax: value === $container.data('maxquantity'),
            isMin: value === 1,
            items: _createQtySelectDropdown(qtyArr, value)
        };
    };

    var _parsePrice = function($priceCell) {
        if (!$priceCell.length) {
            return;
        }

        var $oldPrice = $priceCell.find('.listPrice');
        var $newPrice = $priceCell.find('.nowLabel');
        var oldPriceText = !!$oldPrice.length ? $oldPrice.text().replace(/was/i, '') : '';
        var newPriceText = !!$newPrice.length ? $newPrice.text().replace(/now/i, '') : '';
        var $discountPrice = $priceCell.find('.discountPrice');
        var hasDiscount = !!$discountPrice.length;
        var $orig = $priceCell.find('.orig');


        return {
            priceDiscount: !!$oldPrice.length || hasDiscount,
            price: $orig.length ? $orig.text() : $priceCell.text(),
            priceNew: hasDiscount ? $discountPrice.text() : newPriceText,
            priceWas: hasDiscount ? newPriceText : '',
            priceOld: !!$oldPrice.length ? oldPriceText : $orig.text()
        };
    };

    var _parseWishlistItem = function($items, isRegistry, isView) {
        return $items.map(function(i, item) {
            var $item = $(item);
            var itemData = JSON.parse($item.find('.JSON').first().text()).pageProduct;
            var $desiredQuantity = $item.find('.qtyReq').remove();
            var $purchasedQuantity = $item.find('.qtyPur').remove();

            var wishlistData = {
                isWishlist: true,
                itemName: itemData.prodName + ' (' + translator.translate('cart_item_text') + itemData.giftRegistryItemMFPartnumber + ')',
                itemHref: itemData.productDetailTargetURL,
                complete: $item.find('.gr-item-met-amount-cpmplete'),
                addToCartButton: $item.find('[id*="gwt_add_to_cart_option_link"], .wish-list-add-to-cart').find('a').addClass('u-unstyle u-text-lowercase').append(' >'),
                removeButton: $item.find('.gr-item-remove_link .secondary, .options a:first').addClass('u-unstyle c-remove-wishlist-button').text(translator.translate('remove')),
                price: _parsePrice($item.find('.price').not('#perzuprice')),
                isRegistry: isRegistry,
                originalContent: $item.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                }),
                quantity: _getQty(itemData, $item),
                shippingDate: itemData.dropShipBackOrderDistinction_avaDate
            };

            if (!wishlistData.addToCartButton.length) {
                wishlistData.addToCartButton = $item.find('.primary').addClass('u-unstyle js-add-to-cart u--bold').append(' >');
            }

            if (isRegistry) {
                wishlistData.quantityDesired =  $desiredQuantity;
                wishlistData.quantityPurchased = $purchasedQuantity;
            }

            return wishlistData;
        });
    };

    var _parseShippingMethod = function($cartItem) {
        var $shippingSelect = $cartItem.find('.shipmode');
        var $deliveryOptionsLink = $cartItem.find('.deliveryOptsLink a');
        var $detailsLink = $cartItem.find('[id*="detShipInfoLink"]');

        shippingMethodCount++;

        if ($shippingSelect.length) {
            return {
                shippingSelect: $shippingSelect.attr('hidden', 'true'),
                shippingOptions: $shippingSelect.children().map(function(i, option) {
                    return {
                        text: option.textContent,
                        value: option.value,
                        checked: option.selected,
                        type: 'radio',
                        name: 'js-shipping-method-' + shippingMethodCount
                    };
                }),
                reviewLink: !!$deliveryOptionsLink.length ? {
                    href: $deliveryOptionsLink.attr('href'),
                    text: $deliveryOptionsLink.text()
                } : ''
            };
        }
    };


    var _parseGiftOptions = function($cartItem) {
        var $firstGiftRow = $cartItem.next('.perzonalizationRow').next('.giftMessageRow');
        var $editGiftLink = $cartItem.find('.edit_gift_option_link a');

        if ($editGiftLink.length || $firstGiftRow.find('.gifting').length) {
            $firstGiftRow = $firstGiftRow.add($firstGiftRow.next('.giftMessageRow'));

            return {
                editGiftOptionsLink: {
                    text: $editGiftLink.text(),
                    href: $editGiftLink.attr('href')
                },
                optionDetails: $firstGiftRow.map(function(i, giftRow) {
                    var $giftRow = $(giftRow);
                    return {
                        content: $giftRow.find('.gifting').text(),
                        price: $giftRow.find('.price').text()
                    };
                })
            };
        }
    };

    var _evalJSON = function(JSONText) {
        var data;
        try {
            data = eval('(' + JSONText + ')');
        } catch (err) {
            console.error('Failed to eval Object literal string: eval failed', err);
        } finally {
            return data || {};
        }
    };

    var _parse = function($items) {
        return $items.map(function(i, item) {
            var $item = $(item);
            var itemData = _evalJSON($item.find('.JSON:first').text()).pageProduct;
            if (!itemData) {
                return;
            }
            var $editButton = $item.find('[id*="editButton"] button');
            var $lowInv = $item.find('.lowInv_msg');
            var lowStock = !!$lowInv.length;
            var $personalizationRow = $item.find('[id*="personalizationRow"]');
            var $editGiftButton = $item.find('.gift_msg .button');
            var $shipSurchargeRow = $item.find('[id*="shipSurcharge_"]');

            // This variable for ship method
            var $shipping = $item.find('.shipMethod');
            // var $shippingSelect = $item.find('[id*="shipModeId"]').remove();

            // This variable for shipmethod pinny
            var shippingDetailsHeader = $item.find('.detShipInfo').prev('a').text();
            var $content = $item.find('.detailed_shipping_info');

            if ($('.view-OrderConfirmationDisplayView').length) {
                $shipSurchargeRow = $item.next().next();
            }
            var $giftMessageContent;

            $editButton.addClass('c-button c--small c--link c--dark c--no-padding');

            if (itemData.GIFTBOX_MESSAGE) {
                $giftMessageContent = $('<div>');

                $giftMessageContent.text('"' + itemData.GIFTBOX_MESSAGE + '"');

                $editGiftButton.text(translator.translate('edit_button'));
                $editGiftButton.addClass('c-button c--simple');

                $giftMessageContent.append($editGiftButton);
            }

            if (!$personalizationRow.length) {
                $personalizationRow = $item.next('[id*="personalizationRow"]');
            }

            var inStockMessage = $item.find('.avail_msg').last();

            if (itemData.itemAvailableInventoryMessage === 'In-Stock ') {
                inStockMessage = itemData.itemAvailableInventoryMessage;
            }

            return {
                pinnyTargetClass: 'js-shipping-details-pinny-' + itemData.orderItemId,
                pinnyClass: 'shipping-details-pinny js-shipping-details-pinny js-shipping-details-pinny-' + itemData.orderItemId,
                itemName: itemData.prodName,
                itemHref: itemData.productDetailTargetURL,
                itemNumber: itemData.orderItemMFPartNumber,
                quantity: _getQty(itemData, $item),
                eachText: _getQty(itemData, $item).count === 1 ? '' : 'each',
                removeButton: $item.find('.remove, .qty a').addClass('c-button c--small c--link c--dark c--no-padding'),
                price: _parsePrice($item.find('.price').not('#perzuprice')),
                personalizationPrice: $personalizationRow.length ? true : false,
                isPersonalizationPrice: $personalizationRow.find('#perzuprice div').text().length ? true : false,
                personalizationPriceText: $personalizationRow.find('#perzuprice div').text(),
                personalizationContentClass: !$personalizationRow.find('#perzuprice div').text().length ? 'u--hide' : false,
                isStockLow: lowStock,
                isInStock: !lowStock && itemData.PERSONALIZATION_ID !== 'DS',
                stockInfo: $item.find('.avail_msg').text(),
                availabilityContainer: lowStock ? $lowInv.text() : inStockMessage,
                availableRestrictionMsg: $item.find('.avail_msg_restriction, .avail_hdr'),
                shippingDate: itemData.dropShipBackOrderDistinction_avaDate,
                specialDeliveryLink: $('.gwt-HTML'),
                editButton: $editButton,
                // Used on Gifting Options Page
                giftWrapChoices: _getGiftWrapChoices($item.find('.giftWrapChoices')),
                giftMessage: _getGiftMessage($item.find('.giftMessage')),
                recommendedAccessory: _getRecommendedAccessory($item),

                originalContent: $item.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    if ($cell.is('.giftWrapChoices')) {
                        return;
                    }
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                }),
                gift: $item.find('.gift-checkbox').map(function(i, gift) {
                    var $gift = $(gift);
                    var $label = $gift.find('label');

                    return {
                        input: $gift.find('input'),
                        tooltipContent: $gift.find('.showGiftInfoPopup'),
                        label: $label.addClass('c-field__label'),
                        labelText: $label.text()
                    };
                }),
                giftMessageContent: $giftMessageContent,
                giftOptions: _parseGiftOptions($item),
                personalizationRow: $personalizationRow.map(function(i, row) {
                    return {
                        id: row.id,
                        content: $(row).children().map(function(i, cell) {
                            return {
                                class: cell.className,
                                id: cell.id,
                                cellContent: $(cell).html()
                            };
                        })
                    };
                }),
                shippingSurcharge: $shipSurchargeRow.map(function(i, row) {
                    var $row = $(row);

                    return {
                        label: $row.find('#shipSurchargedesc').text(),
                        value: $row.find('#shipSurchargeuprice').text()
                    };
                }),
                isReviewDeliveryOptions: $item.find('.deliveryOptsLink').length ? true : false,
                reviewDeliveryOptionsLink: $item.find('.deliveryOptsLink a').attr('href'),
                shippingInfo: _parseShippingMethod($item),
                shippingDetails: {
                    title: shippingDetailsHeader,
                    content: $content
                },
                perzNotAvailMessage: function() {
                    return $('#perznotavailmessage').text();
                },
                isPerzNotAvailMessage: function() {
                    return $('#perznotavailmessage').text().length;
                }
            };
        });
    };

    return {
        parse: _parse,
        parseWishlistItem: _parseWishlistItem
    };
});
