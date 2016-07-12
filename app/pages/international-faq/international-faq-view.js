define([
    '$',
    'global/baseView',
    'dust!pages/international-faq/international-faq',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, Translator, Utils, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('br').remove();
        $pageInfo.find('table p').addClass('u-margin-bottom-0 u-padding-start-sm');
        $pageInfo.find('table tr').addClass('u-padding-left-extra-tight c-table-rows u-no-border');
        $pageInfo.find('table').find('tr').first().addClass('u-padding-left-extra-tight u-border-bottom');
        $pageInfo.find('table td').addClass('u-padding-left u--tight u-no-border');
        $pageInfo.find('table').addClass('u-padding-left-extra-tight u-padding-top u-border-grey');
        $pageInfo.find('h3').addClass('u-margin-bottom-sm');
        $pageInfo.find('table strong').addClass('c-main-rows');
        $pageInfo.find('table').addClass('u-padding-left-extra-tight u-border-grey');
        $pageInfo.find('strong').addClass('u--show u-margin-bottom-md u-margin-top-md');
        $pageInfo.find('h2').remove();
        $('.c-main-rows').closest('tr').addClass('c-table-headings u-no-background');
        $pageInfo.find('.c-main-rows').removeClass('u-margin-top-md u-margin-bottom-md');
        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'international-faq',
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
