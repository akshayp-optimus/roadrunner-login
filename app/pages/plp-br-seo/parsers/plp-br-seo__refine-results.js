define([
    '$',
    'translator',
    'dust!components/filter-panel/filter-panel',
    'pages/product-list/parsers/product-list__filter-panel'
],
function($, Translator, filterPanelTemplate, filterPanelParser) {

    var selectOptions = function($options) {
        return $options.map(function(index, item) {
            var $item = $(item);
            return {
                value: $item.attr('href'),
                text: $item.text()
            };
        });
    };

    var filterStackfilters = function($items) {
        return $items.map(function(index, item) {
            var $item = $(item);
            return {
                labelClass: 'c-refine-category',
                selectField: true,
                defaultOptions: 'Select',
                options: selectOptions($item.nextUntil('li.cin-current').find('a')),
                filterStackfiltersClass: 'js-filter-stack-navigation'
            };
        });
    };

    var filterStack = function($navigationContainer) {
        return $navigationContainer.find('.cin-sidebox-navigation > .cin-group > li.cin-current').map(function(index, item) {
            var $item = $(item);
            return {
                title: $item.text(),
                class: 'c-form-group',
                filterStackfilters: filterStackfilters($item)
            };
        });
    };

    var parse = function($navigationContainer) {
        return {
            filterStack: filterStack($navigationContainer.find('> ul').last())
        };
    };

    return {
        parse: parse
    };
});
