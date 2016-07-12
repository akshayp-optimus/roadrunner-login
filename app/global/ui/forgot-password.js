define([
    '$',
    'translator',
    'global/utils',
    'components/sheet/sheet-ui',
    'modal-center',
], function($, Translator, Utils, sheet, modalCenter) {

    var passwordTransform = function($el) {
        var $passwordSheetEl = $('.js-forgot-password-panel');
        var $passwordPanel = $el;

        var passwordSheet = sheet.init($passwordSheetEl, {
            effect: modalCenter
        });

        passwordSheet.setBody($el);

        passwordSheet.open();

    };

    var overrideForgotPassword = function() {
        $('#forgotpw').one('click', function() {

            var desktopShowForgotPasswordModal = window.showForgotPasswordModal;
            window.showForgotPasswordModal = function() {
                desktopShowForgotPasswordModal.apply(this, arguments);
                var $passwordModal = $('#passwordReset');
                var $header = $('<div class="c-sheet__header">');
                var $closeButton = $passwordModal.find('.button.secondary');

                $passwordModal.removeAttr('style');

                $closeButton.addClass('c-sheet__header-close pinny__close');
                $closeButton.find('span').html('<svg class="c-icon c--large" title="Closes"><title>Close</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg>');
                $passwordModal.addClass('c-password-reset-pinny c-sheet');
                $header.append('<div class="c-sheet__title">' + Translator.translate('reset_password') + '</div>');
                $header.append($closeButton);
                $passwordModal.find('input').wrap('<div class="c-input c-arrange__item">');
                $passwordModal.find('.c-input').prev().addClass('c-box__label c-arrange__item c--shrink');
                $passwordModal.find('.c-input').prev().text(Utils.updateFormLabels($passwordModal.find('#emailBoxLabel').text()));
                $passwordModal.find('.c-input').next().remove();
                $passwordModal.find('#emailBoxLabel, .c-input').wrapAll('<div class="c-form-group"><div class="c-box-row"><div class="c-box c-arrange c--align-middle"></div></div></div>');
                $passwordModal.find('input').attr('placeholder', Translator.translate('reset_password_placeholder'));
                $passwordModal.find('.button.primary').append(' >').addClass('c-button c--primary c--full-width');
                $passwordModal.find('.dialogBottom').remove();
                $passwordModal.find('.button.primary').append('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>');

                $passwordModal.html($passwordModal.find('.gwt-submit-cancel-dialog-content-panel'));
                $passwordModal.find('.gwt-submit-cancel-dialog-content-panel').wrap('<div class="c-inner-wrapper" />');
                $passwordModal.find('.c-inner-wrapper').prepend($header);

                $passwordModal.find('.c-input').prev().wrapInner('<label />');

                passwordTransform($passwordModal);
            };
        });
    };


    var tooltipUI = function() {
        overrideForgotPassword();
    };

    return tooltipUI;
});
