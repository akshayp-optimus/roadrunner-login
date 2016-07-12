define([
    '$',
    'global/utils',
    'dust!components/price/partials/price-discount',
    'dust!components/star-rating/star-rating',
    'global/parsers/rating-star',
    'global/ui/tooltip-ui',
    'global/utils/dom-operation-override'
],
function($, utils, DiscountPriceTemplate, RatingTemplate, globalStarRatingParser, tooltipUI, DomOverride) {

    var updatePrice = function($product, $currentProduct) {
        var $price = $product.find('.gwt-product-info-panel-avail');
        if ($price.length) {
            $currentProduct.find('.js-price').html($price.html());
        } else {
            var oldPrice = $product.find('.gwt-product-info-panel-stacked-price-was-label').html();
            var newPrice = $product.find('.gwt-product-info-panel-stacked-price-now-label').html();
            var templateData = {
                priceNew: newPrice ? newPrice.replace('Now', '') : '',
                priceOld: oldPrice ? oldPrice.replace('Was', '') : '',
                priceDiscount: true
            };
            new DiscountPriceTemplate(templateData, function(err, html) {
                $currentProduct.find('.js-price').html(html);
            });
        }
    };

    var addReviews = function($reviews, $currentProduct) {
        var rating = /filled_(\d\d)/.exec($reviews.find('.overlay').attr('class'));

        if (rating) {
            rating = parseFloat(rating[1]) * 0.1;
            var templateData = globalStarRatingParser.parse(rating, true);

            new RatingTemplate(templateData, function(err, html) {
                $currentProduct.find('.js-product-info').append(html);
            });
        }
    };

    var transformForm = function() {
        var $desktopContainer = $(arguments[0]);
        var $desktopProducts = $desktopContainer.find('.gwt-product-info-panel');
        var $products = $('.js-product-tile');

        $desktopProducts.each(function(i, product) {
            var $product = $(product);
            var $currentProduct = $products.eq(i);
            var $reviews = $product.find('.gwt-product-info-panel-bv-details-panel .bvrating');

            updatePrice($product, $currentProduct);

            if ($reviews.length) {
                addReviews($reviews, $currentProduct);
            }
        });
    };

    var updateRestrictionMessage = function() {
        var $message = $('.js-restriction-msg-container');

        if (!$message.hasClass('nodisplay')) {
            $message.parent().removeAttr('hidden');
        }
    };

    var productList2UI = function() {
        DomOverride.on('domAppend', '', transformForm, '#gwt_products_display');
        updateRestrictionMessage();
        tooltipUI();
    };

    return productList2UI;
});
