define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
    'dust!components/notification/partials/cart-item',
    'pages/product-details/parsers/cart-item-parser'
], function($, translator, sheet, NotificationCartItemTemplate, cartItemParser) {

    var $check = $('<svg class="c-icon" data-fallback="img/png/check.png"><title>check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check"></use></svg>');
    var $wishlistPinny = $('.js-wishlist-pinny');
    var $wishlistShade = $('.js-wishlist-shade');
    var $wishlistButton;

    var _initButtons = function($wishlistButton) {
        if (!$wishlistButton) {
            $wishlistButton = $('.js-add-to-wishlist');
        }
        return $wishlistButton;
    };

    var _bindEvents = function() {
        // $wishlistButton = $('.js-add-to-wishlist');
        var $origWishlistButton = $('.gwt-top-cart-gift-registry-btns, .gwt-product-bottom-col4-content-panel').find('button').filter(function() {
            return /Registry/i.test($(this).text());
        });

        $('body').on('click', '.js-add-to-wishlist', function(e) {
            var $button = $(this);
            e.preventDefault();

            if ($button.hasClass('js-to-list')) {
                window.location.href = $('.js-view-list').attr('href');
            } else {
                // Wishlist opens a popup, will need to add transformations
                if ($origWishlistButton[0]) {
                    $($origWishlistButton[0]).find('span').click();
                }
            }
        });
    };

    var _resetPinnyMarkUp = function($wishlistButton) {
        // The wishlist pinny and shade had to be moved inside the desktop popup
        // so that events worked correctly (the desktop JS blocks all events outside their popup).
        // Now that the desktop modal is closed, move the elements back to where they should be.
        var $lockup = $('.lockup__container');
        var $wishlistButton = _initButtons($wishlistButton);
        $wishlistButton.html(translator.translate('wishlist_button'));
        $wishlistPinny.parent().appendTo($lockup);
        $wishlistShade.appendTo($lockup);
    };

    var _revertWishlistButtonToDefault = function($wishlistButton) {
        $wishlistButton = _initButtons($wishlistButton);
        $wishlistButton.html(translator.translate('wishlist_button'));
        $wishlistButton.removeClass('c--check js-to-list c-add-to-cart-message c-added-to c-add-to');
    };

    var _changeButtonToViewList = function($modal) {
        $wishlistButton = _initButtons($wishlistButton);

        var $listName = $modal.find('.dialogTopCenterInner .gwt-HTML:contains("Product Added")').text();

        $wishlistButton.addClass('js-to-list c--check c-add-to-cart-message c-added-to c-add-to');
        $wishlistButton.html('<div>' + translator.translate('view_list_button_text') + '</div>');

        if ($listName) {
            var $productAddedTo = $('<span class="c-product-added-to"/>');
            $listName = $listName.replace('Product Added to', 'Added to');
            $productAddedTo.text($listName);
            $wishlistButton.prepend($productAddedTo);
        }
        $wishlistButton.prepend('<svg class="c-icon" data-fallback="img/png/check.png"><title>check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check"></use></svg>');
        setTimeout(_revertWishlistButtonToDefault, 5000);
    };

    var _changeWishlistToSuccess = function($modal) {
        $wishlistButton = _initButtons($wishlistButton);
        $wishlistButton.html();
        _changeButtonToViewList($modal);
    };

    var _bindSelectEvent = function($select, $addButton) {
        $select.on('change', function(e) {
            var $selected = $select.find(':selected');

            if ($selected.index() !== 0) {
                // it's not the default selection, enable the add button
                $addButton.removeClass('c--is-disabled');
            } else {
                $addButton.addClass('c--is-disabled');
            }
        });
    };

    var _transformWishlistContent = function($content) {
        var $mainTable = $content.find('table');
        var $newContent = $('<div>');
        var $selectContainer = $('<div class="c-select u-margin-bottom-md">');
        var $addButton = $content.find('.button.primary');
        var $select = $content.find('.gift-registry-list-bx');

        // GRRD 239: If user is logged in, do not display Add to Registry option
        if ($('#gwt_logon_id').val().length !== 0) {
            $select.find('option:contains("Add To Existing")').remove();
        }

        // Replace table layout
        // We can't use a template partial here without losing all of the desktop event handlers
        $selectContainer.append($select);
        $newContent.append($selectContainer);

        _bindSelectEvent($select, $addButton);

        $mainTable.replaceWith($newContent);

        // Transform Buttons
        $addButton.addClass('c-button c--primary c--full-width');
        if ($addButton.attr('disabled')) {
            $addButton.addClass('c--is-disabled');
        }
        $content.find('.button.secondary').addClass('u-visually-hidden js-close-modal');
    };

    var _transformNewWishlistContent = function($content) {
        var $mainTable = $content.find('table');
        var $newContainer = $('<div>');
        var $inputContainer = $('<div class="c-field__row">');

        // Error Containers
        $newContainer.append($mainTable.find('#WishlistCreateErrorPanel'));
        $newContainer.append($mainTable.find('#gwt-gift-registry-custom-message-error-text'));

        // name input
        $inputContainer.append($('<div class="c-input">').append($mainTable.find('#wishlist_name_id')));
        $newContainer.append($inputContainer);

        // Buttons
        $newContainer.append($mainTable.find('.button.secondary').addClass('js-close-modal u-visually-hidden'));
        $newContainer.append($mainTable.find('.button.primary').addClass('c-button c--primary js-create-list-btn c--is-disabled c--full-width u-margin-top-md').append(' >'));

        $newContainer.find('.gwt-wishlist-create-name-txtbox').addClass('js-new-wishlist-textbox');
        $mainTable.replaceWith($newContainer);
    };

    var _showAddToWishlistModal = function($modal) {
        var $content = $modal.find('.gwt-submit-cancel-dialog-content-panel');
        var title = 'Select a Registry or Wish List';
        var $signInPinny = $('.js-sign-in-pinny');

        _resetPinnyMarkUp();

        if ($signInPinny.parent().hasClass('pinny--is-open')) {
            $signInPinny.pinny('close');
        }

        $modal.removeAttr('style');

        _transformWishlistContent($content);

        $wishlistPinny.find('.c-sheet__title').html(title);
        $wishlistPinny.find('.js-wishlist-pinny__body').html($content);
        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $modal.html($wishlistPinny.parent());
        $modal.append($wishlistShade);
        $wishlistPinny.pinny('open');
        // Pull for style being applied to this container, then remove
        var removeStyleInterval = setInterval(function() {
            if ($('#x-root[style*=height]').length) {
                $('#x-root').removeAttr('style');
                clearInterval(removeStyleInterval);
            }
        }, 10);
    };

    // GRRD-252
    var _enableDisableCreateListButton = function() {
        $('.js-new-wishlist-textbox').on('keyup', function() {
            var $target = $(this);
            var $button = $target.closest('.js-wishlist-pinny__body').find('.js-create-list-btn');
            if ($target.val() !== '') {
                $button.removeClass('c--is-disabled');
            } else {
                $button.addClass('c--is-disabled');
            }
        });
    };

    var _showNewWishlistModal = function($modal) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption .gwt-HTML').text();

        if (!$content.length) {
            // The transformation has already run.
            return;
        }

        _resetPinnyMarkUp();
        _transformNewWishlistContent($content);

        if (!$wishlistPinny.parent().hasClass('pinny--is-open')) {
            $wishlistPinny.pinny('open');
        }
        $wishlistPinny.find('.c-sheet__title').html(title);
        $wishlistPinny.find('.js-wishlist-pinny__body').html($content);
        $modal.html($wishlistPinny.parent());
        _enableDisableCreateListButton();
    };

    var _triggerWishlistNotification = function($modal) {
        var wishlistContent = cartItemParser.parseWishlist($modal);
        var $dismissButton = $modal.find('.button.secondary');
        var $viewListButton = $modal.find('.button.primary').addClass('c-button c--link c--small js-view-list');

        $wishlistPinny.pinny('close');

        $dismissButton.click();
        $dismissButton.find('span').click();

        _changeWishlistToSuccess($modal);

        $modal.remove();

        new NotificationCartItemTemplate(wishlistContent, function(err, html) {
            Adaptive.notification.triggerAddToCart($(html), wishlistContent.successMessage);
        });
    };


    var _onPinnyClose = function() {
        var $closeButton = $wishlistPinny.find('.js-close-modal');
        // Remove the loader and revert back to the original btn text.
        $closeButton.click();
        $closeButton.find('span').click();
        _resetPinnyMarkUp();
    };

    var _initSheet = function() {
        sheet.init($wishlistPinny, {
            close: _onPinnyClose,
            shade: {
                cssClass: 'js-wishlist-shade'
            },
            open: function() {
                if ($('.js-product-detail-widget-pinny').length) {
                    $('.js-wishlist-shade').addClass('c-shade-on-shade');
                }
                $('.js-to-top').addClass('c--in-active');
            },
            closed: function() {
                $('.js-to-top').removeClass('c--in-active');
            }
        });
    };

    return {
        bindEvents: _bindEvents,
        showAddToWishlistModal: _showAddToWishlistModal,
        initSheet: _initSheet,
        showNewWishlistModal: _showNewWishlistModal,
        triggerWishlistNotification: _triggerWishlistNotification
    };
});
