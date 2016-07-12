/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/clp-david-bromstad/clp-david-bromstad',
    'pages/clp-david-bromstad/parsers/clp-david-bromstad__products'
],
function($, baseView, template, bromstadProductsParser) {

    // Get Keys for Button Tile Component
    var getKeysForButtonTile = function($button) {
        return {
            href: $button.attr('href'),
            title: $button.attr('title'),
            buttonText: $button.text()
        };
    };

    // Get hero Images
    var getHeroImages = function($items) {
        return $items.map(function(_, item) {
            var $item = $(item);
            var $link = $item.find('a');

            return {
                href: $link.attr('href'),
                title: $link.attr('title'),
                img: $item.find('img')
            };
        });
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'clp-david-bromstad',
            davidBromstadIntro: function() {
                var $introContainer = $('#Bromstad_wrapper');
                // Replacing br tag with space to match mockup
                $introContainer.find('.module-intro h4 br').replaceWith(' ');
                return {
                    image: $introContainer.find('.pull-left'),
                    heading: $introContainer.find('.module-intro h4').html(),
                    description: {
                        bodyContent: $introContainer.find('.text-sans')
                    },
                    shopAllButton: getKeysForButtonTile($introContainer.find('.btn-primary').append(' >'))
                };
            },
            heroImages: function() {
                return getHeroImages($('.swiper-slide:not(.swiper-slide-duplicate)'));
            },
            bromstadProducts: function() {
                return bromstadProductsParser.parse();
            },
            shopEntireCollection: function() {
                return getKeysForButtonTile($('#Bromstad_SomethingForEveryRoom').find('.action'));
            }
        }
    };
});
