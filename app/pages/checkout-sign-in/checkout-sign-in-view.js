define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-sign-in/checkout-sign-in',
    'translator'
],
function($, BaseView, template, translator) {
    var _getField = function($container) {
        return {
            input: $container.find('input'),
            inputScript: $container.find('script'),
            label: $container.find('label').addClass('c-field__label')
        };
    };

    var _parseRememberMe = function($container) {
        var $input = $container.find('input');
        var $tooltip = $container.find('.rememberMeDescriptionPopup');

        $tooltip.find('b').first().remove();
        $tooltip.find('br').remove();

        return {
            input: $input,
            text: $container.find('.rememberMeLink').text().replace('on this computer', ''),
            labelFor: $input.attr('id'),
            tooltipContent: $tooltip,
            rememberMeLink: $container.children('a').removeAttr('onclick').text('')
        };
    };

    var _transformContinueButton = function($button) {
        $button.addClass('c-button c--primary c--full-width');
        var buttonText = $button.text();
        $button.find('span').text(buttonText)
            .append(' >');
        return $button;
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'checkout-sign-in',
            pageTitle: function() {
                return $('.signIn.checkout').find('> h3').text();
            },
            errorContainer: function() {
                return $('#gwt-error-placement-div').addClass('u-visually-hidden');
            },
            forgotPasswordParams: function() {
                return $('#gwt_forgot_password_params');
            },
            loginForm: function() {
                var $form = $('#userLogonForm');
                var $loginButton = $form.find('#logonButton');
                var buttonText = $loginButton.text();
                $loginButton.find('span').text(buttonText)
                    .append(' >');

                $form.find('label').map(function(i, item) {
                    var $label = $(item);
                    $label.attr('data-label', $label.text().replace('*', ''));
                });

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    email: _getField($form.find('.logonId')),
                    password: _getField($form.find('.password')),
                    rememberMe: _parseRememberMe($form.find('.rememberMe')),
                    forgotPW: $form.find('#forgotpw').addClass('c-field__info'),
                    loginButton: $loginButton.addClass('c-button c--primary c--full-width')
                };
            },
            guestLoginForm: function() {
                var $form = $('#guestLogon');
                var $formDescription = $form.find('.registration');

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    heading: $formDescription.find('> h3').addClass('c-guest-checkout-heading u-padding-bottom u--tight'),
                    descriptionText: $formDescription.find('> div').first(),
                    createAccountButton: _transformContinueButton($form.find('.button.primary'))
                };
            }
        }
    };
});
