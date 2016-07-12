define([
    '$',
    'components/sheet/sheet-ui',
    'translator'
], function($, sheet, translator) {


    var $signInPinny = $('.js-sign-in-pinny');

    var _appendRow = function($container, $label, $input, isCheckbox, $additionalLink) {
        var $row = $('<div class="c-field c-box c-arrange c--align-middle">');
        $input.attr('placeholder', $label.text().replace('*', '').trim());
        if (isCheckbox) {
            // Reverse the order
            $row.append($input);
            $row.append($label.addClass('c-field__label u-padding-top u-padding-bottom u--tight'));
        } else {
            $row.append($label.addClass('c-field__label u-medium-width u-padding-left-extra-tight'));
            $row.append($input);
        }

        if ($additionalLink && $additionalLink.length) {
            $label.wrap('<div class="c-field__top">');
            $label.after($additionalLink.addClass('c-field__info'));
        }

        $container.append($('<div class="c-box-row c-sign-in-pop-up-fields">').append($row));
    };

    var _bindModalEvents = function() {
        $('.js-sign-in, .js-reset-pw').on('click', function(e) {
            $('.js-sign-in-pinny__body').find('.errortxt').parent().addClass('c--error');
        });
    };

    var _transformSignInModal = function($content) {
        var $mainTable = $content.find('table');
        var $leftPanel = $mainTable.find('.leftPnl');
        var $newContent = $('<div>');

        // Error Panel
        $newContent.append($leftPanel.find('.gwt-forgot-password-error-panel'));

        // Email
        var $emailField = $leftPanel.find('#logonId');
        var $emailLabel = $leftPanel.find('#logonLabelId');
        _appendRow($newContent, $emailLabel, $emailField, false);

        // Password
        var $passwordField = $leftPanel.find('#logonPasswordId');
        var $passwordLabel = $leftPanel.find('#passwordLabelId');
        _appendRow($newContent, $passwordLabel, $passwordField, false);

        // remember Me
        var $rememberMeContainer = $leftPanel.find('.rememberMe');
        _appendRow($newContent, $rememberMeContainer.find('label'), $rememberMeContainer.find('input').addClass('u-margin-top-sm u-margin-start-md'), true);


        // Add Buttons
        var $primaryButton = $mainTable.find('.button.primary');
        $primaryButton.text('sign in >');
        var $secondaryButton = $mainTable.find('.button.secondary');
        $newContent.append($primaryButton.addClass('c-button c--primary c--full-width u-margin-top-md js-sign-in'));
        $newContent.append($secondaryButton.addClass('u-visually-hidden js-sign-in-close'));

        $newContent.append($leftPanel.find('.forgotPWlink').addClass('u-text-align-center u--bold c-forgot-password-link'));

        // Create account
        var $createAccount = $leftPanel.find('.gwt-signInModal-register-panel');
        $createAccount.find('.gwt-Label').remove();
        $createAccount.find('.registerLink').addClass('c-button c--outline c--full-width');

        // Or divider
        var orText = translator.translate('or_text');
        var $orDivider = $('<div class="c-divider c--full-width c--text u-margin-top-md u-margin-bottom-md"><span class="c-divider__text">' + orText + '</span></div>');
        $createAccount.prepend($orDivider);

        $newContent.append($createAccount);


        $mainTable.replaceWith($newContent);
    };

    var _transformForgotPWModal = function($content) {
        var $emailRow = $('<div class="c-field">');
        var $emailLabel = $content.find('#emailBoxLabel');
        var $introNote = $emailLabel.prev();

        $emailLabel.addClass('c-field__label');
        $emailRow.append($emailLabel.add($content.find('#emailbox')));
        $introNote.after($('<div class="c-field__row">').append($emailRow));

        $content.find('.c-field__row').addClass('u-margin-top-md');
        $content.find('.c-field__row').next().addClass('c-field__caption');

        // transform Buttons
        $content.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-md js-reset-pw');
        $content.find('button.secondary').addClass('u-visually-hidden js-close-modal');
    };

    var _showSignInModal = function($signInModal) {
        var $popupPanel = $('.gwt-PopupPanelGlass');

        $popupPanel.hide();

        var title = $signInModal.find('.Caption .gwt-HTML').text();
        var $content = $signInModal.find('.dialogContent').length
            ? $signInModal.find('.dialogContent')
            : $('.gwt-added-to-wish-list-modal').children();

        _transformSignInModal($content);
        _bindModalEvents();

        $signInPinny.find('.c-sheet__title').html(title);
        $signInPinny.find('.js-sign-in-pinny__body').html($content);
        $signInPinny.pinny('open');
    };

    var _showForgotPasswordModal = function($forgotPasswordModal) {
        var $content = $forgotPasswordModal.find('.gwt-submit-cancel-dialog-content-panel');
        $signInPinny.addClass('js--forgot-pw');
        $signInPinny.find('.c-sheet__title').html('Reset Password');
        $signInPinny.find('.js-sign-in-pinny__body').html($content);

        _transformForgotPWModal($content);
        _bindModalEvents();

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $forgotPasswordModal.removeAttr('style');
        $forgotPasswordModal.html($signInPinny.parent());
        $forgotPasswordModal.append($('.js-sign-in-shade'));
    };

    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');
        // Remove the loader and revert back to the original btn text.

        if ($signInPinny.hasClass('js--forgot-pw')) {
            $signInPinny.removeClass('js--forgot-pw');
            // Click cancel button
            $signInPinny.find('.js-close-modal span').click();
            // Reset pinny markup.
            $signInPinny.parent().appendTo($lockup);
            $('.js-sign-in-shade').appendTo($lockup);
        }
    };

    var _initSheet = function() {
        sheet.init($signInPinny, {
            shade: {
                cssClass: 'js-sign-in-shade'
            },
            close: _onSheetClose
        });
    };

    return {
        initSheet: _initSheet,
        showSignInModal: _showSignInModal,
        showForgotPasswordModal: _showForgotPasswordModal
    };
});
