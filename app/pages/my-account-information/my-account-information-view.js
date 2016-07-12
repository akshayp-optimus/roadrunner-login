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
                var $container =  $('.container_nh').last().find('table').parent('td[class*="regform"]')
                .find('> table:nth-child(1)').find('tbody tr:nth-of-type(2)');
                $container.find('img').remove();
                return $container.map(function(_, item) {
                    var $item = $(item);
                    return {
                        fitness: $item.find('td:nth-of-type(2)')
                    };
                });
            },
            unsubscribeEmail: function() {
                var $newsletter = $('#unsubscribeform');
                $newsletter.find('#newsletterSignupBtn').remove();
                return $newsletter;
            }
        }
    };
});
