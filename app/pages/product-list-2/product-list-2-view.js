define([
    '$',
    'global/utils',
    'global/baseView',
    'dust!pages/product-list-2/product-list-2',
    'global/utils/template-reader',
    'components/breadcrumb/parsers/breadcrumb',
    'pages/product-list-2/parsers/product-list-2__products',
    'pages/product-list-2/parsers/product-list-2__pagination',
    'global/parsers/shipping-restriction',
    'global/parsers/related-products',
    'global/parsers/related-searches-parser'
],
function($, utils, BaseView, template, JSONTemplate, breadcrumbParser, productListProductParser,
    productListPaginationParser, globalShippingRestrictionParser, globalRelatedProductsParser,
    globalRelatedSearchParser) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'product-list-2',
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul').find('li:last-child'));
            },
            hiddenInputs: function() {
                return $('#container').children('input[type="hidden"]');
            },
            pageTitle: function() {
                return $('#categoryHeader').text();
            },
            hiddenSuggestedProducts: function() {
                return $('#gwt_recommendations_product_grid_1');
            },
            showReviews: function() {
                return $('#gwt_show_bv_rating_on_cat_page').attr('hidden', 'true');
            },
            shippingRestriction: function() {
                return globalShippingRestrictionParser.parse($('#ProductCategory_InternationalShipRestrictContentEspotDiv'), $('#showIntlShipRestrictInfoPopup'));
            },
            form: function() {
                var $container = $('#changepageSizeForm');
                return $container;
            },
            formHiddenInputs: function(context) {
                return context.form.children('input[type="hidden"]');
            },
            productContainer: function(context) {
                return context.form.find('#gwt_products_display').attr('hidden', 'true');
            },
            products: function(context) {
                var productJSON = JSONTemplate.parse(context.productContainer);
                return productListProductParser.parse(productJSON);
            },
            userState: function() {
                return $('#gwt_user_state');
            },
            sortBy: function() {
                return $('#sortBy');
            },
            itemsPerPage: function() {
                return $('#topItemsPerPage');
            },
            bottomItemsPerPage: function() {
                return $('#bottomItemsPerPage');
            },
            pagination: function(context) {
                return productListPaginationParser.parse(context.form.find('.pagination').first());
            },
            relatedProducts: function() {
                return $('.br_related_products').length ? globalRelatedProductsParser.parse($('.br_related_products')) : null;
            },
            carouselTitle: function() {
                return $('.br-found-heading');
            },
            suggestions: function() {
                return $('#br-related-searches-widget').length ? globalRelatedSearchParser.parse($('#br-related-searches-widget')) : null;
            }
        }
    };
});
