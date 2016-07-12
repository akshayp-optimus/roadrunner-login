define(['$',
    'translator',
    'dust!components/cart-order-summary/partials/promo-code'
], function($, Translator, PromoCodeTemplate) {

    var _getGiftCard = function($giftCouponContainer) {
        var $giftCouponTemplate;
        var $input = $giftCouponContainer.find('#account');
        $input.addClass('js-apply-input').attr('placeholder', $input.attr('value')).removeAttr('value');
        var giftCouponTemplateData = {
            form: $giftCouponContainer.is('form') ? $giftCouponContainer : '',
            hiddenInputs: $giftCouponContainer.find('input[type="hidden"]'),
            label: $giftCouponContainer.find('label').text('Number'),
            tooltip: $giftCouponContainer.find('.giftingInfo'),
            input: $giftCouponContainer.find('#account').addClass('js-apply-input'),
            applyButton: $giftCouponContainer.find('button').addClass('c-button c--small u--disabled'),
            tooltipClass: 'js-gift-card-tooltip',
            promoCodeClass: 'js-gift-card-container'
        };

        new PromoCodeTemplate(giftCouponTemplateData, function(err, html) {
            $giftCouponTemplate = $(html);
        });

        return $giftCouponTemplate;
    };

    // Get promo code section
    var _getPromoCode = function($promoContainer) {
        var $promoContent;
        var $promoError = $promoContainer.find('.error');
        var $promoLabel = $promoContainer.find('#showPromoCodeInfo').text(Translator.translate('offer'));
        // var $tooltip = $promoContainer.find('#showPromoCodeTextInfo');
        var promoTemplateData = {
            form: $promoContainer.is('form') ? $promoContainer : '',
            hiddenInputs: $promoContainer.find('input[type="hidden"]'),
            label: $promoLabel.text(),
            showPromo: location.search.indexOf('promoCodeError') > -1,
            tooltip: $promoContainer.find('.promoCodeInfo, #showPromoCodeInfoPopup'),
            tooltipClass: 'js-promo-tooltip',
            input: $promoContainer.find('#promoCode').addClass('js-apply-input').attr('placeholder', Translator.translate('enter_offer_code')),
            applyButton: $promoContainer.find('#promoButton').addClass('c-button c-input-field-button u-margin-bottom-extra-sm u-margin-top-extra-sm u-margin-end-extra-sm u--disabled c--small'),
            errorContainer: $promoError.addClass('u-margin-top-sm u-text-error'),
            showPromo: location.search.indexOf('promoCodeError') > -1,
            promoCodeClass: 'js-promo-container'
        };

        new PromoCodeTemplate(promoTemplateData, function(err, html) {
            $promoContent = $(html);
        });

        return $promoContent;
    };

    // Get shipping estimate section
    var _getShippingEstimate = function($shippingContainer) {
        var $shippingEstimate;
        var $input = $shippingContainer.find('#estimate_shipping');
        $input.addClass('js-apply-input').attr('placeholder', $input.attr('value')).removeAttr('value');
        var shippingEstimateTemplateData = {
            label: Translator.translate('zip_code'),
            id: $shippingContainer.attr('id'),
            input: $shippingContainer.find('#estimate_shipping_label').attr('hidden', 'hidden').add($input),
            applyButton: $shippingContainer.find('.button').addClass('u--disabled c-button c--small c-input-field-button'),
            pleaseWait: $shippingContainer.find('#pleaseWait'),
            promoCodeClass: 'js-shipping-container'
        };

        new PromoCodeTemplate(shippingEstimateTemplateData, function(err, html) {
            $shippingEstimate = $(html);
        });

        return $shippingEstimate;
    };


    var _getAdditionalTotals = function($container, $promoCode) {
        var $estimatedShipping = $promoCode.find('.EstimateShipping');
        var $giftCardForm = $promoCode.find('#giftCardForm');
        var $changeZipBtn = $estimatedShipping.find('#changeZipBtn');
        var promoApplied = !!$promoCode.find('.edit-promo').length;
        var itemArr = [];
        var item;

        // In order review and payment page promo code section is present in promotionCodeForm
        if ($promoCode.find('#promotionCodeForm').length) {
            $promoCode = $promoCode.find('#promotionCodeForm');
        }

        if ($changeZipBtn.is('[style*="none"]')) {
            // Hide the button if the desktop site is hiding it
            $changeZipBtn.addClass('u--hide');
        } else {
            $changeZipBtn.addClass('u--inline-flex');
        }

        $changeZipBtn.removeAttr('style');
        $changeZipBtn.find('span').text(Translator.translate('change'));

        $container.find('tr').map(function(_, totalRow) {
            var $totalRow = $(totalRow);
            var $label = $totalRow.find('td').first();
            var value = $totalRow.find('td:last').text().trim();
            var $shippingEstimate = $estimatedShipping.find('#zipCodeForm');
            var additionalTotalsClass = '';
            var $moreContent;


            if (!$label.text().trim().length) {
                return;
            }

            if ($totalRow.hasClass('promoRow')) {
                $moreContent = _getPromoCode($promoCode);
                additionalTotalsClass = 'js-applied-promo';
            }

            if ($totalRow.hasClass('estimateShipping_tr') && $shippingEstimate.length) {
                item = {
                    label: $label,
                    value: value.length ? value : Translator.translate('enter_zip'),
                    additionalTotalsClass: value.length ? '' : 'js-enter-zip',
                    changeZip: $changeZipBtn.find('button').addClass('u-unstyle').end(),
                    moreContent: _getShippingEstimate($shippingEstimate)
                };
            } else if ($totalRow.find('.promoColorNoWrap').length) {
                item = {
                    label: $label,
                    value: value.length ? value : Translator.translate('add'),
                    additionalTotalsClass: value.length ? '' : 'js-enter-gift-card',
                    moreContent: _getGiftCard($giftCardForm)
                };
            } else {
                item = {
                    label: $label,
                    value: value,
                    additionalTotalsClass: additionalTotalsClass,
                    moreContent: $moreContent
                };
            }

            itemArr.push(item);
        });

        // Display Offer code label and Add button When no promo code has been applied
        if (!$container.find('.promoRow').length) {
            var $promoCodeLabel = $promoCode.find('#showPromoCodeInfo').clone();
            var promoCodeLabel = $promoCodeLabel.text();
            $promoCodeLabel.children().remove();
            item = {
                label: promoCodeLabel,
                value: location.search.indexOf('promoCodeError') > -1 ? '' : Translator.translate('add'),
                additionalTotalsClass: location.search.indexOf('promoCodeError') > -1 ? '' : 'js-add-promo-code',
                moreContent: _getPromoCode($promoCode)
            };
            itemArr.push(item);
        }

        // Display Gift Card label and Add button When no gift card has been applied
        if (!$container.find('.promoColorNoWrap').length) {
            var $giftCardLabel = $giftCardForm.find('#giftcard-label').clone();
            var giftCardLabel = $giftCardLabel.text();
            $giftCardLabel.children().remove();
            item = {
                label: $giftCardLabel.text(giftCardLabel),
                value: Translator.translate('add'),
                additionalTotalsClass: 'js-add-gift-card',
                moreContent: _getGiftCard($giftCardForm)
            };
            itemArr.push(item);
        }

        return itemArr;
    };

    var _parse = function($totalsContainer, $grandTotal, $promoCode) {
        return {
            grandTotal: {
                label: $grandTotal.find('.grandlabel, .grandLabel').text(),
                value: $grandTotal.find('.amount, .totals.last').text()
            },
            additionalTotals: _getAdditionalTotals($totalsContainer, $promoCode)
        };
    };

    return {
        parse: _parse
    };
});
