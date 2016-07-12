define([
    'lib/viewMocker',
    'pages/email-subscription-form/email-subscription-form-view',
    'text!fixtures/email-subscription-form.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('email-subscription-form view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('email-subscription-form', 'email-subscription-form context has correct template name');
        }
    });

    test('email-subscription-form view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-email-subscription-form')).to.be.true;
        }
    });
});
