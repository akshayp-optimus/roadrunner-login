/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/clp/clp',
    'translator'
],
function($, baseView, template, Translator) {

    // Get categories images and text
    var getCategories = function($container) {
        return $container.find('.wrapper').map(function(_, item) {
            var $item = $(item);
            var $link = $item.children('a');
            return {
                href: $link.attr('href'),
                title: $link.attr('title'),
                imgSrc: $item.find('img').attr('x-src'),
                secondaryHeroSubTitle: $item.find('.action').text()
            };
        });
    };

    // Get see all button based on the category eg: all bedding
    var getSeeAllButton = function($seeAllButton) {
        return {
            href: $seeAllButton.attr('href'),
            title: $seeAllButton.attr('title'),
            buttonText: $seeAllButton.text()
        };
    };

    // GRRD-90 - Get More categories
    var getMoreCategories = function() {
        var $moduleHeading = $('.module-headline').last().closest('.row');
        var $container = $('<div></div>');
        var $moduleItem = $moduleHeading.next();

        while ($moduleItem.hasClass('col-xs-4')) {
            var $currentItem = $moduleItem;
            $moduleItem = $moduleItem.next();
            $container.append($currentItem);
        }
        return {
            title: $moduleHeading.find('h3').text(),
            items: getCategories($container)
        };
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'clp',
            heading: function() {
                // Complete selector is required to get the alt text
                return $('#sideBox #sideBoxHeader').find('a').first().text();
            },
            heroImage: function() {
                var $heroImageLink = $('#category').find('.swiper-slide-visible a');
                $heroImageLink = $heroImageLink.length ? $heroImageLink : $('#category').find('.col-xs-12 a') ;
                return {
                    href: $heroImageLink.attr('href'),
                    title: $heroImageLink.attr('title'),
                    img: $heroImageLink.find('img')
                };
            },
            moreCategories: function() {
                var $moduleHeading = $('.module-headline');
                if ($moduleHeading.length > 1) {
                    return getMoreCategories($moduleHeading);
                }
            },
            categories: function() {
                var $moduleHeading = $('.module-headline');

                var $seeAllButton = $moduleHeading.find('.action');
                return {
                    title: $moduleHeading.first().find('h3').text(),
                    items: getCategories($('#category').find('.col-xs-6, .col-xs-4')),
                    allBedding: $seeAllButton.length ? getSeeAllButton($seeAllButton) : false
                };
            },
            mayAlsoLike: function() {
                return $('#gwt_recommendations_espots_category_1');
            },
            carouselTitle: function() {
                return Translator.translate('you_may_also_like');
            }
        }
    };
});
