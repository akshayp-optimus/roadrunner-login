define([
    '$',
    'global/baseView',
    'dust!pages/returns-exchanges/returns-exchanges',
    'components/breadcrumb/parsers/breadcrumb'

],
function($, BaseView, template, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('img').removeAttr('align').addClass('u-align-image-center u-no-border u-margin-bottom-sm');
        $pageInfo.find('p').find('br').first().replaceWith('<p/>');
        $pageInfo.find('h3').addClass('u-margin-bottom-md');
        $pageInfo.find('ol.simpleList li ').addClass('c-return-and-exchanges-list-items');
        $pageInfo.find('strong:contains(OPTION 1:)').addClass('c-option');
        $pageInfo.find('strong:contains(NOTE)').addClass('u--normal');
        $pageInfo.find('p:contains(OPTION)').addClass('u-margin-bottom-xs-sm');
        $pageInfo.find('h3:contains((Truck Delivery))').addClass('c-truck-option');
        $pageInfo.find('a').addClass('u--bold');
        $pageInfo.find('h3').addClass('c-heading c--4');
        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'returns-exchanges',
            pageTitle: function() {
                return $('.inner').text();
            },
            pageData: function() {
                return getPageData();
            },
            leftNav: function() {
                return $('#sideBox');
            }
        }
    };
});
