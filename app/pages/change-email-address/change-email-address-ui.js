define([
    '$',
    'global/ui/handle-form-fields'
],
function($, handleFormFieldsUI) {

    var changeEmailAddresssUI = function() {

        //  Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();
        handleFormFieldsUI.inputsHandler();
    };

    return changeEmailAddresssUI;

});
