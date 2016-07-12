define([
    '$'
], function($) {
    var getNeedHelpSection = function($needHelp) {
        var phonePattern = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/g;
        var phoneText = $needHelp.text().match(phonePattern);
        phoneText = phoneText || '';
        return $needHelp.html(function(i, oldHtml) {
            return oldHtml.replace(phoneText, '<a href="tel:' + phoneText + '">$&</a>');
        });
        return $needHelp;
    };

    var parse = function($needHelp) {
        if (!$needHelp.length) {
            return;
        }
        return {
            needHelp: getNeedHelpSection($needHelp)
        };
    };

    return {
        parse: parse
    };
});
