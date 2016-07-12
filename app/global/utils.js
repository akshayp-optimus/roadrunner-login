define(['$', 'velocity'], function($, Velocity) {
    var uid = 0;
    // first item corresponds with pixel ratio of 1, second pixel ratio of 2, third with pixel ratio of 3
    // MobifyView1 = 276x345
    // MobifyRetina = 552x690
    // MobifyDoubleRetina = 828x1035
    var sizePresets = ['MobifyView1', 'MobifyRetina', 'MobifyDoubleRetina'];
    var ratio = window.devicePixelRatio;

    var loadingSpinnerTimer;

    var Utils = {
        sliContentUpdateFunctions: (function() {
            var updateFunctions = {};

            var _addFunction = function(key, functionReference) {
                (updateFunctions[key] || (updateFunctions[key] = [])).push(functionReference);
                // set it to global so our monkey patch functions can get it
                Adaptive.evaluatedContext.contentUpdateFunctions = updateFunctions;
            };

            var _getFunctions = function() {
                return updateFunctions;
            };

            return {
                addFunction: _addFunction,
                getFunctions: _getFunctions
            };
        })(),
        overrideDesktopSliUpdates: function() {
            var _oldLoadContent = window.sli_loadContent;

            /*eslint-disable */
            window.sli_loadContent = function() {
                var location = arguments[1];
                var $content = Adaptive.$(arguments[0].replace(/&nbsp;/g, ''));
                var _contentUpdateFunctions = Adaptive.evaluatedContext.contentUpdateFunctions;
                var updateFunctions = _contentUpdateFunctions[location];

                if (updateFunctions) {
                    Adaptive.$.each(updateFunctions, function() {
                        var updateFunction = this;
                        updateFunction($content);
                    });
                }

                _oldLoadContent.apply(this, arguments);
            };
            /*eslint-enable */
        },
        'showLoadingSpinner': function(t) {
            var timeout = t || 2000;

            var $loadingOverlay = $('.js-loading-overlay');
            if ($loadingOverlay.is(':visible')) return;

            $loadingOverlay.shade('open');

            $loadingOverlay.show();

            loadingSpinnerTimer = setTimeout(Utils.hideLoadingSpinner, timeout);
        },
        'hideLoadingSpinner': function(noOuterShade) {
            var $loadingOverlay = $('.js-loading-overlay');
            var $innerShade = $('.js-inner-shade');

            $loadingOverlay.shade('close');

            $loadingOverlay.hide();

            if (loadingSpinnerTimer) {
                clearTimeout(loadingSpinnerTimer);
            }
        },
        replaceFlagImage: function($link, countryCode) {
            var code = countryCode ? countryCode : $link.attr('country-code').toLowerCase();
            var $img = $link.find('img');
            var countryName = $link.attr('title') ? $link.attr('title') : $img.attr('alt');

            // NOTE: Removed hidden country name for screen readers
            // for 1) this breaks desktop scripts
            // and 2) country name follows the flag icon anyways
            $img.replaceWith($('<i class="c-flag-icon c--' + code + '" title="' + countryName + '"></i>'));
        },
        debounce: function(fn, wait) {
            var timeout;

            return function() {
                var that = this;
                var args = arguments;

                var later = function() {
                    timeout = null;
                    fn.apply(that, args);
                };

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        requestAnimationShim: (function() {
            var timeLast = 0;

            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                var timeCurrent = (new Date()).getTime(),
                    timeDelta;

                /* Dynamically set delay on a per-tick basis to match 60fps. */
                /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
                timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                timeLast = timeCurrent + timeDelta;

                return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
            };
        })().bind(window),
        replaceWithPrototypeElements: function() {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            $('.js-needs-replace').filter(function() {
                return !$(this).closest('.js-desktop-pdp').length;
            }).each(function() {
                var $needsReplace = $(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = $('.js-desktop-pdp').find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');
                if (!$original) {
                    $original = $('.js-desktop-pdp').find('[id="' + selector + '"]')
                                        .removeClass('js-needs-replace');
                }

                $needsReplace.replaceWith($original);
            });
        },
        replaceWithPrototypeElementsForCheckout: function(desktopSelector) {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            $('.js-needs-replace').filter(function() {
                return !$(this).closest(desktopSelector).length;
            }).each(function() {
                var $needsReplace = $(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = $(desktopSelector).find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');

                $needsReplace.replaceWith($original);
            });
        },
        generateUid: function() {
            return uid++;
        },
        roundToTwoDecimals: function(num) {
            var rounded = Math.round(num * 100) / 100;
            return rounded.toFixed(2);
        },
        getCorrectImageURL: function(url) {
            // -1 to account for 0 based index for the array
            var sizeType = sizePresets[ratio - 1];


            if (/thumbnail|t_withoutzoom/i.test(url) && ratio === 3) {
                // As per the customer, images with thumbnail or t_withoutzoom
                // cannot be served large enough for double retina so
                // serve the retina version instead (see GH-147 for reference)
                sizeType = sizePresets[1];
            }

            if (/<sizeType>/.test(url)) {
                return url.replace('<sizeType>', sizeType);

            } else if (/sizeType/.test(url)) {
                // The url already has a sizeType defined, so replace it
                var urlSizeTypeMatch = /sizeType=([^&$]+)/.exec(url);
                if (urlSizeTypeMatch) {
                    return url.replace(urlSizeTypeMatch[1], sizeType);
                } else {
                    return url;
                }
            }
            // The url doesn't have a sizeType defined so add one
            return url + '&sizeType=' + sizeType;
        },
        buildToggle: function($hiddenDiv, text) {
            var $toggleContent = $hiddenDiv.wrap($('<div>', {
                class: 'u-visually-hidden'
            })).parent();

            var $toggleTrigger = $('<a>', {
                class: 'c-button c--link c--plus c--simple u-padding-top-sm u-padding-bottom-sm',
                text: text
            });

            $toggleContent.after($toggleTrigger);

            $toggleTrigger.on('click', function() {
                // one-time trigger
                $hiddenDiv.unwrap();
                $toggleTrigger.remove();
            });
        },
        // Update Form Labels to match the invision
        updateFormLabels: function(labelText) {
            /* eslint-disable */
            var desktopLabels = ['Re-enter New Password', 'Re-Enter Email address', 'New Password', 'Re-enter', 'Email Address', 'Company Name', 'Street Address 1', 'Optional', 'State/Province', 'Zip/Postal Code', 'Daytime Phone', 'Evening Phone', 'Credit Card Number', 'Expiration Date', 'Country Name', 'Registry Type', 'Registry Name', 'Registry Number'];
            var mobileLabels = ['re_enter', 're_enter', 'password', 'confirm', 'email', 'company', 'address_1', 'address_2', 'state', 'zip', 'phone', 'phone', 'credit_card_number', 'expiration_date', 'Country', 'Registry', 'name', 'registry_#'];
            var labelRegex;
            for (var i = 0; i < desktopLabels.length; i++) {
                labelRegex = new RegExp(desktopLabels[i], 'i');
                if (labelRegex.test(labelText)) {
                    return mobileLabels[i];
                }
            }
        },
        /* eslint-enable */
        // Update Form Labels to match the invision
        updateAccountLandingFormLabels: function(labelText) {
            var desktopLabels = ['Current Password', 'Create a New Password', 'Re-enter New Password', 'Current Email', 'New Email', 'Re-enter Email', 'Order Number', 'Billing Zip Code'];
            var mobileLabels = ['Current', 'New', 'Re-enter', 'Current', 'New', 'Re-enter', 'Order#', 'billing_zip'];

            var labelRegex;
            for (var i = 0; i < desktopLabels.length; i++) {
                labelRegex = new RegExp(desktopLabels[i], 'i');
                if (labelRegex.test(labelText)) {
                    return mobileLabels[i];
                }
            }
        },
        getNonEmptyChildTextNodes: function($element) {
            return $element.contents().filter(function() {
                return this.nodeType === 3 && this.textContent.trim() !== '';
            });
        },
        getAccordions: function($container) {
            var links = $container.find('h3').map(function(_, item) {
                var $item = $(item);
                var $content = $item.next();
                $content.find('.contactNumber a').addClass('c-contact-number');
                $content.find('dl br').remove();
                return {
                    sectionTitle: $item.text(),
                    content: $content.children()
                };
            });
            return {
                items: links,
                accordionClass: 'c-links'
            };
        },
        // Wrap the last word of heading in span
        wrapLastWordInSpan: function($content) {
            $content.each(function(index, element) {
                var heading = $(element);
                var wordArray;
                var lastWord;
                var firstPart;
                wordArray = heading.html().trim().split(/\s+/); // split on spaces
                lastWord = wordArray.pop();             // pop the last word
                firstPart = wordArray.join(' ');        // rejoin the first words together
                heading.html([firstPart, ' <span class="c-category-card__primary-action-last-word">', lastWord, '</span>'].join(''));
            });
        },
        changeBellowsIcon: function($bellowsItem) {
            var $bellowIcon = $bellowsItem.find('.c-bellows__icon');
            if ($bellowsItem.is('.bellows--is-open, .bellows--is-opening')) {
                $bellowIcon.html('<svg class="c-icon js-product-bellows" data-fallback="img/png/collapse.png"> <title>collapse</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-collapse"></use></svg>');
            } else {
                $bellowIcon.html('<svg class="c-icon js-reviews-bellows u-no-border c-reviews-bellows" data-fallback="img/png/expand.png"> <title>expand</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-expand"></use></svg>');
            }
        },
        getImageBaseUrl: function() {
            return 'http://grandinroad.scene7.com/is/image/frontgate/';
        },
        removeHeaderOpenClass: function() {
            if (!$('.js-header-pinny.pinny--is-open').length) {
                $('body').removeClass('t-header__menu-search-open');
            }
        },
        addHeaderOpenClass: function() {
            if ($('.js-header-pinny.pinny--is-open').length) {
                $('body').addClass('t-header__menu-search-open');
            }
        },
        swapImages: function($container) {
            $container.find('img[data-mobile-src]').each(function(i, img) {
                var $img = $(img);
                $img.attr('x-src', $img.attr('data-mobile-src'));
            });
        },
        overrideDomAppend: function(selector, callback, argumentSelector) {
            var _appendChild = Element.prototype.appendChild;

            Element.prototype.appendChild = function() {
                if ($(this).is(selector) || $(arguments[0]).is(argumentSelector)) {
                    callback.apply(this, arguments);
                }

                return _appendChild.apply(this, arguments);
            };
        },
        animateCartIcon: function($cartIcon) {
            var addToCartPostion = jQuery('.js-add-to-cart').offset().top - 22;

            $cartIcon.addClass('c-cart-fly js--new-item');

            Velocity.animate(
                $cartIcon,
                {
                    translateY: [45, 0]
                },
                {
                    easing: 'swing',
                    duration: 200,
                    display: 'block'
                }
            );
        }
    };

    return Utils;
});
