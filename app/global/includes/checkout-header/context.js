define(['$', 'translator', 'dust!components/mini-cart/partials/mini-cart__empty'],
function($, translator, EmptyCartTemplate) {
    var getStepInfo = function(stepKey, index) {
        var title = translator.translate(stepKey + '_step');
        return {
            stepClass: 'c--' + stepKey,
            stepCurrent: index,
            stepTitle: title,
            stepIcon: stepKey,
            stepIconText: title
        };
    };

    var getReviewStep = function(index) {
        return {
            stepClass: 'c--review',
            stepCurrent: index,
            stepTitle: translator.translate('review_step'),
            stepIcon: 'arrow-right',
            stepIconText: translator.translate('gift_step').replace('&', 'and')
        };
    };

    return {
        context: {
            emptyCartContent: function() {
                var $content;

                new EmptyCartTemplate({}, function(err, html) {
                    $content = $(html);
                });

                return $content;
            },
            shoppingCart: function() {
                return $('#shoppingCart').addClass('u-visually-hidden');
            },
            websiteLink: function() {
                var $websiteLink = $('#logo1');

                return $websiteLink.length ? {
                    href: $websiteLink.find('a').attr('href'),
                    text: $websiteLink.find('img').attr('alt')
                } : false;
            },

            progressBar: function() {
                // The content here will be the same across all checkout steps
                // Modify this key within a template to match the correct progress for that template
                return {
                    stepCount: '3',
                    steps:[
                        getStepInfo('shipping', '1'),
                        getStepInfo('payment', '2'),
                        getReviewStep('3')
                    ]
                };
            },
            progressBarWithGift: function() {
                return {
                    stepCount: '4',
                    steps:[
                        getStepInfo('gift', '1'),
                        getStepInfo('shipping', '2'),
                        getStepInfo('payment', '3'),
                        getReviewStep('4')
                    ]
                };
            }
        }
    };
});
