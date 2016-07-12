define([
    '$'
], function($) {

    var parseIcons = function($socialElement, iconName) {
        return {
            href: $socialElement.attr('href'),
            altName: $socialElement.find('img').attr('alt'),
            iconName: iconName,
            className: 'c-social-links'
        };

        var socialLinks = function() {
            var $facebook = $('.socialIconFacebook');
            var $pinterest = $('.socialIconPinterest');
            var $twitter = $('.socialIconTwitter');
            var $instagram = $('.socialIconInstagram');
            var $youtube = $('.socialIconYouTube');
            var $houzz = $('.socialIconHouzz');
            var $socialLinks = [];

            $facebook.length && $socialLinks.push(parseIcons($facebook, 'facebook'));
            $pinterest.length && $socialLinks.push(parseIcons($pinterest, 'pinterest'));
            $twitter.length && $socialLinks.push(parseIcons($twitter, 'twitter'));
            $instagram.length && $socialLinks.push(parseIcons($instagram, 'instagram'));
            $youtube.length && $socialLinks.push(parseIcons($youtube, 'youtube'));
            $houzz.length && $socialLinks.push(parseIcons($houzz, 'houzz'));

            return {
                links: $socialLinks,
                className: 'c-social-links'
            };
        };
    };

    return {
        parseIcons: parseIcons
    };

});
