define([
    '$',
    'global/baseView',
    'dust!pages/shipping-information/shipping-information',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, Translator, Utils, breadcrumbParser) {
    var getPageData = function() {
        var $pageInfo = $('#page-container');
        $pageInfo.find('br').remove();

        $pageInfo.find('h3').addClass('u-margin-bottom-sm');
        $pageInfo.find('div').addClass('u-margin-top-lg u-padding-bottom-sm');
        $pageInfo.find('table').addClass('t-shipping-information-page__table');
        $pageInfo.find('td').attr('style', null); // Remove inline style

        var $lastTable = $pageInfo.find('table').last(); // last table
        var $lastTwoRows = $lastTable.find('tr:nth-last-of-type(-n+2)'); // last two rows of last table

        $lastTwoRows.remove(); // remove last two rows in last table

        var $lastTwoRowsTable = $('<table class="t-shipping-information-page__table">').append($('<tbody>').html($lastTwoRows)); // new table with last two rows

        $lastTable.after().append($lastTwoRowsTable); // append new table after last table

        return $pageInfo;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'shipping-information',
            pageTitle: function() {
                return $('.inner').text();
            },
            pageContainer: function() {
                return getPageData();
            },
            leftNav: function() {
                return $('#sideBox');
            }
        }
    };
});
