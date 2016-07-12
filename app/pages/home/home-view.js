/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/home/home'
],
function($, baseView, template) {

    var getCorrectResolution = function(imgSrc) {
        var dpr = window.devicePixelRatio || 1;
        dpr = Math.floor(dpr);

        if (dpr >= 2) {
            // Add '@2x' or '@3x'
            return imgSrc.replace(/\.(jpg|png|gif)/i, '@' + dpr + 'x$&');
        } else {
            return imgSrc;
        }
    };

    var useMobileAssetIfExist = function($el) {
        var $image = $el.is('img') ? $el : $el.find('img');
        var mobileSrc = $image.attr('data-mobile-src');

        if (mobileSrc) {
            // $image.attr('x-src', getCorrectResolution(mobileSrc));

            // No longer using @2x or @3x for retina devices (GRRD-709)
            $image.attr('x-src', mobileSrc);
        }

        return $el;
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'home',

            heroImg: function() {
                var $img = $('#homepage-head').find('img');
                $img.removeAttr('style');

                return {
                    img: useMobileAssetIfExist($img),
                    link: $img.closest('a').attr('href')
                };
            },
            cards: function() {
                return $('#homepage-body .genericESpot a').has('img').map(function() {
                    var $imageLink = useMobileAssetIfExist(
                        $(this).addClass('c-hero__img')
                    );

                    $imageLink.find('[style]').removeAttr('style');

                    return {
                        imageLink: $imageLink
                    };
                });
            },
            recommendationDiv: function() {
                return $('#recommendationBox1');
            },
            hiddenForm: function() {
                return $('#gwt_view_name').closest('form');
            },
            carouselTitle: function() {
                // Hardcoding for now, since the heading doesn't exist on page initially
                return 'Just for you:';
                // return $('.title-component').find('.h2').text();
            },
            hiddenViewForm: function() {
                return $('#gwt_view_name').closest('form');
            },
            registryDelete: function() {
                return $('#gift_registry_delete_message_confirmation').parent();
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a
         * look at the documentation:
         *
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
