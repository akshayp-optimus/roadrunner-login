define([
    '$',
    'global/parsers/rating-star'
], function($, globalStarRatingParser) {

    // Check for More colors
    // Remove more color string from product image if present
    var isMoreColorsAvailable = function($productImage, isUIScript) {
        var moreColorsString = '&badgeValue=morecolors';
        var srcAttribute = 'data-src';

        if ($productImage.attr(srcAttribute).match(new RegExp(moreColorsString)) !== null) {
            $productImage.attr(srcAttribute, $productImage.attr(srcAttribute).replace(moreColorsString, ''));
            $productImage.attr('data-alternative', $productImage.attr('data-alternative').replace(moreColorsString, ''));
            return true;
        }
        return false;
    };

    // Get product Ratings
    var parseRating = function(reviewSrc) {
        var rating = /(\d\_\d)\.gif/.exec(reviewSrc);

        if (rating) {
            // turn the rating value into a float
            rating = parseFloat(rating[1].replace('_', '.'));

            return globalStarRatingParser.parse(rating, true);
        }
    };

    var _useHigherResImage = function($img) {
        var srcType = $img.attr('src') ? 'src' : 'x-src';
        var src = $img.attr(srcType);
        var alternateSrc = $img.attr('data-alternative');

        // Normally, we'll replace the sizeType value to 'MobifyRetina'
        // but for this site, you'll get images with extra white margins
        // so we'll just remove the sizeType to give us a 400x400 image without that extra margin.
        var regex = /&?sizeType=[^&]+/;

        var newSrc = src.replace(regex, '');
        var newAlternateSrc = alternateSrc ? alternateSrc.replace(regex, '') : null;

        return $img
            .attr(srcType, newSrc)
            .attr('data-alternative', newAlternateSrc);
    };

    var parse = function($products, isUIScript) {
        return $products.map(function(_, product) {
            var $product = $(product);
            var $productLink = $product.find('.product-link');
            var $productImage = _useHigherResImage($product.find('.cin-image'));
            $productImage.removeAttr('onmouseout').removeAttr('onmouseenter').addClass('js-product-tile-image');

            $productLink.attr('class') + ' ';

            var srcAttribute = 'x-src';
            if (isUIScript) {
                srcAttribute = 'src';
            }
            // Adding lazy loading
            $productImage.attr('data-src', $productImage.attr(srcAttribute));
            $productImage.removeAttr(srcAttribute);

            return {
                class: $product.attr('class') + ' c--lazy-loading u-text-center ',
                productLink: $productLink,
                productLinkClass: 'c--large',
                productHref: $productLink.attr('href'),
                moreColors: isMoreColorsAvailable($productImage, isUIScript),
                productImg: $productImage,
                productTitle: $product.find('.cin-title'),
                productPrice: {
                    priceLineID: $product.find('.priceLine').attr('id'),
                    priceLineClass: 'priceLine'
                },
                productRating: parseRating(isUIScript ? $product.find('.cin-rating-image').attr('src') : $product.find('.cin-rating-image').attr('x-src')),
                productSwatches: {
                    swatches: {
                        swatcheSrc: $productImage.attr('data-alternative')
                    }
                },
                calloutText: $product.find('.cin-callout').text()
            };
        });
    };

    return {
        parse: parse
    };
});
