define([
    '$',
], function($) {
    var updateSelectedVote = function($bvContainer, $container) {
        var votedHelpful = $bvContainer.hasClass('BVDI_FVVisitedVotesHelpfulnessPositive');
        var votedUnhelpful = $bvContainer.hasClass('BVDI_FVVisitedVotesHelpfulnessNegative');
        var $voteButtons = $container.find('.c-review-voter__vote');
        var $selected;

        if (votedHelpful) {
            $selected = $container.find('.c--helpful');
        } else if (votedUnhelpful) {
            $selected = $container.find('.c--not-helpful');
        }

        if ($selected && $selected.length) {
            $voteButtons.not($selected).addClass('c--disabled');
            $selected.addClass('c--selected');
        } else {
            $voteButtons.removeClass('c--selected c--disabled');
        }
    };

    var updateNumberOfVotes = function($bvContainer, $container) {
        var positiveVoteCount = $bvContainer.find('.BVDI_FVVote.BVDI_FVPositive .BVDINumber').text();
        var negativeVoteCount = $bvContainer.find('.BVDI_FVVote.BVDI_FVNegative .BVDINumber').text();

        $container.find('.c--helpful .js-vote-count').text('(' + positiveVoteCount + ')');
        $container.find('.c--not-helpful .js-vote-count').text('(' + negativeVoteCount + ')');
    };

    var showMessage = function($bvContainer, $container) {
        var message = $bvContainer.find('.BVDIPopin .BVDIMessage').text();
        $container.find('.js-vote-message').text(message);
    };

    var showOffensiveMessageForm = function($bvContainer, $container) {
        var $form = $container.find('.js-offensive-form');
        var $bvForm = $bvContainer.find('.BVDI_FVReportPopin');

        $form.find('.js-offensive-label').text($bvForm.find('.BVSUFieldLabel').text());
        $form.find('.js-submit-button').text($bvForm.find('.BVSUSubmitButton').first().val());
        $form.find('.js-cancel-button').text($bvForm.find('.BVSUCancelButton').val());

        $form.removeAttr('hidden');

        $container.find('.c-review-voter__vote.c--offensive').addClass('c--active');
    };

    var updateVote = function($bvContainer, $container) {
        updateSelectedVote($bvContainer, $container);
        updateNumberOfVotes($bvContainer, $container);

        // We have to wait a bit before the message is added
        // TODO: Find a better way to do this
        setTimeout(function() {
            showMessage($bvContainer, $container);

            if ($bvContainer.find('.BVDI_FVReportPopin').length) {
                showOffensiveMessageForm($bvContainer, $container);
            }
        }, 1000);
    };

    var vote = function(targetSelector, e) {
        var $container = $(e.target).closest('.c-question-tile__answer');
        var $bvContainer = $('#' + $container.data('target'));
        var originalLink = $bvContainer.find(targetSelector + ' a')[0];

        originalLink.click();
        originalLink.click();

        setTimeout(function() {
            updateVote($bvContainer, $container);
        });
    };

    var bindEvents = function() {
        var $qaModal = $('.js-product-question-pinny');
        $qaModal.on('click', '.c--helpful', vote.bind(this, '.BVDI_FVPositive'));
        $qaModal.on('click', '.c--not-helpful', vote.bind(this, '.BVDI_FVNegative'));
        $qaModal.on('click', '.c--offensive', vote.bind(this, '.BVDI_FVReportLink'));

        $qaModal.on('click', '.js-offensive-form .js-submit-button', function(e) {
            var $container = $(e.target).closest('.c-question-tile__answer');
            var $bvContainer = $('#' + $container.data('target'));

            var $reportOffensivePopup = $('.BVDI_FVReportPopin');
            var reportOffensiveText = $(this).closest('.js-offensive-form').find('textarea').val().trim();
            $reportOffensivePopup.find('textarea').val(reportOffensiveText);

            $reportOffensivePopup.find('[type="submit"]')[0].click();
            $reportOffensivePopup.find('[type="submit"]')[0].click();

            $(this).closest('.js-offensive-form').attr('hidden', 'hidden');
            $reportOffensivePopup.remove();

            // Display the success message
            updateVote($bvContainer, $container);
        });

        $qaModal.on('click', '.js-offensive-form .js-cancel-button', function(e) {
            var $form = $(this).closest('.js-offensive-form');
            $('.BVDI_FVReportPopin').remove();
            $form.attr('hidden', 'hidden');
            $form.prev().find('.c-review-voter__vote.c--offensive').removeClass('c--active');
        });
    };

    var init = function() {
        bindEvents();
    };

    return {
        init: init,
        vote: vote,
        updateVote: updateVote
    };
});
