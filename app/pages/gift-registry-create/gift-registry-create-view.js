define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-create/gift-registry-create',
    'components/need-help/parsers/need-help'

],
function($, BaseView, template, needHelpParser) {
    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'gift-registry-create',
            hiddenData: function() {
                return $('input[type="hidden"], .nodisplay, .breadcrumbs, #gwt_user_state');
            },
            formContent: function() {
                return $('#giftRegistryVisitView').addClass('c-form-group');
            },
            needHelpSection: function() {
                return needHelpParser.parse($('.giftRegistryCreate_header_second'));
            }
        }
    };
});
