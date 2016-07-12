define([
    '$',
    'global/ui/handle-form-fields'
],
function($, handleFormFieldsUI) {

    var changePasswordUI = function() {

        //  Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();
        handleFormFieldsUI.inputsHandler();
    };

    return changePasswordUI;

});
