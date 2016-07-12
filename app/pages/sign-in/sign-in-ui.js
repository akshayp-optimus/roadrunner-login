define([
    '$',
    'components/tabs/tabs-ui',
    'components/sheet/sheet-ui',
    'external!translator',
    'global/ui/forgot-password',
    'global/ui/handle-form-fields'
], function($, tabs, sheet, Translator, forgotPasswordUI, handleFormFieldsUI) {
    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');

    var overrideSubmitUserLogon = function() {
        var desktopSubmitUserLogon = window.submitUserLogon;
        window.submitUserLogon = function() {
            var result = desktopSubmitUserLogon.apply(this, arguments);

            // Reapply styles to the button and password label
            $('[for="logonPassword"]').addClass('c-arrange__item');
            $('#logonButton').addClass('c-button c--full-width c--primary');
            $('#logonButton').removeAttr('style');
            $('#logonButton').removeAttr('disabled');

            // If there are no validation errors then we want to show the loader
            if (result) {
                $('#logonButton').html($loader);
            }

            return result;
        };
    };

    var overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);
            var $errorPopup = $('#gwt-error-placement-div').attr('hidden', 'hidden');
            var $inputLabel = $('.c-form-group').find('label').not('.errortxt');
            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));

            $('.errortxt').addClass('c-field__label').parents('.c-field').addClass('c--error');
            $('.errortxt').parents('.c-box-row').addClass('c--error-row');
            if (!$inputLabel.hasClass('errortxt')) {
                $inputLabel.parents('.c-box-row').removeClass('c--error-row');
            }

            return result;
        };
    };

    var signInUI = function() {
        tabs.init();
        forgotPasswordUI();

        // Override the submit events right before they occur
        var $logonForm = $('#userLogonForm');
        var originalOnSubmit = $logonForm[0].onsubmit;
        var logonFunctionsOverridden = false;

        $logonForm[0].onsubmit = null;

        $logonForm.submit(function() {
            if (!logonFunctionsOverridden) {
                overrideSubmitUserLogon();
                overrideShowErrors();
                logonFunctionsOverridden = true;
            }

            return originalOnSubmit.call(this);
        });

        // Update placeholders in inputs
        handleFormFieldsUI.inputsHandler();

    };

    return signInUI;
});
