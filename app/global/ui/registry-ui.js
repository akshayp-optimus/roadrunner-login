define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'pages/product-details/ui/personalization-ui',
    'dust!pages/product-details/partials/personalization-control',
    'pages/product-details/ui/personalization-delete-ui',
    'dust!global/partials/gift-registry/gift-card-content',
    'velocity'
],
function(
    $,
    utils,
    DomOverride,
    personalizationUI,
    PersonalizationControl,
    deletePersonalizationModalUI,
    GiftCardContentTemplate,
    Velocity) {

    var _buildReplaceItem = function(selector, $element) {
        return {
            selector: selector,
            element: $element
        };
    };

    var bindEvents = function() {
        var $desktopParent = $('.gwt-product-detail-widget-col3-row');
        var $container = $('.js-gift-cart-content');
        var $personalizeLabel = $container.find('.js-add-personalization-label');

        $container.find('.js-personalization-edit').on('click', function() {
            $desktopParent.find('.gwt-personalize-edit-link-style').triggerGWT('click');
        });
        $container.find('.js-personalization-remove').on('click', function() {
            $desktopParent.find('.gwt-personalize-remove-link-style').triggerGWT('click');
        });
        $container.find('.js-add-personalization-label').on('click', function() {
            $('.gwt-product-detail-widget-personalization-panel > .gwt-personalize-link-style:first')[0].dispatchEvent(new CustomEvent('click'));
        });

        $('.js-amount').on('change', function() {
            if ($(this).find(':selected').text() !== 'Choose Amount') {
                $personalizeLabel.removeClass('c--is-disabled');
            } else {
                $personalizeLabel.addClass('c--is-disabled');
            }
        });
    };

    var buildPersonalization = function($container, $desktopParent) {
        $desktopParent = $('.gwt-product-detail-widget-col3-row');
        $container = $('.js-gift-cart-content');

        var $personalizationLink = $desktopParent.find('.gwt-personalize-link-style:first');
        var data;

        if ($desktopParent.find('.gwt-product-detail-widget-personalization-chosen-values').text() !== '') {
            // Personalization Detail
            data = {
                additionalCost: $desktopParent.find('.gwt-personalize-cost-style'),
                personalizationDetail: $desktopParent.find('.gwt-product-detail-widget-personalization-chosen-values')
            };
        } else {
            // Personalization button
            data = {
                personalizationText: $personalizationLink.text()
            };
        }

        new PersonalizationControl(data, function(err, html) {
            $container
                .find('.js-personalization-container')
                .empty()
                .append(html)
                .removeAttr('hidden');

            bindEvents();
            // updateAddToCartState($container);
            $container.find('.js-add-personalization-label').removeClass('c--is-disabled');
        });
    };

    var updatePersonalization = function() {
        setTimeout(function() {
            buildPersonalization();
        }, 500);
    };
    var _buildReplaceMap = function($content, templateData) {
        // var $detailsButton = $content.find('.pdp-linkpanel a').last();
        var $addToCartButton = $content.find('#gwt-add-to-cart-btn').append(' >');
        var $optionSelects = $content.find('.gwt-product-option-panel-listbox-container select');
        var $price = $content.find('.gwt-product-detail-widget-price-holder');

        $addToCartButton.addClass('c-button c--full-width js-add-to-cart c--primary');

        $price.find('.gwt-Label').remove();


        return [
            _buildReplaceItem('.js-atc-link', $addToCartButton),
            _buildReplaceItem('.js-product-image', $content.find('.gwt-pdp-collection-thumbnail-image')),
            _buildReplaceItem('.js-price', $price),
            _buildReplaceItem('.js-stepper-dropdown', $content.find('.csb-quantity-listbox')),
            _buildReplaceItem('.js-color', $optionSelects.first()),
            _buildReplaceItem('.js-amount', $optionSelects.last()),
        ];
    };



    var _getSelectDropDown = function($options) {
        return {
            options: $options.map(function(index, item) {
                var $item = $(item);
                var text = $item.text();

                return {
                    value: $item.attr('value'),
                    dataId: $item.attr('data-id'),
                    text: text,
                    selected: $item.is(':selected')
                };
            })
        };
    };

    var _transformGiftCard = function() {
        var $content = $(arguments[0]);
        var templateData = {
            image: $content.find('.gwt-pdp-collection-thumbnail-image').attr('src'),
            itemName: $content.find('.gwt-product-detail-widget-name').text(),
            itemShortName: $content.find('.gwt-product-detail-widget-title').last().text(),
            freeShipping: $content.find('.gwt-product-detail-widget-short-desc-lbl'),
            quantity: {
                decreaseIcon: 'minus',
                decreaseTitle: 'Reduce Quantity',
                increaseIcon: 'plus',
                isMin: true,
                increaseTitle: 'Increase Quantity',
                items: _getSelectDropDown($content.find('.csb-quantity-listbox option'))
            },
            personalizationText: $content.find('.gwt-personalize-link-style:first').text()
        };
        var replaceMap = _buildReplaceMap($content, templateData);

        new GiftCardContentTemplate(templateData, function(err, html) {
            var $templateContent = $(html);

            $.each(replaceMap, function(i, replaceInfo) {
                $templateContent.find(replaceInfo.selector).prepend(replaceInfo.element);
            });

            $('.js-gift-cart-content').html($templateContent);
            bindEvents();
            $templateContent.find('.js-giftcard-stepper-increase').click();
        });
    };

    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $popupPanel = $('.gwt-PopupPanelGlass');
            var $personalizationModal = $('#gwt-personalization-modal-V2');
            var $deletePersonalizationModal = $('.ok-cancel-dlog');

            if ($personalizationModal.length) {
                // for some reason, Pinny opens multiple times
                // ModalAdded is triggered multiple times
                if ($('.js-personalization-pinny').find('.js-personalization-content').html() !== '') {
                    return;
                }


                personalizationUI.build($personalizationModal);
            } else if ($deletePersonalizationModal.length && !$deletePersonalizationModal.children('.pinny').length && !$deletePersonalizationModal.hasClass('gwt_addtocart_div')) {
                // Handle Delete Modal
                deletePersonalizationModalUI.showRemovalConfirmationModal($deletePersonalizationModal);
            }
        }
    };

    var handleStepperButtonVisibility = function($stepper, count) {
        $stepper.find('button').removeClass('c--disabled');
        if (count > 1 && count < 20) {
            $stepper.find('button').removeClass('c--disabled');
        } else if (count <= 1) {
            $stepper.find('.js-giftcard-stepper-decrease').addClass('c--disabled');
        } else {
            $stepper.find('.js-giftcard-stepper-increase').addClass('c--disabled');
        }
    };

    var bindStepper = function() {
        $('body').on('click', '.js-giftcard-stepper-decrease, .js-giftcard-stepper-increase', function(e) {
            e.preventDefault();

            var $this = $(this);
            var $stepper = $this.closest('.c-stepper');
            var $dropdown = $stepper.find('select');
            var count = 1;
            if ($dropdown.find('option:selected').text()) {
                count = parseInt($dropdown.find('option:selected').text());
            }
            // var $desktopQuantitySelect = $stepper.find('.csb-quantity-listbox:first');
            // var $customQtySelect = $stepper.find('.js-dropdown');
            var highestCount = $dropdown.find('option:last-child').text();
            if ($this.hasClass('js-giftcard-stepper-decrease')) {
                count--;
                if (count < 1) {
                    count = 1;
                }
            } else {
                count++;
                if (count > highestCount) {
                    count = highestCount;
                }
            }

            // $count.html(count);
            // $customQtySelect.val(count);

            handleStepperButtonVisibility($stepper, count);
            // update desktop div
            // need to use window dispatch event to trigger prototype events
            $dropdown.val(count);
            // $desktopQuantitySelect[0].dispatchEvent(new CustomEvent('change'));
        });
    };


    var giftRegistryManageUI = function() {
        utils.overrideDomAppend('#custom_add_to_cart_GRCARD', _transformGiftCard);
        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', updatePersonalization);
        DomOverride.on('domRemove', '.ok-cancel-dlog', updatePersonalization);
        personalizationUI.init($(), $());
        deletePersonalizationModalUI.initSheet();
        bindStepper();
    };

    return giftRegistryManageUI;
});
