define([
    '$',
    'components/sheet/sheet-ui'
    // 'swap'
], function($, sheet) {

    var bindEvents = function() {
        var $tooltipPinny = $('.js-tooltip-pinny');
        var tooltipSheet;

        sheet.init($tooltipPinny);

        tooltipSheet = $tooltipPinny.data('component');

        $('body').on('click', '.js-tooltip-button', function(e) {
            var $button = $(this);
            var $target = $button.siblings($button.attr('data-target'));
            var $tooltipContent = $target.find('.inst-copy, .js-content').clone();
            e.preventDefault();
            e.stopPropagation();

            if (!$tooltipContent.length) {
                $tooltipContent = $target.children().clone();
            }

            $tooltipContent.removeAttr('style');
            // $tooltipContent.find('b').swap('span');
            $tooltipContent.find('img').wrap('<div class="u-margin-top-md u-margin-bottom-sm u-text-align-center">');

            $tooltipPinny.find('.js-tooltip-content').html($tooltipContent);
            tooltipSheet.open();
        });
    };


    var tooltipUI = function() {
        bindEvents();
    };

    return tooltipUI;
});
