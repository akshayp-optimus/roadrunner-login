define([
    '$',
    'global/baseView',
    'dust!pages/order-status/order-status',
    'components/button/parsers/button',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb',
],
function($, BaseView, template, buttonParser, Translator, Utils, BreadcrumbParser) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'order-status',
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.data').find('p:contains(1-866-668-5962)');
            },
            formGuideline: function() {
                return $('.data').find('p:contains(case-sensitive)').last();
            },
            error: function() {
                return $('.data').find('.error').addClass('u-required-star u-margin-bottom-md u--show u--bold');
            },
            form: function() {
                return $('#orderStatusForm').addClass('js-form');
            },
            errorContainer: function(context) {
                return context.form.find('.gwt-csb-error-panel');
            },
            hiddenInputs: function(context) {
                return context.form.children('[type="hidden"]');
            },
            formRows: function(context) {
                return context.form.find('.spot').not('.actions, .opt').map(function(i, row) {
                    var $row = $(row);
                    var $required = $row.find('.required').addClass('c--shrink u--hide').remove();
                    var $label = $row.find('label').addClass('c-arrange__item');
                    var labelText = $label.text();
                    var newLabel = Utils.updateAccountLandingFormLabels(labelText);
                    $label.attr('data-label', labelText);
                    // Update Form Labels to match the invision
                    newLabel && $label.text(Translator.translate(newLabel));

                    $row.find('label').prepend('<span class=" u-padding-right-extra-tight u-padding-left-extra-tight u-required-star">*</span>');
                    $('#billZip').attr('type', 'tel');
                    return {
                        inputScript: $row.find('script').remove(),
                        required: $required,
                        input: $row.find('input').attr('placeholder', labelText),
                        label: $label
                    };
                });
            },
            continueButton: function(context) {
                return buttonParser.parse(context.form.find('.button.primary').addClass('c-button c-check-order-status-button c--primary'));
            },
            forgotYourOrderLink: function() {
                return $('.data').find('p').last().find('a').addClass('c-forgot-your-order-link');
            }
        }
    };
});
