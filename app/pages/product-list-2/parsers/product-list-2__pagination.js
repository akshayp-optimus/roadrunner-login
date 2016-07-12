define(['$'], function($) {

    // Get page numbers
    var getPageNumbers = function($pageNumbers) {
        return $pageNumbers.map(function(_, pageNumber) {
            var $pageNumber = $(pageNumber);
            return {
                isCurrent:  $pageNumber.find('a').length ? false : true,
                pageHref: $pageNumber.find('a').attr('href'),
                pageNumber: $pageNumber.text()
            };
        });
    };

    var parse = function($paginationContainer) {
        var $previous = $paginationContainer.find('.prev').remove();
        var $next = $paginationContainer.find('.next').remove();
        var $previousLink = $previous.find('a');
        var $nextLink = $next.find('a');

        if (!$previous.length && !$next.length) {
            return;
        }

        return {
            prev: {
                isDisabled: $previousLink.length ? false : true,
                href: $previousLink.attr('href')
            },
            pageNumbers: getPageNumbers($paginationContainer.find('li')),
            next: {
                isDisabled: $nextLink.length ? false : true,
                href: $nextLink.attr('href')
            }
        };
    };

    return {
        parse: parse
    };
});
