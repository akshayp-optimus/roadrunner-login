define([
    '$',
    'translator'
], function($, translator) {


    var _parse = function($totalTable) {
        return {
            ledgerEntries: $totalTable.find('tr').map(function(i, row) {
                var $row = $(row);
                if ($row.hasClass('promoRow')) {
                    return {
                        description: $row.find('.qty .promoColor').text(),
                        entryModifierClass: 'js-applied-promo',
                        tooltipContent: $row.find('[id*="PromoDesc"]').remove().removeClass(),
                        number: $row.find('.last .promoColor').text()
                    };
                }
                return {
                    description: $row.find('.qty').text(),
                    number: $row.find('.last').text(),
                    entryModifierClass: $row.is(':last-of-type') ? 'c--total c--bordered' : ''
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
