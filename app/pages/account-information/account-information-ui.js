define([
    '$',
    'pages/account-information/decorators/account-information__form-decorator',
    'global/ui/handle-form-fields',
    'global/ui/replace-text-node'

],
function($, accountInfoFormDecorator, handleFormFieldsUI, replaceNbspUI) {
    var transformForm = function() {
        $('.js-form-container').each(function(i, formContainer) {
            var $formContainer = $(formContainer);

            // We have to use a decorator here.
            // Using a parser/partial template instead breaks some of the desktop JS functionality
            // Their JS ends up referencing the original elements, and not the elements in the partial.

            $('br').remove();

            $formContainer.find('.spot').map(function(_, item) {
                var $item = $(item);
                var $labelRequired = $item.find('label .required');
                if ($labelRequired.length) {
                    $labelRequired.closest('label').prepend($labelRequired);
                }
            });
            $formContainer.find('.postal-code, .phone1_shipping, .phone2_shipping').attr('type', 'tel');
            $formContainer.find('label').map(function(i, item) {
                var $label = $(item);
                $label.attr('data-label', $label.text().replace('*', ''));
            });

            accountInfoFormDecorator.decorate($formContainer);

            if ($formContainer.is('#gwt_shipaddr_panel')) {
                $formContainer.addClass('js-shipping-panel c-form-panel');
                $formContainer.parent().parent().find('.gwt-CheckBox input').on('click', function(e) {
                    $formContainer.toggleClass('c--active');
                });
            } else if ($formContainer.is('#gwt_billaddr_panel')) {
                $formContainer.find('#bill_reqdlabel').removeClass().addClass('c-required-label').unwrap()
                    .insertAfter($('.accountInfoBillingForm').find('h3').wrap('<div class="c-box-row"/>'));
            }

            var $hiddenField = $('.addrStreet3Spot, .addrFaxSpot');
            if ($hiddenField.css('display') === 'none') {
                $hiddenField.parent().hide();
            }

            var $sumbitButton = $('#gwt_billshipaddr_btn button');
            if (!$sumbitButton.hasClass('c--primary')) {
                $('#gwt_billshipaddr_btn button').addClass('c-button c--primary c--full-width')
                    .append(' >');
            }
        });
    };

    var overrideDesktop = function() {
        var _oldRunAsync = window.CSBEntryPoint.__installRunAsyncCode;
        var transformed = false;

        window.CSBEntryPoint.__installRunAsyncCode = function() {
            _oldRunAsync.apply(this, arguments);

            if (!transformed && $('.address-widget-wwcm-wrapper').length) {
                transformForm();

                transformed = true;
            }
        };
    };
    var accountInformationUI = function() {
        // Add any scripts you would like to run on the accountInformation page only here
        overrideDesktop();
        // Update placeholders in inputs
        handleFormFieldsUI.inputsHandler();
        replaceNbspUI.replaceNbsp();

    };

    return accountInformationUI;
});
