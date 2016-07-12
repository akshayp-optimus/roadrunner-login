define(['$'], function($) {

    var _parse = function($relatedSearches) {
        return $relatedSearches.length ? {
            termHeading: $relatedSearches.find('.br-related-heading').text(),
            termSuggestions: $relatedSearches.find('.br-related-query').map(function(i, suggestion) {
                return $(suggestion).find('a').addClass('needsclick');
            })
        } : '';
    };

    return {
        parse: _parse
    };
});
