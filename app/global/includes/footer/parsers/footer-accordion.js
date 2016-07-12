define(['$'], function($) {
    var parse = function() {
        var $footerSectionWithLinks = $('.footerInner').find('.col-xs-4:not(:first-child)');
        $('.phoneNumber').addClass('c-footer-phone-number');
        var $changeCountry = $('#countrySelector');

        // GRRD-656: Hide links leading to unmobified pages
        var regExp = new RegExp('CatalogQuickShopView|online-catalogs|GiftRegistryHomeView|contract-sales|corporate-sales|quality-commitment|product-safety-information|WeCare|career-opps|plcc-instant-landing', 'i');
        var $linksToHide = $footerSectionWithLinks.find('a').filter(function() {
            var $this = $(this);
            var href = $this.attr('href');

            if (regExp.test(href)) {
                return $this;
            }
        });
        $linksToHide.closest('li').attr('hidden', 'hidden');

        var footerLinkItems = $footerSectionWithLinks
            .map(function(index, item) {
                var $footerLinksHeading = $(item);
                var $bellowsContent = $footerLinksHeading.find('ul');

                if (index === 0) {
                    $bellowsContent.prepend($changeCountry);
                }

                return {
                    sectionTitle: $footerLinksHeading.find('> h3').text(),
                    content: $bellowsContent.children()
                };
            });


        return {
            items: footerLinkItems,
            accordionClass: 'c-footer-links'
        };
    };

    return {
        parse: parse
    };
});
