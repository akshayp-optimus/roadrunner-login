define(['$', 'translator'], function($, Translator) {

    // Get innerLinks (third Level navigation content)
    var getInnerLinks = function($innerLinks) {
        return $innerLinks.map(function() {
            var $innerLink = $(this);
            return {
                primaryContent: $innerLink.text(),
                href: $innerLink.attr('href'),
                primaryAction: false,
                primaryContentClass: ''
            };
        });
    };

    var buildViewAllText = function(desktopText) {
        desktopText = desktopText
            // Make it all in one line
            .replace(/\n/g, '')
            // Delete the extraneous text from desktop
            .replace(/\[.*Espot\].*/, '');

        return Translator.translate('view_all') + ' ' + desktopText;
    };

    // Get sub categories (second Level navigation content)
    var getSubCategories = function($subCategories) {
        return $subCategories.map(function() {
            var $subCategory = $(this);
            var $subCategoryLink = $subCategory.children('a');
            var subCategoryLinkText = $subCategoryLink.text();
            var $innerLinks = $subCategory.find('> ul a');
            var hasInnerLinks = $subCategory.find('ul > li').length;

            return {
                subCategoryLink: {
                    primaryContent: subCategoryLinkText,
                    href: hasInnerLinks ? '' : $subCategoryLink.attr('href'),
                    primaryAction: hasInnerLinks ? true : false,
                    primaryIconName: 'chevron-right',
                    primaryContentClass: hasInnerLinks ? 'u--bold' : '',
                    back: {
                        primaryAction: true,
                        primaryIconName: 'chevron-left',
                        primaryContent: subCategoryLinkText,
                        secondaryAction: true,
                        secondaryIconName: 'close',
                        secondaryIconClass: 'pinny__close'
                    }
                },
                innerLinks: getInnerLinks($innerLinks),
                viewAll: {
                    primaryContent: buildViewAllText(subCategoryLinkText),
                    href: $subCategoryLink.attr('href'),
                    primaryAction: false,
                    primaryContentClass: ''
                }
            };
        });
    };

    // Get navigation items
    var getNavItems = function($categories) {

        // GRRD-655: Remove Davis Bromstad oos links
        $categories.find('li > a').has('span:contains("Style Lounge")').parent().remove();
        $categories.find('li > a').has('span:contains("Videos")').parent().remove();

        // Removing last link to match the mockup.
        $categories.children('.menuItem');
        var $navItems = $categories.children('.menuItem').map(function() {
            var $category = $(this);
            var $categoryLink = $category.children('a');
            var categoryLinkText = $categoryLink.find('div').text();

            // Change - Added View all category link at the end of second pane
            var $viewAllCategory = $category.clone().find('> ul').remove().end();
            var $viewAllCategoryName = $viewAllCategory.find('#gwt-category-description-name');
            $viewAllCategoryName
                .text(buildViewAllText($viewAllCategoryName.text()))
                .next('span').remove(); // span has some unnecessary digit
            var $subCategories = $viewAllCategory.add($category.find('> ul > .menuItem'));

            return {
                categoryLink: {
                    primaryAction: true,
                    primaryIconName: 'chevron-right',
                    primaryContent: categoryLinkText,
                    primaryContentClass: $subCategories.length ? 'u--bold' : '',
                    back: {
                        primaryAction: true,
                        primaryIconName: 'chevron-left',
                        primaryContent: categoryLinkText,
                        secondaryAction: true,
                        secondaryIconName: 'close',
                        secondaryIconClass: 'pinny__close'
                    }
                },
                subCategories: getSubCategories($subCategories)
            };
        });

        return {
            categories: $navItems
        };
    };

    return {
        parse: getNavItems
    };
});
