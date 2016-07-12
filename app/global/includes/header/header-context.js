define(['$',
    'translator',
    'components/my-account/parsers/my-account',
    'dust!components/my-account/my-account',
    'dust!components/mini-cart/partials/mini-cart__empty',
    'global/includes/header/parsers/transform-search'
], function(
    $,
    translator,
    myAccountParser,
    myAccountTemplate,
    EmptyCartTemplate,
    transformSearch
) {

    return {
        context: {
            websiteLink: function() {
                var $websiteLink = $('#logo1');

                return $websiteLink.length ? {
                    href: $websiteLink.find('a').attr('href'),
                    text: $websiteLink.find('img').attr('alt')
                } : false;
            },
            searchBox: function() {
                return transformSearch.parse($('#headerSearchForm'));
            },
            myAccountItems: function() {
                var $content;
                var data = myAccountParser.parse();

                myAccountTemplate(data, function(err, html) {
                    $content = $(html);
                });

                return $content;
            },
            shoppingCart: function() {
                return $('#shoppingCart').addClass('u-visually-hidden');
            },
            emptyCartContent: function() {
                var $content;

                new EmptyCartTemplate({}, function(err, html) {
                    $content = $(html);
                });

                return $content;
            }
        }
    };
});
