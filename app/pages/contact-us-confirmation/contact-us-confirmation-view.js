define([
    '$',
    'global/baseView',
    'dust!pages/contact-us-confirmation/contact-us-confirmation'
],
function($, BaseView, template) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'contact-us-confirmation',
            pageTitle: function() {
                return $('.inner').first().text();
            },
            form: function() {
                return $('#confirmation').remove();
            },
            hiddenInputs: function(context) {
                return context.form.children('[type="hidden"]');
            },
            confirmationMsg: function(context) {
                return context.form.find('.note');
            },
            continueBtn: function(context) {
                context.form.find('.button.primary').append(' >');
                return context.form.find('.button').addClass('c-continue-btn c--primary c-button c--full-width');
            }
        }
    };
});
