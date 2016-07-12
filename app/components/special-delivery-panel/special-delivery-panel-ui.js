define([
    '$',
    'components/sheet/sheet-ui',
    'modal-center',
    'components/special-delivery-panel/parsers/special-delivery-panel__terms-and-conditions',
    'dust!components/special-delivery-panel/partials/special-delivery-panel__terms-and-conditions'
], function($, sheet, modalCenter, specialDeliveryParser, specialDeliveryTemplate) {

    var welcomeMatTransform = function($el, parser, Template) {
        var $welcomeSheetEl = $('.js-special-delivery-options-panel');
        var $welcomePanel = $el;
        var templateData = parser.parse($welcomePanel);

        $welcomePanel.remove();

        var welcomeSheet = sheet.init($welcomeSheetEl, {
            effect: modalCenter,
        });

        if ($el.is('#modal')) {
            welcomeSheet.setTitle('<svg class="c-icon c-grandin-logo" data-fallback="img/png/GR-logo.png"><title>GR-logo</title><use xlink:href="#icon-GR-logo"></use></svg>');
        } else {
            $('.c-welcome-panel').find('.pinny__header').hide();
        }

        new Template(templateData, function(err, html) {
            welcomeSheet.setBody(html);

            welcomeSheet.open();
        });

    };

    var animationListener = function() {
        if (event.animationName === 'specialDeliveryAdded') {
            var $specialDeliveryPanel = $('.termsCondModal');
            welcomeMatTransform($specialDeliveryPanel, specialDeliveryParser, specialDeliveryTemplate);
        }
    };


    var welcomePopup = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        init: welcomePopup
    };
});
