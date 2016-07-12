define([
    '$',
    'global/utils',
    'translator',
    'global/ui/wishlist-item-ui',
    'global/ui/stepper-ui',
    'global/parsers/product-details-tab-parser',
    'components/sheet/sheet-ui',
    'dust!components/bellows/bellows',
    'global/ui/wishlist-create-list-modal-ui',
    'bellows'
],
function($, utils, translator, wishlistItemUI, stpperUI, productDetailsTabParser, sheet, BellowsTemplate, wishlistCreateListModalUI) {
    var $deletePinny = $('.js-delete-pinny');
    var $detailsPinny = $('.js-details-pinny');
    var deleteSheet, detailsSheet;

    var initBellows = function() {
        $('.js-details-pinny').find('.c-bellows__item').map(function(_, item) {
            var $item = $(item);
            var $icon = $item.find('.c-icon');
            if ($item.hasClass('bellows--is-open')) {
                $icon.attr('data-fallback', 'img/png/collapse.png');
                $icon.find('title').text('collapse');
                $icon.find('use').attr('xlink:href', '#icon-collapse');
            }
        });
    };


    var _getDetails = function($modal) {
        var templateContent = productDetailsTabParser.parse($modal);
        var $content;

        $modal.find('ul').addClass('c-list-bullets');

        new BellowsTemplate(templateContent, function(err, html) {
            $content = $(html);
            $content.find('.c-bellows__header').addClass('js-bellows-header');
            $content.bellows();
        });

        return $content;
    };

    var _animationListener = function() {
        if (event.animationName === 'shoppingCartAdded') {
            if ($('.ok-cancel-dlog.gwt_addtocart_div').length && $('#gwt_minicart_div').find('.gwt-HTML').text().match(/\d/) !== null && !$('.js-cart-toggle.js--new-item').length) {
                utils.animateCartIcon();
            }
        } else if (event.animationName === 'modalAdded') {
            var $deleteModal = $('.gwt-gr-delete-dialog');
            var $detailsModal = $('#gwt-product-detail-info-modal');

            if ($deleteModal.length) {
                var $buttons = $deleteModal.find('.okCancelPanel');
                var $primaryButton = $buttons.find('.primary');
                $deleteModal.removeAttr('style');
                $deleteModal.attr('hidden', 'true');

                $buttons.find('.secondary')
                    .addClass('c-button c--outline c--full-width u-margin-bottom-md js-close u-unstyle c-wishlist-delete-pinny')
                    .insertAfter($primaryButton);
                $primaryButton.addClass('c-button c--primary c--full-width').append(' >');

                deleteSheet.setTitle($deleteModal.find('.Caption').text());
                deleteSheet.setBody($buttons);

                deleteSheet.open();
            } else if ($detailsModal.length) {
                var $button = $detailsModal.find('.button');
                $button.click();
                $button.find('span').click();

                detailsSheet.setTitle($detailsModal.find('.Caption').text());
                detailsSheet.setBody(_getDetails($detailsModal));
                initBellows();
                detailsSheet.open();
            }
        }
    };

    var _bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', _animationListener);
        document.addEventListener('webkitAnimationStart', _animationListener);
    };


    var _bindEvents = function() {
        deleteSheet = sheet.init($deletePinny);
        detailsSheet = sheet.init($detailsPinny);

        $('body').on('click', '.js-close', function(e) {
            if (deleteSheet.isOpen) {
                deleteSheet.close();
            }
        });

        $('body').on('click', '.c-sheet__header-close', function(e) {
            var $closeButton = $('.js-close');
            $closeButton.click();
            $closeButton.find('span').click();
        });
    };

    var viewWishlistUI = function() {
        stpperUI();
        wishlistItemUI();
        _bindEvents();
        _bindAnimationListener();
        wishlistCreateListModalUI();

    };

    return viewWishlistUI;
});
