/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/email-un-subscription/email-un-subscription'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'email-un-subscription',
            subscriptionContent: function() {
                return $('.genericESpot').find('p').first();
            },
            subscriptionForm: function() {
                return $('.emailUnsubscribeIframe');
            },
            preferenceGuideLine: function() {
                return $('#bottomEspot').find('p:first');
            },
            disclaimerInfo: function() {
                return $('.disclaimer');
            }
        }
    };
});
