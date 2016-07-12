define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
    'dust!components/bellows/bellows',
    'removeStyle',
    'global/utils',
    'global/utils/dom-operation-override',
    'pages/product-details/ui/pdp-build-helpers-ui'
], function($, Translator, sheet, BellowsTmpl, RemoveStyles, Utils, DomOverride, BuildHelpersUI) {
    var $personalizationPinny = $('.js-personalization-pinny');
    var $personalizationShade = $('.js-personalization-shade');
    var $pinnyContent = $personalizationPinny.find('.js-personalization-content');

    $personalizationPinny.find('.pinny__content').addClass('u-padding-all-0');

    var bindStepsBellows = function() {
        // initial state
        $('.js-personalization-bellows').bellows('open', 1);
        var $secondBellow = jQuery('.js-personalization-content').find('.c-bellows__icon')[1];
        $secondBellow.innerHTML = '<svg class="c-icon c--gray-bg u-border-top-remove js-personalization-bellows" data-fallback="img/png/collapse.png"> <title>collapse</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-collapse"></use></svg>';
        $('.js-personalization-bellows').on('click', '.js-next-step', function(e) {
            e.preventDefault();

            var $currentStep = $(this);
            var $bellows = $currentStep.closest('.bellows');
            var $nextBellowsItem = $currentStep.closest('.bellows__item').next('.bellows__item');

            $bellows.bellows('closeAll');
            $bellows.bellows('open', $nextBellowsItem);
        });


        $('.js-personalization-content').find('.c-bellows__item').map(function() {
            Utils.changeBellowsIcon($(this));
        });
    };

    // stick bellows inside gwt modal so the gwt events stay intact
    var buildStepsBellows = function($personalization) {
        $personalization.find('.c-bellows').remove(); // not sure why it's not cleared second time it's opened
        var bellowsMarkup;
        var itemsArr = [];
        var $accordions = $personalization.find('.gwt-accordion-tab');

        $accordions.map(function(index, item) {
            var $item = $(item);
            var uid = Utils.generateUid();

            var $continueButton = $('<button>', {
                class: 'c-button c--primary c--full-width js-next-step ',
                text: $accordions.length - 1 === index ? 'finish & preview >' : 'next >',
            });
            // Original
            var $originalSelectedOption = $item.find('.gwt-tab-header-selected-option');

            // Add data relpace id in original
            $item.find('.gwt-tab-header-selected-option').attr('data-replace-id', uid);

            var bellowItem = {
                sectionTitle: $item.find('.gwt-tab-header-title').text($item.find('.gwt-tab-header-title').text().toLowerCase()),
                addtionalTitleInfo: $('<div class="js-needs-replace"/>').attr('data-replace-id', uid),
                content: $continueButton
            };

            itemsArr.push(bellowItem);
        });


        // Create one more bellow item for Preview And Save
        var preveiwAndSaveBellowItem = {
            sectionTitle: Translator.translate('preview_and_save')
        };
        itemsArr.push(preveiwAndSaveBellowItem);

        var bellowsData = {
            class: 't-personalization-bellows-pinny c--gray-bg u-border-top-remove js-personalization-bellows',
            items: itemsArr
        };

        new BellowsTmpl(bellowsData, function(err, html) {
            bellowsMarkup = html;
        });

        var $bellowsContainer = $(bellowsMarkup);

        $personalization.append($bellowsContainer);

        $personalization.find('.gwt-accordion-tab-content').each(function(index) {
            var $content = $(this).contents().unwrap();
            // // Add labels text as placeholder to inputs
            var $label = $content.find('.gwt-personalization-textbox-description');
            $content.find('.gwt-TextBox').attr('placeholder', $label.text());
            $personalization.find('.c-bellows__content').eq(index).append($content[0]);
        });
        // we are hiding the rest of the container except for the bellows content
        $personalization.children().addClass('u-visually-hidden');
        $personalization.prepend($bellowsContainer);
        $bellowsContainer.removeClass('u-visually-hidden');
        $('.c--close-pinny').removeClass('u-visually-hidden');

        return $personalization;
    };

    // stick relevant content into relevant bellows steps
    var transformPinnyContent = function($container) {
        // var $personalization = $pinnyContent.find('#gwt-personalization-modal-V2');

        $container.find('.button.primary').addClass('js-personalization-save');
        $container.find('.button.secondary:not(.step-button)').addClass('js-personalization-close');

        $container.find('.gwt-submit-cancel-dialog-button-panel button').each(function() {
            var $button = $(this);

            if (/(save)/i.test($button.text())) {
                $button.addClass('js-close-pinny');
            }
            if (/(cancel)/i.test($button.text())) {
                $button.addClass('js-cancel-pinny');
            }
        });
        // All Steps
        $container.find('.gwt-personalization-modal-accordions-content')
            .parent().addClass('u-padding-sides-md');
        var reorderButtons = $container.find('.js-next-step').each(function(index) {
            var $button = $(this).unwrap();
            var $bellowsContent = $button.closest('.bellows__content');

            $bellowsContent.append($button);
        });

        $container.find('.js-next-step').wrap($('<div>', {
            class: 'u-margin-bottom-md u-padding-sides-md u-margin-top-md'
        }));

        // Step 1
        $container.find('.gwt-swatch-picker').first().addClass('c-grid c--4up c--gutters u-margin-bottom-md');
        $container.find('.gwt-personalization-image-picker-option').addClass('c-grid__span');
        $container.find('.gwt-personalization-image-picker-label').remove();
        $container.find('.gwt-personalization-image-picker-description').addClass('u-text-align-center u-margin-bottom-md');
        $container.find('.gwt-image-picker-option').removeClass('nodisplay');
        $container.find('#gwt-see-all-button-wrapper').attr('hidden', '');
        // $pinnyContent.find('.gwt-tab-header-selected-option').remove();

        // Step 2
        $container.find('.gwt-swatch-picker').last().addClass('c-grid c--6up c--gutters');
        $container.find('.gwt-personalization-swatch-picker-option').addClass('c-grid__span');
        $container.find('.gwt-personalization-swatch-picker-label').remove();
        $container.find('.gwt-personalization-swatch-picker-description').addClass('u-text-align-center u-margin-top-sm u-margin-bottom-md');

        // Step 3 - Preview And Save
        var $preveiwAndSaveButtons = $container.find('.gwt-submit-cancel-dialog-button-panel');
        $preveiwAndSaveButtons.find('.secondary').insertAfter($preveiwAndSaveButtons.find('.primary'));
        $container.find('.c-bellows__content').last()
            .append($container.find('.gwt-personalization-main-image'))
            .append($container.find('.gwt-personalization-modal-total-price-amount'))
            .append($container.find('#gwt-personalization-shipping-details'))
            .append($preveiwAndSaveButtons.find('button'))
            .find($('.js-next-step')).remove();

        $container.find('.gwt-personalization-attribute-value-alpha-freeform').wrap('<div class="c-input">');
        $container.find('.gwt-personalization-textbox-description').addClass('c-field__caption');
        $container.find('.gwt-personalization-main-image').addClass('u-padding-sides-md u-margin-bottom-md u-margin-top-sm u--tight c-personalization-image');
        $container.find('.gwt-personalization-textbox-label').remove();

        var $personalizationPrice = $container.find('.gwt-personalization-modal-total-price-amount').addClass('u--bold');

        $personalizationPrice.last().addClass('c-ledger__number');
        var $ledgerDescription = $personalizationPrice.first().addClass('c-ledger__description');

        $personalizationPrice.wrapAll('<div class="c-ledger u-padding-sides-md u-text-align-center"><div class="c-ledger__entry c--total"></div></div>');
        $ledgerDescription.replaceWith('<div class="c-total-product-cost">' + Translator.translate('total_product_cost') + '</div>');
        $container.find('.gwt-personalization-modal-total-price-holder').remove();

        $container.find('.js-close-pinny, .js-cancel-pinny').addClass('c-button c--full-width u-margin-bottom-md').wrapAll('<div class="u-padding-sides-md"></div>');
        $container.find('.button.primary').addClass('c--primary').text(Translator.translate('save_and_close'));
        $container.find('.button.secondary').addClass('c--secondary c-personalization-cancel-button');
        $container.find('#gwt-personalization-shipping-details').addClass('c-aux-text u-padding-sides-md u-margin-bottom-md u-text-align-center');
        $('.c--close-pinny').length || $('#gwt-personalization-modal-V2').prepend($('<button class="c--close-pinny pinny__close c-sheet__header-close" />'));
        $('.c--close-pinny').html('<svg class="c-icon" data-fallback="img/png/close.png"> <title>close</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use> </svg>');

        // Trigger click  event of "cancel" button of personalization popup.
        // $('.c--close-pinny').one('click', function() {
        //     var evt = document.createEvent('HTMLEvents');
        //     evt.initEvent('click', false, true);
        //     $('.js-cancel-pinny').length && $('.js-cancel-pinny')[0].dispatchEvent(evt);
        // });
    };

    var animationListener = function() {
        if (event.animationName === 'errorAdded') {
            var $clonedErrorPanel = $('.gwt-personalization-modal-mainpanel #gwt-error-placement-div').clone(true);
            var $errorPanel = $('.js-error-panel');
            $clonedErrorPanel.find('.gwt-csb-error-panel').removeClass('gwt-csb-error-panel');
            $errorPanel.html(
                $clonedErrorPanel
            );
        }
    };

    var _closePinny = function() {
        var $lockup = $('.lockup__container');
        $personalizationPinny.parent().appendTo($lockup);
        $personalizationShade.appendTo($lockup);

        $personalizationPinny.pinny('close');
    };

    var buildPinny = function() {
        var $modal = $('#gwt-personalization-modal-V2');
        $modal.removeStyle();
        // we need to hide this instead of removing because desktop scripts
        // will try to remove this container upon dialogbox closing
        // if it's removed, then it'll cause desktop script failing silently
        // and cause personalization pinny to be out of sync
        $('.gwt-PopupPanelGlass').addClass('u-visually-hidden');

        var headerText = $modal.find('.gwt-dm-modal-productinfopanel-cost').text();

        $personalizationPinny.find('.c-sheet__title').html(headerText);

        // we can't use a partial template here without losing all event listeners
        // So instead we need to transform the content in place
        $pinnyContent.empty();
        $pinnyContent.append($('<div class="js-error-panel u-padding-left-tight" />'));
        buildStepsBellows($modal);

        // stick pinny into modal so we can keep gwt bindings
        $modal
            .append($pinnyContent.closest('.pinny'))
            .append($personalizationShade);

        $modal.find('.c-bellows').appendTo($modal.find('.js-personalization-content'));

        transformPinnyContent($modal);

        $('.js-personalization-bellows').bellows({
            singleItemOpen: true,
            opened: function(e, ui) {
                // focus on input box when bellow is opened.
                var $bellowInput = $($(ui)[0].item).find('input');
                $bellowInput.length && $bellowInput.focus();

                $('.js-personalization-content').find('.c-bellows__item').map(function() {
                    Utils.changeBellowsIcon($(this));
                });
            },
            closed: function() {
                $('.js-personalization-content').find('.c-bellows__item').map(function() {
                    Utils.changeBellowsIcon($(this));
                });
            }
        });

        bindStepsBellows();
        $modal.addClass('js-transformed');
        $personalizationPinny.pinny('open');
    };

    var waitForPersonalizationModal = function() {
        var $personalizationModal = $('#gwt-personalization-modal-V2');
        var pollForVisible = window.setInterval(function() {
            if (/visibility: visible/i.test($personalizationModal.attr('style'))) {
                clearInterval(pollForVisible);
                buildPinny();
            }

            // clear interval after 10s
            setTimeout(function() {
                clearInterval(pollForVisible);
            }, 10000);

            return;
        }, 100);
    };

    var _bindPinnyEvents = function() {
        $('body').on('click', '.js-personalization-pinny .pinny__close', function() {
            $('.js-personalization-pinny .js-personalization-close').triggerGWT('click');
        });

        DomOverride.on('domAppend', '#gwt-personalization-modal-V2', waitForPersonalizationModal);
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', _closePinny);
    };

    var _init = function($parent, $desktopParent) {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        sheet.init($personalizationPinny, {
            shade: {
                cssClass: 'js-personalization-shade'
            },
            coverage: '100%',
            opened: function() {
                // Replae with Prototype elements
                $('.js-personalization-pinny .js-needs-replace').each(function() {
                    var $needsReplace = $(this);
                    var selector = $needsReplace.attr('data-replace-id');
                    var $original = $('.gwt-DialogBox').find('[data-replace-id="' + selector + '"]').first();

                    $needsReplace.replaceWith($original.addClass('c-bellows__header-selected-option'));
                });
            }
        });

        _bindPinnyEvents();

        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        init: _init,
        build: buildPinny
    };
});
