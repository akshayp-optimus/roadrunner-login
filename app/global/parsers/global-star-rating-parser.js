define(['$'],
function($) {


    var updateStars = function(stars, rating) {
        $.each(stars, function(e, star) {
            if (e + 0.5 === rating) {
                star.ratingFilledHalf = true;
            } else if (e < rating) {
                star.ratingFilled = true;
            }
        });

        return stars;
    };

    var parse = function(rating, justStars) {
        var ratingStars = [{}, {}, {}, {}, {}];

        // round the rating value to the nearest .5
        rating = Math.round(rating * 2) / 2;

        return {
            rating: rating,
            ratingStar: updateStars(ratingStars, rating),
            justStars: justStars
            // reviews: ratingCopy ? ratingCopy.replace(/[()]/g, '') : ''
        };
    };

    return {
        parse: parse
    };

});
