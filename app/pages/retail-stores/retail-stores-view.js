define([
    '$',
    'global/baseView',
    'dust!pages/retail-stores/retail-stores',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, BaseView, template, breadcrumbParser) {

    var getHoursInfo = function($container) {
        return $container.find('.daysOpen').map(function(_, item) {
            var $item = $(item);
            var $hoursOpen = $item.find('.hoursOpen').remove();
            return {
                daysOpen: $item.text(),
                hoursOpen: $hoursOpen.text()
            };
        });
    };

    var getPhoneNumber = function($phoneNumber) {
        var phonePattern = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/g;
        var phoneText = $phoneNumber.text().match(phonePattern);
        phoneText = phoneText || '';
        return $phoneNumber.html(function(i, oldHtml) {
            return oldHtml.replace(phoneText, '<a href="tel:' + phoneText + '">$&</a>');
        });
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'retail-stores',
            leftNav: function() {
                return $('#sideBox');
            },
            pageTitle: function() {
                return $('.inner').text();
            },
            description: function() {
                return $('.topParagraph').html();
            },
            grOutletStoresHeading: function() {
                return $('.topParagraph').next('h3').html();
            },
            stores: function() {
                return $('.container').find('.store').map(function(_, item) {
                    var $item = $(item);
                    var $address = $item.find('#mapWrapper .storeDetails').remove();
                    var $contactNumber = $item.find('.storeDetails');
                    return {
                        heading: $item.find('h4').addClass('c-grandin-outlet-heading u-margin-bottom-md u--bold'),
                        image: $item.find('.storePhotoContainer img').addClass('c-store-image u-margin-end-md  u-margin-bottom-md'),
                        address: $address.find('p').html(),
                        contactNumber: $contactNumber,
                        hoursInfo: getHoursInfo($item.find('.hoursInfo')),
                        directionsBtn: $item.find('.mapDirections a').append(' >').addClass('c-button c-direction-button u-margin-bottom-sm c--primary'),
                        contactBtn: getPhoneNumber($item.find('.storeDetails').find('b')),
                        description: $item.find('.col-xs-12:last')
                    };
                });
            }
        }
    };
});
