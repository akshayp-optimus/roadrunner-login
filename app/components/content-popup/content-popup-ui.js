define([
    '$',
    'modal-center',
    'components/sheet/sheet-ui',
    'components/content-popup/parsers/content-popup',
    'dust!components/content-popup/content-popup'
],
function($, modalCenter, Sheet, contentPopupParser, contentPopupTemplate) {

    var contentPopupTransform = function($el, parser, Template) {
        var $contentPopupSheetEl = $('.js-content-popup');
        var $contentPanel = $el;
        var templateData = parser.parse($contentPanel);

        var contentSheet = Sheet.init($contentPopupSheetEl, {
            effect: modalCenter
        });

        new Template(templateData, function(err, html) {
            contentSheet.setBody(html);

            contentSheet.open();
        });

    };

    // Display the show content popup in pinny
    var overrideShowContentPopup = function() {
        var $contentPopupPinny = $('.js-content-popup');

        var contentPopupSheet = Sheet.init($contentPopupPinny, {
            effect: modalCenter,
            cssClass: 'c--dialog'
        });

        $('a[href*="javascript:showContentPopup"]').one('click', function() {
            var desktopShopContentPopup = window.showContentPopup;
            window.showContentPopup = function() {
                var contentID = arguments[0];

                try {
                    desktopShopContentPopup.apply(this, arguments);
                } catch (e) {
                    console.log('Error calling desktop function:', desktopShopContentPopup);
                }

                contentPopupTransform($('#' + contentID), contentPopupParser, contentPopupTemplate);
            };
        });
    };

    return {
        overrideShowContentPopup: overrideShowContentPopup
    };

});
