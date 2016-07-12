define(['$'], function($) {
    var parse = function() {
        var $footerSectionWithLinks = $('#copyright .links');
        var $phoneNumber = $('#phoneNumber img').attr('alt');
        $('#copyright .links').find('a[onclick*="billmelater"]').remove();
        var footerLinkItems = $footerSectionWithLinks
            .map(function(index, item) {
                var $footerLinksHeading = 'Customer Service';
                var $bellowsContent = $footerSectionWithLinks.find('li');

                if (index === 0) {
                    var $footerPhoneNumber = $('<div class="c-footer-bellows-phone-number"><div/>');
                    $footerPhoneNumber.html('questions?' + ' ' + $phoneNumber);
                    $bellowsContent.first().prepend($footerPhoneNumber);
                }

                return {
                    sectionTitle: $footerLinksHeading,
                    content: $bellowsContent
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
