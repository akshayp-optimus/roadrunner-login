define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/international-checkout/international-checkout'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            // International checkout is 1-step
            context.header.progressBar = null;

            return context;
        },

        context: {
            templateName: 'international-checkout',
            hiddenData: function() {
                return {
                    inputs: $('input[type="hidden"]').remove(),
                    paymentIframe: $('#__frame').remove()
                };
            },
            checkoutIframe: function() {
                return $('#envoyId');
            }
        }
    };
});
