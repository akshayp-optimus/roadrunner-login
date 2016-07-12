define([
    '$',
    'global/utils',
    'scrollTo',
],
function($, Utils) {

    var bindEvents = function() {
        var $topButton = $('.js-to-top');
        var footerTop = $('.t-footer').offset().top;

        $topButton.on('click', function(e) {
            $.scrollTo($('html'));
        });

        var stoppedScrolling = Utils.debounce(function() {
            $topButton.removeClass('c--scrolling');
        }, 500);

        $(window).on('scroll', function(e) {
            var scrollPosition = document.body.scrollTop;

            if ($topButton.length) {
                Utils.requestAnimationShim(function() {
                    stoppedScrolling();
                    $topButton.addClass('c--scrolling');
                });

                if (scrollPosition > 90) {
                    $topButton.addClass('c--active');
                } else {
                    $topButton.removeClass('c--active');
                }
            }
        });

    };

    return bindEvents;
});
