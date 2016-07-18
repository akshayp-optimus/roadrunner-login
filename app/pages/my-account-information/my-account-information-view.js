/**
 * Account login View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/my-account-information/my-account-information'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'my-account-information',
            accountHeading: function() {
                return $('.moduleheader');
            },
            pageHint: function() {
                return $('span.regform');
            },
            editProfile: function() {
                var $edit = $('.regform_indent').find('.orangetext').parents('.user_cell');
                var $newsletter = $('#unsubscribeform');
                $newsletter.find('#newsletterSignupBtn').remove();
                $newsletter.addClass('c-unsubscribe');
                $edit.find('img').remove();
                $edit.find('br').remove();
                $edit.html($edit.html().replace(/&gt;/g, ''));
                $newsletter.html($newsletter.html().replace(/&gt;/g, ''));
                $edit.html($edit.html().replace(/&nbsp;/g, ''));
                $edit.contents().filter(function() {
                    return this.nodeType === 3 && this.textContent.trim() !== '';
                }).first().remove();
                $edit.find('a:not(:first):not(:last)').append(' >');
                $newsletter.insertAfter($edit.find('a:contains(Join now and save!)'));
                $newsletter.find('br').remove();
                $newsletter.find('a').append('>');
                return  $edit;
            },
            fitnessProfile: function() {
                var $profile = $('table').find('b:contains(Fitness Profile)').parents('.user_cell');
                $profile.contents().filter(function() {
                    return this.nodeType === 3;
                }).wrap('<span class="c-boldText"></span>');
                $profile.find('br').remove();
                $profile.find('img').remove();
                return $profile;
            },
            shoppingHistory: function() {
                var $shopping = $('table').find('b:contains(Shopping History)').parents('.user_cell');
                $shopping.find('img').remove();
                return $shopping;
            }
        }
    };
});
