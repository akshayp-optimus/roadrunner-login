define([
    '$'
], function($) {
    var _parse = function(rating) {
        if ($.type(rating) !== 'number') {
            return;
        }

        var $ratingStar = [];
        var $ratingStarWhole = Math.floor(rating);
        var $ratingStarHalf = rating % 1;

        // build $ratingStars
        for (var i = 0; i < $ratingStarWhole; i++) {
            $ratingStar.push({ratingFilled: true});
        }

        if ($ratingStarHalf > 0.5) {
            $ratingStar.push({ratingFilledHalf: true});
        }

        // build empty stars
        var remaining = 5 - $ratingStar.length;
        for (var i = 0; i < remaining; i++) {
            $ratingStar.push({ratingFilled: false});
        }

        return $ratingStar;
    };

    return {
        parse: _parse
    };
});
