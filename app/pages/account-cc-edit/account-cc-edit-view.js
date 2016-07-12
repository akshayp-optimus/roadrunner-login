define([
    '$',
    'global/baseView',
    'dust!pages/account-cc-edit/account-cc-edit',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, BreadcrumbParser) {
    var _parseRow = function($label, $select) {
        return {
            input: $label.siblings('input'),
            label: $label.addClass('c-field__label'),
            select: $select,
            cardTypeLabel: $('#credit_card_type_label')
        };
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-cc-edit',
            breadcrumbLink: function() {
                return BreadcrumbParser.parse($('#myAccount'));
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.inst-copy').text();
            },
            formWrapper: function() {
                return $('#creditCardEditForm');
            },
            form: function(context) {
                var $form = context.formWrapper;
                $form.find('#cardExpiryMonth').find('option').first().text($form.find('#cardExpiryMonth').find('option').first().text().replace('Select Month', 'Month'));
                $form.find('#cardExpiryYear').find('option').first().text($form.find('#cardExpiryYear').find('option').first().text().replace('Select Year', 'Year'));
                $form.find('label .required').addClass('u-required-star u-padding-right-extra-tight u-padding-left-extra-tight');
                $form.find('#pay_cardNumbertext').attr('type', 'tel');
                return {
                    formInputs: $form.find('input[type="hidden"], .hidden'),
                    ccNumber: _parseRow($('#credit_card_number_label'), $('#payMethodCCID')),
                    dateLabel: $('#credit_card_expmonth_label'),
                    month: $('#cardExpiryMonth'),
                    year: $('#cardExpiryYear'),
                    button: $('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-0')
                };
            },
            errorContainer: function(context) {
                return context.form.find('#gwt-error-placement-div');
            },
            button: function() {
                $('.actions button').addClass('js-save c-save-button');
                return $('.actions');
            },
            hiddenInputs: function() {
                return $('input[type="hidden"], #shipModes, #multiShipTos, #giftCardRedeemed, #promotionApplied, #gwt_user_state');
            }
        }
    };
});
