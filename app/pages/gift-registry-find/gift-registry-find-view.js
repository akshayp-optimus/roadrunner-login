define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-find/gift-registry-find'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'gift-registry-find',
            pageTitle: function() {
                return $('.gr_search_header_title').text();
            },
            pageSubTitle: function() {
                return $('.data.gift-registry-search').find('.inst-copy').next().text();
            },
            errors: function() {
                return $('.gwt-error-placement-div');
            },
            findRegistryByName: function() {
                return $('#giftRegSearchFormPanel');
            },
            findRegistryByNumber: function() {
                return $('#giftRegIdPanel');
            }
        }
    };
});
