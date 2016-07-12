define([
    '$',
    'hijax',
    'global/parsers/carousel',
    'dust!components/carousel/partials/carousel__products'
],
function($, Hijax, carouselParser, carouselTemplate) {

    // Create carousel structure
    var buildCarouselStructure = function($container) {
        var data = carouselParser.parse($container);
        carouselTemplate(data, function(err, html) {
            $('.js-carousel__items').html(html);
        });

        // Display the carousel section that is initially hidden.
        $('.js-carousel-container').removeClass('u--hide');

        // Adds related products in 'you may also like carousel'
        $('.js-carousel__items').append($('.js-related-products').children());
    };

    // setTimeout has been used as the image src is created by some desktop script
    // that takes some lag. Tried piolling also but could not get the src
    // TODO: Atatch event listner and remove setTimeout
    var carouselHijax = function($container) {
        var hijax = new Hijax();
        hijax.set(
            'recommendations', function(url) {
                return /RecommendationsJSONCmd/.test(url);
            }, {
                complete: function() {
                    setTimeout(function() {
                        buildCarouselStructure($container);
                    }, 1000);
                }
            }
        );
    };

    var init = function init($container) {
        carouselHijax($container);
    };

    return {
        init: init
    };
});
