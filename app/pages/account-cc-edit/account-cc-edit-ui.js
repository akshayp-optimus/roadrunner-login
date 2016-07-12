define([
    '$',
    'global/utils',
    'global/ui/handle-form-fields',
    'translator',
    'bower_components/jquery-creditcardvalidator/jquery.creditCardValidator'
], function($, Utils, handleFormFieldsUI, Translator) {
    var cardTypes = {
        'amex': '',
        'visa': 'Visa',
        'discover': 'Discover',
        'mastercard': 'Master Card',
        'jcb': 'JCB'
    };
    var errorPanelOverridden = false;

    var updateLabelText = function() {
        $('#creditCardEditForm').find('.c-box').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();
            // var $labelRequired = $labelField.find('.required');
            $labelField.attr('data-label', $labelField.text().replace('*', ''));


            var newLabel = Utils.updateFormLabels($labelField.text());
            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);
        });
        $('.js-cc-input').find('input').attr('placeholder', 'Credit Card Number');
    };

    var _overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);

            var $errorPopup = $('.gwt-csb-error-panel-popup').attr('hidden', 'hidden');

            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));

            $('.errortxt').addClass('c-field__label').parents('.c-field').addClass('c--error');

            return result;
        };
    };

    var _bindEvents = function() {
        var $cardSelect = $('.js-card-type select');

        $cardSelect.removeAttr('onchange');

        jQuery('.js-cc-input input').validateCreditCard(function(result) {
            var $input = $(this);
            var $container = $input.closest('.js-cc-input-container');
            var type = result.card_type;

            if ($input.val().indexOf('*') > -1) {
                // The user has saved CC info, so it's been pre-filled
                return;
            }

            if (type && type.name) {
                $container.addClass('c--' + type.name);
                $cardSelect.children('[value="' + cardTypes[type.name] + '"]').prop('selected', 'selected');
                $cardSelect.trigger('change');
            } else {
                $container.attr('class', 'c-field__credit-card js-cc-input-container');
            }
        });

        $('.js-save').on('click', function(e) {
            if (!errorPanelOverridden) {
                _overrideShowErrors();
                errorPanelOverridden = true;
            }
        });
    };

    var accountCreditCardEditUI = function() {
        updateLabelText();
        // Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();
        _bindEvents();
    };

    return accountCreditCardEditUI;
});
