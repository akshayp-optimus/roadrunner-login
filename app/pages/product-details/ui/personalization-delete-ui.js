define([
    '$',
    'components/sheet/sheet-ui',
    'translator',
    'global/utils'
], function($, sheet, translator, Utils) {


    var $removePersonalizationPinny = $('.js-delete-personalization-pinny');

    var _showRemovalConfirmationModal = function($removePersonalizationModal) {
        var title = $removePersonalizationModal.find('.Caption').text();
        var $content = $removePersonalizationModal.find('.dialogContent');
        var $cancelButton = $content.find('.button.secondary').addClass('c-button  c--secondary c--outline pinny__close js-cancel-button').append(' >');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width js-ok-button  js-yes-button pinny__close').append(' >')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width c-cancel-button js-close-modal');
        $content.find('.button.primary').addClass('c-button c--primary c--full-width js-yes-button pinny__close');
        $removePersonalizationPinny.find('.c-sheet__title').text('Confirmation');
        $removePersonalizationPinny.find('.js-delete-personalization-pinny__body').html($content);
        $removePersonalizationPinny.pinny('open');
    };


    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');
        // Remove the loader and revert back to the original btn text.

        if ($removePersonalizationPinny.hasClass('js--forgot-pw')) {
            $removePersonalizationPinny.removeClass('js--forgot-pw');
            // Click cancel button
            $removePersonalizationPinny.find('button').click();
            // Reset pinny markup.
            $removePersonalizationPinny.parent().appendTo($lockup);
            $('.js-remove-personalization-shade').appendTo($lockup);
        }

        $(document).trigger('pinny.confirmationModal.close');
    };

    var _initSheet = function() {
        // zIndex values are set to ensure they appear above bundle Pinny
        sheet.init($removePersonalizationPinny, {
            zIndex: 2000,
            shade: {
                zIndex: 1999,
                cssClass: 'js-remove-personalization-shade'
            },
            close: _onSheetClose,

            open: function() {
                // if ($('.js-delete-personalization-pinny').length) {
                // }
                $('.js-to-top').addClass('c--in-active');
            },
            closed: function() {
                $('.js-to-top').removeClass('c--in-active');
            }

        });
    };

    return {
        initSheet: _initSheet,
        showRemovalConfirmationModal: _showRemovalConfirmationModal
    };
});
