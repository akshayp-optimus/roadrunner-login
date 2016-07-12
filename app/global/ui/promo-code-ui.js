define([
    '$'
], function($) {

    var _updatePromoContainer = function() {
        var $promoContainer = $('.js-promo-container');
        var $appliedContainer = $promoContainer.prev();
        var $editPromoContainer = $promoContainer.find('.edit-promo');
        var $promoEditButton = $editPromoContainer.find('.edit-promo-link').addClass('u-margin-start-sm u--bold u-text-capitalize');

        // Add edit button
        if ($promoEditButton.length) {
            var $appliedDescription = $appliedContainer.find('.c-ledger__description');

            if (!$appliedContainer.hasClass('js-applied-promo')) {
                // GRRD-671: There's a promo but it has no discount value
                $appliedContainer.find('.c-ledger__number').text('');
                $appliedDescription.html($editPromoContainer.find('.label-promo-code'));
            }
            $appliedDescription.append($promoEditButton);
        }
    };


    var _overrideDesktop = function() {
        var _editOnClick = window.editOnClick;
        window.editOnClick = function() {
            _editOnClick.apply(this, arguments);
            $('.js-promo-container').removeAttr('hidden');
        };

        var _changeZipCode = window.showZipCodeForm;

        window.showZipCodeForm = function() {
            _editOnClick.apply(this, arguments);
            $('.js-shipping-container').removeAttr('hidden');
        };
    };

    var _bindEvents = function() {
        $('.js-apply-input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $input.next();

            if ($input.val() !== '') {
                $button.removeClass('u--disabled');
            } else {
                $button.addClass('u--disabled');
            }
        });
    };

    var _init = function() {
        _updatePromoContainer();
        _overrideDesktop();
        _bindEvents();
    };

    return {
        init: _init
    };
});
