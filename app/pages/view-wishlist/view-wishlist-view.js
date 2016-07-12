define([
    '$',
    'global/baseView',
    'dust!pages/view-wishlist/view-wishlist',
    'global/parsers/cart-item-parser',
    'translator'
],
function($, BaseView, template, cartItemParser, Translator) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'view-wishlist',
            pageTitle: function() {
                return $('.gr-header').text();
            },
            chooseWislistForm: function() {
                var $chooseWislistForm = $('#wishListHomeViewForm');

                return {
                    form: $chooseWislistForm,
                    hiddenInputs: $chooseWislistForm.find('input[type="hidden"]'),
                    label: $chooseWislistForm.find('#registry_name'),
                    dropdown: $chooseWislistForm.find('#descriptionGR')
                };
            },
            createWishlist: function() {
                return $('#createWishList').text('create new').addClass('u-unstyle');
            },
            wishlistItemsForm: function() {
                var $wishListItemsForm = $('#wishListItemsForm');
                var $sort = $wishListItemsForm.find('#sortBy');

                $sort.find('option').append('&#x200E;');

                return {
                    form: $wishListItemsForm,
                    hiddenInputs: $wishListItemsForm.find('input[type="hidden"]'),
                    itemsInWishlist: $wishListItemsForm.find('.gift_registry_items_count_number'),
                    sortBy: $sort.addClass('u-unstyle')
                };
            },
            errorMessagesContainer: function() {
                return $('#topErrorMessages');
            },
            isEmpty: function(context) {
                return !!context.errorMessagesContainer.length;
            },
            emptyListMessage: function(context) {
                if (context.isEmpty) {
                    return {
                        infoText: context.errorMessagesContainer.children('p').text()
                    };
                }
            },
            addProductsButton: function(context) {
                return context.errorMessagesContainer.find('.button.primary').addClass('c-begin-adding-items-button');
            },
            deleteButton: function() {
                return $('#wish_list_remove').remove().addClass('u-unstyle u--bold u-text-align-center');
            },
            wishlistProducts: function() {
                var $wishlistProducts = $('#giftRegistryQuantityForm');
                return {
                    form: $wishlistProducts,
                    hiddenInputs: $wishlistProducts.find('input[type="hidden"]'),
                    products: cartItemParser.parseWishlistItem($wishlistProducts.find('.GRProductsInView tbody tr'))
                };
            },
            addItemsToCart: function() {
                return $('#wish_list_add_all_items_to_cart').addClass('u-margin-bottom-gt-md c-button c--primary c--full-width').append(' >');
            },
            hiddenLabels: function() {
                return $('#mainContent').children('.nodisplay, [style*="display:none"]');
            },
            socialButtons: function() {
                return {
                    items: {
                        sectionTitle: Translator.translate('share'),
                        bellowsContent: $('#socialPlugins').addClass('c-social-link-share')
                    }
                };
            },
            itemsForm: function() {
                var $form = $('#wishListHomeViewForm');

                return {
                    form: $form,
                    hiddenInputs: $form.find('[type="hidden"]'),
                    products: cartItemParser.parseWishlistItem($form.find('.GRProductsInView tbody tr'))
                };
            }
        }

    };
});
