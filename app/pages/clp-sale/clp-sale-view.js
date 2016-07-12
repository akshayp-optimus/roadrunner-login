/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/clp-sale/clp-sale',
    'translator',
    'global/parsers/related-products',
    'global/parsers/related-searches-parser'
],
function($, baseView, template, Translator, relatedProductsParser, relatedSearchesParser) {

    // Get Sale Categories
    var getSaleCategories = function($container) {
        return $container.find('.col-xs-4').map(function(_, item) {
            var $item = $(item);
            var $link = $item.find('.action');
            return {
                href: $link.attr('href'),
                imgSrc: $item.find('img').attr('x-src'),
                secondaryHeroSubTitle: $link.text()
            };
        });
    };
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'clp-sale',
            pageHeading: function() {
                return $('#sideBox').find('#sideBoxLink img').attr('alt');
            },
            saleBanner: function() {
                return {
                    img: $('.swiper-slide').find('img')
                };
            },
            saleCategories: function() {
                return {
                    items: getSaleCategories($('#category'))
                };
            },
            mayAlsoLike: function() {
                return $('#gwt_recommendations_espots_category_1');
            },
            carouselTitle: function() {
                return Translator.translate('you_may_also_like');
            },
            relatedProducts: function() {
                return relatedProductsParser.parse($('#br_related_products'));
            },
            suggestions: function() {
                return relatedSearchesParser.parse($('#br-related-searches-widget'));
            }
        }
    };
});
