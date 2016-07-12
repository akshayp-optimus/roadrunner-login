define([
    '$',
    'global/includes/checkout-header/context',
    'global/includes/checkout-footer/context',
    'global/baseView',
    'dust!global/checkoutBase'
],
function($, checkoutHeader, checkoutFooter, BaseView, baseTemplate) {
    var descript;

    return {
        template: baseTemplate,
        extend: BaseView,
        includes: {
            header: checkoutHeader,
            footer: checkoutFooter
        },
        preProcess: function(context) {
            $('#emailUpdates').remove();
            $('script[x-src*="sli"]').remove();


            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            return context;
        },
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            return context;
        },
        context: {
            templateName: 'checkout-base',
        }
    };

});
