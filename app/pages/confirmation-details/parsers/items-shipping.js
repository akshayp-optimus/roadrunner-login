define([
    '$',
    'translator',
    'global/parsers/cart-item-parser',
    'global/parsers/address-parser'
], function($, translator, cartItemParser, addressParser) {

    var _parse = function($orderItems, isButton) {
        var orderDetails = [];
        $orderItems.each(function(i, orderItem) {
            var $orderItem = $(orderItem);
            var $menuBar = $orderItem.find('[id*="gwt_dropdownmenu"]').remove();
            var itemDetails = cartItemParser.parse($orderItem)[0];
            var $address = $orderItem.closest('table').prev('.line').remove();
            var $shipping = $orderItem.find('.shipMethod');
            var qtyCount = parseInt($orderItem.find('.qty').text()) || '';

            itemDetails.quantity.count = qtyCount;

            if ($('.od-shipping').length) {
                $address = $('.od-shipping').remove();
            }

            $menuBar.find('.menu_header').addClass('js-menu-title');

            if (!$address.length && orderDetails.length) {
                // add to the most recent order collection
                var shippingGroup = orderDetails[orderDetails.length - 1];
                shippingGroup.items = shippingGroup.items.concat(itemDetails);
            } else {
                var $detailsLink = $shipping.find('[id*="detShipInfoLink"]');
                var $shippingSelect = $shipping.find('[id*="shipModeId"]');
                orderDetails.push({
                    address: $address.length ? addressParser.parse($address, false, isButton) : false,
                    menuBar: $menuBar,
                    items: [itemDetails]
                });
            }
        });

        return orderDetails;
    };

    return {
        parse: _parse
    };
});
