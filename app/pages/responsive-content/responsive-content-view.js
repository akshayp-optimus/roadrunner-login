define([
    '$',
    'global/baseView',
    'dust!pages/responsive-content/responsive-content',
    'global/utils'
],
function($, BaseView, template, utils) {

    var _transformContent = function($container) {
        utils.swapImages($container);

        return $container;
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'responsive-content',
            pageContent: function() {
                return _transformContent($('#mobile-template').remove());
            },
            recomendationContainer: function() {
                return $('[id*="gwt_recommendations_"]').remove();
            }
        }
    };
});
