define([
    '$',
    'global/baseView',
    'dust!pages/cart/cart',
    'translator',
    'global/parsers/cart-order-summary-parser',
    'global/parsers/recently-viewed-parser',
    'global/parsers/cart-item-parser',
    'global/parsers/related-products'
],
function($, BaseView, template, translator, orderSummaryParser, recentlyViewedParser, cartItemParser, relatedProductsParser) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'cart',
            pageTitle: function() {
                return $('#mainContent').children('h1').attr('title');
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            requiredLabels: function() {
                return $('#gwt_order_item_uber_disp_strings');
            },
            qtyForm: function() {
                return $('#ItemQuantityUpdateForm');
            },
            promoCodeForm: function() {
                return $('#PromotionCodeForm');
            },
            estimateShippingForm: function() {
                return $('#EstimateShippingForm');
            },
            giftFlagForm: function() {
                return $('#ItemGiftFlagUpdateForm');
            },
            cartForm: function() {
                return $('#ShopCartForm');
            },
            emptyCart: function(context) {
                if (!context.cartForm.length) {
                    var $contShoppingButton = $('.button.secondary');
                    $contShoppingButton.find('span').html(translator.translate('continue_shopping_cart'));
                    return {
                        continueShoppingButton: $contShoppingButton.addClass('c-button c--full-width c--outline u-margin-bottom-md'),
                    };
                }
            },
            analyticsData: function(context) {
                return context.cartForm.find('#analyticsDataShop5');
            },
            hiddenInputs: function(context) {
                return context.cartForm.find('input[type="hidden"]');
            },
            cartItems: function(context) {
                return cartItemParser.parse(context.cartForm.find('.itemline'));
            },
            cartCount: function(context) {
                return context.cartItems.length;
            },
            ctas: function(context) {
                var $checkoutButton = context.cartForm.find('.button.primary');
                var $contShoppingButton = context.cartForm.find('.button.secondary');

                $checkoutButton.addClass('c-button c--primary c--full-width u-margin-bottom-sm');
                $contShoppingButton.addClass('c-button c-continue-shopping c--outline c--full-width c--primary');

                $checkoutButton.find('span').append(' >');
                $contShoppingButton.find('span').html(translator.translate('continue_shopping_cart'));
                return {
                    checkoutButton: $checkoutButton,
                    continueShoppingButton: $contShoppingButton
                };
            },
            totals: function(context) {
                var $totalsContainer = context.cartForm.find('.totals');
                var $grandTotal =  $totalsContainer.find('.totalPrice').remove();
                return orderSummaryParser.parse($totalsContainer.find('table'), $grandTotal, context.cartForm.find('.promoCode'));
            },
            relatedProducts: function() {
                return relatedProductsParser.parse($('#br_related_products'));
            },
            mayAlsoLike: function() {
                return $('#gwt_recommendations_cart_1');
            },
            recentlyViewedProducts: function() {
                return recentlyViewedParser.parse($('#gwt_recently_viewed'), $('#gwt_international_conversion_rate'), $('#gwt_international_currency_indicator'));
            },
            errorMessages: function() {
                return $('#gwt-error-placement-div, .error').addClass('u-text-error');
            }
        }

    };
});
