define([
    '$'
], function($) {

    // Get Bellows Items
    var getBellowsItems = function($accordion) {
        var bellowsHeader = '';
        var bellowsItems = [];
        $accordion.find('> h3, > div').each(function(_, item) {
            var $item = $(item);

            // All accordion items are directly given as siblings in desktop
            if ($item.is('h3')) {
                bellowsHeader = $item.text();
            } else {
                bellowsItems.push({
                    bellowsHeader: bellowsHeader,
                    bellowsContent: $item
                });
            }
        });

        return bellowsItems;
    };

    return {
        parse: getBellowsItems
    };
});
