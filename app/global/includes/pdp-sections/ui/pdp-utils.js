define(['$'], function($) {
    var videoInScooch = function($imageParent, $appendTo) {

        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', false, true);
        var $el = $('img[src*="video"]', $imageParent)[0] || $('img[src*="alt_360"]', $imageParent)[0];
        var $videoImg = $($el).closest('.carouselTile')[0];

        if (!!$videoImg) {
            $videoImg.dispatchEvent(evt);
            $($appendTo).append(
                    $imageParent
                    .closest('#gwt-product-detail-center-panel, .gwt-bundle-detail-insp-panel')
                    .find('#gwt-video-player-wrapper').clone()
            );
            $($appendTo).find('img').remove();

            // Stop autoplay of embedded player.
            $('.gwt-video-object').map(function(i, item) {
                var $videoIframe = $(item);
                var newIframeSrc = $videoIframe.attr('src') + '&autoplay=0';
                $videoIframe.attr('src', newIframeSrc);
            });
        }
    };

    var Utils = {
        videoInScooch: videoInScooch
    };

    return Utils;
});
