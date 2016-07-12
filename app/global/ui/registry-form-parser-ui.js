define([
    '$',
    'global/utils',
    'dust!components/select/select',
    'translator',
    'global/ui/handle-form-fields'
], function(
    $,
    Utils,
    // Partials
    SelectTmpl,
    Translator,
    handleFormFieldsUI) {

    var $selectComponent;
    var toggleText = '+ Add Another Line';
    var $errorContainer = $('<div class="js-errors" hidden></div>').appendTo($('body'));

    new SelectTmpl({select: $('<select>'), class: 'c-arrange__item'}, function(err, html) {
        $selectComponent = $(html);
    });

    var _transformContent = function($content) {
        $content.find('.group .spot, .spot').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);

            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();

            $labelField.attr('data-label', $labelField.text().replace('*', ''));
            var newLabel = Utils.updateFormLabels($labelField.text());

            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            // Update placeholder
            $labelField.parent().find('input').attr('placeholder', $labelField.attr('data-label'));
            $labelField.prepend($labelContent);
        });
    };

    // Transforms fields that have inputs on the left, labels on the right
    // radio buttons and checkboxes
    var _transformLeftInputRightLabelFields = function($field, parentClass) {
        if (!$field.length) {
            return;
        }

        var $cField = $('<div class="c-box c-arrange"></div>');

        $field.parent().addClass(parentClass);

        $field.find('label').addClass('c-box__label');

        $field.contents().appendTo($cField);
        $field.append($cField);
    };

    var _transformCheckboxField = function($formField) {
        var $field = $formField.find('.gwt-CheckBox').length ?
                        $formField.find('.gwt-CheckBox') :
                        $formField;

        $field.each(function() {
            var $checkboxField = $(this);
            _transformLeftInputRightLabelFields($checkboxField, 'u-margin-bottom-md');
        });
    };

    var _transformRadioField = function($formField) {
        // filter $formField with only gwt-RadioButton, do our transformations
        // then empty() formField so we're only left with gwt-RadioButtons
        $formField.contents().filter(function() {
            return $(this).is('.gwt-RadioButton');
        }).each(function() {
            var $radioField = $(this);
            _transformLeftInputRightLabelFields($radioField, 'u-display-block');
        }).appendTo($formField.empty());
    };

    var _transformSelect = function($selects) {
        if (!$selects.length) {
            return;
        }

        $selects.each(function() {
            var $selectContainer = $(this).parent();
            var $select = $(this);
            var $newSelect = $selectComponent.clone();

            $newSelect.find('select').replaceWith($select);
            $selectContainer.append($newSelect);
        });
    };

    var _transformTextsAndSelects = function($formField) {
        var $cInput = $('<div class="c-input"></div>');
        var $cField = $('<div class="c-box c-arrange"></div>');
        var $label = $formField.find('label').addClass('c-box__label').unwrap();

        $formField.addClass('c-box-row');

        $cField
            .append($label)
            .append($formField.find('input:not([type="checkbox"]), select'));

        _transformSelect($cField.find('select'));
        // remove unnecessary labels in row and append our fields
        $formField.empty().append($cField);
    };

    var _transformButtons = function($page) {
        if (!$page.length) {
            return;
        }

        $page.find('.gwt-Button.secondary, .gwt-Button.primary, .button.primary')
            .addClass('c-button c--primary c--full-width u-margin-top-gt-md u-margin-bottom-md')
            .find('span').append(' >');
        $page.find('.button.secondary').addClass('c-button c--full-width c-backgroung-none c-back-to-registry-button');
        $page.find('.gwt_GR_cancel').removeClass('c-back-to-registry-button');
        $page.find('button').find('br').remove();
    };

    var _transformFormField = function($formField) {
        if (!$formField.length) {
            return;
        }

        // transform based on input types
        if ($formField.find('input[type="checkbox"]').length) {
            _transformCheckboxField($formField);
        } else if ($formField.find('input[type="radio"]').length) {
            _transformRadioField($formField);
        } else {
            _transformTextsAndSelects($formField);
        }
    };

    // unfortunately each step has different form markup
    var _transformSpotFields = function($field) {
        if (!$field.length) {
            return;
        }

        var $cFieldRow = $('<div class="c-box-row"></div>');

        $field.find('label').addClass('c-box__label');
        $field.addClass('c-box c-arrange c--align-middle');

        if ($field.find('select').length) {
            _transformSelect($field.find('select'));
        }

        // some fields have .group markup, we can just add class
        // otherwise, wrap lonesome .spot fields with c-field-row
        if ($field.parent('.group').length) {
            $field.unwrap();
        }

        $field.wrap($cFieldRow);

    };

    var _transformMiddleInitial = function($pageContainer) {
        var $middleInitial = $pageContainer.find('.miLabel');
        var $firstName = $pageContainer.find('.AddrFNameSpot').parent().addClass('c--3-4');

        $middleInitial.unwrap().appendTo($firstName);
    };

    var _transformStep1 = function($pageContainer) {
        if (!$pageContainer.length) {
            return;
        }


        // This decoration is for step 1, but is happening up here so that we can check for c-field-row
        // as parent during _transformFormField functions
        $pageContainer.find('.GR_acceptgiftCardFlag_Panel, .GR_create_guestOptions_panel')
            .addClass('c-box-row u-display-block');
        $pageContainer.find('.GR_create_custom_message').insertBefore($pageContainer.find('.GR_acceptgiftCardFlag_Panel'));

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);

        // this one has nested panels, which will break our panels iterator
        $pageContainer.find('.GR_giftCardsAndGuestOptions_Panel').children().unwrap();
        $pageContainer.find('.GR_description_length_label').insertAfter($pageContainer.find('.GR_create_reg_name_panel'));

        // spit out all content, transform as we go
        $pageContainer.find('.GR_Creat_Step1Panel').children('div').filter(function() {
            return /\_panel/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        _transformButtons($pageContainer);

        // step 1 specific transforms
        $pageContainer.find('#gift_registry_create_content1').appendTo($pageContainer.find('.GR_creat_step1'));
        $pageContainer.find('#reqdlabel, .GR_create_registry_option_label').remove();
        $pageContainer.find('.GR_customMessage_Label').addClass('u-margin-bottom-md');
        $pageContainer.find('.GR_message_remainingCharsLabel').addClass('c-field__caption');
        $pageContainer.find('.gwt-Button.secondary span span').remove();
        $pageContainer.find('.gwt-Button.secondary').insertBefore($pageContainer.find('.button.secondary'));
        // Move Event Date out of c-box-row
        $pageContainer.find('.GR_create_event_date_panel').find('label').insertBefore($pageContainer.find('.GR_create_event_date_panel'));
    };

    // unfortunately each step has different form markup
    var _transformStep2 = function($pageContainer) {
        if (!$pageContainer.length) {
            return;
        }

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);
        $('.gwt_steps_error_div').appendTo($errorContainer);

        // spit out all content, transform as we go
        $pageContainer.find('.GR-create-stepe2Panel .spot').each(function() {
            _transformSpotFields($(this));
        });
        $pageContainer.find('.GR_create_co-registrantForm_panel').find(' > div:not(:last-of-type)').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);

            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();

            $labelField.attr('data-label', $labelField.text().replace('*', ''));
            var newLabel = Utils.updateFormLabels($labelField.text());

            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);
        });

        $pageContainer.find('.GR_create_co-registrantForm_panel_container').find('div').filter(function() {
            return /(\_panel)|(\_flag)/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        $pageContainer.find('.GR-Co-Reg-form-address').parent().removeClass('c-box c-arrange c--align-middle');
        $pageContainer.find('.GR_create_co-registrantForm_panel_container').children('span')
            .addClass('c-box-row').children('label').addClass('c-box__label needsclick');
        $pageContainer.find('.GR_create_co-registrantForm_panel_container').children('span').children('label').find('span').addClass('needsclick');
        $pageContainer.find('.GR_create_registrantForm_panel').children('div, span').filter(function() {
            return /(\_panel)|(\_flag)/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        _transformButtons($pageContainer);
        $pageContainer.find('.GR_coRegistrant_sameContant_flag').addClass('c-field-row');
        $pageContainer.find('#reqdlabel, #coRegistrant_reqdlabel').remove();
        _transformMiddleInitial($pageContainer.find('.address-widget-wwcm-wrapper').first());
        $pageContainer.find('.c-box-row').map(function(_, item) {
            var $item = $(item);
            if ($item.children().css('display') === 'none' || $item.text().trim().length === 0) {
                $item.remove();
            }
        });
        $pageContainer.find('.GR_promotional_email_flag').addClass('c-box-row').insertBefore($pageContainer.find('.addrStreet1Spot').parent());
    };

    var _transformStep3 = function($pageContainer) {
        if (!$pageContainer.length) {
            return;
        }

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);

        $pageContainer.find('.spot').each(function() {
            _transformSpotFields($(this));
        });

        _transformButtons($pageContainer);

        $pageContainer.find('#other_reqdlabel, #reqdlabel').remove();
        $pageContainer.find('.GR_shippingAddressDisplayMessage').addClass('c-field__caption');
        $pageContainer.find('.button.primary').after($('.GR_creat_step2 .button.secondary'));
        $pageContainer.find('.GR_shippingChoices_panel').addClass('c--kill');
        $pageContainer.find('td:empty').remove();
        $pageContainer.find('.c-box-row').map(function(_, item) {
            var $item = $(item);
            if ($item.children().css('display') === 'none' || $item.text().trim().length === 0) {
                $item.remove();
            }
        });
        $('.GR_visit_myAccount_section').addClass('c-visit-my-account').insertBefore($pageContainer.find('.GR_create_buttons_step3'));
    };

    var _bindErrorsViaClick = function() {
        $('body').on('click', '.c-button.c--primary', function() {
            setTimeout(function() {
                if (!$('.js-errors').text().trim().length) {
                    return;
                }

                $('.c--error').removeClass('c--error');
                Adaptive.$('.errortxt').closest('.c-box-row').addClass('c--error-row');
                Adaptive.$('.errortxt').next('.GR_create_event_date_panel.c-box-row').addClass('c--error-row');
                Adaptive.notification.triggerError($('.js-errors'));
            }, 3000);
        });
    };

    return {
        transformFormField: _transformFormField,
        transformSpotFields: _transformSpotFields,
        transformButtons: _transformButtons,
        transformStep1: _transformStep1,
        transformStep2: _transformStep2,
        transformStep3: _transformStep3,
        bindErrorsViaClick: _bindErrorsViaClick,
        transformContent: _transformContent
    };
});
