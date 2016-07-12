define(['$'],
function($) {
    var parseVotingOption = function(_, vote) {
        var $vote = $(vote);
        var count = $vote.find('.BVDINumber').text();

        var isHelpful = $vote.hasClass('BVDI_FVPositive');
        var isUnhelpful = $vote.hasClass('BVDI_FVNegative');

        var type = isHelpful ? 'helpful' : isUnhelpful ? 'not-helpful' : 'offensive';
        var icon = isHelpful ? 'check' : isUnhelpful ? 'expand' : 'offensive';

        var label = $vote.find('.BVDILabel').text();

        if (!label.length) {
            label = 'Offensive';
        }

        return {
            label: label,
            count: count > 0 ? count : false,
            type: type,
            icon: {
                name: icon,
                class: 'c-review-voter__vote-icon'
            }
        };
    };

    var parse = function($container) {
        return {
            votes: $container.find('.BVDI_FVVote, .BVDI_FVReportLink').map(parseVotingOption)
        };
    };

    return {
        parse: parse
    };

});
