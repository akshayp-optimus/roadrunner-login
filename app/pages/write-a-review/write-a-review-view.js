define([
    '$',
    'global/baseView',
    'dust!pages/write-a-review/write-a-review'
],
function($, BaseView, template) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'write-a-review',
            writeAReviewContainer: function() {
                return $('#BVSubmissionContainer');
            }
        }
    };
});
