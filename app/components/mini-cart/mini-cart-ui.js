define([
    '$',
    'hijax',
    'translator',
    'components/sheet/sheet-ui',
    'dust!components/mini-cart/mini-cart'
],
function($, Hijax, Translator, Sheet, MiniCartTemplate) {
    var $body = $('body');

    // Initializes cart pinny
    var initCartPinny = function() {
        var $cartPinny = $('.js-cart-pinny');
        Sheet.init($cartPinny, {
            shade: {
                opacity: 0.5
            },
            open: function() {
                // GRRD-390
                $('.js-checkout-mini-cart').find('.js-mini-cart-checkout-button').removeClass('c-button c--primary').text(Translator.translate('payment_back_button'));
                $('.js-cart-toggle.js--new-item').removeClass('js--new-item c-cart-fly').removeAttr('style');
            }
        });

        $('.js-cart-toggle').on('click', function(e) {
            $cartPinny.pinny('open');

            $('.js-search').pinny('close');
            $('.js-left-nav').pinny('close');
            $body.removeClass('t-header__menu-search-open');
        });
    };

    // Parse mini cart items
    var parseCartItems = function(items) {
        var $cartContent = $('.js-cart-contents');
        var templateContent = {
            cartItems: [],
            checkoutHref: $('#shoppingCart a').attr('href')
        };

        /*eslint-disable*/
        $.each(items, function(i, item) {
            item = item.pageProduct;
            // For generation product image using "product part number" and "product select value"
            var itemSelectValue;
            var imageBaseUrl = all.BASE_S7_URL + item.mfPartNumber;
            var images = [];
            // For generation product image using "product part number" and "product select value"
            if (item.itemSelectedOptions.length) {
                for (var i=0; i<item.itemSelectedOptions.length; i++) {
                    itemSelectValue = '_' + item.itemSelectedOptions[i].selectValue;
                    images.push('<img src="' + imageBaseUrl + itemSelectValue + '" onerror="this.parentElement.removeChild(this);">');
                }
            }

            itemSelectValue = '_main';
            images.push('<img src="' + imageBaseUrl + itemSelectValue + '" onerror="this.parentElement.removeChild(this);">');

            images = images.join('');

            // var itemSelectValue = item.itemSelectedOptions.length && item.itemSelectedOptions.length < 2 ?
            //     '_' + item.itemSelectedOptions[0].selectValue : '_main';
            templateContent.cartItems.push({
                productImage: images,
                productName: item.prodName,
                qty: item.quantity,
                options: item.itemSelectedOptions.map(function(option) {
                    return {
                        value: option.optionValue
                    };
                })
            });
        });
        /*eslint-enable*/

        return templateContent;
    };

    // Add minicart title
    var shoppingCartTransform = function() {
        var $miniCartTitle = $('.js-cart-title .c-sheet__title');
        var $cart = $('#shoppingCart');
        var $cartCount = $('.js-cart-count');
        var cartCount = '';

        if (!$cartCount.length) {
            return;
        }

        if ($cart.text() && $cart.text().match(/\d+/g)) {
            cartCount = $cart.text().match(/\d+/g)[0];
            // Facing issue in using translation
            $miniCartTitle.text('Shopping Cart (' + $cart.text().match(/\d+/g) + ')');
            cartCount !== '0' ? $cartCount.removeClass('u--hide') : $cartCount.addClass('u--hide');
        }
    };

    var animationListener = function() {
        if (event.animationName === 'shoppingCartAdded') {
            shoppingCartTransform();
        }
    };

    // Implemented hijax for mini cart
    var initHijaxProxies = function() {
        var hijax = new Hijax();

        hijax.set(
            'mini-cart-proxy',
            function(url) {
                return /MiniCartView/.test(url);
            },
            {
                receive: function(data, xhr) {
                    var items = $.parseJSON(data).items;
                    var $cartContent = $('.js-cart-contents');
                    var $cartCheckoutButton = $('.js-cart-checkout-button');
                    var templateContent = parseCartItems(items);
                    var cartCount = items.length;
                    $('.js-cart-count').html(cartCount);

                    if (cartCount) {
                        $('.t-header__cart').addClass('t--count');
                    }

                    $('.js-checkout-cart-link').attr('href', templateContent.checkoutHref);

                    new MiniCartTemplate(templateContent, function(err, html) {
                        $cartContent.html(html);
                    });
                    $cartCheckoutButton.html($('.js-cart-contents').find('.js-mini-cart-checkout-button'));
                }
            }
        );
    };

    var bindEventHandlers = function() {
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };
    return {
        initHijaxProxies: initHijaxProxies,
        initCartPinny: initCartPinny,
        bindEventHandlers: bindEventHandlers
    };
});
