define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    'hijax',
    'pages/gift-registry-find/parsers/gift-registry-find__results',
    'dust!pages/gift-registry-find/partials/gift-registry-find__results',
    'global/ui/registry-form-parser-ui',
    'global/ui/handle-form-fields'
], function(
    $,
    Utils,
    sheet,
    Hijax,
    giftRegistryResultsParser,
    GiftRegistryResultsTemplate,
    formParser,
    handleFormFieldsUI) {

    var $searchResultsContainer = $('.js-registry-results');
    var $noResultsMessage = $('.js-no-results-message');
    var $loading = $('.js-loader');
    var $pageContainer = $('.js-page');
    var $resultsPinny = $('.js-gift-registry-results-pinny');
    var $addressShade;

    var _transformField = function($field) {
        if (!$field.length) {
            return;
        }

        var $cInput = $('<div class="c-input"></div>');
        var $cFieldRow = $('<div class="c-box-row"></div>');

        // $field.find('input').wrap($cInput);
        $field.addClass('c-box c-arrange c--align-middle');
        $field.find('label').addClass('c-box__label');
        $field.wrap($cFieldRow);
    };

    var _updatePlaceholder = function($content) {
        $content.find('.c-box').map(function(_, item) {
            var $item = $(item);
            var $label = $item.find('label').clone();
            $label.find('.required').remove();

            if ($label.length && $label.attr('data-label')) {
                $item.find('input').attr('placeholder',  $label.attr('data-label').trim());
            }
        });
    };

    var _transformFindById = function($findByIdContainer) {
        $findByIdContainer.find('button').addClass('c-button c--primary c--full-width u-margin-top-gt-md u-margin-bottom-md')
            .append(' >');
        $findByIdContainer.find('.spot').each(function() {
            _transformField($(this));
        });
        _updatePlaceholder($findByIdContainer);
    };

    var _transformFindByName = function($findByNameContainer) {
        $findByNameContainer.find('button')
            .text('find registry')
            .addClass('c-button c--primary c--full-width u-margin-top-gt-md u-margin-bottom-sm')
            .append(' >');
        $findByNameContainer.find('.spot').each(function() {
            _transformField($(this));
        });
        _updatePlaceholder($findByNameContainer);
    };

    var _transforms = function(findByIdContainer) {
        var $findByNameContainer = $('#giftRegSearchFormPanel').addClass('c-form-group');
        var $findByIdContainer = $(findByIdContainer);
        $('#giftRegIdPanel').addClass('c-form-group');
        formParser.transformContent($findByIdContainer);
        formParser.transformContent($findByNameContainer);

        _transformFindById($findByIdContainer);
        _transformFindByName($findByNameContainer);
        $loading.remove();
        $pageContainer.removeAttr('hidden');
    };

    var _bindEvents = function() {
        $('body').on('click', '.c-button', function(e) {
            if (!$('.errortxt').length && $searchResultsContainer.find('.gwt-Anchor').length) {
                $searchResultsContainer.removeAttr('hidden');
                $searchResultsContainer.find('.js-reuslts-table').removeAttr('hidden');
                $noResultsMessage.attr('hidden', 'hidden');
            }
        });
    };

    var _showGiftRegistryResultsModal = function($modal) {
        var title = 'Find Registry';

        if ($('.GR-no-results-found').length) {
            $resultsPinny.find('.js-gift-registry-results-pinny__body').html($('.GR-no-results-found'));
        } else {
            var data = giftRegistryResultsParser.parse($modal);
            new GiftRegistryResultsTemplate(data, function(err, html) {
                $resultsPinny.find('.js-gift-registry-results-pinny__body').html(html);
            });
        }

        $resultsPinny.find('.c-sheet__title').html(title);
        $modal.append($addressShade);
        if ($resultsPinny.hasClass('c--is-rendered')) {
            $resultsPinny.pinny('open');
            $resultsPinny.removeClass('c--is-rendered');
        }

    };

    var _initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
           'gift-registry-search-results',
            function(url) {
                return url.indexOf('GiftRegistrySearchJSONCmd') > -1;
            },
            {
                complete: function(data, xhr) {
                    _showGiftRegistryResultsModal($('#giftRegSearchFormPanel table'));
                }
            }
        );
    };

    // This is used to check whether the new results are appended on DOM
    // This is called many times depending upon the number of searched registry's
    var _getresults = function() {
        if (!$resultsPinny.hasClass('c--is-rendered')) {
            $resultsPinny.addClass('c--is-rendered');
        }
    };

    var giftRegistryFindUI = function() {
        Utils.overrideDomAppend('#giftRegIdPanel', _transforms, '');
        Utils.overrideDomAppend('.gwt-gr-search-panel tbody, .gwt-gr-search-panel td', _getresults, '');

        _bindEvents();
        sheet.init($resultsPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-shade',
                zIndex: 100,
                opacity: '0.5'// Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: function() {
                $resultsPinny.find('.js-gift-registry-results-pinny__body').empty();
            }
        });

        $addressShade = $('.js-address-shade');
        _initHijax();
    };

    return giftRegistryFindUI;
});
