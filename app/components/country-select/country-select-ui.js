define([
    '$',
    'hijax',
    'components/tabs/tabs-ui',
    'components/sheet/sheet-ui',
    'sheet-bottom',
    'components/country-select/country-select-pinny-parser',
    'dust!components/country-select/_country-select-pinny-content',
    'global/utils',
    'pinny'
], function($, Hijax, tabs, sheet, sheetBottom, countrySelectParser, CountrySelectTemplate, utils) {
    var $countrySelectSheetEl;
    var countrySelectSheet;


    var wrapFlagsInLetterContainers = function($links) {
        var $currentContainer;

        $links.each(function() {
            var $link = $(this);
            var firstLetter = $link.attr('title').charAt(0).toLowerCase();

            utils.replaceFlagImage($link);

            if ($currentContainer && $currentContainer.is('[data-tozee="' + firstLetter + '"]')) {
                $currentContainer.append($link);
            } else {
                $link.wrap('<div data-tozee="' + firstLetter + '">');
                $currentContainer = $link.parent();
            }
        });
    };

    var wrapDefaultFlagsInLetterContainer = function($link) {
        $link.wrap('<div data-tozee="a">');
    };

    var updateTabSubtitles = function() {
        var currencyValue = $('#currencyListBox').val();
        var $selectedCurrency = $('option[value="' + currencyValue + '"]');
        var $selectedCountry = $('.newly_selected_country .currentlySelectedCountry');

        if (!$selectedCountry.length) {
            $selectedCountry = $('.currentlySelectedCountry');
        }

        $('.js-currency-subtitle').text($selectedCurrency.text());
        $('.js-shipping-subtitle').text($selectedCountry.text());
    };

    var bindEvents = function() {

        $('.js-country-select').on('click', '.c-sheet__header-close', function() {
            $('.okCancelPanel').find('button span').trigger('click');
        });

        $countrySelectSheetEl.on('click', '.gwt_flag_anchor', updateTabSubtitles);
        $countrySelectSheetEl.on('change', '#currencyListBox', updateTabSubtitles);

        $countrySelectSheetEl.on('focus', 'select', function(e) {
            $(this).parent().addClass('c--is-focus');
        });

        $countrySelectSheetEl.on('blur', 'select', function(e) {
            $(this).parent().removeClass('c--is-focus');
        });
    };

    var transformCountrySelect = function() {
        $countrySelectSheetEl = $('.js-country-select');
        var $desktopCountrySelect = $('.gwt-international-country-changer');
        var templateData = countrySelectParser.parse($desktopCountrySelect);

        // These elements will only have their event handlers set if we don't parse them
        var $links = $desktopCountrySelect.find('.gwt_flag_anchor');
        var $button = $desktopCountrySelect.find('.button.primary');
        var $select = $desktopCountrySelect.find('#currencyListBox');
        var $usFlag = $desktopCountrySelect.find('.okCancelPanel .gwt-Anchor');

        // Add classes
        $links.addClass('c-country-select__item u-margin-top-sm u-margin-bottom-sm');
        $('.gwt_united_states_flag_changer').addClass('c-country-select__item');
        $('.currentlySelectedCountry').parent().addClass('c--active');

        countrySelectSheet = sheet.init($countrySelectSheetEl, {
            effect: sheetBottom
        });

        countrySelectSheet.setTitle('Change Country & Currency');

        $desktopCountrySelect.removeAttr('style');
        $button.addClass('c-button c--primary c--full-width');

        utils.replaceFlagImage($usFlag, 'us');


        new CountrySelectTemplate(templateData, function(err, html) {

            countrySelectSheet.setBody(html);

            // Replace interactive elements
            $countrySelectSheetEl.find('.js-currency-select').prepend($select);
            $countrySelectSheetEl.find('.js-country-links')
                .append($usFlag)
                .append($links);
            var buttonText = $button.text().toLowerCase();
            $button.find('span').text(buttonText)
                .append(' >');
            countrySelectSheet.setFooter($button);

            wrapFlagsInLetterContainers($links);
            wrapDefaultFlagsInLetterContainer($usFlag);

            // Init plugins
            // Please don't try to display ALL HE LETTERS, for we love our users
            $countrySelectSheetEl.find('.js-tozee').tozee({
                ignoreResizeDelta: 0,
                overflowScroll: true
            });

            tabs.init();

            countrySelectSheet.open();
        });

        bindEvents();
    };

    var appendFlagImage = function() {
        var code;
        var countryName;
        var $shopBellows = $('.c-bellows__header:contains(Shop)');
        var $internationalCountry = $('#gwt_international_country_code');

        if ($internationalCountry.length > 0) {
            code = $('#gwt_international_country_code').val().toLowerCase();
            countryName = $('#gwt_international_country_name').val();

            $shopBellows
                .append($('<i class="c-flag-icon c--' + code + '" title="' + countryName + '"></i>'));
        } else {
            $shopBellows
                .append($('<i class="c-flag-icon c--us" title="United States"></i>'));
        }
    };

    var init = function() {
        var hijax = new Hijax();

        hijax.set(
            'country-select-proxy',
            function(url) {
                return /InternationalCountryPickerJSONView/.test(url);
            },
            {
                complete: function(data, xhr) {
                    transformCountrySelect();
                }
            }
        );

        hijax.set(
            'country-select-text-update',
            function(url) {
                return /International\/CountryChanger.*ContentSpot3/.test(url);
            },
            {
                complete: function(data, xhr) {
                    $('.js-fine-print').html(data);
                }
            }
        );

        appendFlagImage();
    };

    var updateCountryContent = function() {
        var countryIntervalId;
        // Some of the content is added by desktop scripts, and there isn't a good way for us to hook into it
        // So instead set an interval to check for those elements until they've been added
        var updateCountrySelect = function() {
            var $countryLink = $('.gwt_header_country_selector');

            if ($countryLink.length) {
                $countryLink.find('.gwt_header_country_picker_change_text').addClass('u--hide').end()
                    .find('.gwt_header_country_picker_text').text('Change Country & Currency');

                if (countryIntervalId) {
                    clearInterval(countryIntervalId);
                }
            }
        };
        $('link[href*="CSBEntryPoint.css"]').attr('disabled', 'true');
        $('iframe[src*="imiclk.com"]').addClass('u-visually-hidden');

        if ($('.gwt_header_country_selector').length) {
            updateCountrySelect();
        } else {
            countryIntervalId = setInterval(updateCountrySelect, 200);
        }
    };

    return {
        init: init,
        updateCountryContent: updateCountryContent
    };
});
