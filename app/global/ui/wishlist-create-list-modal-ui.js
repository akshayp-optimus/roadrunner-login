define([
    '$',
    'global/ui/wishlist-ui'
], function($, wishlistModalUI) {

    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $newWishlistModal = $('#gwt-wishlist-create-modal');

            if ($newWishlistModal.length) {
                wishlistModalUI.showNewWishlistModal($newWishlistModal);
            }
        }
    };

    var wishlistCreateListModalUI = function() {
        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);
        wishlistModalUI.initSheet();
    };

    return wishlistCreateListModalUI;
});
