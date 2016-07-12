define([
    '$',
    'components/sheet/sheet-ui',
    'translator'
], function($, sheet, translator) {


    var $askSpecialistPinny = $('.js-ask-a-specialist-pinny');

    var _appendRow = function($container, $label, $input, isCheckbox, $additionalLink) {
        var $row = $('<div class="c-field">');
        if (isCheckbox) {
            // Reverse the order
            $row.append($input);
            $row.append($label.addClass('c-field__label c-label-field'));
        } else {
            $row.append($label.addClass('c-field__label c-label-field'));
            $row.append($input);
        }

        if ($additionalLink && $additionalLink.length) {
            $label.wrap('<div class="c-field__top">');
            $label.after($additionalLink.addClass('c-field__info'));
        }

        $container.append($('<div class="c-field-row">').append($row));
    };

    var _bindModalEvents = function() {
        $('.js-ask-a-specialist-pinny__body').on('click', function(e) {
            $('.errortxt').closest('tr').addClass('c--error c-field');
        });
    };

    var _transformAskSpecialistModal = function($content) {
        var $mainTable = $content.find('table .form');
        var $tableForm = $content.find('.form');

        $('table .form').find('*').removeAttr('style').removeAttr('align');
        $('table .form').find('[class*="lbl"]').addClass('c-field__label c-label-field');
        $tableForm.find('[class*="txtbox"]').addClass('c-field');
        $tableForm.find('[class*="listbox"]').addClass('c-field');
        $tableForm.find('.gwt-site-feedback-email-addr-lbl').text('Email');
        $tableForm.find('td:empty').addClass('u-visually-hidden');
        $tableForm.find('.okCancelPanel').find('.button.primary').addClass('c-button c--primary c--full-width').append(' >');
        $tableForm.find('.okCancelPanel').find('.button.secondary').addClass('c-cancel-button js-cancel');
        $tableForm.find('.gwt-site-feedback-required-text-lbl').addClass('c-require-field-label-text');
        $tableForm.find('td').addClass('c-td-field');
        $tableForm.find('.gwt-site-feedback-last-name-lbl');
        $tableForm.find('tr').addClass('c-box-row');
        $tableForm.find('.okCancelPanel').closest('tr').removeClass('c-box-row');
        $tableForm.find('.gwt-site-feedback-topic-listbox').addClass('c-feedback-listbox');
        $tableForm.find('.gwt-site-feedback-middle-init-lbl').addClass('c-feedback-label');
        $tableForm.find('.gwt-site-feedback-middle-init-txtbox').addClass('c-feedback-middle-textbox');
        $tableForm.find('.gwt-site-feedback-main-panel').closest('tr').addClass('c-main-feedback-panel');
        $tableForm.find('.gwt-site-feedback-main-panel').attr('class', 'c-main-panel c-feedback-main-panel');
        $tableForm.find('.gwt-site-feedback-instructions-lbl').addClass('c-feedback-instructions-heading');
        $tableForm.find('.gwt-site-feedback-email-addr-lbl, .gwt-site-feedback-topic-lbl').prepend('*  ');
        $tableForm.find('.gwt-site-feedback-required-lbl, .gwt-site-feedback-email-addr-required-lbl, .gwt-site-feedback-comments-required-lbl, .gwt-site-feedback-topic-required-lbl').remove();
        $tableForm.find('.gwt-site-feedback-phone-lbl ').text('Phone');
        $tableForm.find('.gwt-site-feedback-comments-lbl').append('  *').addClass('c-feedback-comments-label');
        $tableForm.find('.gwt-site-feedback-comments-txtarea').closest('td').addClass('c-feedback-textarea c-field');
        // $('.okCancelPanel').find('.button.primary').insertBefore('.button.secondary');
        $('.okCancelPanel').closest('tr').addClass('c-empty-container').nextAll('tr').remove();
        $('.c-empty-container').prev('.c-box-row').remove();
        $('.gwt-site-feedback-email-recieve-lbl').closest('tr').remove();
        $('.c-feedback-middle-textbox').attr('placeholder', 'MI');
        $tableForm.find('.gwt-site-feedback-first-name-lbl').closest('tr').addClass('c-first-name-label');
        $tableForm.find('.gwt-site-feedback-email-addr-txtbox').attr('placeholder', 'Your e-mail Address');
        $tableForm.find('.gwt-site-feedback-email-addr-txtbox').attr('type', 'email');
        $tableForm.find('.gwt-site-feedback-phone-txtbox').attr('type', 'tel');
        $tableForm.find('.gwt-site-feedback-first-name-txtbox').attr('placeholder', 'First name');
        $tableForm.find('.gwt-site-feedback-last-name-txtbox').attr('placeholder', 'Last name');
        $tableForm.find('.gwt-site-feedback-phone-txtbox').attr('placeholder', 'Phone Number');
        $tableForm.find('.gwt-site-feedback-first-name-txtbox').closest('td').addClass('c-feedback-txtbox');
        $tableForm.find('.gwt-site-feedback-topic-listbox').closest('td').addClass('c-feedback-topic-listbox');
        $tableForm.find('.okCancelPanel').addClass('c-cancel-panel');
        $tableForm.find('.gwt-site-feedback-comments-lbl').closest('tr').addClass('c-feedback-comments');
    };

    var _showAskSpecialistModal = function() {
        var $askSpecialistModal = $('#gwt-site-feedback-modal');


        if (!$(this).is('.dialogContent')) {
            // not the trigger we want, exit
            return;
        }

        $askSpecialistModal.attr('id', 'js-specialist');

        $askSpecialistModal.hide();

        var title = $askSpecialistModal.find('.Caption .gwt-HTML').text();
        var $content = $askSpecialistModal.find('.dialogContent');

        _transformAskSpecialistModal($content);
        _bindModalEvents();


        $askSpecialistPinny.find('.c-sheet__title').html(title);
        $askSpecialistPinny.find('.js-ask-a-specialist-pinny__body').html($content);
        $askSpecialistPinny.pinny('open');

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $askSpecialistModal.removeAttr('style');
        $askSpecialistModal.html($askSpecialistPinny.parent());
        $askSpecialistModal.append($('.js-ask-a-specialist-shade'));
    };

    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');
        // Remove the loader and revert back to the original btn text.

        if ($askSpecialistPinny) {
            // Click cancel button
            $askSpecialistPinny.find('.js-close-modal span').click();
            // Reset pinny markup.
            $askSpecialistPinny.parent().appendTo($lockup);
            $('.js-ask-a-specialist-shade').appendTo($lockup);
        }
    };

    var _initSheet = function() {
        sheet.init($askSpecialistPinny, {
            shade: {
                cssClass: 'js-ask-a-specialist-shade'
            },
            coverage: '100%',
            close: _onSheetClose
        });
    };

    var _closeSheet = function() {
        $askSpecialistPinny.data('component').close();
    };

    return {
        initSheet: _initSheet,
        showAskSpecialistModal: _showAskSpecialistModal,
        closeSheet: _closeSheet
    };
});
