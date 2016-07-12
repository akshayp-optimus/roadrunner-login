define([
    '$',
    'global/baseView',
    'dust!pages/gift-cards/gift-cards'
],
function($, BaseView, template) {

    var getCardData = function() {
        var $cardItemContainer = $('.wwcmModule').find('#wwcmInner');
        return $cardItemContainer.map(function(_, item) {
            var $item = $(item);
            $item.find('a[href*="grandinroad.cashstar"]').last().text('Order an eGift Card >');
            $item.find('a[href*="gifts-celebrations/grandin-gift-cards"]').last().text('Order a Classic Gift Card >');
            $item.find('a').last().addClass('c-button u-margin-top-md c--primary c--full-width');
            $item.find('li').addClass('u-padding-bottom u--tight');
            return {
                cardImage: $item.find('a').first(),
                cardTitle: $item.find('h2').text(),
                orderButton: $item.find('a').last().find('img').remove().end(),
                cardIntro: $item.find('p'),
                cardDesc: $item.find('ul')
            };
        });
    };

    var getCardGuidelines = function() {
        var $cardGuideline = $('#wwcmFooter').find('p');
        $cardGuideline.find('br:first').replaceWith('<p/>');
        $cardGuideline.find('a').addClass('u--bold');
        return $cardGuideline;
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-cards',

            pageTitle: function() {
                return $('#wwcmHeader').find('h1').text();
            },
            pageSubTitle: function() {
                return $('#wwcmHeader').find('h3').text();
            },
            giftCardIntroduction: function() {
                return $('#wwcmHeader').find('p').find('br').remove().end();
            },
            giftCards: function() {
                return getCardData();
            },
            giftcardGuideline: function() {
                return getCardGuidelines();
            }
        }
    };
});
