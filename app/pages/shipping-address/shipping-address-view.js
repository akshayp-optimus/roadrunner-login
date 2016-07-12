define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/shipping-address/shipping-address'
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
            templateName: 'shipping-address',
            mainContent: function() {
                return $('#mainContent');
            },
            hiddenLabels: function(context) {
                return context.mainContent.children('.nodisplay, [style*="none"]');
            },
            form: function(context) {
                var $formContainer = context.mainContent.children('.form');
                var $billingContainer = $formContainer.find('#billing-address');
                var $shippingContainer = $formContainer.find('#shipping-address');
                var $registrationContainer = $formContainer.find('#checkout-registration-holder');
                $formContainer.find('#gwt_billshipaddr_btn').html(function(i, h) {
                    return h.replace(/&nbsp;/g, '');
                });

                return {
                    errorContainer: $formContainer.find('#gwt-error-placement-div').addClass('u-visually-hidden'),
                    billingTitle: $billingContainer.find('.BillingHdr').text(),
                    billingContainer: $billingContainer.find('#gwt_billaddr_panel'),
                    emailContainer: $billingContainer.find('#gwt_email_textbox'),
                    confirmEmailContainer: $billingContainer.find('#gwt_confirm_email_textbox'),
                    sendEmailsContainer: $billingContainer.find('#gwt_sendMeEmails_cb'),
                    shippingTitle: $shippingContainer.find('.BillingHdr').text(),
                    shippingAddressOptions: $shippingContainer.find('#gwt_shippingOption_panel'),
                    shippingContainer: $shippingContainer.find('#gwt_shipaddr_panel'),
                    registrationContainer: {
                        title: $registrationContainer.find('h3').text(),
                        container: $registrationContainer.find('#gwt_password_panel'),
                        copy: $registrationContainer.find('.inst-copy').text()
                    },
                    ctaContainer: $formContainer.find('#gwt_billshipaddr_btn')
                };
            }
        }

    };
});
