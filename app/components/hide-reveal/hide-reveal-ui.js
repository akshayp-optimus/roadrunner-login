define([
    '$',
],
function($) {

    var init = function() {
        // Display all content when reveal link is clicked
        $('body').on('click', '.js-reveal-link', function() {
            var $this = $(this);
            var $container = $this.parents('.c-hide-reveal');
            $container.children('.js-content').removeClass('c--restricted-content');
            $this.addClass('u--hide');
            $container.children('.js-hide-link').removeClass('u--hide');
            $container.find('ul').addClass('c-hide-reveal__detail-list');
        });

        // Display restricted content when hide link is clicked
        $('body').on('click', '.js-hide-link', function() {
            var $this = $(this);
            var $container = $this.parents('.c-hide-reveal');
            $container.children('.js-content').addClass('c--restricted-content');
            $this.addClass('u--hide');
            $container.children('.js-reveal-link').removeClass('u--hide');
        });
    };

    return {
        init: init
    };
});
