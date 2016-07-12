define([
    '$',
    'global/parsers/review-voter-parser',
    'dust!components/question-tile/question-tile__content',
    'dust!components/question-tile/question-tile__header',
    'dust!components/bellows/bellows'
], function($, ReviewVoterParser, QuestionTileContentTmpl, QuestionTileHeaderTmpl, BellowsTmpl) {

    var parseQuestions = function($qaContainer, inModal) {
        return $qaContainer.find('.BVQAQuestionAndAnswersProduct, .BVQAQuestionAndAnswers').map(function(_, question) {
            var $question = $(question);
            var data = {
                // class: 'u-margin-top-md',
                question: $question.find('.BVQAQuestionSummary').text(),
                answerCount: $question.find('.BVQAQuestionAnswersCount').text(),
                date: $question.find('.BVQAQuestionData .BVQAElapsedTime').text(),
                by: $question.find('.BVQAWrittenBy').first().text(),
                author: $question.find('.BVQANickname').first().text(),
                answerQuestionText: $question.find('.BVQAAnswerQuestion').text(),
                canAnswerQuestions: !$question.find('.BVQAAnswerQuestionInactive').length,
                originalSelector: $question.attr('id')
            };

            var answers = $question.find('.BVQAAnswer').map(function(index, answer) {
                var $answer = $(answer);

                return {
                    answer: $answer.find('.BVQAAnswerText').text(),
                    date: $answer.find('.BVQAElapsedTime').text(),
                    by: $answer.find('.BVQAWrittenBy').text(),
                    author: $answer.find('.BVQANickname').first().text(),
                    voter: ReviewVoterParser.parse($answer),
                    inModal: inModal,
                    originalSelector: $answer.attr('id')
                };
            });

            data.answers = answers;

            return data;
        });
    };

    var _buildQuestions = function($qaContainer, inModal) {
        var $qa = $('<div>', {
            class: 't-product-details__reviews-and-questions u-padding-sides-md js-qa'
        });

        var questionData = parseQuestions($qaContainer, inModal);
        var bellowsClass = 'js-question-bellows c--light';

        if (inModal) {
            bellowsClass += ' u-no-border';
        }

        $.makeArray(questionData).forEach(function(itemData) {
            var $bellowsContent = $('<div>');
            var $bellowsHeader = $('<div>');
            var bellowsData = {
                items: [{
                    bellowsHeader: $bellowsHeader,
                    bellowsHeaderClass: 'js-question-header',
                    bellowsContent: $bellowsContent
                }],
                class: bellowsClass
            };

            new QuestionTileHeaderTmpl(itemData, function(err, html) {
                $(html).appendTo($bellowsHeader);
            });

            new QuestionTileContentTmpl(itemData, function(err, html) {
                $(html).appendTo($bellowsContent);
            });

            new BellowsTmpl(bellowsData, function(err, html) {
                $(html).appendTo($qa);
            });
        });

        return $qa;
    };

    var _parse = function($qaContainer, isModal) {
        var $search = $qaContainer.find('#BVQASearchFormTextInputID');

        var $selectOptions = $qaContainer.find('.BVQAToolbarSortSelect option').map(function(_, option) {
            var $option = $(option);

            return {
                optVal: $option.attr('value'),
                selected: $option.prop('selected'),
                text: $option.text(),
            };
        });

        var $questions = _buildQuestions($qaContainer, isModal);

        var $searchResultCount = $qaContainer.find('.BVQASearchMatchCount').text();

        return {
            questions: $questions,
            askQuestionText: $qaContainer.find('#BVQAAskQuestionID').text(),
            currPage: $qaContainer.find('.BVQASelectedPageNumber').text(),
            numPages: $qaContainer.find('.BVQAPageNumber').last().text(),
            disableNext: $qaContainer.find('.BVQANextPage').length ? false : true,
            disablePrev: $qaContainer.find('.BVQAPreviousPage').length ? false : true,
            selectOptions: $selectOptions,
            search: {
                value: /Search all questions/.test($search.val()) ? '' : $search.val(),
                back: $qaContainer.find('#BVQAPageTabBrowseID .BVQAPageTabLink').text(),
                isError: $searchResultCount.match(/\bnot match\b/i),
                resultCount: $searchResultCount,
            },
            isModal: isModal
        };
    };

    return {
        parse: _parse
    };
});
