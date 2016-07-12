define([
    '$',
    'components/search-suggestions/parsers/search-suggestions',
    'dust!components/search-suggestions/search-suggestions',
    'sheet-right',
    'global/utils'
], function(
    $,
    searchSuggestionParser,
    SearchSuggestionTemplate,
    sheetRight,
    Utils
) {

    var toggleEmptySearchImage = function() {
        var $searchResult = $('.js-search__auto-complete');
        if (!$searchResult.children().length || $searchResult.css('display') === 'none') {
            $('.c-search-pinny .pinny__content').addClass('c--no-result');
        } else {
            $('.c-search-pinny .pinny__content').removeClass('c--no-result');
        }
    };

    var overrideSearch = function() {
        var _oldAddData = window.sliAutocomplete.select.addData;
        var _oldSelectCurrent = window.sliAutocomplete.select.selectCurrent;
        var _oldInputBlur = window.sliAutocomplete.input.onBlur;
        var _hideSearchSuggestion = window.sliAutocomplete.select.hide;
        var $searchSuggest = $('#sli_autocomplete');

        $searchSuggest.addClass('c-search-suggestions u-padding-sides-md js-search__auto-complete');
        $searchSuggest.appendTo($('.js-search'));

        window.sliAutocomplete.select.hide = function() {
            _hideSearchSuggestion.apply(this, arguments);
            toggleEmptySearchImage();
        };

        window.sliAutocomplete.select.addData = function() {
            var searchData = {suggestions: ''};
            _oldAddData.apply(this, arguments);
            $searchSuggest.removeAttr('style');
            toggleEmptySearchImage();
            searchData.suggestions = searchSuggestionParser.parse($searchSuggest);

            new SearchSuggestionTemplate(searchData, function(err, html) {
                $searchSuggest.html($(html));
            });
        };

        // The desktop scripts sets the active option on hover,
        // so set it ouselves before letting the desktop scripts select the "current" option
        window.sliAutocomplete.select.selectCurrent = function() {
            // Same fix as FRGT-632: Scope down suggestions to autocomplete container
            var $suggestions = $('.js-search__auto-complete .js-suggestion');
            this.currentSelected = $suggestions.index($suggestions.filter('.js--active')[0]);
            _oldSelectCurrent.apply(this, arguments);
        };

        window.sliAutocomplete.input.onBlur = function() {
            // Don't hide the suggestions on blur.
            return;
        };

        // Mark the "active" suggestion to use above.
        $('body').on('click', '.js-suggestion', function(e) {
            $(this).addClass('js--active');
        });
    };

    var initSearch = function() {
        var searchOverridden = false;
        var $searchPinny = $('.js-search');
        var $searchInput = $('.js-search__input');
        var $headerItem = $('.t-header__row-item').children();

        // Init search autosuggestion PInny
        $searchPinny.pinny({
            effect: sheetRight,
            coverage: '100%',
            cssClass: 'c-sheet c-search-pinny js-search-pinny js-header-pinny',
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                zIndex: 100, // Match our standard modal z-index from our CSS ($z3-depth)
                opacity: '0'
            },
            reFocus: false,
            structure: {
                header: false
            },
            open: function() {
                $headerItem.addClass('c--depth-max');
                $('.c-search-pinny .pinny__content').addClass('c--no-result');
            },
            opened: function() {
                Utils.addHeaderOpenClass();
            },
            close: function() {
                $headerItem.removeClass('c--depth-max');
            },
            closed: function() {
                $searchInput.val('');
                window.sliAutocomplete.select.hide();
                Utils.removeHeaderOpenClass();
            }
        });

        $('.js-search-box').on('click', function() {

            if (!searchOverridden) {
                // The desktop function that we need to override won't exist on doc ready
                // It's a script that's added through other JS, so wait until the user first
                // focuses into the input to override the desktop functionality
                overrideSearch();
                searchOverridden = true;
            }

            $searchPinny.pinny('open');

        });

    };

    return {
        init: initSearch
    };
});
