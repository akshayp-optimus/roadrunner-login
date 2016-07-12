define([
    '$'
], function($) {


    var _parse = function($addressContainer, includeEdit, isButton) {
        var $name = $addressContainer.find('.fn');
        return {
            sectionTitle: $addressContainer.find('h3').text(),
            edit: $addressContainer.find('button:first').text('edit').addClass('u-unstyle u--bold'),
            select: $addressContainer.find('button:last').text('select').addClass('u-unstyle u--bold').removeClass('nodisplay'),
            name: $name.first().text(),
            company: $name.length > 1 ? $name.last().text() : '',
            street: $addressContainer.find('.street-address').text(),
            city: $addressContainer.find('.locality').text(),
            state: $addressContainer.find('.region').text(),
            postalCode: $addressContainer.find('.postal-code').text(),
            country: $addressContainer.find('.country').text(),
            phoneNumber: $addressContainer.find('.phone-number').text(),
            container: $addressContainer,
            isButton: isButton,
            editClickHandler: includeEdit ? $addressContainer.find('.button').first().attr('onclick') : ''
        };
    };

    return {
        parse: _parse
    };
});
