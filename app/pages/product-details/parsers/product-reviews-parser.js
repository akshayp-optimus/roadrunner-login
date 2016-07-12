define([
    '$',
    'dust!components/refine/refine'
], function($, refineTemplate) {
    // A little confusing here as we're mapping so the index we're passing it
    // here isn't going to count down from 5-1, instead  maps forward and is
    // 0 indexed thus: 0 = 5, 1 = 4, 2 = 3, 3 = 2, 4 = 1
    var _mapRatingOverviewStars = function(numStars) {
        if (numStars === 0) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 1) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 2) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 3) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}]
            };
        } else {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}]
            };
        }
    };

    var _getStarData = function($review) {
        var rating = $review.find('.BVImgOrSprite').attr('alt').match(/[+-]?\d+(\.\d+)?/g)[0];
        var ratingStarData = [];

        for (var i = 0; i < 5; i++) {
            i < rating ? ratingStarData.push({ratingFilled: true}) : ratingStarData.push({ratingFilled: false});
        }

        return {
            justStars: true,
            ratingStar: ratingStarData
        };
    };

    // On decimal values of > .5, we want to round down the stars, for values of < .5 we'll round up.
    var _getOverallRatingStars = function($reviewsContainer) {
        var ratingArr = $reviewsContainer.find('.BVRROverallRatingContainer .BVImgOrSprite').first().attr('alt').match(/[+-]?\d+(\.\d+)?/g)[0].split('.');
        var ratingStarData = [];
        var rating = ratingArr[0];

        if (ratingArr.length > 1) {
            var decimalRating = ratingArr[1];

            for (var i = 0; i < 5; i++) {
                if (i < rating) {
                    ratingStarData.push({ratingFilled: true});
                } else {
                    decimalRating < 5 ? ratingStarData.push({ratingFilledHalf: true}) : ratingStarData.push({ratingFilled: true});
                }
            }
        } else {
            for (var x = 0; x < 5; x++) {
                x < rating ? ratingStarData.push({ratingFilled: true}) : ratingStarData.push({ratingFilled: false});
            }
        }

        return {
            ratingStar: ratingStarData,
            justStars: true
        };
    };

    var _getRefineMarkup = function($reviewsContainer) {
        var $refineMarkup;
        var refineData = {
            refine: $reviewsContainer.find('.BVRRQuickTakeContainer').map(function(_, container) {
                var $container = $(container);
                var $refineOptions = $container.find('li.BVRRTagFilter').map(function(_, filter) {
                    var $filter = $(filter);

                    return {
                        refineText: $filter.find('a').text(),
                        refineNumber: $filter.find('.BVRRNote').text(),
                        checked: $filter.hasClass('BVRRTagFilterOn')
                    };
                });

                return {
                    title: $container.find('.BVRRQuickTakeLabel').clone().find('span').remove().end().text(),
                    desktopClass: $container.clone().removeClass('BVRRQuickTakeContainer').attr('class'),
                    refineOptions: $refineOptions
                };
            })
        };

        refineTemplate(refineData, function(_, out) {
            $refineMarkup = $(out);
        });

        return $refineMarkup;
    };

    var parse = function($reviewsContainer, isModal) {
        var $reviews = $reviewsContainer.find('.BVRRContentReview').map(function(_, review) {
            var $review = $(review);
            var reviewDescription = $review.find('span.BVRRReviewText').text();
            var $reviewNumbers = $review.find('.BVRRReviewFeedbackSummaryContainer .BVRRNumber');
            var helpfulReviews = $reviewNumbers.first().text();
            var totalReviews = $reviewNumbers.last().text();
            var $author = $review.find('.BVRRUserNickname');

            $author.find('a').addClass('u-text-dark-grey');

            return {
                class: 'u-margin-top-md',
                desktopId: $review.attr('id'),
                reviewAuthor: $author,
                reviewDate: $review.find('.BVRRReviewDate').first().text(),
                reviewTitle: $review.find('.BVRRReviewTitle').text(),
                desc: {
                    bodyContent: reviewDescription.trim(),
                    class: 'u-padding-none u-margin-bottom-md'
                },
                reviewPros: $review.find('.BVRRReviewProsContainer').text(),
                reviewCons: $review.find('.BVRRReviewConsContainer').text(),
                footer: isModal,
                starRating: _getStarData($review),
                numberHelpful: $reviewNumbers.length ? '(' + helpfulReviews + ')' : '(0)',
                numberNotHelpful: $reviewNumbers.length ? '(' + (totalReviews - helpfulReviews) + ')' : '(0)'
            };
        });

        var $ratingsBreakdown = $reviewsContainer.find('.BVRRHistogramBarRow').map(function(idx, row) {
            var $row = $(row);

            return {
                percentage: $row.find('.BVRRHistogramPercentageLabel').text(),
                numStars: $row.find('.BVRRHistStarLabelText').text(),
                stars: _mapRatingOverviewStars(idx)
            };
        });

        var $selectOptions = $reviewsContainer.find('.BVRRSortAndSearch .BVRRDisplayContentSelect option').map(function(_, option) {
            var $option = $(option);

            return {
                optVal: $option.attr('value'),
                selected: $option.prop('selected'),
                text: $option.text(),
            };
        });

        var $activeFilters = $reviewsContainer.find('.BVRRTagFilterOn');
        var $refineFilters;

        if ($reviewsContainer.find('.BVRRQuickTakeContainer').length) {
            $refineFilters = {
                class: 'js-refine-bellows c--light c--bordered u-margin-bottom-md',
                bellowsItemClass: 'u-no-border',
                items: {
                    sectionTitle: $activeFilters.length ? 'Refine ' + $activeFilters.first().find('.BVRRNote').text() : 'Refine',
                    isOpen: $('.js-refine-bellows').find('.bellows--is-open').length ? true : false,
                    bellowsContent: _getRefineMarkup($reviewsContainer)
                }
            };
        }

        var $paginationCurrPage = $reviewsContainer.find('.BVRRSelectedPageNumber');
        var $paginationNextPage = $reviewsContainer.find('.BVRRPageNumber').last();

        return {
            ratingsBreakdown: isModal ? false : {
                info: $ratingsBreakdown
            },
            reviews: isModal ? $reviews : $reviews.slice(0, 4),
            showModalBtn: !isModal,
            hr: !isModal,
            overallRating: _getOverallRatingStars($reviewsContainer),
            filters: isModal,
            selectOptions: $selectOptions.length ? $selectOptions : '',
            pagination: isModal,
            isModal: isModal,
            currPage: $paginationCurrPage.length ? $reviewsContainer.find('.BVRRSelectedPageNumber').text() : '1',
            numPages: $paginationNextPage.length ? $reviewsContainer.find('.BVRRPageNumber').last().text() : '1',
            disableNext: $reviewsContainer.find('.BVRRNextPage').length ? false : true,
            disablePrev: $reviewsContainer.find('.BVRRPreviousPage').length ? false : true,
            refineFilters: $refineFilters
        };
    };

    return {
        parse: parse
    };
});
