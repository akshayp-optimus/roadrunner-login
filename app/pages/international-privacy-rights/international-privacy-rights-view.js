define([
    '$',
    'global/baseView',
    'dust!pages/international-privacy-rights/international-privacy-rights',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb',
],
function($, BaseView, template, Translator, Utils, breadcrumbParser) {

    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('h3').addClass('c-international-privacy-right-heading u-margin-top-md u-margin-bottom-md');
        $pageInfo.find('h2').first().remove();
        $pageInfo.find('a').addClass('u--bold');
        $pageInfo.find('strong').addClass('u--show');
        $pageInfo.find('strong:contains(contact points:)').addClass('u-margin-bottom-ng-md u-margin-top-ng-md');
        $pageInfo.find('strong').last().addClass('u-margin-bottom-md u-margin-top-md');
        $pageInfo.find('br:eq(12)').replaceWith('<p/>');
        $pageInfo.find('br:eq(13)').replaceWith('<p/>');
        $pageInfo.find('br').slice(3, 6).replaceWith('<p/>');
        $pageInfo.find('br:last').replaceWith('<p/>');
        $pageInfo.find('li').find('br:first').replaceWith('<p/>');
        $pageInfo.find('strong:contains(Web Beacons)').addClass('u-margin-bottom-sm u-margin-top-sm');
        $pageInfo.find('strong:contains(Cookies)').addClass('u-margin-bottom-sm');
        $pageInfo.find('li').find('strong:contains(Cookies)').addClass('u-margin-bottom-0');
        $pageInfo.find('br:not(li > br)').remove();
        $pageInfo.find('a:last').addClass('u--show u-margin-bottom-md');
        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'international-privacy-rights',
            pageTitle: function() {
                return $('#page-container').find('h2').first().text();
            },
            pageDescription: function() {
                return getPageData();
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            }
        }
    };
});
