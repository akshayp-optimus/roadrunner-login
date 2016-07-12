define([
    '$',
    'global/baseView',
    'translator',
    'dust!pages/gift-services/gift-services',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, translator, template, breadcrumbParser) {

    var getGiftCardData = function() {
        var $giftCardData = $('.col-xs-6.left-side');
        var $phoneNumber = $giftCardData.find('p').find('strong').first();
        var phonePattern = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/g;
        var phoneText = $phoneNumber.text().match(phonePattern);
        phoneText = phoneText || '';
        $phoneNumber.html(function(i, oldHtml) {
            return oldHtml.replace(phoneText, '<a href="tel:' + phoneText + '">$&</a>');
        });
        $giftCardData.find('h3').nextAll().remove();
        $giftCardData.find('h2').first().remove();
        $giftCardData.find('h3').first().remove();
        return $giftCardData;
    };

    var getGiftCardDetails = function() {
        var $getGiftCardDetails = $('.col-xs-6.right-side').find('#page-box');
        $getGiftCardDetails.find('a img').remove();
        $getGiftCardDetails.find('h2:not(.strong)').remove();
        $getGiftCardDetails.find('a').attr('class', 'button primary c-button c--primary c--full-width');
        $getGiftCardDetails.find('a[href*="GiftCards/landing-path"]').html('<span>' + translator.translate('purchase_a_gift_card_or_ecard') + '</span>');
        $getGiftCardDetails.find('a[href*="GiftCardBalanceView"]').html('<span>' + translator.translate('check_your_gift_balence') + '</span>');

        return $getGiftCardDetails;

    };

    var getGiftServicesDetails = function() {
        var $giftServicesDetail = $('.col-xs-6.left-side').find('h3').nextAll();
        return $giftServicesDetail;
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-services',

            pageTitle: function() {
                return $('.col-xs-6.left-side').find('h2').first().text();
            },
            reedemGiftCardHeading: function() {
                return $('.col-xs-6.left-side').find('h3').first();
            },
            img: function() {
                return $('.col-xs-6.right-side').find('a').last();
            },
            giftServicesDetail: function() {
                return getGiftServicesDetails();
            },
            giftCardIntroduction: function() {
                return getGiftCardData();
            },
            giftCardDetails: function() {
                return getGiftCardDetails();
            },
            leftNav: function() {
                return $('#sideBox');
            }
        }
    };
});
