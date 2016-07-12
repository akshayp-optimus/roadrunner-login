/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/my-account-landing/my-account-landing'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'my-account-landing',
            img: function() {
                return $('#bottomEspot').find('img');
            },
            changepasswordMessage: function() {
                return $('#mainContent .reset-password-msg').addClass('u-text-success');
            },
            welcomeMessage: function() {
                return $('.inst-copy').first();
            },
            myAcountLandingItems: function() {
                return $('#sideBox')
                                .addClass('c-my-account-landing-items')
                            .find('.header')
                                .remove()
                            .end()
                            .find('> ul > li:last')
                                .remove()
                            .end();
            }
        }
    };
});
