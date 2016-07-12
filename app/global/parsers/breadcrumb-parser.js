define([
    '$',
    'translator'
], function($, translator) {

    var parse = function($breadcrumb) {
        return {
            'title': $breadcrumb.text(),
            'href': $breadcrumb.attr('href')
        };
    };

    var _parseTranslated = function($breadcrumbs) {
        if (!$breadcrumbs.length) {
            return;
        }

        // one before current is the previous page we want
        $breadcrumbs.find('.current').remove();

        var $crumb = $breadcrumbs.find('li').last();

        return {
            title: $crumb.text(),
            href: $crumb.find('a').attr('href')
        };
    };

    var _parseTranslatedLinkOnly = function($breadcrumb) {
        return {
            title: translator.translate('breadcrumb_prefix') + ' ' + $breadcrumb.text(),
            href: $breadcrumb.attr('href')
        };
    };

    return {
        parse: parse,
        parseTranslated: _parseTranslated,
        parseTranslatedLinkOnly: _parseTranslatedLinkOnly
    };
});
