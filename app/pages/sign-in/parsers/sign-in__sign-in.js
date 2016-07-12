define([
    '$',
    'translator',
    'components/button/parsers/button'
], function($, Translator, buttonParser) {

    // TODO: Move this in component
    // Get label and inputs
    var getFormFields = function($form) {
        return $form.find('.spot').map( function(_, item) {
            var $self = $(item);
            if (!$self.children().length) {
                return;
            }
            return {
                label: $self.find('label'),
                input: $self.find('input').addClass('c-input c-arrange__item'),
                formScript: $self.find('script')
            };
        });
    };

    // Get Remember Me checkbox, content and hidden elements
    var getRememberMe = function($rememberMe) {
        // $rememberMe.children('input').addClass('dfdf');
        var $rememberMeAnchor = $rememberMe.children('a');
        return {
            checkbox: $rememberMe.children('input'),
            rememberMeText: Translator.translate('remember_me'),
            rememberMeLink: $rememberMeAnchor.text(''),
            hiddenDiv: $rememberMe.children('#rememberMeDescriptionPopup')
        };
    };

    var _parse = function($form) {
        var $submitButtonWrapper = $form.find('.actions').remove();
        var $submitButton = $submitButtonWrapper.find('#logonButton');
        var $arrowIcon = $('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>');
        var buttonText = $submitButton.text();
        $submitButton.find('span').text(buttonText)
            .append(' >');
        // Add class for styling to submit button
        $submitButtonWrapper.addClass('c-field-row');
        $submitButton.addClass('c-button c--primary c--full-width');

        // Hide the please wait div as not required on page
        $submitButtonWrapper.find('#pleaseWait').addClass('u--hide');

        $form.find('label').map(function(i, item) {
            var $label = $(item);
            $label.attr('data-label', $label.text().replace('*', ''));
        });

        return {
            form: $form,
            welcomeMsg: $form.parent().find('.inst-copy').first().addClass('u-margin-bottom-md c-welcome-message'),
            hiddenFields: $form.find('input[type="hidden"]'),
            signInButton: $submitButtonWrapper,
            rememberMe: getRememberMe($form.find('.rememberMe').remove()),
            forgotPassword: $('#gwt_forgot_password_params').add($('#forgotpw')),
            formField: getFormFields($form)
        };
    };

    return {
        parse: _parse
    };
});
