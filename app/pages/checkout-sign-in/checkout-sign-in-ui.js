define([
    '$',
    'global/ui/forgot-password',
    'global/ui/handle-form-fields'
], function($, forgotPasswordUI, handleFormFieldsUI) {
    var _overrideDesktop = function() {
        var _desktopSubmit = window.submitUserLogon;

        window.submitUserLogon = function() {
            var result = _desktopSubmit.apply(this, arguments);

            $('.js-signin-button button').addClass('c-button c--full-width c--primary');

            return result;
        };
    };

    var checkoutSignInUI = function() {
        forgotPasswordUI();
        _overrideDesktop();
        // Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();
    };

    return checkoutSignInUI;
});
