define([
    '$',
    'global/ui/carousel-ui'
],
function($, carouselUI) {

    // Display all products of 'You may like' section in carousel
    var changeNumberOfImagesInCarousel = function() {
        /*eslint-disable*/
        gwt_recommendations_espots_category_1_JSON.num_visible =
            gwt_recommendations_espots_category_1_JSON.num_recommendations;
        /*eslint-enable*/
    };

    var clpSaleUI = function() {
        changeNumberOfImagesInCarousel();
        carouselUI.init($('#gwt_recommendations_espots_category_1'));
    };

    return clpSaleUI;
});
