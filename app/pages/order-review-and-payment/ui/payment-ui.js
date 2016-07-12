define([
    '$',
    'global/ui/promo-code-ui',
    'bower_components/jquery-creditcardvalidator/jquery.creditCardValidator'
], function($, promoCodeUI) {

    var cardTypes = {
        'amex': 'American Express',
        'visa': 'Visa',
        'discover': 'Discover',
        'mastercard': 'Master Card',
        'jcb': 'JCB'
    };

    var _bindEvents = function() {
        var $cardSelect = $('.js-card-type select');

        $cardSelect.removeAttr('onchange');

        jQuery('.js-cc-input input').validateCreditCard(function(result) {
            var $input = $(this);
            var $container = $input.closest('.js-cc-input-container');
            var $paymentCardType = $('.js-cc-payment-card-type');
            var type = result.card_type;

            if ($input.val().indexOf('*') > -1) {
                // The user has saved CC info, so it's been pre-filled
                return;
            }

            if (type && type.name) {
                $paymentCardType.addClass('c--' + type.name);
                $cardSelect.children('[value="' + cardTypes[type.name] + '"]').prop('selected', true);
                $cardSelect.trigger('change');
                // Hide all other card ID info blocks (CC ID tooltip)
                $('.js-ccID-tooltip .js-card-id-block').not('.js-' + type.name).addClass('u-visually-hidden');
            } else {
                $paymentCardType.attr('class', 'paymentOption creditCard form js-cc-payment-card-type');
                $container.attr('class', 'c-field__credit-card js-cc-input-container');
                $('.js-ccID-tooltip .js-card-id-block.u-visually-hidden').removeClass('u-visually-hidden');
            }
        });

        $('.js-toggle').on('click', function(e) {
            var $button = $(this);
            var $target = $button.next($button.attr('data-target'));
            e.preventDefault();

            $button.attr('hidden', 'true');
            $target.removeAttr('hidden');

        });

        $('.js-apply-input input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $input.parent().next().find('button');

            if ($input.val() !== '') {
                $button.removeAttr('disabled');
            } else {
                $button.attr('disabled', 'true');
            }
        });
    };

    var _updateFieldsAndButtons = function() {
        var $ccField = $('#accountcc');
        var $placeOrderButton = $('.js-place-order .primary');
        var cvvStyles = {
            'box-sizing': 'border-box',
            width: '100%',
            height: '44px',
            'min-height': '34px',
            padding: '12px 12px',
            border: '0',
            'background-color': '#fff',
            color: '#000',
            'font-family': '"Default Sans", "Helvetica Neue", "Arial", sans-serif',
            'font-size': '14px',
            'line-height': '20px',
            '-webkit-appearance': 'none',
            '-webkit-tap-highlight-color': 'transparent'
        };
        $placeOrderButton.append(' >');

        $ccField.removeAttr('onkeyup');
        $ccField.removeAttr('pattern');
        $ccField.attr('type', 'tel');

        $placeOrderButton.addClass('c-button c--primary c--full-width js-submit');

        $('.js-form-container[hidden] input').attr('disabled', 'true');

        if (window.cvvLogicEnabled) {
            // Desktop JS function that allows us to apply inline styles to the CVV field in an iframe
            window.ccTokenizerSocket.setCVVFieldStyleByObject(cvvStyles);
        }
    };

    var switchForms = function($newlyActiveForm, $previouslyActiveForm) {
        $newlyActiveForm.find('input').removeAttr('disabled');
        $previouslyActiveForm.find('.js-form-container input').attr('disabled', 'true');

        $newlyActiveForm.find('#payment-type-holder').addClass('c-payment-active');
        $previouslyActiveForm.find('#payment-type-holder').removeClass('c-payment-active');
    };


    var _overrideDesktop = function() {
        var _submitForm = window.submitCreditCardForm;
        var _showPLCC = window.showPLCCOptions;
        var _showCreditCard = window.showCreditCardOptions;
        var $plccForm = $('.js-plcc-form');
        var $ccForm = $('.js-cc-payment-card-type');

        window.submitCreditCardForm = function() {
            $('.js-payment-block .js-form-container:visible').find('input, select').removeAttr('disabled');

            return _submitForm.apply(this, arguments);
        };

        window.showPLCCOptions = function() {
            var result = _showPLCC.apply(this, arguments);

            switchForms($plccForm, $ccForm);

            $('.js-submit').removeAttr('onclick');

            return result;
        };

        window.showCreditCardOptions = function() {
            var result = _showCreditCard.apply(this, arguments);

            switchForms($ccForm, $plccForm);

            if (window.checkAndTokenizeCVV) {
                $('.js-submit').attr('onclick', 'checkAndTokenizeCVV();');
            }

            return result;
        };
    };

    var _checkForErrors = function() {
        // Wrap error with generic container
        $('#payment-error-cvv[style*="block"]').contents().wrapAll('<div id="gwt-error-placement-div" />');
        var $otherErrors = $('#ok-placement-div .gwt-csb-error-panel, #topErrorMessages, #payment-error-cvv[style*="block"]');

        if ($otherErrors.length) {
            Adaptive.notification.triggerError($otherErrors.parent());
        }
    };

    var _init = function() {


        promoCodeUI.init();

        _bindEvents();

        _overrideDesktop();

        _updateFieldsAndButtons();

        _checkForErrors();

    };

    return {
        init: _init
    };
});
