define([
    '$',
    'translator',
    'dust!components/filter-panel/filter-panel',
    'pages/product-list/parsers/product-list__filter-panel'
],
function($, Translator, filterPanelTemplate, filterPanelParser) {

    var filterStackfilters = function($container) {
        return $container.find('.cin-sidebox-filter').map(function(index, item) {
            var $item = $(item);
            var $titleText = $item.find('> .cin-title').text();
            var filterPanelContentData = filterPanelParser.parse($item);
            var $filterPanelContent;
            var filterStackfiltersClass = 'js-filter-stack';
            if ($item.find('.sli_facets_slider').length) {
                filterStackfiltersClass = 'js-filter-stack js-price-range-slider';
            }
            // Html for filter panel pinny
            filterPanelTemplate(filterPanelContentData, function(err, html) {
                $filterPanelContent = $(html);
            });
            return {
                label: $titleText,
                labelClass: 'u-margin-start-md',
                customSelectText: 'All',
                customSelect: true,
                filterStackfiltersClass: filterStackfiltersClass,
                isFilterPanelPinny: true,
                filterPanelClass: 'js-filter-panel',
                isHeader: true,
                pinnyTitle: $titleText,
                filterPanelContent: $filterPanelContent
            };
        });
    };

    var parse = function($container) {
        return {
            filterStack: {
                title: 'Filter by',
                class: 'c-form-group',
                filterStackfilters: filterStackfilters($container)
            }
        };
    };

    return {
        parse: parse
    };
});
