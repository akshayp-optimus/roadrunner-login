define([
    '$',
    'global/utils'
], function($, Utils) {
    var _parse = function($pdpContainer) {
        var $imageContainer = $pdpContainer.find('#gwt-pdp-main-image-wrapper');
        var triggerId = Utils.generateUid();
        var $originalImage = $imageContainer.find('.iwc-main-img');
        var $cloneImage = $originalImage.clone(true);
        $cloneImage.attr('data-replace-id', 'main-image-' + triggerId);

        $originalImage.after($cloneImage);

        // we are not returning an imgSrc because the main image will need to be replaced
        // in the ui.js in order to retain original prototype events
        return {
            class: 'js-needs-replace',
            replaceId: $cloneImage.attr('data-replace-id')
        };
    };

    return {
        parse: _parse
    };
});
