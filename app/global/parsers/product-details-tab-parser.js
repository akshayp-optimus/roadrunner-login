define([
    '$'
], function($, translator) {


    var _parse = function($container) {
        var $tabs = $container.find('.gwt-TabBarItem');
        var $tabPanels = $container.find('.pdp-single-tab-content');

        var items = $tabs.map(function(i, tab) {
            return {
                sectionTitle: $(tab).text(),
                content: $tabPanels.eq(i)
            };
        });

        if (items.length) {
            items[0].isOpen = true;
        }

        return {
            items: items
        };
    };

    return {
        parse: _parse
    };
});
