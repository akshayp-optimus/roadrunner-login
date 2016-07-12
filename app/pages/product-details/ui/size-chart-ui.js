define([
    '$',
    'pages/product-details/parsers/size-chart-parser',
    'dust!pages/product-details/partials/size-chart/size-chart-main-page'
], function($, sizeChartParser, SizeChartTemplate) {


    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');
    var currentChartURL;
    var $pinnyContent;
    var _showSizeChart;

    var _getFullUrl = function(partialHref) {
        var urlPartialMatch = /[^\/]+.html/.exec(currentChartURL);

        if (urlPartialMatch) {
            return currentChartURL.replace(urlPartialMatch[0], partialHref);
        }
    };

    var _bindEvents = function() {
        $('.js-tab-select').on('change', function(e) {
            var $selected = $(this).children(':selected');
            var newHref = $selected.attr('data-tab-href');
            var url = _getFullUrl(newHref);

            _showSizeChart(url);
        });

        $('.js-size-chart-link').on('click', function(e) {
            e.preventDefault();
            var url = _getFullUrl($(this).attr('href'));
            _showSizeChart(url, true);
        });

        $('.js-size-chart-tab').on('click', function(e) {
            e.preventDefault();
            var url = _getFullUrl($(this).attr('href'));
            _showSizeChart(url, false);
        });
    };

    _showSizeChart = function(sizeChartUrl, updatePinnyHeader) {
        $pinnyContent.html($loader);
        currentChartURL = sizeChartUrl;

        $.ajax({
            url: sizeChartUrl,
            complete: function(xhr) {
                var $response = $(xhr.responseText);
                var templateContent = sizeChartParser.parse($response.filter('table'), currentChartURL);

                if (updatePinnyHeader) {
                    $pinnyContent.prev('.c-sheet__header').find('.c-sheet__title').html($response.filter('title').text());
                }

                new SizeChartTemplate(templateContent, function(err, html) {
                    $pinnyContent.html(html);
                    _bindEvents();
                });
            }
        });
    };

    var _init = function(url, $pinny) {
        $pinnyContent = $pinny.find('.js-size-chart-body');

        _showSizeChart(url);
    };


    return {
        init: _init
    };
});
