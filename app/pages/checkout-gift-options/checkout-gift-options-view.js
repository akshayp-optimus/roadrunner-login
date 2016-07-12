define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-gift-options/checkout-gift-options',
    'translator',
    'global/utils',
    'global/parsers/cart-item-parser'
],
function($, BaseView, template, Translator, Utils, cartItemParser) {

    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            context.header.progressBar = context.header.progressBarWithGift;

            var currentStep = context.header.progressBar.steps[0];

            currentStep.status = 'c--active';

            return context;
        },

        context: {
            templateName: 'checkout-gift-options',
            description: function() {
                return Utils.getNonEmptyChildTextNodes($('#mainContent'));
            },
            giftOptionsForm: function() {
                return $('form[name="GiftWrap"]');
            },
            giftDisplayContainer: function() {
                return $('#gwt_display_availability_msg, #gwt_display_low_inventory_msg, #gwt_display_personalization_msg, #personalization_msg_label');
            },
            giftOptionsHiddenInputs: function(context) {
                return context.giftOptionsForm.find('input[type="hidden"]');
            },
            removePriceFromPackingSlip: function(context) {
                return context.giftOptionsForm.find('.removePriceFromPackingSlip');
            },
            giftItems: function(context) {
                return cartItemParser.parse(context.giftOptionsForm.find('table tr'));
            },
            continueButton: function(context) {
                return context.giftOptionsForm.find('.button.primary')
                    .addClass('c--primary c-button').text(Translator.translate('continue_with_arrow'));
            }
        }
    };
});
