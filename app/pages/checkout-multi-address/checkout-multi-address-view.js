define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-multi-address/checkout-multi-address'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var orderContainsGifts = /gift/i.test($giftBreadcrumb.text()) && !!$giftBreadcrumb.find('a').length;
            var steps;
            var shippingStep;
            var giftStep;

            if (orderContainsGifts) {
                context.header.progressBar = context.header.progressBarWithGift;
                steps = context.header.progressBar.steps;
                giftStep = steps[0];
                shippingStep = steps[1];
                giftStep.status = 'c--complete';
                giftStep.statusText = 'Completed';
            } else {
                steps = context.header.progressBar.steps;
                shippingStep = steps[0];
            }

            shippingStep.status = 'c--active';

            return context;
        },

        context: {
            templateName: 'checkout-multi-address',
            desktopContent: function() {
                return $('#content');
            }
        }
    };
});
