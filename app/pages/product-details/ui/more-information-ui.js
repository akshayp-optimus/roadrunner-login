define([
    '$',
    'translator',
    'components/sheet/sheet-ui'
], function($, translator, sheet) {
    var $moreInformationPinny = $('.js-more-information-pinny');

    var initSheet = function() {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        sheet.init($moreInformationPinny, {
            coverage: '100%',
            close: function() {
                jQuery('html[style*="overflow-y: hidden"]').removeAttr('style');
            }
        });
    };

    var parse = function(content) {
        initSheet();
        var $pinnyContent = $('<div class="c-more-info-content" />');
        $('body').append($pinnyContent);
        $('.c-more-info-content').append(content);

        $pinnyContent.find('link, style').remove();
        $pinnyContent.find('#header, img[src*="estimateYourShipping"]').remove();
        $pinnyContent.find('#header, img[src*="shoppingScreen"]').remove();
        // Set the title as first heading
        var $title = $pinnyContent.find('h1, h3').first();
        $moreInformationPinny.find('.c-sheet__title').html($title.text());
        $title.remove();

        // Remove all inline styles
        $pinnyContent.find('*').removeAttr('align');
        $pinnyContent.find('img').removeAttr('style').addClass('u-align-image-center');
        $pinnyContent.find('img[src*="closewindow"]').addClass('js-more-information__cancel u--hide');

        $pinnyContent.find('img[src*="closewindow"]').parent().replaceWith(function() {
            return $('<div class="js-more-information__cancel pinny__close button primary c-button c--primary  u-margin-bottom-sm u-margin-top-md  c-close-window-button" />').text('close >').append($(this).contents());
        });

        // Find the content and push inside pinny
        $pinnyContent.find('h1, h3').replaceWith(function() {
            return $('<h5 />').append($(this).contents());
        });

        $pinnyContent.find('h2').replaceWith(function() {
            return $('<h4/>').append($(this).contents());
        });

        $pinnyContent.find('td').addClass('u-padding-left-extra-tight');

        $pinnyContent.find('center a').addClass('pinny__close button primary c-button c--primary  u-margin-bottom-sm u-margin-top-md  c-close-window-button').prepend('< ');

        $('.js-more-information__cancel').on('click', function(e) {
            if ($moreInformationPinny.parent().hasClass('pinny--is-open')) {
                $moreInformationPinny.pinny('close');
            }
        });

        $moreInformationPinny
            .find('.js-more-information-content').addClass('c-more-information-pinny')
            .html($pinnyContent);

        $moreInformationPinny.pinny('open');
    };

    var _closeModal = function() {
        $moreInformationPinny.pinny('close');
    };

    return {
        parse: parse,
        closeModal: _closeModal
    };
});
