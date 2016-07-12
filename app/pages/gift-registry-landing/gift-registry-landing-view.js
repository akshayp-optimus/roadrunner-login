/**
 * Gift Registry Landing View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-landing/gift-registry-landing',
    'translator',
    'pages/gift-registry-landing/parsers/product-tile-parser',
    'components/need-help/parsers/need-help'

],
function($, baseView, template, Translator, productTileParser, needHelpParser) {

    var _decorateStaticContent = function($mainContent) {
        $mainContent.addClass('c-registry-menu u-clear-both');
        $mainContent.find('h4').addClass('c-registry-options u-text-uppercase');
        $mainContent.find('h6').addClass('c-registry-button u-text-lowercase').append(' >');
        return $mainContent;
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'gift-registry-landing-page',
            hiddenData: function() {
                return $('#giftRegistryForms');
            },
            registryButtons: function() {
                return _decorateStaticContent($('.main-menu-choice'));
            },
            img: function() {
                return $('#hero').find('img').first();
            },
            categories: function() {
                return $('#category-cells');
            },
            categoryOptionsHeading: function(context) {
                return context.categories.find('h2').text();
            },
            products: function(context) {
                return productTileParser.parse(context.categories);
            },
            needHelpSection: function() {
                return needHelpParser.parse($('.gr_home_header_phone'));
            },
            giftCardHref: function() {
                return $('#gift-registry-body').find('[title*="Gift Card"]').attr('href');
            }
        }
    };
});
