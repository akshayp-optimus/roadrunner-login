define([
    '$'
], function($) {

    var _parse = function($productOption) {
        var option = {};

        // if element is a select
        var uuid = 0;
        var $element = $productOption.each(function(_, productOption) {
            var $select = $(productOption).find('select');
            var replaceId = $select.attr('class') + $select.attr('name');

            replaceId += new Date().getTime() + uuid++;

            $select.attr('data-replace-id', replaceId);
            $select.addClass('js-needs-replace js-product-option');

            if ($select.length) {
                var parsedOption = {
                    class: '',
                    select: $select,
                };

                option.select = parsedOption;
                option.label = $select.attr('name');
            }
            // add other types of options here and set option.type = $parsedOption
        });

        return option;
    };

    return {
        parse: _parse
    };
});
