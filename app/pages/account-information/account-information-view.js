/**
 * Account Information View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/account-information/account-information'
],
function($, baseView, template) {

    var transformContainer = function($container) {
        $container.find('#gwt_billaddr_panel').addClass('js-form-container');
        $container.find('#gwt_shipaddr_panel').addClass('js-form-container');

        $container.find('#gwt_sameasbilling_cb').addClass('u-margin-top-sm');

        return $container;
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'account-information',
            hiddenForm: function() {
                return $('#gwt_view_name').parent();
            },
            accountInfoContainer: function() {
                return transformContainer($('.account_info'));
            },
            pageInfo: function(context) {
                return context.accountInfoContainer.find('.inst-copy').remove();
            },
            hiddenLabels: function() {
                // Labels needed for desktop JS
                return $('#mainContent').children('.nodisplay, [id^="gwt_errmsg"], [id$="label"]');
            }
        }
    };
});
