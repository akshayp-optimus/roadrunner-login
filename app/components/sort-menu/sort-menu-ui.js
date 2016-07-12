define([
    '$'
],
function($) {

    var dropdownOnChange = function($select) {
        $select.on('change', function() {
            var $selectedOptionValue = this.options[this.selectedIndex].text;
            $('.c-sort-section').find('a').each(function(_, item) {
                if ($(item).text() === $selectedOptionValue) {
                    $(item).trigger('click');
                }
            });
        });
    };

    return {
        dropdownOnChange: dropdownOnChange
    };
});
