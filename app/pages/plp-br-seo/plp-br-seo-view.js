/**
 * Category Landing View
 */

define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/plp-br-seo/plp-br-seo',
    'pages/plp-br-seo/parsers/plp-br-seo__product-tile-parser',
    'dust!components/filter-stack/filter-stack',
    'pages/plp-br-seo/parsers/plp-br-seo__refine-results',
    'dust!components/button/button'
],
function($, Translator, baseView, template, productTileParser, filterStackTemplate, refineResultsParser, buttonTemplate) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'plp-br-seo',
            pageTitle: function() {
                return $('#categoryHeader').text();
            },
            products: function() {
                return productTileParser.parse($('#sli_resultsSection_wrapper'));
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

                var refineContentData = refineResultsParser.parse($filterContainer);
                filterStackDataArray.push(refineContentData);

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
            }
        }
    };
});
