define([
    '$',
    'global/utils',
    'dust!pages/order-history/partials/order-history-list',
], function($, Utils, OrderListTmpl) {
    var $orderListContainer = $('.js-order-history');

    var _transformOrderHistory = function(orderHistoryContainer) {
        var $orderHistoryContainer = $(orderHistoryContainer);
        var $orderRows = $orderHistoryContainer.find('tr').filter(function() {
            return $(this).children('.gwt-order-history-widget-order').length;
        });

        var orderListObj = $orderRows.map(function(_, order) {
            var $order = $(this);
            return {
                orderNumber: $order.find('.gwt-order-history-widget-order').text(),
                orderDate: $order.find('.gwt-order-history-widget-date').text(),
                href: $order.find('.gwt-order-history-widget-order').find('a').attr('href')
            };
        });

        var data = {
            orderList: orderListObj
        };

        new OrderListTmpl(data, function(err, html) {
            $('.js-loader').attr('hidden', 'hidden');
            $orderListContainer.html($(html));
        });
    };

    var animationListener = function() {
        if (event.animationName === 'orderHistoryData') {
            _transformOrderHistory($('.gwt-order-history-widget-mainPanel'));
        }
    };

    var accountOrderHistoryUI = function() {
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return accountOrderHistoryUI;
});
