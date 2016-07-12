define([
    '$',
    'translator'
],
function($, Translator) {

    // Get suggestion links and text
    var getTermSuggestions = function($container) {
        return $container.find('a').map(function(i, suggestion) {
            var $suggestions = $(suggestion);
            return {
                href: $suggestions.attr('href'),
                text: $suggestions.text()
            };
        });
    };


    var parse = function($container) {
        return {
            revealIconName: 'expand',
            hideIconName: 'collapse',
            revealText: Translator.translate('search_suggestions'),
            isTermSuggestions: true,
            termSuggestions: getTermSuggestions($container)
        };
    };

    return {
        parse: parse
    };
});
