define([
    '$'
],
function($) {

    // Enable disable Button handler
    var enableDisableButton = function() {
        $('.c-input-form__wrapper').on('keyup', 'input[type="text"]', function() {
            var $target = $(this);
            var $button = $target.next();
            if ($target.val() !== '') {
                $button.removeClass('u--disabled');
            } else {
                $button.addClass('u--disabled');
            }
        });
    };

    return enableDisableButton;
});
