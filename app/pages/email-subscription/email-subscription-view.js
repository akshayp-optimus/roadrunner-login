/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/email-subscription/email-subscription'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'email-subscription',
            heading: function() {
                return $('.custom').attr('title');
            },
            subscriptionContent: function() {
                return $('.data').find('p:last-of-type').remove().end().find('p:not(:first-of-type), ul');
            },
            subscriptionForm: function() {
                return $('.emailSubscribeIframe');
            },
            disclaimerInfo: function() {
                return $('.disclaimer');
            }
        }
    };
});
