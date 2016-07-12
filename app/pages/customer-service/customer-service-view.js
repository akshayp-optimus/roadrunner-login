/**
 * Customer Service View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/customer-service/customer-service',
    'pages/customer-service/parsers/customer-service-bellows',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, baseView, template, bellowsParser, breadcrumbParser) {

    var collectDetails = function($header) {
        var $detailsCollection = $();
        var $next = $header;

        do {
            $next = $next.next().not('h2, h3');
            $detailsCollection = $detailsCollection.add($next);
        } while ($next.length);

        return $detailsCollection;
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'customer-service',
            pageTitle: function() {
                return $('.inner').text();
            },
            contactInfoSection: function() {
                return bellowsParser.parse();
            },
            pageContent: function() {
                var $pageContainer = $('#page-container');

                return $pageContainer.children().map(function(i, child) {
                    var $child = $(child);

                    if ($child.is('h3, h2')) {
                        return {
                            title: $child.text()
                        };
                    }

                    return {
                        details: $child
                    };
                });
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            },
            leftNav: function() {
                return $('#sideBox');
            }
        }
    };
});
