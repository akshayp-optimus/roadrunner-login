/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/address-book/address-book',
    'components/breadcrumb/parsers/breadcrumb'

],
function($, BaseView, template, BreadcrumbParser) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'address-book',
            breadcrumbLink: function() {
                // TODO: BreadcrumbParser should be in camel case
                return BreadcrumbParser.parse($('#myAccount'));
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.upper').text();
            },
            hiddenInputs: function() {
                return $('input[type="hidden"]');
            },
            hiddenData: function() {
                return $('div[id*="gwt"]');
            },
            addressContainer: function() {
                return $('#gwt_address_display_panel');
            },
            addNewButton: function() {
                return $('.gwt-addrbk-btnpanel');
            }
        }
    };
});
