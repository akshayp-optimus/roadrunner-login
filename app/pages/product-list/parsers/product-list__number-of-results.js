define(['$'], function($) {

    // Get products counts displayed and total number of products
    var parse = function($container) {
        return {
            resultsCount: $container.find('.sli_bct_num_results').html(),
            totalCount: $container.find('.sli_bct_total_records').html(),
            separatorText: $container.find('span').remove().end().text().trim()
        };
    };

    return {
        parse: parse
    };
});
