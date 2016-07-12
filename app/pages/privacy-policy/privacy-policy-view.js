define([
    '$',
    'global/baseView',
    'dust!pages/privacy-policy/privacy-policy',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb',
],
function($, BaseView, template, Translator, Utils, breadcrumbParser) {

    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('h3').addClass('u-margin-bottom-md');
        $pageInfo.find('a').addClass('u--bold');
        $pageInfo.find('p:contains(© 2008)').addClass('u-margin-top-md');
        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'privacy-policy',
            pageTitle: function() {
                return $('.inner').text();
            },
            pageDescription: function() {
                return getPageData();
            },
            leftNav: function() {
                return $('#sideBox');
            }
        }
    };
});
