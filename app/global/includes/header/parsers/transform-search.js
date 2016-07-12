define(['$'], function($) {
    var parse = function($search) {
        var $searchBox = $search.find('#searchBox');
        var $searchInput = $searchBox.find('input');

        $search.find('.button').remove();

        $search.addClass('c-arrange__item');
        $searchBox.addClass('c-input u-position-context');

        $search.find('#searchBoxLbl').remove();

        // Search input
        $searchInput
            .addClass('js-search__input')
            .attr('placeholder', $searchInput.attr('value').replace(/ \- .*$/, ''))
            .removeAttr('value');

        return $search;
    };

    return {
        parse: parse
    };
});
