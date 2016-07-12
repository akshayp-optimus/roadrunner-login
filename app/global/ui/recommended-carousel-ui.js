define([
    '$',
    'hijax',
    'translator',
    'dust!components/products-scroller/products-scroller'
], function($, Hijax, translator, ProductScrollerTemplate) {
    var $recommendedProductsContainer = $('.js-recommended-products');

    var _getCrouselTitle = function($carousel) {
        var $header = $carousel.find('.header');
        var headerText = $header.text().trim();

        return headerText.length ? headerText : translator.translate('you_may_also_like');
    };

    var _transformRecommendations = function() {
        var $carousels = $('.gwt-we-suggest-panel-horizontal, .gwt-we-suggest-panel-vertical');

        $carousels.each(function(i, carousel) {
            var $carousel = $(carousel);
            var $images = $();

            var templateData = {
                title: _getCrouselTitle($carousel),
                slideshow: {
                    productTiles: $carousel.find('.carouselTile').map(function(i, productTile) {
                        var $productTile = $(productTile);
                        var $imageLink = $productTile.find('.gwt-we-suggest-panel-img-anchor');
                        $images = $images.add($imageLink);
                        return {
                            productVertical: true,
                            productHref: $imageLink.attr('href'),
                            productTitle: $productTile.find('.gwt-we-suggest-panel-name-anchor').text()
                        };
                    })
                }
            };

            new ProductScrollerTemplate(templateData, function(err, html) {
                var $content = $(html);

                $content.find('.js-product-img').each(function(i, img) {
                    $(img).replaceWith($images.eq(i).find('img').addClass('c-ratio__item'));
                });

                $carousel.replaceWith($content);
            });
        });
    };

    var recommendedCarouselUI = function() {
        var hijax = new Hijax();

        hijax.set(
            'suggested-products-proxy',
            function(url) {
                return /RecommendationsJSONCmd/.test(url);
            },
            {
                complete: function(data, xhr) {
                    _transformRecommendations();
                }
            }
        );
    };

    return recommendedCarouselUI;
});
