define(['$'], function($) {

    // Third level filter data
    var thirdPanelFilterPanelList = function($thirdLevelFilterPanelList) {
        return $thirdLevelFilterPanelList.find('> li').map(function(_, item) {
            var $item = $(item);
            var $input = $item.find('> label input');
            return {
                isThirdPanelCheckbox: true,
                thirdPanelCheckbox: $input,
                thirdPanelLabel: $item.find('> label').text()
            };
        });
    };

    // Second level filter data
    var secondPanelFilterPanelList = function($secondLevelFilterPanelList) {
        return $secondLevelFilterPanelList.find('> li').map(function(_, item) {
            var $item = $(item);
            var $itemChildren = $item.find('> .sli_children');
            var $input = $item.find('> label input');
            return {
                isSecondPanelCheckbox: true,
                secondPanelCheckbox: $input,
                secondPanelLabel: $item.find('> label').text(),
                filterPanelThird: $itemChildren.length ? {
                    thirdPanelFilterPanelList: thirdPanelFilterPanelList($itemChildren)
                } : false
            };
        });
    };

    // First level filter data
    var filterPanelList = function($filterPanelList) {
        var $priceRangeSlider = $filterPanelList.find('.sli_facets_slider');
        if ($priceRangeSlider.length) {
            return {
                label: $priceRangeSlider.addClass('c-price-range-slider')
            };
        } else {
            return $filterPanelList.find('> ul > li').map(function(_, item) {
                var $item = $(item);
                var $itemChildren = $item.find('> .sli_children');
                var $input = $item.find('> label input');
                var $checkbox;
                var filterListClass;
                if ($item.find('> label').text() === 'More') {
                    $checkbox = $input.add('<svg class="c-icon" data-fallback="img/png/expand.png"><title>expand</title><use xlink:href="#icon-expand"></use></svg>');
                    filterListClass = 'c-more-filter';
                } else if ($item.find('> label').text() === 'Less') {
                    $checkbox = $input.add('<svg class="c-icon" data-fallback="img/png/collapse.png"><title>collapse</title><use xlink:href="#icon-collapse"></use></svg>');
                    filterListClass = 'c-more-filter';
                } else {
                    $checkbox = $input;
                    filterListClass = '';
                }
                return {
                    filterListClass: filterListClass,
                    isCheckbox: true,
                    checkbox: $checkbox,
                    label: $item.find('> label').text(),
                    filterPanelSecond: $itemChildren.length ? {
                        secondPanelFilterPanelList: secondPanelFilterPanelList($itemChildren)
                    } : false
                };
            });
        }
    };

    var parse = function($container) {
        return {
            filterPanel: {
                filterPanelList: filterPanelList($container)
            }
        };
    };

    return {
        parse: parse
    };
});
