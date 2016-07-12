define([
    '$',
    'global/utils',
    'global/ui/registry-form-parser-ui',
    'global/ui/handle-form-fields',
    'translator'
],
function(
    $,
    Utils,
    formParser,
    handleFormFieldsUI,
    Translator
) {

    var _updatePlaceholder = function() {
        $('.c-form-group').find('.c-box').map(function(_, item) {
            var $item = $(item);
            var $label = $item.find('label').clone();
            $label.find('.required').remove();

            if ($label.length && $label.attr('data-label')) {
                $item.find('input').attr('placeholder',  $label.attr('data-label').trim());
            }
        });
    };

    var _progressBarStepOneActivation = function() {
        $('.c-step-contact-info').removeClass('c--active');
        $('.c-step-contact-info-heading').removeClass('c--active');
        $('.c-step-registry-info').removeClass('c-contact-step');
    };

    var _progressBarStepTwoActivation = function() {
        $('.c-step-contact-info-heading').addClass('c--active');
        $('.c-step-registry-info').addClass('c-contact-step');
        $('.c-step-contact-info').addClass('c--active');
    };

    var _transforms = function() {
        var $appendingElement = $(arguments[0]);
        var $appendingTo = $(this);
        // on page load, #gwt_new_gift_registry_create is the right hook to start transforms
        // however, on page update (step 1 to 2, or 2 to 1), we need to
        // hook onto .GR_create_progressBar_Step
        if ($appendingTo.is('#gwt_new_gift_registry_create')) {
            formParser.transformContent($appendingElement);
            formParser.transformStep1($appendingElement);
            _progressBarStepOneActivation();
            $('#gwt_new_gift_registry_create .c--error-row').addClass('c--remove-error-row');
        } else if ($appendingElement.is('.GR_creat_step2') && !$appendingElement.find('.c-box').length) {
            formParser.transformContent($appendingElement);
            formParser.transformStep2($appendingElement);
            _progressBarStepTwoActivation();
            $('#gwt_new_gift_registry_create .c--error-row').addClass('c--remove-error-row');
        } else if ($appendingElement.is('.GR_creat_step3') && !$appendingElement.find('.c-box').length) {
            formParser.transformContent($appendingElement);
            formParser.transformStep3($appendingElement);
        } else if ($appendingTo.is('[class^="GR_create_progressBar_Step1"]')) {
            _progressBarStepOneActivation();
            $('.js-loader').remove();
        } else if ($appendingTo.is('[class^="GR_create_progressBar_Step2"]')) {
            _progressBarStepTwoActivation();
        }
        _updatePlaceholder();
    };


    var giftRegistryCreateUI = function() {
        Utils.overrideDomAppend('', _transforms, '*');
        formParser.bindErrorsViaClick();
    };

    return giftRegistryCreateUI;
});
