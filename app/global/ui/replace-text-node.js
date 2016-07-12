define([
    '$'
], function($) {

    var replaceNbsp = function() {
        // Get all the elements that contains "&nbsp;".
        var $nbspElements =
            $(':contains("\u00a0")').filter(function() {
                return $(this).children().length === 0;
            });

        $nbspElements.map(function(i, item) {
            var $nbspEl = $(item);
            $nbspEl.contents().each(function() {
                if ( this.nodeType === Node.TEXT_NODE) {
                    this.textContent = this.textContent.replace(/\u00a0/g, '').trim();
                }
            });
        });
    };

    return {
        replaceNbsp: replaceNbsp
    };
});
