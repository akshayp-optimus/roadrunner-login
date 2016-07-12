define(['$'], function($) {

    var _parse = function(url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            success: successCallback,
            error: errorCallback
        });
    };

    // returns the response from Ajax request
    return {
        parse: _parse
    };
});
