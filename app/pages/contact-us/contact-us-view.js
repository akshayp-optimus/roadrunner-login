/**
 * Customer Service View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/contact-us/contact-us',
    'pages/contact-us/parsers/contact-us-bellows',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, baseView, template, bellowsParser, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.addClass('u-margin-top-md');
        $('#page-container > p').first().remove();
        $('#page-container > h3').first().remove();
        $pageInfo.find('.contact-section').remove();
        $('#page-container > h2').addClass('c-heading c--3');
        $('#page-container > h3').addClass('c-heading c--3');
        $pageInfo.find('.c--3').addClass('u-margin-bottom-md');
        $pageInfo.find('.store-details > h3').addClass('u-default-font-size u-margin-bottom-sm');
        $pageInfo.find('a').addClass('u--bold');
        return $pageInfo;
    };
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'contact-us',
            pageTitle: function() {
                return $('.inner').text();
            },
            pageIntroduction: function() {
                return $('#page-container > p').first();
            },
            contactInfoHeading: function() {
                return $('#page-container > h3').first().text();
            },
            contactInfoSection: function() {
                return bellowsParser.parse();
            },
            leftNav: function() {
                return $('#sideBox');
            },
            pageData: function() {
                return getPageData();
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            }
        }
    };
});
