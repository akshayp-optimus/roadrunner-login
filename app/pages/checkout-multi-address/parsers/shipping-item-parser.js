define([
    '$',
    'translator',
    'global/utils'
], function($, Translator, Utils) {

    var _parse = function($item) {
        return $item.map(function(_, info) {
            var $info = $(info);
            var $productOptionContainer = $info.find('.gwt-multiple-address-component-panel-col1').find('tr');
            var $personalization = $('.gwt-multiple-address-row_pers .perz-text');
            var $productOption = $productOptionContainer.filter(function(index) {
                var productOptionLength = $productOptionContainer.length;
                if ($(this).find('.gwt-multi-address-product-lbl, .gwt-multi-address-item-aval-lbl, .lowInventoryMessaging').length) {
                    return;
                }
                return $(this);
            });

            var $itemCode = $info.find('.gwt-multi-address-item-lbl');

            var editId = Utils.generateUid();
            var addId = Utils.generateUid();
            var selectId = Utils.generateUid();
            var $editAddress = $info.find('.gwt-multiple-address-component-panel-col3 a')
                                .attr('data-bind-click', editId)
                                .clone();

            var $addAddress = $info.find('.gwt-multiple-address-component-panel-col4 a')
                                .attr('data-bind-click', addId)
                                .clone();

            var $select = $info.find('select')
                            .attr('data-replace-id', selectId)
                            .clone();

            var $inStock = $info.find('.gwt-multi-address-item-aval-lbl');

            $editAddress.text(Translator.translate('edit'));
            $addAddress.text(Translator.translate('add_new'));

            return {
                productName: $info.find('.gwt-multi-address-product-lbl').text(),
                productOption: $productOption,
                stock: {
                    inStock: /in\-*\s*stock/i.test($inStock.text()),
                    text: $inStock.text()
                },
                personalization: $personalization,
                select: $select.addClass('js-needs-replace'),
                editAddress: $editAddress.addClass('js-bind'),
                addAddress: $addAddress.addClass('js-bind')
            };
        });
    };

    return {
        parse: _parse
    };
});
