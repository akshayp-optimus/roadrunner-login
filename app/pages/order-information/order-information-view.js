define([
    '$',
    'global/baseView',
    'dust!pages/order-information/order-information',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('> h3').addClass('c-order-info-heading u-margin-bottom-sm');
        $pageInfo.find('> p').addClass('c-order-info-details');
        $('.c-order-info-details a').addClass('u--bold');
        $pageInfo.find('h3').last().addClass('c-grandin-road-title u-default-font-size u--bold');
        $pageInfo.find('.address').last().addClass('c-grandin-road-address');
        return $pageInfo;
    };
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'order-information',

            pageTitle: function() {
                return $('.inner').text();
            },
            pageData: function() {
                return getPageData();
            },
            leftNav: function() {
                return $('#sideBox');
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            }
        }
    };
});
