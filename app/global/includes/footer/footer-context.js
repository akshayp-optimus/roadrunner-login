define([
    '$',
    'translator',
    'global/includes/footer/parsers/footer-accordion'
],

function($, translator, bellowsParser) {

    var parseIcons = function($socialElement, iconName) {
        return {
            href: $socialElement.attr('href'),
            altName: $socialElement.find('img').attr('alt'),
            iconName: iconName,
            className: 'c-social-links'
        };
    };

    var getEmailSubscription = function() {
        var $emailSubscription = $('#EmailSignUpForm');
        var $emailSigUpInputField = $emailSubscription.find('#emailSignUp').attr('type', 'email');
        $emailSigUpInputField.removeAttr('value');
        $emailSigUpInputField.attr('placeholder', translator.translate('email-address')).addClass('c-email-subscription-placeholder');
        return {
            form: $emailSubscription,
            hiddenFields: $emailSubscription.find('[type="hidden"]'),
            emailFieldLabel: $emailSubscription.find('#emailSignUp'),
            emailFieldInput: $emailSubscription.find('.button')
                .text(translator.translate('sign-up')).addClass('c-input-field-button c--is-disabled'),
            label: $emailSubscription.find('#emailSignUp_label')
        };
    };

    return {
        context: {
            footerCopyRightText: function() {
                return $('#copyright .cr').text();
            },
            footerSiteMap: function() {
                return $('#copyright li:first-child a');
            },
            footerLinksSection: function() {
                return bellowsParser.parse();
            },
            socialLinks: function() {
                var $icons = $('.footerSocial [class^="socialIcon"]').not(':last');

                var $socialLinks = $icons.map(function() {
                    var $icon = $(this);
                    var type = $icon.attr('class').replace('socialIcon', '').toLowerCase();
                    return parseIcons($icon, type);
                });

                return {
                    links: $socialLinks,
                    className: 'c-social-links'
                };
            },
            emailSubscriptionHeading: function() {
                return $('#emailSignUp').attr('value');
            },
            emailSubscriptionFields: function() {
                return getEmailSubscription();
            },
            sourceCode: function() {
                return $('#display_source_code').text();
            },
            hiddenCountryFields: function() {
                return $('#container').children('input[type="hidden"]');
            }
        }
    };
});
