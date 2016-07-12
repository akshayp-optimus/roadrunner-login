/**
 * Account login View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/account-login/account-login'
],
function($, baseView, template) {


    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'account-login',
            loginBox: function() {
                return $('#login_box');
            },
            signInModule: function() {
                return $('#signin');
            }
        }
    };
});
