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

            // make non-360 images zoomable.
            if (/alt_(360|video)/i.test($img.attr('src'))) {
                $img.addClass('js-interactive-image');
            } else {
                $img.addClass('magnifik');
            }

            if ($img.hasClass('gwt-image-picker-option-image-selected')) {
                selectedClass = ' c-updated-swatch-color-to-thumb';
            }


            if ($img.attr('src')) {
                var imgSrc = $img.attr('src');
                $img.attr('src', imgSrc.replace('$wgcp', '$wgis'));
                $img.attr('href', imgSrc.replace('$wgcp', '$wgie'));
            }

            if ($slide.find('img') && $slide.find('img').attr('src')) {
                // bind click handler to original element so we can use it in ui.js
                $slide.find('img').attr('data-bind-click', bindId);
                $slide.find('img').attr('src', $slide.find('img').attr('src').replace('$wgit', '$wgis'));
            }

            return {
                index: i + 1,
                img: $img,
                style: $style,
                bindId: bindId,
            };
        });

        return {
            items: $items,
            class: containerClasses + ' m-scooch m-fluid'
        };
    };

    return {
        parse: _parse
    };
});
