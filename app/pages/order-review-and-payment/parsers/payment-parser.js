define([
    '$',
    'translator',
    'dust!pages/order-review-and-payment/partials/payment-tooltip',
    'global/utils'
], function($, translator, toolTipTmpl, Utils) {

    var _decorateCardID = function($tooltip) {
        $tooltip.find('[style]').removeAttr('style');

        $tooltip.find('> div > div').each(function(i, cardContainer) {
            var $cardContainer = $(cardContainer);
            var cardType = $cardContainer.find('strong').text();

            if (!cardType) {
                cardType = $cardContainer.children('p').first().text();
            }

            $cardContainer.addClass('js-card-id-block');

            if (cardType.indexOf('American Express') > -1) {
                $cardContainer.addClass('js-amex');
            } else {
                $cardContainer.addClass('js-' + cardType.toLowerCase().replace(' ', '-'));
            }
        });
    };

    var _parseRow = function($label, $tooltip, labelText) {

        if ($tooltip && $tooltip.hasClass('showCardId')) {
            _decorateCardID($tooltip);
        }

        if (labelText) {
            $label.html($label.html().replace('Card Identification Number', labelText));
        }

        return {
            input: $label.siblings('input, #cvv-container'),
            label: $label.addClass('c-box__label c-arrange__item c--shrink'),
            select: $label.siblings('select'),
            inputScript: $label.siblings('script'),
            tooltip: $tooltip
        };
    };

    var cardTypes = {
        'American Express': 'amex',
        'amex': '',
        'Visa': 'visa',
        'Discover': 'discover',
        'Master Card': 'mastercard',
        'JCB': 'jcb'
    };

    var _getPaymentType = function($paymentType) {
        return {
            input: $paymentType.find('input'),
            label: $paymentType.find('label')
        };
    };

    // Get credit card content
    var _getCreditCardPaymentOptionDetails = function($container) {
        // return $container;
        var $expiryRow = $container.find('#exp-date-row');
        $expiryRow.find('#expire_month').find('option').first().text($expiryRow.find('#expire_month').find('option').first().text().replace('Select Month', 'Month'));
        $expiryRow.find('#expire_year').find('option').first().text($expiryRow.find('#expire_year').find('option').first().text().replace('Select Year', 'Year'));
        var $paymentMethodLabel = $container.find('#pay_method_id_label');
        var $creditCardPaymentType = $container.find('#payment-type-holder');
        var $cardIDLabel = $container.find('#card_id_number_label');

        if ($creditCardPaymentType.find('input').is(':checked')) {
            $creditCardPaymentType.addClass('c-payment-active');
        }
        $creditCardPaymentType.append('<svg class="c-icon" data-fallback="img/png/Card Disable icon.png"><title>Card Disable icon</title><use xlink:href="#icon-Card Disable icon"></use></svg>');
        var cardTypeInputLabel = cardTypes[$paymentMethodLabel.next().val()];
        return {
            paymentType: $creditCardPaymentType,
            creditCardLogoOptions: $container.find('.creditCardOptionLogos'),
            creditCardOption: $container.find('.creditCardOptions').addClass('js-form-container'),
            paymentMethod: _parseRow($paymentMethodLabel),
            cardType: cardTypeInputLabel,
            ccNumber: _parseRow($container.find('#account_label')),
            cardID: _parseRow($cardIDLabel, $container.find('#showCardId'), translator.translate('cvv_label')),
            expiry: {
                label: $expiryRow.find('#expire_month_label').addClass('c-box__label c-arrange__item c--shrink'),
                month: $expiryRow.find('#expire_month'),
                year: $expiryRow.find('#expire_year'),
                yearLabel: $expiryRow.find('#expire_year_label')
            }
        };
    };

    var _getInstallmentOptions = function($container) {
        return {
            heading: $container.find('> p'),
            options: $container.find('.installment_option').map(function(_, item) {
                var $item = $(item);
                var $tooltip = $item.find('[id^="option_desc"]');

                var toolTipData = {
                    tooltipClass: $tooltip.attr('id'),
                    tooltip: $tooltip
                };

                toolTipTmpl({toolTipData: toolTipData}, function(err, html) {
                    $item.find('label').append($(html));
                });

                // GRRD-564: Show inline description
                $item.find('[class^="option_desc"]').removeAttr('hidden');

                return {
                    radioBtn: $item.find('input[type="radio"]'),
                    label: $item.find('label')
                };
            })
        };
    };

    // TODO: Get Grandin Road Gift Card content
    var _getGRCreditCardPaymentOptionDetails = function($container) {
        var $grPaymentType = $container.find('#payment-type-holder');
        if ($grPaymentType.find('input').is(':checked')) {
            $grPaymentType.addClass('c-payment-active');
        }
        var $labelField = $container.find('#plcc_account_label');
        var $labelContent = $labelField.children();
        var newLabel = Utils.updateFormLabels($labelField.text());
        // Update Form Labels to match the invision
        newLabel && $labelField.text(translator.translate(newLabel));

        $labelField.prepend($labelContent);
        $grPaymentType.append('<svg class="c-icon" data-fallback="img/png/GR.png"><title>GR CardIcon</title><use xlink:href="#icon-GR"></use></svg>');
        return {
            grCreditCardOption: $container.addClass('js-plcc-form'),
            paymentType: $grPaymentType,
            grCreditCardContainer: $container.find('.PLCCOptions').addClass('js-form-container'),
            gRCreditCardLabel: $labelField,
            gRCreditCardInput: $container.find('.plcc-input'),
            installmentOptions: _getInstallmentOptions($container.find('.installment_options'))
        };
    };

    var _parse = function($form, context) {
        var $ctaContainer = $form.find('#processOrderContainer');
        var $cancelBtn = $ctaContainer.find('#processOrderCancelButton');
        var $finalTotal = $('#order_total_table').find('tr').last();

        $cancelBtn.addClass('c-button c--outline c-secondary-button c-payment-cancel-button');
        $cancelBtn.find('span').text(translator.translate('payment_back_button'));


        context.desktopScripts = context.desktopScripts.add($form.find('#cvv-container').siblings('script').remove());

        return {
            form: $form,
            sectionTitle: $form.find('h3').text(),
            // This hidden input will be converted to a text input if the cvv iframe fails to load
            // So we need to place it with the cvv iframe
            cvvInput: $form.find('#card_id_number').remove(),
            hiddenInputs: $form.find('input[type="hidden"], .nodisplay').remove(),
            gRCreditCardPaymentOption: _getGRCreditCardPaymentOptionDetails($form.find('.paymentOption.PLCC')),
            creditCardPaymentOption: _getCreditCardPaymentOptionDetails($form.find('.paymentOption.creditCard')),
            saveCC: $form.find('#ccsave-holder'),
            ctas: {
                container: $ctaContainer,
                cancel: $cancelBtn,
                placeOrder: $ctaContainer.find('.primary'),
            },
            finalTotal: {
                label: $finalTotal.find('.grandLabel').text(),
                price: $finalTotal.find('td').last().find('strong').text()
            }
        };
    };

    return {
        parse: _parse
    };
});
