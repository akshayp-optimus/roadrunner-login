define([
    '$',
    'global/baseView',
    'dust!pages/wishlist/wishlist',
],
function($, BaseView, template) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'wishlist',
            mainContent: function() {
                return $('#mainContent');
            },
            pageTitle: function() {
                return $('.gr-header').text();
            },
            createWishList: function(context) {
                var $createWishList = context.mainContent.find('#createWishList').remove();

                return {
                    text: $createWishList.text(),
                    button: $createWishList.addClass('u-unstyle c-create-wishList')
                };
            },
            wishlistForm: function(context) {
                return context.mainContent.find('#wishListHomeViewForm').remove();
            }
        }
    };
});
