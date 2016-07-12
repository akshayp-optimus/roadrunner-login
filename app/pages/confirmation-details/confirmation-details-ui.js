define([
    '$',
    'global/ui/cart-item-ui',
    'components/sheet/sheet-ui',
    'global/ui/tooltip-ui',
    'global/ui/carousel-ui'
],
function($, cartItemUI, sheet, tooltipUI, carouselUI) {

    var confirmationDetailsUI = function() {
        cartItemUI();
        tooltipUI();
        carouselUI.init($('#gwt_recommendations_order_confirmation_display_1'));
    };

    return confirmationDetailsUI;
});
