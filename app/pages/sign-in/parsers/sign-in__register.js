define(['$'], function($) {

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
                input: $self.find('input'),
                formScript: $self.find('script')
            };
        });
    };

    // Get Remember Me checkbox and content
    var getRememberMe = function($rememberMe) {
        $rememberMe.children('input').addClass('dfdf');

        return $rememberMe;
    };

    // TODO: Move this in utils
    // Get Button Attributes
    var getButtonAttr = function($button) {
        return {
            buttonId: $button.attr('id'),
            buttonType: $button.attr('type'),
            buttonText: $button.text().trim()
        };
    };

    var _parse = function($form) {
        var $button = $form.find('button').remove();
        var buttonText = $button.text();
        $button.find('span').text(buttonText)
            .append(' >');
        var $content = $form.find('.contentspot').find('p,ul');
        $content.addClass('t-sign-in__registration-list');
        $content.find('li').find('strong')
            .prepend('<svg class="c-icon" data-fallback="img/png/check.png"><title>check</title><use xlink:href="#icon-check"></use></svg>');
        return {
            form: $form,
            welcomeMsg: $form.find('.inst-copy').addClass('c-welcome-message'),
            hiddenFields: $form.find('input[type="hidden"]'),
            registerButton: getButtonAttr($button),
            registerContent: $content
        };
    };

    return {
        parse: _parse
    };
});
