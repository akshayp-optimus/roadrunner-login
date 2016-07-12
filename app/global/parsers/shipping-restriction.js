define([
    '$'
], function($) {

    var _parse = function($messageContainer, $popup) {
        var $extraMesageInPopup = $('<div class="c-extra-message"></div>');
        var $messageText = $messageContainer.find('strong');
        var $message = $messageText.parent();

        $message.find('strong, br').remove();
        $message.find('a').removeAttr('style').addClass('u--bold');
        $messageText.children('a').remove();

        // GRRD-94: Extra message was required in popup.
        $extraMesageInPopup.append($messageText.text());
        $extraMesageInPopup.append($message.html());
        $popup.find('.genericESpot').prepend($extraMesageInPopup);

        return {
            messageContainer: $messageContainer.addClass('js-restriction-msg-container'),
            tooltipDOM: $popup
        };
    };

    return {
        parse: _parse
    };
});
