define([
    '$',
    'hijax',
    'translator',
    'fastclick',
    'bellows',
    'navitron',
    'deckard',
    'pinny',
    'modal-center',
    'sheet-bottom',
    'sheet-left',
    'components/sheet/sheet-ui',
    'components/country-select/country-select-ui',
    'components/welcome-modal/welcome-modal-ui',
    'components/special-delivery-panel/special-delivery-panel-ui',
    'components/notification/notification-ui',
    'components/content-popup/content-popup-ui',
    'components/mini-cart/mini-cart-ui',
    'components/search-suggestions/search-suggestion-ui',
    'global/ui/back-to-top',
    'global/utils',
    'tozee'
],
function(
    $,
    Hijax,
    Translator,
    fastclick,
    bellows,
    navitron,
    deckard,
    pinny,
    modalCenter,
    sheetBottom,
    sheetLeft,
    Sheet,
    countrySelect,
    welcomeModal,
    specialDeliveryPanel,
    notification,
    contentPopup,
    minicart,
    searchSuggestionUI,
    backToTop,
    Utils
) {

    // Initiaizes Navigation and uses Navitrn plugin
    var initNav = function() {
        var $nav = $('.js-nav').navitron({
            structure: false
        });

        // Make sure navitron panes are scrollable
        $nav.find('.navitron__content').addClass('pinny--is-scrollable');

        // GRRD-660:
        // Avoiding duplicate nesting .pinny--is-scrollable seems to fix the issue of
        // not able to scroll when you open the menu the 2nd time and onwards.
        $nav.closest('.pinny__content').removeClass('pinny--is-scrollable');

        return $nav;
    };

    // Initializes My Account pinny
    var initMyAccount = function() {
        var $myAccounySheetEl = $('.js-my-account');
        var myAccounySheet = Sheet.init($myAccounySheetEl, {
            shade: {
                opacity: 0.5
            },
            open: function() {
                // Close all the open pinny if any, before opening this pinny.
                $('.pinny--is-open').find('.pinny__close').first().trigger('click');
            }
        });

        $('body').on('click', '#x-toggle-account-modal', function() {
            myAccounySheet.open();
        });
    };

    // Initializes left Navigation
    var initLeftNav = function() {
        var $leftNavSheetEl = $('.js-left-nav');
        var $headerItem = $('.t-header__row-item').children();
        var leftNavSheet = Sheet.init($leftNavSheetEl, {
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                zIndex: 100, // Match our standard modal z-index from our CSS ($z3-depth)
                opacity: '0'
            },
            open: function() {
                $headerItem.addClass('c--depth-max');
            },
            opened: function() {
                Utils.addHeaderOpenClass();
            },
            close: function() {
                $headerItem.removeClass('c--depth-max');
            },
            closed: function() {
                Utils.removeHeaderOpenClass();
            }
        });

        $('body').on('click', '.js-shop-nav', function() {
            leftNavSheet.open();
        });
    };

    // Handles the icons displayed when bellow is open and closed
    var initBellows = function() {
        $('body').on('click', '.js-bellows-header', function(e) {
            var $target = $(this);

            var $icon = $target.find('.c-icon');

            if ($icon.find('title').text() === 'expand') {
                $icon.attr('data-fallback', 'img/png/collapse.png');
                $icon.find('title').text('collapse');
                $icon.find('use').attr('xlink:href', '#icon-collapse');
            } else {
                $icon.attr('data-fallback', 'img/png/expand.png');
                $icon.find('title').text('expand');
                $icon.find('use').attr('xlink:href', '#icon-expand');
            }
        });
    };

    // Intercept alert to display the errors using notification component
    var interceptAlertForError = function() {
        var $onClickError = $('.c-email-subscription__form');
        $onClickError.on('click', 'button', function(event) {
            var _alert = window.alert;

            // Intercepting alert function to catch the error messages.
            window.alert = function(message) {

                // Create structure required by notifiation component
                var $errorContainer = $('<div><div class="js-error"></div></div>');
                $errorContainer.find('.js-error').append(message);
                Adaptive.notification.triggerError($errorContainer);

                // TODO: Handle multiple error case
                // message = message.split(/\n/gm);
            };
            /*eslint-enable */
        });
    };

    // Singup enable disable button
    var signUpEnable = function() {
        $('.c-email-section').on('keyup', '#emailSignUp, .form-control', function() {
            var $target = $(this);
            if ($target.val() !== '') {
                $target.next().removeClass('c--is-disabled');
            } else {
                $target.next().addClass('c--is-disabled');
            }
        });
    };

    // Remove 'now' and 'was' text from price section
    var updateSearchPrice = function() {
        var hijax = new Hijax();
        hijax.set(
           'price-proxy',
            function(url) {
                return url.indexOf('JSONPricingAPI') > -1;
            },
            {
                complete: function() {
                    $('.js-search').find('.c-search-suggestions__product').map(function(_, item) {
                        var $item = $(item);
                        var $priceNow = $item.find('.priceNow');
                        var $priceWas = $item.find('.priceWas');
                        if ($priceNow.length) {
                            $priceNow.text($priceNow.text().replace('Now', ''));
                        }
                        if ($priceWas.length) {
                            $priceWas.text($priceWas.text().replace('Was', ''));
                        }
                    });
                }
            }
        );
    };

    var fixIOSScrollInPinny = function() {
        // We need to know when to do the scroll fix, and this is when options
        // change for a product.
        // FRGT-519: Repaint page on touchstart when repaint is needed.
        if (!$.os.ios) { return; }

        $('body')
            .on(
                'blur',
                '.c-sheet select, .c-sheet input',
                function() {
                    var $sheets = $('.c-sheet.pinny--is-open').filter(function() {
                        return $(this).find('.c-scooch').length > 0;
                    });

                    $sheets.data('needsScrollFix', true);
                })
            .on(
                'touchstart',
                '.c-sheet',
                function() {
                    var $sheet = $(this);
                    var needsScrollFix = $sheet.data('needsScrollFix');

                    if (needsScrollFix) {
                        $sheet.css('border', 'solid 1px transparent');
                        $sheet.find('.c-scooch').css('transform', '');

                        setTimeout(function() {
                            $sheet.find('.c-scooch').css('transform', 'translateZ(0)');
                            $sheet.css('border', 'solid 0px transparent');
                        }, 500);

                        $sheet.data('needsScrollFix', false);
                    }
                });
    };

    var initLoadingSpinner = function() {
        $('.js-loading-overlay').shade({
            cssClass: 't-loading-overlay-shade',
            color: '#333',
            opacity: '0.5',
            click: $.noop,
            zIndex: 10000
        });
    };

    var globalUI = function() {
        // Remove 300ms tap delay using FastClick
        fastclick.attach(document.body);

        // Enable active states for CSS
        $(document).on('touchstart', function() {});

        // Initializes bellows and handles the display of icon
        $('.c-bellows').bellows();
        initBellows();
        signUpEnable();

        // Initializes Mini cart
        minicart.initHijaxProxies();
        minicart.initCartPinny();
        minicart.bindEventHandlers();

        initLoadingSpinner();

        initNav();
        initMyAccount();
        initLeftNav();

        // Initiaizes change country popup
        countrySelect.init();
        countrySelect.updateCountryContent();

        // Initiaizes welcome modal popup
        welcomeModal.init();

        specialDeliveryPanel.init();


        // Display content popups in pinny
        contentPopup.overrideShowContentPopup();

        // Display notifications (error messages, success messages) in pinny
        Adaptive.notification = notification;
        Adaptive.notification.init();
        searchSuggestionUI.init();

        // Add repaint for scrolling issue.
        fixIOSScrollInPinny();

        // Intercept alert to display the errors using notification component
        interceptAlertForError();
        updateSearchPrice();
        backToTop();
    };

    return globalUI;

});
