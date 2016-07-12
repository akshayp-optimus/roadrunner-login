/**
 * BreadCrumb View
 */
define(['$'], function($) {
    var parse = function($breadcrumb) {
        return {
            href: $breadcrumb.find('a').attr('href'),
            title: $breadcrumb.text()
        };
    };

    return {
        parse: parse
    };
});
