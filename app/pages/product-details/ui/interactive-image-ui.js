define([
    '$',
    'components/sheet/sheet-ui',
    'translator'
], function($, sheet, translator) {

    var $interactiveImagePinny = $('.js-interactive-image-pinny');

    var _showInteractiveImageModal = function() {
        var $iframe = $('iframe.gwt-video-object').remove();

        $iframe.removeAttr('class');
        //_bindModalEvents();

        $interactiveImagePinny.find('.js-interactive-image-pinny__body').html($iframe);
        $interactiveImagePinny.pinny('open');
    };

    var _onSheetClose = function() {
    };

    var _initSheet = function() {
        sheet.init($interactiveImagePinny, {
            shade: {
                cssClass: 'js-interactive-image-shade'
            },
            coverage: '100%',
            close: _onSheetClose
        });
    };

    return {
        initSheet: _initSheet,
        showInteractiveImageModal: _showInteractiveImageModal
    };
});
