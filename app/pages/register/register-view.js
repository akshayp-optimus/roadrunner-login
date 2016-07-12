define([
    '$',
    'global/baseView',
    'dust!pages/register/register',
    'components/button/parsers/button',
    'translator',
    'global/utils'
],
function($, BaseView, template, buttonParser, Translator, Utils) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'register',
            pageTitle: function() {
                return $('.data').children('h2').addClass('u-padding-bottom u--tight c-register-page-title');
            },
            pageDescription: function() {
                return Utils.getNonEmptyChildTextNodes($('.data'));
            },
            userState: function() {
                return $('#gwt_user_state');
            },
            form: function() {
                return $('#userRegistrationForm').remove();
            },
            errorContainer: function(context) {
                return context.form.find('#gwt-error-placement-div');
            },
            hiddenInputs: function(context) {
                return context.form.children('[type="hidden"]');
            },
            continueButton: function(context) {
                return buttonParser.parse(context.form.find('.button.primary').addClass('c-button c--primary'));
                // return context.form.find('.button.primary').addClass('c-button c--primary c--full-width');
            },
            sendMeEmails: function(context) {
                var $sendMeEmailContainer = context.form.find('.spot.opt');
                var $input = $sendMeEmailContainer.find('input').remove();
                return {
                    input: $input,
                    inputId: $input.attr('id'),
                    label: $sendMeEmailContainer.text()
                };
            },
            formRows: function(context) {
                return context.form.find('.spot').not('.actions, .opt').map(function(i, row) {
                    var $row = $(row);
                    var $required = $row.find('.required').addClass('c--shrink u--hide').remove();
                    var $label = $row.find('label').addClass('c-arrange__item c--shrink');
                    var labelText = $label.text();
                    var newLabel = Utils.updateFormLabels(labelText);
                    $label.attr('data-label', labelText);

                    // Update Form Labels to match the invision
                    newLabel && $label.text(Translator.translate(newLabel));
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
