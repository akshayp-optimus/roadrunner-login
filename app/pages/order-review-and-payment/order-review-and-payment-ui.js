define([
    '$',
    'global/ui/cart-item-ui',
    'pages/order-review-and-payment/ui/review-ui',
    'global/ui/tooltip-ui',
    'pages/order-review-and-payment/ui/payment-ui',
    'global/ui/handle-form-fields',
    'global/utils',
    'translator'
], function($, cartItemUI, reviewUI, tooltipUI, paymentUI, handleFormFieldsUI, Utils, Translator) {

    var updateLabelText = function() {
        $('.c-form-group').find('.c-box').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();
            // var $labelRequired = $labelField.find('.required');
            $labelField.attr('data-label', $labelField.text().replace('*', ''));

            var newLabel = Utils.updateFormLabels($labelField.text());
            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);
        });
    };

    var _animation = function() {
        if (event.animationName === 'pleaseWaitLoader') {
            var $pleaseWaitLoader = $('.gwt-payment-selection-please-wait-panel');
            var $pleaseWaitLoader = $('#pleaseWait');
            if ($pleaseWaitLoader.length || $pleaseWaitLoader[0].style.display === 'inline') {
                $('.js-filter-loader').removeClass('u--hide');
            } else {
                $('.js-filter-loader').addClass('u--hide');
            }
        }
    };

    var orderReviewAndPaymentUI = function() {
        tooltipUI();
        reviewUI.setUpSection();
        paymentUI.init();
        updateLabelText();
        // Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();

        $('#plcc_account').attr('placeholder', Translator.translate('fg_credit_card_number'));
        // TODO: Check the script adding disabled state
        $('.js-review-only').find('.js-submit').removeAttr('disabled');

        // Implementation of loader on changing payment options
        document.addEventListener('animationStart', _animation);
        document.addEventListener('webkitAnimationStart', _animation);
    };

    return orderReviewAndPaymentUI;
});
