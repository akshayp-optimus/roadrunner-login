define([
    '$',
    'global/baseView',
    'dust!pages/international-returns/international-returns',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, Translator, Utils, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.addClass('u-margin-top-md');
        $pageInfo.find('h2').remove();
        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'international-returns',
            pageTitle: function() {
                return $('#page-container').find('h2').text();
            },
            pageContainer: function() {
                return getPageData();
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            }
        }
    };
});
