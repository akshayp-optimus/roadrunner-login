define(['$'], function($) {


    var _parseItems = function($items) {
        return $items.map(function(i, item) {
            var $item = $(item);
            return {
                name: $item.find('.addToCartProductName').text(),
                options: $item.find('.oios-option-line').map(function(i, optionLine) {
                    var $optionLine = $(optionLine);
                    return {
                        value: $optionLine.find('.ois-option-value').remove().text(),
                        label: $optionLine.text()
                    };
                }),
                price: {
                    label: $item.find('.gwt_addtocartdiv_pricelabel').text(),
                    value: $item.find('.gwt_addtocartdiv_price').text()
                },
                qtyValue: $item.find('.gwt_addtocartdiv_quanity, .gwt_grDiv_quantity').text()
            };

        });
    };

    var _parseCart = function($fullModal) {
        return {
            items: _parseItems($fullModal.find('.addToCartItem')),
            checkoutButton: {
                text: $fullModal.find('.button.primary').text(),
                href: $('.js-cart__footer-link a').attr('href')
            },
            successMessage: $fullModal.find('.dialogTopCenterInner .gwt-HTML').text()
        };
    };

    var _buildWishlistHref = function() {
        return $('#wishlist').find('a').attr('href');
    };

    var _parseWishlist = function($fullModal) {
        var $viewListButton = $fullModal.find('.button.primary');
        return {
            items: _parseItems($fullModal.find('.addToCartItem')),
            checkoutButton: '',
            viewListButton: {
                text: $viewListButton.text(),
                href: _buildWishlistHref()
            },
            successMessage: $fullModal.find('.dialogTopCenterInner .gwt-HTML').first().text()
        };
    };

    return {
        parseCart: _parseCart,
        parseWishlist: _parseWishlist
    };
});
