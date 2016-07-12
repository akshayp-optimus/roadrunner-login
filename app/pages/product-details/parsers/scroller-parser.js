define([
    '$'
], function($) {
    // takes a list of thumbnail images
    // parses into c-slideshow
    var _parse = function($slides, containerClasses) {
        if (!$slides.length) {
            return;
        }

        var $items = $slides.map(function(i, slide) {
            var $slide = $(slide);

            var $style;
            var selectedClass = '';
            if ($slide.hasClass('gwt-image-picker-option')) {
                $style = 'background-color: ' + $slide.find('.gwt-image-picker-option-fill').css('background-color');
            }

            var bindId = 'js-' + new Date().getTime() + i;
            // we are cloning because we don't actually need the original element
            // since we will later on relay click events via occulus approach
            var $img = $slide.find('img').clone();

            // Copy over the color attr as the `no image` thumbnail doesnt have it on the img element.
            $img.attr('color', $slide.attr('color'));

            if ($img.hasClass('gwt-image-picker-option-image-selected')) {
                selectedClass = ' c-updated-swatch-color-to-thumb';
            }

            if ($img.attr('src')) {
                $img.attr('src', $img.attr('src').replace('$wgcp', '$wgis'));
            }

            if ($slide.find('img') && $slide.find('img').attr('src')) {
                // bind click handler to original element so we can use it in ui.js
                $slide.find('img').attr('data-bind-click', bindId);
                $slide.find('img').attr('src', $slide.find('img').attr('src').replace('$wgit', '$wgis'));
            }

            return {
                slideContent: $img,
                class: 'js-bind js-thumbnails js-product-option c-product-options' + selectedClass,
                style: $style,
                bindId: bindId,
            };
        });

        return {
            slideshow: {
                slides: $items,
                class: containerClasses
            }
        };
    };

    return {
        parse: _parse
    };
});
