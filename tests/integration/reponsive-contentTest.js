define([
    'lib/viewMocker',
    'pages/reponsive-content/view',
    'text!fixtures/reponsive-content.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('reponsive-content view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('reponsive-content', 'reponsive-content context has correct template name');
        }
    });

    test('reponsive-content view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-reponsive-content')).to.be.true;
        }
    });
});
