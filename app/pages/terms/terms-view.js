define([
    '$',
    'global/baseView',
    'dust!pages/terms/terms',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, breadcrumbParser) {
    var getpageData = function() {
        var $pageData = $('.data');
        $pageData.find('p').find('br').first().replaceWith('<div/>');
        $pageData.find('strong').addClass('u-margin-top-ng-gt-md u-margin-bottom-ng-extra-lg');
        $pageData.find('br').first().remove();
        $pageData.find('h2').remove();
        return $pageData;
    };
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'terms',
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            },
            pageTitle: function() {
                return $('.data').find('h2').text();
            },
            block: function() {
                return getpageData();
            },

            // breadcrumbLink: function() {
            //     return breadcrumbParser.parse($('#sideBoxHeader a'));
            // }
        }
    };
});
