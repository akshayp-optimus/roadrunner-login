define([
    '$',
    'global/baseView',
    'dust!pages/order-history/order-history',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, breadCrumbParser) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'order-history',
            breadcrumbLink: function() {
                return breadCrumbParser.parse($('#myAccount'));
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.inst-copy').addClass('c-intro-text');
            },
            orderHistory: function() {
                return {
                    orderHistoryContainer: $('#orderHistory'),
                    fallbackMessage: $('#gwt_order_history_div')
                };
            }
        }
    };
});
