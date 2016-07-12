define([
    '$',
    'global/ui/carousel-ui'
],
function($, carouselUI) {

    var clpUI = function() {
        carouselUI.init($('#gwt_recommendations_espots_category_1'));
    };

    return clpUI;
});
