/**
 * Change Password View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/change-password/change-password',
    'components/button/parsers/button',
    'translator',
    'global/utils',
    'components/breadcrumb/parsers/breadcrumb'
],
function($, baseView, template, buttonParser, Translator, Utils, BreadcrumbParser) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'change-password',
            breadcrumbLink: function() {
                // TODO: BreadcrumbParser should be in camel case
                return BreadcrumbParser.parse($('#myAccount'));
            },
            updateEmailMessage: function() {
                return $('.inst-copy');
            },
            form: function() {
                return $('#changePasswordForm');
            },
            errorContainer: function(context) {
                return context.form.find('#gwt-error-placement-div');
            },
            hiddenInputs: function(context) {
                return context.form.children('[type="hidden"]');
            },
            continueButton: function(context) {
                return buttonParser.parse(context.form.find('.button.primary').addClass('c-button c--primary'));
            },
            formRows: function(context) {
                return context.form.find('.spot').not('.actions, .opt').map(function(i, row) {
                    var $row = $(row);
                    var $required = $row.find('.required').addClass('c--shrink u--hide').remove();
                    var $label = $row.find('label').addClass('c-arrange__item c--shrink');
                    var labelText = $label.text();
                    var newLabel = Utils.updateAccountLandingFormLabels(labelText);
                    $label.attr('data-label', labelText);
                    // Update Form Labels to match the invision
                    newLabel && $label.text(Translator.translate(newLabel));

                    $row.find('label').prepend('<span class="u-padding-right-extra-tight u-padding-left-extra-tight u-required-star">*</span>');
                    return {
                        inputScript: $row.find('script').remove(),
                        required: $required,
                        input: $row.find('input').attr('placeholder', labelText),
                        label: $label
                    };
                });
            }
        }
    };
});
