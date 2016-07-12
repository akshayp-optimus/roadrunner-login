define(['$', 'translator', 'global/utils'], function($, Translator, Utils) {
    var _decorateInputs = function($inputCollection, $container) {

        $container.find('.group').not('.addrNameGroup')
            .children()
            .unwrap();

        $container.find('.addrNameGroup')
            .after($container.find('.AddrLNameSpot'))
            .addClass('c-box-row')
            .find('.AddrFNameSpot, .AddrMNameSpot')
            .addClass('c-box');

        $container.find('.AddrMNameSpot')
            .addClass('c--shrink c--quarter-width');

        $container.find('.spot').not('.AddrFNameSpot, .AddrMNameSpot')
            .addClass('c-box c-arrange c--align-middle')
            .wrap('<div class="c-box-row" />');

        // Country field hide as per design
        $('.addrCountrySpot').parent().addClass('u--hide');
        return $inputCollection.map(function(i, input) {
            var $input = $(input);
            var $label = $input.prev('label');
            var wrapClass = 'c-input c-arrange__item';
            var $additionalInput, $additionalLabel;
            var $labelContent = $label.children();
            var newLabel = Utils.updateFormLabels($label.text());
            // Update Form Labels to match the invision
            newLabel && $label.text(Translator.translate(newLabel));

            $label.prepend($labelContent);
            $label.addClass('c-box__label c-arrange__item c--shrink');

            if ($input.is('select')) {
                wrapClass = 'c-select c-arrange__item';
            }

            $input.wrap('<div class="' + wrapClass + '">');

            if ($input.is('.given-name')) {
                $additionalInput = $container.find('.additional-name');
                $additionalLabel = $additionalInput.prev('label');
                $additionalInput.wrap('<div class="' + wrapClass + '">');
                $additionalLabel.addClass('c-box__label c-arrange__item c--shrink');
            }
        });
    };

    var _decorateGroups = function($groupCollection, $container) {
        return $groupCollection.map(function(i, group) {
            var $group = $(group);
            _decorateInputs($group.find('input, select').not('.additional-name'), $container);
        });
    };

    var _decorate = function($formContainer) {
        // return {
        //     requiredLabel: $formContainer.find('.reqdlabel'),
        //     groups: _parseGroups($formContainer.find('.group'), $formContainer)
        // };

        _decorateInputs($formContainer.find('input, select').not('.additional-name'), $formContainer);
    };

    return {
        decorate: _decorate
    };
});
