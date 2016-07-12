define([
    '$',
    'dust!pages/international-customer-service/partials/international-customer-service-select',
],
function($, SelectTemplate) {

    // Get service links from left nav
    var getServiceLinks = function() {
        // GRRD-674: Exclude links to desktop pages
        var regExp = new RegExp('plcc-instant-landing|requests|guarantee|ship-to-store-landing', 'i');
        var $linksToHide = $('.js-desktop-left-nav').find('#sideBox').children('ul').children('li')
        .not('#sideBoxHeader').children('ul').find('a').filter(function() {
            var $this = $(this);
            var href = $this.attr('href');

            if (regExp.test(href)) {
                return $this;
            }
        });

        $linksToHide.closest('li').addClass('x-ignore');

        var $serviceLinks = $('.js-desktop-left-nav').find('#sideBox').children('ul').children('li')
        .not('#sideBoxHeader').children('ul').children('li').map(function(index, option) {
            var $option = $(option).children('a');

            if ($(option).hasClass('x-ignore')) {
                return;
            }

            return {
                text: $option.text(),
                value: $option.attr('href')
            };
        });
        return {
            createSelect: true,
            selectItems: $serviceLinks
        };
    };

    // Create Service Service
    var createServiceSelect = function() {
        new SelectTemplate(getServiceLinks(), function(err, html) {
            $('.js-service-select').html(html);
        });
    };

    // Handle on chnage event of service select
    var serviceSelectOnChange = function() {
        $('.js-service-select').on('change', function() {
            var $selectedOptionValue = $(this).find('option:selected').attr('value');
            window.location.href = $selectedOptionValue;
        });
    };

    var internationalCustomerServiceUI = function() {
        createServiceSelect();
        serviceSelectOnChange();
    };

    return internationalCustomerServiceUI;
});
