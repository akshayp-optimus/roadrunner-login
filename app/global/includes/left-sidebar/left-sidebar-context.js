define([
    '$',
    'components/nav/parsers/nav-items',
    'dust!components/nav/nav'
], function(
    $,
    navParser,
    navTemplate
) {
    return {
        context: {
            navItems: function() {
                var $content;
                var data = navParser.parse($('#flyout'));

                navTemplate(data, function(err, html) {
                    $content = $(html);
                });

                return $content;
            }
        }
    };
});
