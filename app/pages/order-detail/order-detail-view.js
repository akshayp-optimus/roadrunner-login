/**
 * Customer Service View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/order-detail/order-detail',
    'pages/order-detail/parsers/order-detail__order-info'
],
function($, baseView, template, orderInfoParser) {

    var getTrackingClass = function($tracking) {
        var trackingClass;
        if (!$tracking.text().length) {
            return;
        }

        return $tracking.text().match(/cancelled/gi) ? 'u-text-error' : false;
        return $tracking.text().match(/success/gi) ? 'u-text-success' : false;

    };

    // Get details of items placed
    var getOrderedItems = function($items) {
        return $items.map(function(_, item) {
            var $item = $(item);
            var $tracking = $item.find('.tracking');

            return {
                productName: $item.find('.colProd').text(),
                quantity: $item.find('.qty'),
                tracking: $tracking,
                trackingClass: getTrackingClass($tracking),
                shippingMethod: $item.find('.shipmethod'),
                price: $item.find('.totals')
            };
        });
    };

    // Get order summary
    var getOrderSummary = function($container) {
        $container.find('.colProd').remove();
        return $container.find('tr').map(function(_, item) {
            var $item = $(item);

            return {
                label: $item.find('td:first').text(),
                value: $item.find('.totals').text()
            };
        });
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'order-detail',
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            orderInfo: function() {
                return orderInfoParser.parse($('.orderSummary'));
            },
            orderedItems: function() {
                return getOrderedItems($('.orderstatus').find('tbody .prod'));
            },
            priceDislaimer: function() {
                var $priceDislaimer = $('.pricedisclaimerindicatorrow').remove();
                return $priceDislaimer.find('td').html();
            },
            orderSummary: function() {
                return getOrderSummary($('.orderstatus').find('tfoot'));
            }
        }
    };
});
