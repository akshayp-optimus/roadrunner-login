/**
 * Product List Page View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/product-list/product-list',
    'dust!components/button/button',
    'dust!components/filter-stack/filter-stack',
    'pages/product-list/parsers/product-list__refine-result',
    'components/breadcrumb/parsers/breadcrumb',
    'global/parsers/related-products',
    'pages/product-list/parsers/product-list__products',
    'pages/product-list/parsers/product-list__sort-by',
    'pages/product-list/parsers/product-list__pagination',
    'pages/product-list/parsers/product-list__number-of-results',
    'global/parsers/shipping-restriction',
    'pages/product-list/parsers/product-list__refine-category'
],
function($, baseView, template, buttonTemplate, filterStackTemplate, refineResultParser,
    breadcrumbParser, relatedProductsParser, productListProductParser, productListSortByParser,
    productListPaginationParser, productListNumberOfResultsParser, shippingRestrictionParser, refineCategoryParser) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'product-list',
            brSeoPageContainer: function() {
                return $('.view-BRThematicView');
            },
            isSearchPage: function() {
                return $('.area-ProductSearch, .view-BRThematicView').length ? true : false;
            },
            isNoSearchResultPage: function() {
                return $('.sli_noresults_container').length ? true : false;
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sli_bct').find('.sli_browse_cat:last').parent());
            },
            pageTitle: function() {
                return $('#categoryHeader, .sli_bct_search_results').text();
            },
            products: function() {
                return productListProductParser.parse($('#sli_products').find('.cin-catalog-item'));
            },
            sortBy: function() {
                return productListSortByParser.parse($('.cin-filter-sortby'));
            },
            shippingRestriction: function() {
                return shippingRestrictionParser.parse($('#ProductCategory_InternationalShipRestrictContentEspotDiv'), $('#showIntlShipRestrictInfoPopup'));
            },
            pagination: function() {
                var $paginationContainer = $('.cin-filter-pager').first();
                return productListPaginationParser.parse($paginationContainer);
            },
            numberOfResults: function() {
                return productListNumberOfResultsParser.parse($('.sli_bct_num_results').parent());
            },
            refineResult: function(context) {
                var $filterContainer = $('#sli_leftNav');
                var refineButtonData = {
                    class: 'c--full-width c--outline js-refine-button c--small',
                    buttonText: 'Refine Results',
                    buttonIcon: 'chevron-down'
                };

                var $refineButton;
                var $refineContent;
                var filterStackDataArray = [];
                if ($filterContainer.find('.cin-sidebox-navigation > .cin-group > li.cin-current > ul').length) {
                    var refineCategoryData = refineCategoryParser.parse($filterContainer);
                    filterStackDataArray.push(refineCategoryData);
                }
                if (!context.brSeoPageContainer.length) {
                    var refineContentData = refineResultParser.parse($filterContainer);
                    filterStackDataArray.push(refineContentData);
                }

                var filterStackData = {
                    filterStackItems: filterStackDataArray
                };

                // Html for refine filter-stack header
                buttonTemplate(refineButtonData, function(err, html) {
                    $refineButton = $(html);
                });

                // Html for refine filter-stack Body
                filterStackTemplate(filterStackData, function(err, html) {
                    $refineContent = $(html);
                });

                return {
                    items: {
                        refineButton: $refineButton,
                        bellowsContent: $refineContent
                    }
                };
            },
            relatedProductsSection: function() {
                var $relatedProducts = $('#br_related_products');
                if (!$relatedProducts.children().length) {
                    return;
                }
                return {
                    carouselTitle: $('.br-found-heading'),
                    relatedProducts: relatedProductsParser.parse($relatedProducts)
                };
            },
            relatedSearches: function() {
                var searchData = {termSuggestions: ''};
                var $suggestions = $('.br-related-query');
                if (!$suggestions.length) {
                    return;
                }
                searchData.termSuggestions = $('.br-related-query').map(function(i, suggestion) {
                    return $(suggestion).find('.br-related-query-link');
                });
                return {
                    relatedSearchHeader: $('.br-related-heading').text(),
                    suggestions: searchData
                };
            },
            desktopBreadcrumbContainers: function(context) {
                // GRRD-488: Fix search header title
                return context.body.find('#breadcrumbs, #sli_bct');
            },
            youMayAlsoLikeContainer: function() {
                return $('#sideBoxRec');
            }
        }
    };
});
