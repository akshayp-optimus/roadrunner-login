define(['$', 'translator'], function($, translator) {
    var _parse = function($welcomePanel) {

        // Remove default styling of elements.
        $welcomePanel.removeAttr('style');
        $welcomePanel.find('[style]').removeAttr('style');

        // Wrap inner content in div for styling purposes.
        $welcomePanel.wrapInner('<div class="c-welcome-subscribe" />');

        // Added different classes for styling purposes.
        $welcomePanel.addClass('pinny c-sheet c--dialog');
        $welcomePanel.find('.c-welcome-subscribe').addClass('pinny__wrapper');

        $welcomePanel.find('h1').addClass('c-heading c--2 u-margin-bottom-sm');
        $welcomePanel.find('h2').addClass('c-heading c--5 c-welcome-window-sub-heading');

        $welcomePanel.find('#email').attr('type', 'email')
            .attr('placeholder', translator.translate('email-address')).addClass('c-welcome-window-placeholder');

        $welcomePanel.find('.gwt_welcome_window_close').addClass('c-sheet__header-close')
            .html('<svg class="c-icon c--large" title="Closes"><title>Close</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg>');
        $welcomePanel.find('button')
            .addClass('c-button c--full-width c--primary u-margin-top-md')
            .append(' >');
        $welcomePanel.find('.gwt_confirmation_div').hide();

    };

    return {
        parse: _parse
    };
});
