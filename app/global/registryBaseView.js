define([
    '$',
    'global/baseView',
    'dust!global/base',
    'translator'
],
function($, BaseView, baseTemplate, translator) {
    // Requires the text nodes for error messages.
    var getNonEmptyChildTextNodes = function($element) {
        return $element.contents().filter(function() {
            return this.nodeType === 3 && this.textContent.trim() !== '';
        });
    };

    var descript;

    return {
        template: baseTemplate,
        extend: BaseView,
        context: {
            templateName: 'registry-base',
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden, #giftRegistryHomeViewForm, #gwt_gift_registry_create, #gift_registry_delete_message, #giftRegistryStaticForm');
                return $hiddenForms;
            },
            hiddenLabels: function() {
                return $('#mainContent').children('.nodisplay, [style*="display:none"]');
            },
            registryDetailsLabel: function() {
                return $('.gr-details-header').text();
            },
            pageTitle: function() {
                return $('.gr-inner-header').text();
            },
            eventDate: function() {
                return $('.gr-event-date');
            },
            details: function() {
                $('.gr_info_edit_link').text('Edit').addClass('u-text-black u--bold');
                var $registryInfo = $('.registry-info-main.first');
                getNonEmptyChildTextNodes($registryInfo.find('p')).wrap('<span />');
                return {
                    registryDetailEditLink: $('.registry-info-main.first').find('p').last(),
                    registryDetail: $registryInfo,

                };
            },
            shipTo: function() {
                return {
                    href: $('.selected-ship-address').find('.gr_info_edit_link'),
                    title: $('.selected-ship-address').find('.title').text().toLowerCase(),
                    name: $('.selected-ship-address').find('.gr-data').text().toLowerCase(),
                };
            },
            registrant: function() {
                $('.selected-ship-address').addClass('u--hide');
                var $editSelectedAddressLink = $('.registrant-info-address').find('.editGiftRegLink');
                var $registrantInfo = $('.registrant-info-address').find('.note').not('.editGiftRegLink');
                getNonEmptyChildTextNodes($registrantInfo).wrap('<span class="c-registry-content"/>');
                $registrantInfo.find('.adr').wrap('<span class="c-registry-content"/>');
                $registrantInfo.find('.phone-number').addClass('c-registry-content');
                return {
                    registrantEditLink: $editSelectedAddressLink,
                    title: $('.registry-info-address').find('.GR-shipping-address').text(),
                    content: $registrantInfo
                };
            },
            coregistrant: function() {
                var $coRegistrantContent = $('.coregistrant-info-address').find('.note');
                getNonEmptyChildTextNodes($coRegistrantContent).wrap('<span />');
                $('.coregistrant-info-address').find('.adr.note p').wrapAll('<span/>');
                $coRegistrantContent.find('span:last-of-type').addClass('c-registry-content');
                return {
                    coregistrantEditLink: $('.coregistrant-info-address').find('a'),
                    title: $('.coregistrant-info-address').find('.GR-shipping-address').first().text(),
                    content: $coRegistrantContent
                };
            },
            message: function() {
                var $messageContainer = $('.registry-message-to-guests-container');
                var messageText = $messageContainer.find('.adr').text();

                if (messageText.trim() !== '') {
                    return {
                        href: $messageContainer.find('.gr_info_edit_link').attr('href'),
                        title: $messageContainer.find('.GR-shipping-address').text(),
                        content: messageText
                    };
                }
            },
            giftCard: function() {
                return $('#gwt_GR_GC_part_number');
            },
            socialLinks: function() {
                return $('.socialPlugins');
            },
            countMessage: function() {
                var $count = $('.gift_registry_items_count_number');
                var count;
                if (!$count.length) {
                    return;
                }
                count = $count.remove().text();
                return count + ' ' + translator.translate('items');
            },
            sort: function() {
                var $giftRegistryItemsForm = $('#giftRegistryItemsForm');
                var $sortBy = $('#sortBy');
                $sortBy.find('option').append('&#x200E;');
                return {
                    form: $giftRegistryItemsForm,
                    hiddenInputs: $giftRegistryItemsForm.find('> input[type="hidden"]'),
                    sortDropdown: $('.gr-sort-by').length ? $('.gr-sort-by').find('label').remove().end() : $sortBy
                };
            },
            sortLinks: function() {
                var $sortLinksContainer = $('#gr-sort-by');
                var $current = $sortLinksContainer.find('.selected');

                $current.replaceWith($('<span>').text($current.text()));

                return {
                    links: $sortLinksContainer.find('a, span').addClass('c-sort-options__item'),
                    current: $current.text()
                };
            },
        }
    };

});
