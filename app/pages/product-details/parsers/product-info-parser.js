define([
    '$',
    'global/parsers/rating-star-parser'
], function($, RatingStarParser) {

    // JSON data is from a desktop script
    var _parseTitle = function(productJSON) {
        if (!productJSON) {
            return;
        }

        var title = productJSON.prodName || productJSON.name;

        return title.replace('&amp;', '&');
    };

    var _parseRating = function(productJSON) {
        if (!productJSON) {
            return;
        }

        var stars = productJSON.descriptiveAttributes.filter(function(data, _) {
            // reduce dataset to just review number and stars
            return /Rating/i.test(data.name);
        });

        var reviews = productJSON.descriptiveAttributes.filter(function(data, _) {
            // reduce dataset to just review number and stars
            return /Number of Reviews/i.test(data.name);
        });

        if (stars.length) {
            // if rating = 3.4, i need [{filled}, {filled}, {filled}, {halfFilled}]
            var rating = parseFloat(stars[0].value);

            return {
                modifierClasses: 'c--center',
                rating: rating,
                ratingStar: RatingStarParser.parse(rating),
                reviews: reviews.length ? reviews[0].value : ''
            };
        }

    };

    return {
        parseTitle: _parseTitle,
        parseRating: _parseRating
    };
});
