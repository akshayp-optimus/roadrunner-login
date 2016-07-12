define([
    '$',
    'global/baseView',
    'dust!pages/account-cc-info/account-cc-info',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, BreadcrumbParser) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-cc-info',
            breadcrumbLink: function() {
                return BreadcrumbParser.parse($('#myAccount'));
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            creditCard: function() {
                return {
                    methodLabel: $('.spot:eq(0) label'),
                    method: $('.spot:eq(0) span'),
                    cardNumberLabel: $('.spot:eq(1) label'),
                    number: $('.spot:eq(1) span'),
                    expLabel: $('.spot:eq(2) label'),
                    expDate: $('.spot:eq(2) span'),
                    links: $('.form a').addClass('c-button c--primary c--full-width')
                };
            }
        }
    };
});
