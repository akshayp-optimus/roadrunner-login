define([
    '$'
],
function($) {

    // Bind events for 'Br Seo Page' navigation
    var bindEvents = function() {
        $('.js-filter-stack-navigation').find('select').on('change', function() {
            var dataHrefValue = $(this).find('option:selected').attr('data-href');
            window.location.href = dataHrefValue;
        });
    };

    var plpBrSeoUI = function() {
        bindEvents();
    };

    return plpBrSeoUI;
});
