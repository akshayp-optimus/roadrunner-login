define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
    'global/ui/handle-form-fields'
], function($, translator, sheet) {
    var $tafPinny = $('.js-taf-pinny');

    var addTAFFieldsAndLabels = function($newContent, $nameLabel, $emailLabel, $nameInput, $emailInput, isRecipient, handleFormFieldsUI) {
        var $nameContainer = $('<div class="c-field c-add-another-row c-box c-arrange c--align-middle u-less-width ">');
        var $emailContainer = $('<div class="c-field c-arrange c-box c--align-middle u-less-width">');

        $emailInput.attr('type', 'email').attr('placeholder', $emailLabel.text());
        $nameInput.attr('placeholder', $nameLabel.text());
        $emailLabel.addClass('c-field__label u-less-width').text('Email').prepend('<span class="c-asterix-field">*</span>');

        $nameContainer.append($nameLabel);
        $emailContainer.append($emailLabel);

        $nameContainer.append($nameInput);
        $emailContainer.append($emailInput);

        if (isRecipient) {
            var $recipientGroup = $('<div class="js-taf__recipients">');
            $nameLabel.addClass('c-field__label u-less-width ').text('To').prepend('<span class="c-asterix-field">*</span>');

            $recipientGroup.append($('<div class="c-box-row">').append($nameContainer));
            $recipientGroup.append($('<div class="c-box-row ">').append($emailContainer));
            $newContent.append($recipientGroup);
        } else {
            $nameLabel.addClass('c-field__label u-less-width ').text('From').prepend('<span class="c-asterix-field">*</span>');

            $newContent.append($('<div class="c-box-row">').append($nameContainer));
            $newContent.append($('<div class="c-box-row">').append($emailContainer));
        }
    };

    var addSenderFields = function($newContent, $form) {
        var $senderEmailLabel = $form.find('#sender_email');
        var $labelRow = $senderEmailLabel.parent().parent();
        var $senderNameLabel = $labelRow.find('.global-Modal-Label').first();
        var $inputs = $labelRow.next().find('input');

        addTAFFieldsAndLabels($newContent, $senderNameLabel, $senderEmailLabel, $inputs.first(), $inputs.last());
    };

    var addRecipient = function() {
        var $recipientsGroups = $('.js-taf__recipients');
        var newIndex = $recipientsGroups.length;
        var currentIndex = newIndex - 1;
        var $newGroup = $recipientsGroups.last().clone().addClass('c-remove-button');
        var $newEmail = $newGroup.find('[id*="reciepient_email"]');
        var $newName = $newGroup.find('[id*="reciepient_name"]');

        // Update ids
        $newEmail.attr('id', $newEmail.attr('id').replace(currentIndex, newIndex));
        $newName.attr('id', $newName.attr('id').replace(currentIndex, newIndex));

        $newGroup.find('input').each(function(i, input) {
            $(input).val('');
        });

        // add remove button if necessary
        if (!$newGroup.find('.js-taf__remove').length) {
            var $fieldTop = $newGroup.find('.c-field__label').first().wrap('<div class="c-field__top  u-less-width">');
            $('<a href="#" class="js-taf__remove c-taf__remove u-padding-top u--tight">')
                .text(translator.translate('remove_button'))
                .insertAfter($fieldTop);
        }

        $newGroup.insertAfter($recipientsGroups.last());
    };

    var bindTAFEvents = function() {
        $('.js-taf__add-recipient').on('click', addRecipient);

        $('body').on('click', '.js-taf__remove', function(e) {
            e.preventDefault();
            $(this).parents('.js-taf__recipients').remove();
        });

        $('.js-taf__cancel').on('click', function(e) {
            if ($tafPinny.parent().hasClass('pinny--is-open')) {
                $tafPinny.pinny('close');
            }
        });

        $('.js-taf__send').on('click', function(e) {
            $('.js-taf-content').find('.errortxt').parent().addClass('c--error');
        });

        $('.js-taf__message').on('focus input keyup', function(e) {
            if (this.scrollHeight > this.offsetHeight) {
                var $textArea = $(this);
                $textArea.height($textArea.height() + 20);
            }
        });
    };

    var addSendMeACopy = function($newContent, $form) {
        var $copyCheckbox = $form.find('.gwt-CheckBox input');
        var $checkboxContainer = $('<div class="c-field">');
        var $checkBoxLabel = $copyCheckbox.next();
        var $checkBoxLabelDiv = $copyCheckbox.parent().parent().next().find('.global-Modal-Label');

        $checkBoxLabel.addClass('c-field__label c-check-box-label');
        $checkBoxLabel.text($checkBoxLabelDiv.text());

        $checkboxContainer.append($copyCheckbox);
        $checkboxContainer.append($checkBoxLabel);
        $newContent.append($('<div class="c-box-row u-margin-top-md c-check-me u-padding-all u--tight">').append($checkboxContainer));
    };

    var transformTellAFriend = function($tafContent) {
        var $gridContent = $tafContent.find('.gwt-tell-a-friend-input-grid');
        var $form = $gridContent.find('.gwt-tell-a-friend-form');
        var $recNameLabels = $form.find('[id*="reciepient_name"]');
        var $recEmailLabels = $form.find('[id*="reciepient_email"]');
        var $newContent = $('<div>');
        var $tellAFriend = $form.find('.gwt-tell-a-friend-remaining-lbl').addClass('c-taf__remaining-label');
        var $addFriendMsgLbl = $form.find('.gwt-tell-a-friend-add-message-lbl').addClass('c-taf__add-message');
        var $errorPanel = $gridContent.find('.gwt-taf-error-panel');

        // Add Error Container.
        $newContent.append($errorPanel);
        $errorPanel.addClass('u-text-error u-margin-bottom-md');

        // Add Recipient labels/inputs
        $recNameLabels.each(function(i, nameLabel) {
            var $nameLabel = $(nameLabel);
            var $emailLabel = $recEmailLabels.eq(i);
            var $labelRow = $nameLabel.parent().parent();
            var $inputs = $labelRow.next().find('input');

            addTAFFieldsAndLabels($newContent, $nameLabel, $emailLabel, $inputs.first(), $inputs.last(), true);
        });

        // Add address link
        $newContent.append($form.find('.gwt_add_address_link').removeAttr('style').addClass('c-button c--link c--dark c--small c-taf__add-recipient js-taf__add-recipient'));

        // Sender Info
        addSenderFields($newContent, $form);

        // Send me a copy
        addSendMeACopy($newContent, $form);

        // personalized msg
        $tellAFriend.addClass('c-field__caption');
        $addFriendMsgLbl.addClass('c-field__label u-margin-top-md');

        $newContent.append($addFriendMsgLbl);
        $newContent.append($form.find('textarea').addClass('js-taf__message c-taf__message'));
        $newContent.append($tellAFriend);

        // CTA buttons
        $newContent.append($tafContent.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-sm u-margin-top-md js-taf__send c-taf__send').append(' >'));
        $newContent.append($tafContent.find('.button.secondary').addClass('c-button c--outline c--full-width js-taf__cancel c-taf__cancel u-margin-top-ng-sm'));

        // handleFormFieldsUI.updatePlaceholder();
        // handleFormFieldsUI.inputsHandler();

        $tafContent.html($newContent);

        bindTAFEvents();

    };

    var initSheet = function() {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        sheet.init($tafPinny, {
            coverage: '100%',
            closed: function() {
                var $tafCancel = $('.js-taf__cancel');
                if ($('#gwt-tell-a-friend-modal').length) {
                    // Force the desktop modal to close if it's not already closed.
                    $tafCancel.click();
                    $tafCancel.find('span').click();
                }
            }
        });
    };

    var init = function() {
        var _oldTellAFriend = window.doTellAFriendClickAction;

        initSheet();

        window.doTellAFriendClickAction = function() {
            _oldTellAFriend.apply(this, arguments);

            var $modal = $('#gwt-tell-a-friend-modal');
            var headerText = $modal.find('.dialogTopCenterInner .gwt-HTML').text();
            var $body = $modal.find('.dialogContent');

            $tafPinny.find('.c-sheet__title').html(headerText);

            // we can't use a partial template here without losing all event listeners
            // So instead we need to transform the content in place
            transformTellAFriend($body);

            $tafPinny.find('.js-taf-content').html($body);

            $modal.prev('.gwt-PopupPanelGlass').hide();
            $modal.hide();

            $tafPinny.pinny('open');

        };
    };

    var _closeModal = function() {
        $tafPinny.pinny('close');
    };


    return {
        init: init,
        closeModal: _closeModal
    };
});
