define(['$'], function($) {

    // params: takes templateContainer with a template script inside of it
    // returns: JSON that contains the page's data
    //          undefined if script doesn't exist
    var _parse = function($templateContainer) {
        var $container = $templateContainer;

        if (!$container.length) {
            console.log('Template Reader: JSON Template failed: template container is undefined');
            return;
        }

        var $script = $container.find('script');
        var data;

        if ($script.length) {
            // $script.attr('x-src', '');
            $script = $script.text().replace('/*', '').replace('*/', '');
            data = JSON.parse($script);
        }

        return data;
    };

    // returns the JSON data that desktop scripts use to render their page
    return {
        parse: _parse
    };
});
