define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/confirmation-details/confirmation-details',
    'global/parsers/cart-item-parser',
    'global/parsers/address-parser',
    'pages/confirmation-details/parsers/items-shipping',
    'global/parsers/totals-parser',
    'translator'
],
function($, BaseView, template, cartItemParser, addressParser, itemsShippingParser, totalsParser, Translator) {
    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var orderContainsGifts = /gift/i.test($giftBreadcrumb.text()) && !!$giftBreadcrumb.find('a').length;
            var steps;
            var stepsLength;
            var i;

            if (orderContainsGifts) {
                context.header.progressBar = context.header.progressBarWithGift;
            }

            steps = context.header.progressBar.steps;
            stepsLength = steps.length;

            for (i = 0; i < stepsLength; i++) {
                steps[i].status = 'c--complete';
                steps[i].statusText = 'Completed';
            }

            return context;
        },
        context: {
            templateName: 'confirmation-details',
            hiddenInputs: function() {
                return $('#container').children('input[type="hidde"]');
            },
            orderContainer: function() {
                return $('#orderReviewDisplayViewDiv');
            },
            orderInfo: function(context) {
                var $infoContainer = context.orderContainer.children('.vcard');

                return $infoContainer.children().map(function(i, row) {
                    var $row = $(row);
                    return {
                        label: $row.find('b').remove().text(),
                        value: $row.text()
                    };
                });
            },
            billingAddress: function(context) {
                return addressParser.parse(context.orderContainer.find('.od-bill'));
            },
            paymentDetails: function(context) {
                var $paymentContainer = context.orderContainer.find('.od-bill-payment');
                var cardText = $paymentContainer.find('.vcard').contents().filter(function(i, node) {
                    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '';
                });
                var $plccInfo = $paymentContainer.find('.plcc-account-info');
                var cards = [];
                var i;

                if ($plccInfo.length) {
                    cards.push({
                        cardName: $plccInfo.find('.plcc-account-label').text(),
                        cardInfo: $plccInfo.find('.plcc-account-number').text(),
                        isPLCCType: true
                    });
                }

                for (i = 0; i < cardText.length; i = i + 2) {
                    var currentNode = cardText[i];
                    var nextNode = cardText[i + 1];
                    if (currentNode && nextNode) {
                        cards.push({
                            cardName: currentNode.textContent,
                            cardInfo: nextNode.textContent.replace('Card#', '')
                        });
                    }
                }



                if (cards.length) {
                    return {
                        sectionTitle: $paymentContainer.find('h3').text(),
                        cards: cards
                    };
                }

            },
            orderItems: function(context) {
                return itemsShippingParser.parse(context.orderContainer.find('.orderItemRow'));
            },
            totals: function(context) {
                return totalsParser.parse(context.orderContainer.find('#order_total_table'));
            },
            mayAlsoLike: function() {
                return $('#gwt_recommendations_order_confirmation_display_1');
            },
            carouselTitle: function() {
                return Translator.translate('you_may_also_like');
            }
        }

    };
});
