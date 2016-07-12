define([
    '$'
], function($) {

    var _parse = function($item) {
        var $tableHeading = $item.find('thead th');
        return {
            searchResultFields: $item.find('tr').map(function(_, item) {
                var $item = $(item);
                var $button = $item.find('button').remove();
                return {
                    fields: $item.find('td').map(function(index, i) {
                        var $i = $(i);
                        var $label = $tableHeading[index];
                        return {
                            label: $label,
                            field: $i
                        };
                    }),
                    href: $item.find('a.gwt-Anchor').attr('href'),
                    button: $button.addClass('c-button c--primary c--full-width')
                        .append(' >').addClass('c-view-registry')
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
