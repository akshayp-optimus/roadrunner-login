define([
    '$',
    'global/ui/handle-form-fields'
],
function($, handleFormFieldsUI) {

    var overrideDesktopScripts = function() {
        $('#continue').text($('#continue').text()).append(' >');
        var desktopSubmitUserRegistration = window.submitUserRegistration;
        window.submitUserRegistration = function() {
            var result = desktopSubmitUserRegistration.apply(this, arguments);
            $('.button.primary').removeAttr('disabled');
            return result;
        };
    };

    var registerUI = function() {
        overrideDesktopScripts();

        //  Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();
        handleFormFieldsUI.inputsHandler();
    };

    return registerUI;

});
