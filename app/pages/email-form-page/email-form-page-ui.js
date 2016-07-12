define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'dust!components/select/select',
    'global/ui/handle-form-fields'
], function($, Utils, DomOverride, SelectTmpl, handleFormFieldsUI) {

    var styleForm = function() {
        $('.required').each(function() {
            var $asterisk = $(this);
            $asterisk.addClass('u-text-error');

            $asterisk.parent().append($asterisk);
        });

        $('[style*="color:#cc0000;"]').removeAttr('style').addClass('u-text-error');
    };

    var _transformCountrySelect = function(countryContainer) {
        var $countryContainer = $(countryContainer);
        $countryContainer.addClass('c-box c-arrange c--align-middle');
        $countryContainer.find('c-select').addClass('c-select-country');
        var $countrySelect = $countryContainer.find('select');
        var $countryLabel = $countryContainer.find('label');

        $countryLabel.addClass('c-field__label c-box__label c-arrange__item c--shrink');
        $countryLabel.text($countryLabel.text().replace('country name', 'Country'));

        new SelectTmpl($countrySelect, function(err, html) {
            $countrySelect.replaceWith($(html));
        });
    };

    var emailFormPageUI = function() {
        styleForm();
        DomOverride.on('domAppend', '.countrySpot', _transformCountrySelect);
        handleFormFieldsUI.updatePlaceholder();
        $('#phoneNumber').attr('placeholder', 'Phone Number');
        $('#phoneNumber').attr('type', 'tel');

    };

    return emailFormPageUI;
});
