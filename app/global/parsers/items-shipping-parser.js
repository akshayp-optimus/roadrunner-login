define([
    '$',
    'translator',
    'global/parsers/cart-item-parser',
    'global/parsers/address-parser'
], function($, translator, cartItemParser, addressParser) {

    var _parse = function($orderItems, orderedItemCount) {
        var orderDetails = [];
        $orderItems.each(function(i, orderItem) {
            var $orderItem = $(orderItem);
            var $menuBar = $orderItem.find('[id*="gwt_dropdownmenu"]').remove();
            var itemDetails = cartItemParser.parse($orderItem)[0];
            var $address = $orderItem.closest('table').prev('.line').remove();
            var qtyCount = parseInt($orderItem.find('.qty').text()) || '';
            $menuBar.find('.menu_header').addClass('js-menu-title');

            itemDetails.quantity.count = qtyCount;

            if ($('.unit.size2of4').length) {
                $address = $('.unit.size2of4').remove();
            }

            if (!$address.length && orderDetails.length) {
                // add to the most recent order collection
                var shippingGroup = orderDetails[orderDetails.length - 1];
                shippingGroup.items = shippingGroup.items.concat(itemDetails);
            } else {
                orderDetails.push({
                    address: $address.length ? addressParser.parse($address) : false,
                    menuBar: $menuBar,
                    items: [itemDetails],
                    orderedItemCount: orderedItemCount
                });
            }
        });

        return orderDetails;
    };

    return {
        parse: _parse
    };
});
