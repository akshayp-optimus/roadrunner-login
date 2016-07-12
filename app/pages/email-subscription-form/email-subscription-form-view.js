define([
    '$',
    'global/baseView',
    'dust!pages/email-subscription-form/email-subscription-form'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'email-subscription-form',
            body: function() {

                // Remove unnecessary whitespace
                var $emptyCells = $('td').filter(function() {
                    return $(this).text().trim() === ''
                        && $(this).children().length === 0;
                });
                $emptyCells.remove();

                // Transform these input type=image as our typical buttons
                $('input[type=image]').each(function() {
                    var $input = $(this);
                    var $ourButton = $('<button type="button" class="c-button c--image-type c--primary c--full-width">');

                    $ourButton.attr(
                        'data-button-text',
                        $input.attr('title') || $input.attr('alt')
                    );
                    $input.wrap($ourButton);
                });

                return $('body');
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
