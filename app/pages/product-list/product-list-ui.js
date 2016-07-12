define([
    '$',
    'translator',
    'hijax',
    'components/sheet/sheet-ui',
    'pages/product-list/parsers/product-list__products',
    'pages/product-list/parsers/product-list__pagination',
    'pages/product-list/parsers/product-list__number-of-results',
    'pages/product-list/parsers/product-list__no-results',
    'dust!components/product-tile/product-tile',
    'dust!components/price/partials/price-discount',
    'dust!components/pagination/pagination',
    'dust!components/number-of-results/number-of-results',
    'global/ui/tooltip-ui',
    'global/utils',
    'dust!components/filter-panel/filter-panel',
    'dust!pages/product-list/partials/product-list__no-results',
    'pages/product-list/parsers/product-list__filter-panel',
    'pages/product-list/parsers/product-list__refine-result',
    'dust!components/filter-stack/filter-stack',
    'pages/product-list/parsers/product-list__refine-category',
    'pages/product-list/parsers/product-list__sort-by',
    'dust!pages/product-list/partials/product-list__sort-by',
    'global/ui/enable-disable-button',
    'dust!components/hide-reveal/hide-reveal',
    'pages/product-list/parsers/product-list__search-suggestion',
    'components/hide-reveal/hide-reveal-ui',
    'global/ui/suggested-products',

    'vendor/lazyloadxt'
],
function($,
    translator,
    Hijax,
    Sheet,
    productListProductsParser,
    productListPaginationParser,
    productListNumberOfResultsParser,
    productListNoResultParser,
    ProductTileTemplate,
    DiscountPriceTemplate,
    PaginationTemplate,
    NumberOfResultsTemplate,

    tooltipUI,
    Utils,
    filterPanelTemplate,
    NoResultsTemplate,
    filterPanelParser,
    refineResultParser,
    filterStackTemplate,
    refineCategoryParser,
    productListSortByParser,
    ProductListSortByTemplate,
    enableDisableButtonUI,
    HideRevealTemplate,
    searchSuggestionParser,
    hideRevealUI,
    suggestedProducts,

    lazyloadxt
) {

    var $noSearchResult = $('.js-no-results');
    var $numberOfResults = $('.js-number-of-results');
    var $sortByContainer = $('.js-product-list__sort-by');
    var $refineResultContainer = $('.js-refine-results');

    // Current clicked expand button
    var $currentClickedMore;

    // Get search suggestions for search result page
    var searchSuggestionSection = function() {
        var $searchSuggestionContainer = $('.cin-filter-suggestions');

        if ($searchSuggestionContainer.length) {
            var templateData = searchSuggestionParser.parse($searchSuggestionContainer);
            new HideRevealTemplate(templateData, function(err, html) {
                $('.js-search-suggestion').html(html);
            });
        }
    };

    // Hide global search
    var hideSearchSuggest = function() {
        var $searchPinny = $('.js-search');

        if ($searchPinny.data('pinny')) {
            $searchPinny.pinny('close');

            // Toggle search icons
            $('.js-search__icon').prop('hidden', false);
            $('.js-search__clear').prop('hidden', true);
        }
    };

    // Add show filter applied indicator
    var appliedFilterIndicator = function() {
        var isFilterApplied = false;
        var $customSelect = $('.c-custom-select__inner');
        var $refineButton = $('.js-refine-button');

        $customSelect.each(function() {
            if ($(this).text().trim() !== 'All') {
                isFilterApplied = true;
                return;
            }
        });

        isFilterApplied ? $refineButton.addClass('c-filter-applied') :
            $refineButton.removeClass('c-filter-applied');
    };

    // Add active class on selected filter text label
    var activeCheckedFilterLable = function($checkbox) {
        $checkbox.map(function(_, item) {
            var $item = $(item);
            var $label = $item.closest('label').find('.c-filter-panel__label');
            if ($item.find('input').is(':checked')) {
                $label.addClass('c--check-active');
            } else {
                $label.removeClass('c--check-active');
            }
        });
    };

    // Show price range in price filter drodown
    var priceRangeApplied = function($priceRange) {
        var startPriceFrom = $priceRange.find('> a:nth-of-type(1)').text();
        var endPriceTo = $priceRange.find('> a:nth-of-type(2)').text();
        $priceRange.closest('.c-filter-stack__filters')
            .find('.c-custom-select__inner').text(startPriceFrom + ' - ' + endPriceTo);
    };

    var setFilterStack = function($pinnyInstance) {
        var $filterStack = $pinnyInstance.closest('.c-filter-stack__filters').find('.c-custom-select__inner');
        var selectedFilter = $pinnyInstance.find('.c-filter-panel__checkbox input:checked').parent().next();
        var selectedFilterArr =
            selectedFilter.map(function(_, item) {
                var $item = $(item);
                if ($item.text() !== null) {
                    return $item.text().trim().match(/.+[^\s\(\d\)]/g);
                }
            });
        selectedFilterArr = selectedFilterArr.toArray();
        if ($.inArray('More', selectedFilterArr) > -1 || $.inArray('Less', selectedFilterArr) > -1) {
            return;
        }
        $filterStack.text(selectedFilterArr.join(', ') || 'All');
    };


    var bindClickMore = function() {
        $('.c-more-filter').on('click', function(e) {
            $currentClickedMore = e.target;
        });
    };

    var triggerFilterPinny = function($pinnyContainerEl, $filterSheetEl) {
        var $filterSheet = Sheet.init($filterSheetEl, {
            appendTo: $pinnyContainerEl,
            shade: {
                opacity: 0
            },
            opened: function() {
                bindClickMore();
                var $loader = $('.js-filter-loader');
                $loader.addClass('u--hide');
            },
            closed: function() {
                var $pinnyInstance = $(this.$content);
                setFilterStack($pinnyInstance);
                priceRangeApplied($pinnyInstance.find('.c-filter-panel__label .sli-range-slider-track'));
            }
        });
        $filterSheet.open();
    };

    var initFilterPinny = function() {
        var $filterSheetEl;
        var filterSheet;

        $('.js-filter-stack').on('click', function() {
            var $pinnyContainerEl = $(this);
            $filterSheetEl = $pinnyContainerEl.find('.js-filter-panel');
            triggerFilterPinny($pinnyContainerEl, $filterSheetEl);
        });
    };

    // Handle swatch functionality
    // Change main image on click of swatche and swatche image
    var handleSwatcheFunctionality = function() {
        $('.js-product-tile-container').on('click', '.js-swatche-image', function() {
            var $this = $(this);
            var $productContainer = $this.closest('.js-product-tile-image-container');
            // Update product image
            /* eslint-disable*/
            imageSwitch($productContainer.find('.js-product-tile-image')[0]);
            /* eslint-enable*/
            // Update swatche src
            $this.attr('src', $productContainer.find('.js-product-tile-image').attr('data-alternative'));
        });
    };

    // Display Shipping restiction message
    var updateShippingRestrictionMessage = function() {
        var $message = $('.js-restriction-msg-container');

        if (!$message.hasClass('nodisplay')) {
            $message.parent().removeAttr('hidden');
        }
    };

    // Update refine result button text to show all results count
    var updateRefineButtonText = function() {
        var $bellowButton = $('.js-refine-button').find('span');
        var $bellowButtonOpen = $('.bellows--is-open').find($bellowButton);
        var totalCount = $('.js-total-count').text().trim();

        // Don't change the sequence of below two lines.
        $bellowButton.text('refine ' + totalCount + ' results');
        $bellowButtonOpen.text('show ' + totalCount + ' results');

        $('.c-refine-filter').bellows({
            open: function() {
                // 'js-total-count' is used without caching since it is
                // updated each time.
                totalCount = $('.js-total-count').text().trim();
                $bellowButton.text('show ' + totalCount + ' results');
            },
            close: function() {
                // 'js-total-count' is used without caching since it is
                // updated each time.
                totalCount = $('.js-total-count').text().trim();
                $bellowButton.text('refine ' + totalCount + ' results');
            }
        });
    };

    // Update number of products displayed and total products count
    var updateNumberOfResults = function($container) {
        if ($container.length) {
            var templateData = productListNumberOfResultsParser.parse($container);
            new NumberOfResultsTemplate({numberOfResults: templateData}, function(err, html) {
                $numberOfResults.html(html);
                updateRefineButtonText();
            });
            $numberOfResults.removeClass('u--hide');
        }
    };

    // Update prices for products
    var updatePrices = function() {
        $('.js-price').each(function(i, priceContainer) {
            var $priceContainer = $(priceContainer);
            var $priceLine = $priceContainer.children('.js-priceLine');
            var regularPrice = $priceLine.find('.price').text();
            var originalPrice = $priceLine.find('.cin-price-then').text();
            var noLongerAvailableMessage = $priceLine.find('.removed').text();

            if (regularPrice) {
                $priceContainer.html(regularPrice);
                $priceContainer.append($priceLine);
            } else if (noLongerAvailableMessage) {
                $priceContainer.html('<span class="u-text-error">' + noLongerAvailableMessage + '</span>');
                $priceContainer.append($priceLine);
            } else {
                var templateData = {
                    priceNew: $priceLine.find('.priceNow').text().replace('Now', ''),
                    priceOld: originalPrice ? originalPrice.replace(/Was|Now/ig, '') : ''
                };

                new DiscountPriceTemplate(templateData, function(err, html) {
                    $priceContainer.html(html);
                    $priceContainer.append($priceLine);
                });
            }
        });
    };

    var setupLazyLoading = function() {
        jQuery('.js-product-tile-image').lazyLoadXT({
            blankImage: $('.c-loading-gif').attr('src')
        });
        jQuery('.js-swatche-image').lazyLoadXT();
    };

    // Update products
    var updateProductTiles = function($products) {

        var templateData = productListProductsParser.parse($products, true);
        new ProductTileTemplate({products: templateData}, function(err, html) {
            // Desktop script sometimes updates the content after this.
            // Hence using setTimeout
            setTimeout(function() {
                var $productContainer = $('.js-product-tile-container');
                /* The only reason clone is needed is to remove the reference desktop
                 * has on it look for sliLoadInData in desktop script
                */
                // $productContainer.clone(true).insertAfter($productContainer);
                // $productContainer.remove();
                $('.js-product-tile-container').find('#sli_products').html(html);
                $('#sli_products').removeAttr('style');
                // This is needed as price doesnt get updated otherwise. Content update is delayed
                updatePrices();
                setupLazyLoading();
            }, 0);
        });
    };

    // Update Pagination
    var updatePagination = function($newPagination) {
        var paginationContent = productListPaginationParser.parse($newPagination);

        new PaginationTemplate({pagination: paginationContent}, function(err, html) {
            // Desktop class has been used as the entrie div generates dynamically
            $('.js-pagination').html(html);
        });
    };

    // Update refine result data when animation fire on page
    var filterStackfilters = function() {
        var $filterContainer = $('#sli_leftNav');
        var $refineResults = $('.js-refine-results');
        var refineContentData = refineResultParser.parse($filterContainer);
        var $refineContent;
        var filterStackDataArray = [];
        if ($filterContainer.find('.cin-sidebox-navigation > .cin-group > li.cin-current > ul').length) {
            var refineCategoryData = refineCategoryParser.parse($filterContainer);
            filterStackDataArray.push(refineCategoryData);
        }
        filterStackDataArray.push(refineContentData);
        var filterStackData = {
            filterStackItems: filterStackDataArray
        };

        // Html for refine filter-stack Body
        filterStackTemplate(filterStackData, function(err, html) {
            if (!$(html).find('.c-filter-stack__filters').children().length &&
                    !jQuery('.js-filter-stack-category').children().length) {
                $refineResults.hide();
            } else {
                $refineResults.show();
            }
            if (refineContentData.filterStack.filterStackfilters.length) {
                $('.js-refine-results .c-bellows__content').html(html);
                initFilterPinny();
            }
        });

        if ($currentClickedMore) {
            $('.js-filter-stack:contains("' + $($currentClickedMore).parentsUntil('.c-form-group').filter('.js-filter-stack').find('.c-box__label').text().trim() + '")').trigger('click');
            // Remove this flag
            $currentClickedMore = undefined;
            // Bind actions again
            bindClickMore();

        }

        return $('#sli_leftNav').find('.cin-sidebox-filter').map(function(index, item) {
            var $item = $(item);
            var pinnyContent = $('.js-filter-panel .pinny__content')[index];
            var filterPanelContentData = filterPanelParser.parse($item);

            filterPanelTemplate(filterPanelContentData, function(err, html) {
                $(pinnyContent).html(html);
            });
        });
    };

    var clearPriceFilter = function() {
        var $priceFilter = jQuery('#sli_bct').find('[href*="raprislider"]');
        $priceFilter.find('img').remove();
        $priceFilter.append('<svg class="c-icon " data-fallback="img/png/remove.png"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-remove"></use></svg>');

        if (!$('#slider-raprislider').length) {
            jQuery('.c-breadcrumb').after($priceFilter.addClass('c-price-filter-clear'));
        } else {
            $('.c-price-filter-clear').remove();
        }
    };

    var bindEvents = function() {
        $('.js-sort-menu').on('change', function() {
            var dataOnclickValue = $(this).find('option:selected').attr('data-onclick');
            window.location.href = dataOnclickValue;
        });

        $('.js-filter-stack-category').find('select').on('change', function() {
            var dataHref = $(this).find('option:selected').attr('data-href');
            window.location.href = dataHref;
        });

        enableDisableButtonUI();
        hideRevealUI.init();

        // Desktop script sometimes updates the content after this.
        // Hence using setTimeout
        setTimeout(function() {
            priceRangeApplied($('.js-price-range-slider .c-filter-panel__label .sli-range-slider-track'));
        }, 600);

        // Bind click event on the more button so pinny can be triggered if clicked on
        bindClickMore();
    };

    var applySliProductStyle = function($context) {
        $context.find('.cin-title ').wrap('<h5></h5>').addClass('c-product-tile__title');
        $context.find('.priceLine').addClass('c-price');
        $context.find('.cin-catalog-item').addClass('c-product-tile');
    };

    // Update Search Page title
    var updateSearchPageTitle = function($pageTitle) {
        if ($pageTitle.length) {
            var $keyword = $pageTitle.find('.sli_bct_keyword');

            // GRRD-488: Add quotes around search term
            $keyword.html('"' + $keyword.html().trim() + '"');

            $('.js-page-title').remove();
            $('.js-product-list').prepend('<h2 class="c-title js-page-title">' + $pageTitle.text() + '</h2>');
        }
    };

    var updateSortby = function($sortby) {
        if (!$sortby.length) {
            return;
        }
        var sortbyContent = productListSortByParser.parse($sortby);
        new ProductListSortByTemplate({sortBy: sortbyContent}, function(err, html) {
            $sortByContainer.html(html);
        });

        $sortByContainer.removeClass('u--hide');
    };

    var interceptLeftNavUpdate = function() {
        var _updateLeftNav = jQuery.sliLoadInData;
        jQuery.sliLoadInData = function() {
            var _returnLeftNav = _updateLeftNav.apply(this, arguments);
            $('#sli_products').hide();
            setTimeout(function() {
                $('.js-product-tile-container').find('#sli_products').find('button').remove();
                applySliProductStyle($('.js-product-tile-container').find('#sli_products'));
                filterStackfilters();
                clearPriceFilter();
                if ($('#sli_products > .js-product-tile').length === 0) {
                    updateProductTiles($('#sli_products > li'));
                    updateSortby($('.cin-filter-sortby'));
                    updatePagination($('.cin-filter-pager').first());
                    updateSearchPageTitle($('.sli_bct_search_results').remove());
                    updateNumberOfResults($('.sli_bct_num_results').parent());
                }
                $('.js-refine-results').removeAttr('style');
            });
            return _returnLeftNav;
        };
    };

    // Add animation listener for getting filter data
    // because this data comes on page after some script run
    var animationListener = function() {
        if (event.animationName === 'refinePinny') {
            bindEvents();
            $('.c-filter-panel').map(function(_, item) {
                setFilterStack($(item));
            });
            activeCheckedFilterLable($('.c-filter-panel__checkbox'));
            appliedFilterIndicator();
        }
    };

    // Get no search result page content
    var showNoResults = function($noResults) {
        var noSeacrhResultContent = productListNoResultParser.parse($noResults);
        // Remove search contents that is appended by desktop
        $('.js-product-tile-container').find('#sli_products').empty();
        new NoResultsTemplate(noSeacrhResultContent, function(err, html) {
            $noSearchResult.html(html);
        });

        $('.c-bellows').bellows();
    };

    var _updateCount = function($content) {
        if (!$content || !$content.length) {
            return;
        }

        var $appliedFilters = $content.find('.sli_browse_other');
        var $appliedFilterContainer = $('.js-applied-filters');

        // Update and show item count
        // var $count = $content.find('.sli_bct_total_records');
        //
        // if ($count.length) {
        //     $('.js-item-count > span').html($count.text());
        // }


        if ($appliedFilters.length) {
            $appliedFilters.find('img').remove();
            $appliedFilters
                .addClass('c-filter-tag')
                .append('<span class="c-filter-tag__icon"><svg class="c-icon c--link" title="Close"><title>Close</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg></span>');

            $appliedFilterContainer
                .removeAttr('hidden')
                .html($appliedFilters);
        } else {
            $appliedFilterContainer
                .empty()
                .attr('hidden', 'hidden');
        }
    };

    var _attachSliUpdateFunctionCallbacks = function() {
        Utils.sliContentUpdateFunctions.addFunction('#sli_bct_inner', _updateCount);
    };

    var initHijax = function() {
        var hijax = new Hijax();
        var $loader = $('.js-filter-loader');
        hijax.set(
           'filter-proxy',
            function(url) {
                return url.indexOf('slisearchgr') > -1;
            },
            {
                beforeSend: function() {
                    var $pinnyOpenContainer = $('.js-filter-pinny.pinny--is-open');
                    $pinnyOpenContainer.find('.pinny__close').trigger('click');
                    $loader.removeClass('u--hide');
                },
                receive: function(data, xhr) {
                    var $data = $(data);
                    var $products = $data.filter('.cin-catalog-item');

                    if (/\<\!\-\-JUMPTOURL/.test(data)) {
                        // The page is redirecting, don't populate any list data
                        return;
                    }
                    if ($products.length) {
                        updateProductTiles($products);
                        updateSortby($('.cin-filter-sortby'));
                        updatePagination($('.cin-filter-pager').first());
                        updateSearchPageTitle($('.sli_bct_search_results').remove());
                        updateNumberOfResults($('.sli_bct_num_results').parent());
                        $noSearchResult.empty();
                        $refineResultContainer.removeClass('u--hide');
                        searchSuggestionSection();
                    } else {
                        showNoResults($data.find('.sli_noresults_container'));
                        updateProductTiles($data.find('.cin-catalog-item'));
                        $noSearchResult.removeAttr('hidden');
                        $numberOfResults.addClass('u--hide');
                        $sortByContainer.addClass('u--hide');
                        $refineResultContainer.addClass('u--hide');
                        $('.js-page-title').remove();
                    }
                    bindEvents();
                    updateRefineButtonText();
                    window.priceAPI(0, 0);
                    if (!$currentClickedMore) {
                        $loader.addClass('u--hide');
                    }
                    hideSearchSuggest();
                }
            }
        );

        hijax.set(
            'suggested-products-proxy',
            function(url) {
                return /RecommendationsJSONCmd/.test(url);
            },
            {
                complete: function(data, xhr) {
                    var JSONData = JSON.parse(data);
                    var suggestedProductsJSON = JSONData.requestResults[0];
                    suggestedProducts.buildSuggestedProducts(suggestedProductsJSON, 'You may also like', $('.js-you-may-also-like'));
                }
            }
        );


        hijax.set(
            'price-proxy',
            function(url) {
                return url.indexOf('JSONPricingAPI') > -1;
            },
            {
                complete: function(data, xhr) {
                    updatePrices();
                }
            }
        );
        window.priceAPI(0, 0);
    };

    // Execute this outside productListUI, so it's set in time for some of the desktop scripts,
    // which run before productListUI will execute
    if ($('.t-product-list').length) {
        initHijax();
        updateRefineButtonText();
    }

    var productListUI = function() {
        // Add event listeners for an filter panel being added.
        $('#sli_leftNav')[0].addEventListener('animationStart', animationListener);
        $('#sli_leftNav')[0].addEventListener('webkitAnimationStart', animationListener);
        $('.js-price-range-slider').find('.sli_facets_slider').find('a').addClass('needsclick');
        initFilterPinny();
        interceptLeftNavUpdate();
        bindEvents();
        handleSwatcheFunctionality();
        updateShippingRestrictionMessage();
        tooltipUI();
        // Refactor to use sli overrides instead of timeouts
        Utils.overrideDesktopSliUpdates();
        _attachSliUpdateFunctionCallbacks();
        setupLazyLoading();
    };

    return productListUI;

});
