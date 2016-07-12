define([
    '$',
    'global/utils',
    'translator',
    'dust!components/notification/partials/cart-item',
    'pages/product-details/parsers/cart-item-parser'
], function($, utils, translator, NotificationCartItemTemplate, cartItemParser) {
    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');
    var $check = $('<svg class="c-icon-svg " title="Checks"><title>Check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check-button"></use></svg>');
    var $addToCartButton;

    var _initButtons = function($addToCartButton) {
        if (!$addToCartButton) {
            $addToCartButton = $('.js-add-to-cart');
        }
        return $addToCartButton;
    };

    var _changeButtonToLoading = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.html($loader);
        $addToCartButton.addClass('c--primary');
    };

    var _revertButtonToDefault = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.html(translator.translate('add_to_cart'));
        $addToCartButton.removeClass('c--success c-add-to c--check js-to-cart c--added-to js-viewcart-checkout-button');
        $addToCartButton.addClass('js-add-to-cart c-add-to-cart-button c--primary c--is-disabled');
    };


    var swapDivPostion = function() {
        var $sugestedProduct = $('.js-suggested-products');
        var $productBellows = $('.js-product-detail-bellow');
        $sugestedProduct.after($productBellows);
    };

    var _changeButtonToViewCartCheckout = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.addClass('js-viewcart-checkout-button c-button');
        $addToCartButton.removeClass('js-add-to-cart c-add-to-cart-button c--success c-add-to c--check js-to-cart c--added-to');

        $addToCartButton.html(translator.translate('viewcart_checkout_button'));

        // This is required to trigger the listener for data refresh happening
        // after product is added to cart
        $(document).trigger('addedToCart');

        // Re-enabled as the above event will disable the button.
        $addToCartButton.removeClass('c--is-disabled');
    };

    var _changeButtonToViewCart = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.addClass('js-to-cart c--success c-add-to c--check c-button c--added-to').removeClass('c--is-disabled');


        $addToCartButton.html(translator.translate('view_cart_button_text'));
        $addToCartButton.prepend('<svg class="c-icon" data-fallback="img/png/check.png"><title>check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check"></use></svg>');
        utils.animateCartIcon(jQuery('.js-cart-toggle').not('.c-cart-fly'));

        // Swap functionality for PDP #1 and #2
        if ($('#gwt-bundle-det-insp-see-coll').length === 0) {
            swapDivPostion();
        }

        setTimeout(_changeButtonToViewCartCheckout, 2000);
    };

    var _changeButtonToSuccess = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);

        setTimeout(_changeButtonToViewCart, 2000);
    };


    var _triggerNotification = function($modal) {
        // var cartContent = cartItemParser.parseCart($modal);
        $modal.find('button.secondary span').click();
        _changeButtonToSuccess();
    };


    var _bindEvents = function($addToCartButton) {
        var headerBarHeight = $('.js-header__top').height();
        var $cartToggle = $('.js-cart-toggle');
        var $cartButton = $('.gwt-top-cart-gift-registry-btns, .gwt-bundle-add-to-cart-btn').find('button').filter(function() {
            return /cart/i.test($(this).text());
        });

        $('body').on('click', '.js-add-to-cart', function(e) {
            var $button = $(this);
            e.preventDefault();

            if ($button.hasClass('js-to-cart')) {
                // Navigate to the cart
                window.location.pathname = $('.js-cart__footer-link a').attr('href');
            } else {
                var _scrollTo = window.scrollTo;
                window.scrollTo = function() {};
                _changeButtonToLoading($button);
                $cartButton.find('span').click();
                window.scrollTo = _scrollTo;
            }
        });

        $('body').on('click', '.js-viewcart-checkout-button', function(e) {
            e.preventDefault();

            window.location = $('#shoppingCart a').attr('href');
        });

        $(window).on('scroll', function(e) {
            if ($cartToggle.hasClass('js--new-item')) {
                var scrollPosition = document.body.scrollTop;

                if (scrollPosition <= headerBarHeight) {
                    $cartToggle.removeClass('c-cart-fly').removeAttr('style');
                } else if (!$cartToggle.hasClass('c-cart-fly')) {
                    utils.animateCartIcon($cartToggle);
                    // $cartToggle.addClass('c-cart-fly').attr('style', 'transform: translateY(45px);');
                }
            }
        });

        // When we make a new selection ensure that the add-to-cart button
        // is reset to it's original state, as a previous item may have been added
        // and it's state is in "view/checkout".
        $('body').on(
            'click',
            '.js-product-options-container .js-thumbnails,' +
            '.js-product-options-container [class*="js-stepper"]:not(".c--disabled")',
            function() {
                _revertButtonToDefault($('.js-viewcart-checkout-button'));
            }
        ).on(
            'change',
            '.js-product-options-container select',
            function() {
                _revertButtonToDefault($('.js-viewcart-checkout-button'));
            }
        );
    };


    return {
        bindEvents: _bindEvents,
        triggerNotification: _triggerNotification
    };
});
