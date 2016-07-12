define([
    '$',
    'global/registryBaseView',
    'dust!pages/gift-registry-manage/gift-registry-manage',
    'global/parsers/cart-item-parser',
    'translator',
    'components/need-help/parsers/need-help'
],
function($, BaseView, template, cartItemParser, translator, needHelpParser) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'gift-registry-manage',
            pageTitle: function() {
                return $('.giftRegistryCreate_header_main, .GR-Visit_View_Title');
            },
            noDisplayElement: function() {
                var $container = $('#mainContent');
                return $container.find('> .nodisplay').add($container.find('[style*="display: none"]'));
            },
            noDisplayElementForConfirmation: function() {
                return $('#newGiftRegistryConfirmationDiv').parent();
            },
            toolTipData: function() {
                return $('.tooltip');
            },
            chooseRegistry: function() {
                var $registryLabel = $('#registry_name');
                if (!$registryLabel.length) {
                    return;
                }
                return {
                    label: $registryLabel.addClass('c-field__label'),
                    select: $('#descriptionGR')
                };
            },
            selectedRegistry: function(context) {
                return context.chooseRegistry ? context.chooseRegistry.select.find('option:selected').text() : '';
            },
            viewAsGuest: function() {
                var $link = $('.gr_view_as_guest_link');

                return {
                    text: $link.text(),
                    href: $link.attr('href') || '#'
                };
            },
            deleteRegistryLink : function() {
                return $('.gr-delete-link').addClass('u-text-black');
            },
            manageRegistryLink: function() {
                var $manageRegistryLink = $('.gr_manage_registry');
                $manageRegistryLink.find('a').addClass('u-text-black');
                return $manageRegistryLink;
            },
            chooseGifts: function() {
                var $chooseGifts = $('.gift_registry_manage_WWCM');

                $chooseGifts.children('div').each(function() {
                    var $content = $(this);

                    $content[0].innerHTML = $content[0].innerHTML.replace(/<br>/ig, ' ');
                });

                return $chooseGifts;
            },
            itemsForm: function() {
                var $form = $('#giftRegistryQuantityForm');
                var $topFive = $('.gr-top5-header');
                $topFive.find('a')
                    .html('<svg class="c-icon" data-fallback="img/png/question.png"><title>question</title><use xlink:href="#icon-question"></use></svg>')
                    .removeAttr('id');
                if (!$form.length) {
                    var $container = $('.GRProductsInView');
                    return {
                        products: cartItemParser.parseWishlistItem($container.find('tbody tr'), true),
                        topLabel: $topFive,
                        isForm: false,
                    };
                }

                return {
                    form: $form,
                    isForm: true,
                    hiddenInputs: $form.find('[type="hidden"]'),
                    products: cartItemParser.parseWishlistItem($form.find('.GRProductsInView tbody tr'), true),
                    topLabel: $topFive,
                };
            },
            addItemsToCart:  function() {
                var $addItemsToCart = $('.gift_registry_items_count').next();
                $addItemsToCart.find('button').addClass('c-button c--primary c-add-all-items').append(' >');
                return $addItemsToCart;
            },
            needHelpSection: function() {
                return needHelpParser.parse($('.giftRegistryCreate_header_second'));
            },
            socialButtons: function() {
                return {
                    items: {
                        sectionTitle: translator.translate('share'),
                        bellowsContent: $('#socialPlugins').addClass('c-social-link-share')
                    }
                };
            },
            addItemsStatement: function() {
                return $('.gift_registry_manage_WWCM').addClass('u-margin-top-sm u-margin-bottom-sm c-empty-manage-registry-msg u-text-medium u-text-align-center');
            },
            addItemsButton: function(context) {
                var $addItemsButton = context.addItemsStatement.next().find('button').last();
                $addItemsButton.find('span').remove();
                $addItemsButton.addClass('c-begin-adding-items-button').append('<svg class="c-icon" data-fallback="img/png/expand.png"><title>arrow-right</title><use xlink:href="#icon-expand"></use></svg>');
                return $addItemsButton;
            },
            personalizationContainer: function() {
                return $('<div class="js-personalization-content c-personalization-content">');
            },
            isManageRegistryPage: function() {
                return $('.view-GiftRegistryStaticViewView').length ? true : false;
            },
            countdown: function() {
                var $countdownContainer = $('.gr_count-down_text');

                return {
                    label: $countdownContainer.find('.gr-count-down-lbl').text(),
                    value: $countdownContainer.find('.diffYears').text() + ' ' +
                        $countdownContainer.find('.diffMonths').text() + ' ' + $countdownContainer.find('.diffDays').text()
                };
            },
            moreInformationContainer: function() {
                return $('<div class="js-more-information-content">');
            },
            registryNotFoundError: function() {
                return $('#regNotFoundErrorMsg').addClass('u-padding-all u--tight ');
            }
        }
    };
});
