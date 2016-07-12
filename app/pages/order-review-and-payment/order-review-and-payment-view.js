/**
 * Category Landing View
 */

define([
    '$',
    'translator',
    'global/checkoutBaseView',
    'dust!pages/order-review-and-payment/order-review-and-payment',
    'global/parsers/address-parser',
    'global/parsers/items-shipping-parser',
    'global/parsers/totals-parser',
    'global/parsers/cart-order-summary-parser',
    'pages/order-review-and-payment/parsers/payment-parser',

],
function($, translator, baseView, template, addressParser, itemsShippingParser,
    totalsParser, orderSummaryParser, paymentParser) {

    // Desktop uses PrototypeJS which has this function
    // CVV desktop scripts calls setValue to switch whether CVV value should
    // come from iFrame or an <input>
    var _addSetValueFunction = function() {
        Element.prototype.setValue = function(value) {
            this.value = value;
        };
    };

    return {
        template: template,
        extend: baseView,
        postProcess: function(context) {
            if (baseView.postProcess) {
                context = baseView.postProcess(context);
            }

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var orderContainsGifts = /gift/i.test($giftBreadcrumb.text()) && !!$giftBreadcrumb.find('a').length;
            var steps;
            var shippingStep;
            var giftStep;
            var paymentStep;


            if (orderContainsGifts) {
                context.header.progressBar = context.header.progressBarWithGift;
                steps = context.header.progressBar.steps;
                giftStep = steps[0];
                shippingStep = steps[1];
                paymentStep = steps[2];
                giftStep.status = 'c--complete';
                giftStep.statusText = 'Completed';
            } else {
                steps = context.header.progressBar.steps;
                shippingStep = steps[0];
                paymentStep = steps[1];
            }

            shippingStep.status = 'c--complete';
            shippingStep.statusText = 'Completed';


            paymentStep.status = 'c--active';

            _addSetValueFunction();

            return context;
        },
        context: {
            templateName: 'order-review-and-payment',
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms;
            },
            modalContainer: function() {
                return $('#gwt_tc_modal, #element_parent_id');
            },
            shipToMultipleAddressLink: function() {
                return $('a[href*="ipleShippingAddressDisplayView"]');
            },
            modalLabels: function() {
                return $('#gwt_address_select, #payment_method_change_notification_message');
            },
            requiredLabels: function() {
                return $('#mainContent').children('.nodisplay, [id*="gwt_errmsg"]');
            },
            pleaseWaitContainer: function() {
                return $('#pleaseWait').addClass('u-visually-hidden');
            },
            giftMessages: function() {
                return $('#gift_box_reset_message, #gwt_confirmation_title');
            },
            requiredForms: function() {
                return $('#ShipModeUpdateForm, #AlternateShipModeUpdateForm, #AddressUpdateForm, #OrderCopyForm, #payPalForm, #selectedPaymentMethodForm').remove();
            },
            errorContainer: function() {
                return $('#ok-placement-div, #topErrorMessages, #payment-error-cvv');
            },
            notifyStop: function() {
                return $('#notifyStop');
            },
            billingAddress: function() {
                var $container = $('#billingAddress');
                return addressParser.parse($container);
            },
            mainForm: function() {
                return $('.shoppingCart.orderReview');
            },
            orderItems: function() {
                var orderedItemCount = $('.orderSummaryItemCount:first').text();
                return itemsShippingParser.parse($('.orderItemRow'), orderedItemCount);
            },
            hiddenInputs: function() {
                return $('#shipModes, #multiShipTos, #giftCardRedeemed, #promotionApplied, #gwt_user_state');
            },
            totals: function(context) {
                var $totalsContainer = context.mainForm.find('#order_total_table');
                var $grandTotal =  $totalsContainer.find('.grandLabel').closest('tr').remove();
                return orderSummaryParser.parse($totalsContainer, $grandTotal, context.mainForm.find('.promoCode'));
            },
            paymentForm: function(context) {
                return paymentParser.parse($('#creditCardForm').remove(), context);
            }
        }
    };
});
