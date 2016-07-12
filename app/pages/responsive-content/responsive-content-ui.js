define([
    '$',
    'global/ui/recommended-carousel-ui'

], function($, recommendedCarouselUI) {

    var responsiveContentUI = function() {
        recommendedCarouselUI();
    };

    return responsiveContentUI;

});
