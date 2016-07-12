define(['$'], function($) {

    // Get current page number and total page count
    var getPageOf = function($pageDetail) {
        return {
            currentPage: $pageDetail.find('input').attr('value'),
            totalPage: $pageDetail.text().match(/\d+/)
        };
    };

    var parse = function($paginationContainer) {
        var $previous = $paginationContainer.find('.cin-prev');
        var $next = $paginationContainer.find('.cin-next');

        if (!$previous.length && !$next.length) {
            return;
        }
        return {
            prev: {
                isDisabled: $previous.length ? false : true,
                href: $previous.find('a').attr('href')
            },
            pageOf: getPageOf($paginationContainer.find('input').parent()),
            next: {
                isDisabled: $next.length ? false : true,
                href: $next.find('a').attr('href')
            }
        };
    };

    return {
        parse: parse
    };
});
