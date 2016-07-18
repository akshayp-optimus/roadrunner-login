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
                var $buttonName = $('#login_box');
                $buttonName.find('#loginEmail1').attr('type', 'email');
                // $buttonName.find('.login-button').attr('value', 'Continue');
                return $buttonName;
            },
            signInMessage: function() {
                return $('#main_message').find('h1');
            },
            form: function() {
                var $changeButtonName = $('form[name="register"]');
                $changeButtonName.find('#guestEmailId').attr('type', 'email');
                // $changeButtonName.find('.login-button').attr('value', 'Continue');
                $changeButtonName.find('.login-button').parent().addClass('u-padding-bottom u--tight');
                return $changeButtonName;
            },
            vipImage: function() {
                return $('#vip_callout');
            }
        }
    };
});
