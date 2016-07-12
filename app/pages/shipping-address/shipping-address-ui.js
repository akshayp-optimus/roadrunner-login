define([
    '$',
    'translator',
    'global/utils',
    'global/ui/handle-form-fields',
    'global/utils/dom-operation-override'
],
function($, Translator, Utils, handleFormFieldsUI, DomOverride) {

    var createFieldContainer = function($inputContainer) {
        var $input = $inputContainer.find('input');
        var $select = $inputContainer.find('select');
        var $fieldLabel = $inputContainer.find('label');
        var $labelContent = $fieldLabel.children();
        var $fieldRow = $('<div class="c-box c-arrange c--align-middle">');

        var newLabel = Utils.updateFormLabels($fieldLabel.text());
        // Update Form Labels to match the invision
        newLabel && $fieldLabel.text(Translator.translate(newLabel));

        $fieldLabel.prepend($labelContent);

        $fieldRow.append($inputContainer.find('label').addClass('c-box__label c-arrange__item c--shrink'));

        if ($input.length) {
            $fieldRow.append($('<div class="c-input c-arrange__item">').append($input));
        }

        if ($select.length) {
            $fieldRow.append($('<div class="c-select c-arrange__item">').append($select));
        }


        return $fieldRow;
    };

    var transformSplitFieldRow = function($fieldRow, $inputContainer) {
        var $nextContainer = $inputContainer.next();
        var $labelField = $nextContainer.find('label');
        $labelField.attr('data-label', $labelField.text().replace('*', ''));
        var $fieldContainer = createFieldContainer($nextContainer);
        $fieldRow.append($fieldContainer);
    };

    var transformForm = function($form) {
        var $container = $(this);
        var $form = $(arguments[0]);
        var $fields = $();
        var fieldsRowClass = 'c-box-row';
        if ($container.is('#gwt_password_panel')) {
            fieldsRowClass = 'c-box-row spot';
        }

        if ($container.is('#gwt_shipaddr_panel')) {
            $container.addClass('u-margin-top-md js-shipping-form');
        }

        $form.find('.spot').not('.AddrMNameSpot, #bill_reqdlabel, #ship_reqdlabel').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $labelField = $inputContainer.find('label');
            var $labelRequired = $labelField.find('.required');
            var $fieldRow = $('<div class="' + fieldsRowClass + '">');
            $labelField.attr('data-label', $labelField.text().replace('*', ''));
            var $fieldContainer = createFieldContainer($inputContainer);

            if ($labelRequired.length) {
                $labelRequired.closest('label').prepend($labelRequired);
            }

            $fieldRow.append($fieldContainer);

            if ($inputContainer.hasClass('AddrFNameSpot')) {
                transformSplitFieldRow($fieldRow, $inputContainer);
                var $firstNameAndMiddleNameFieldBox = $fieldRow.find('.c-box');
                $fieldRow.addClass('c--3-4');
                $firstNameAndMiddleNameFieldBox.removeClass('c-arrange c--align-middle');
                $firstNameAndMiddleNameFieldBox.first().addClass('c-first-name');
                $firstNameAndMiddleNameFieldBox.last().addClass('c--shrink c-middle-name');
            } else if ($inputContainer.is('[style*="none"], .addrCountrySpot')) {
                $fieldRow.attr('hidden', 'true');
            }

            $fields = $fields.add($fieldRow);
        });


        $form.html($fields);

    };

    var transformShippingOptions = function() {
        var $container = $(arguments[0]);

        $container.find('.gwt-RadioButton').each(function(i, radioButtonContainer) {
            var $radioButtonContainer = $(radioButtonContainer);

            if (i === 0) {
                $radioButtonContainer.find('input').addClass('js-hide-form');
            } else {
                $radioButtonContainer.find('input').addClass('js-show-form');
            }

            $radioButtonContainer.addClass('c-field__checkbox-radio');
            $radioButtonContainer.wrap('<div class="c-shipping-option-panel u-margin-bottom-md">');
            $radioButtonContainer.find('br').remove();
            $radioButtonContainer.find('label');
        });
    };

    var transformSendEmails = function() {
        var $sendEmails = $(arguments[0]);

        $sendEmails.find('label');
        $sendEmails.addClass('c-field__checkbox-radio');
        $(this).addClass('c-shipping-promotional-emails');
    };

    var transformCTA = function() {
        var $cta = $(arguments[0]);
        $cta.addClass('c-button c--primary c--full-width u-margin-top-lg');
        $cta.find('span').text($cta.text().replace('Secure Checkout', ''))
            .append(' >');
    };

    // Some label text is regenerating in actual state as desktop when clicking shipping address radio
    // so this is required to transform again to match the design
    var transformLabelText = function() {
        $('.js-shipping-form').find('label[for="ship_region"], label[for="ship_phone2box"]').map(function(_, item) {
            var $fieldLabel = $(item);
            var $labelContent = $fieldLabel.children();
            var newLabel = Utils.updateFormLabels($fieldLabel.text());
            // Update Form Labels to match the invision
            newLabel && $fieldLabel.text(Translator.translate(newLabel));

            $fieldLabel.prepend($labelContent);
        });
    };

    var bindEvents = function() {
        $('body').on('click', '.js-hide-form', function(e) {
            transformLabelText();
            $('.js-shipping-form').attr('hidden', 'true');
        });

        $('body').on('click', '.js-show-form', function(e) {
            transformLabelText();
            $('.js-shipping-form').removeAttr('hidden');
        });
    };

    var overrideGWTDomAppend = function() {
        DomOverride.on('domAppend', '', transformForm, '#gwt_billaddr_panel');
        DomOverride.on('domAppend', '', transformForm, '#gwt_shipaddr_panel');
        DomOverride.on('domAppend', '', transformForm, '#gwt_password_panel');
        DomOverride.on('domAppend', '', transformForm, '#gwt_email_textbox');
        DomOverride.on('domAppend', '', transformSendEmails, '#gwt_sendMeEmails_cb');
        DomOverride.on('domAppend', '', transformShippingOptions, '#gwt_shippingOption_panel');
        DomOverride.on('domAppend', '', transformCTA, '#gwt_billshipaddr_btn');
    };

    var shippingAddressUI = function() {
        overrideGWTDomAppend();
        // Update placeholders in inputs
        handleFormFieldsUI.inputsHandler();
        bindEvents();
    };

    return shippingAddressUI;
});
