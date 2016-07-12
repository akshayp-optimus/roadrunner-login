/**
 * Customer Service View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/international-customer-service/international-customer-service',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, baseView, template, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#intcontact');
        $pageInfo.find('h3').addClass('u-margin-bottom-sm c-international-contact-heading u-margin-top-md');
        $pageInfo.find('.column.int-details:not(:last)').find('.continfo').addClass('u-margin-bottom-0 u-padding-bottom u--tight u-border-bottom-light-grey');
        $pageInfo.find('.column.int-details:not(:last)').find('br').remove();
        $pageInfo.find('strong').addClass('u--normal');
        $pageInfo.find('a').addClass('u--bold');
        return $pageInfo;
    };
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'international-customer-service',
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            },
            pageTitle: function() {
                return $('#page-container h2').text();
            },
            img: function() {
                return $('.slide').find('img');
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
