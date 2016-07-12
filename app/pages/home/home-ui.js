define([
    '$',
    'global/ui/carousel-ui',
    'components/sheet/sheet-ui',
    'global/utils/dom-operation-override'
],
function($, carouselUI, sheet, DomOverride) {

    var $deleteConfirmationPinny = $('.js-delete-confirmation-pinny');
    var $addressConfirmationShade = $('.js-address-confirmation-shade');

    var _closeCallback = function() { return;};

    var _addCloseCallback = function(cb) {
        _closeCallback = cb;
    };

    var _resetDeleteRegistryPinny = function() {
        var $lockup = $('.lockup__container');
        $deleteConfirmationPinny.parent().appendTo($lockup);
        $deleteConfirmationPinny.appendTo($lockup);

        $deleteConfirmationPinny.pinny('close');
        _closeCallback();
    };

    var desktopDeleteRegistryConfirmationCloseCallback = function(removedElement) {
        _resetDeleteRegistryPinny();
    };

    var _bindPinnyEvents = function() {
        DomOverride.on('domRemove', '.ok-cancel-dlog', desktopDeleteRegistryConfirmationCloseCallback);
        $('body').on('click', '.js-delete-confirmation-pinny .pinny__close', function(e) {
            $deleteConfirmationPinny.find('.js-close-modal').click();
            $deleteConfirmationPinny.find('.js-close-modal span').click();
        });
    };

    var showDeleteConfirmationModal = function($modal) {
        $deleteConfirmationPinny.pinny('open');
        $modal.find('.button.primary')
           .addClass('c-button c--primary u-margin-bottom-sm c--full-width js-ok-button').append(' >');

        var title = $modal.find('.Caption');
        var $content = $modal.find('.dialogContent');
        $deleteConfirmationPinny.find('.c-sheet__title').html(title);
        $deleteConfirmationPinny.find('.js-delete-confirmation-pinny__body').html($content);
        $deleteConfirmationPinny.find('.okCancelPanel').closest('tr').nextAll().addClass('c-not-required-fields').remove();
        $deleteConfirmationPinny.find('table tr td').addClass('u-no-border-bottom u-no-padding');
        $deleteConfirmationPinny.find('table').addClass('u-margin-bottom-0 u-margin-top-0');
        $deleteConfirmationPinny.find('.gwt-gr-delete-confirm-message').addClass('u-text-align-start u-margin-bottom-gt-md');
        $modal.html($deleteConfirmationPinny.parent());
        $modal.append($addressConfirmationShade);
    };

    var initPinnies = function() {
        sheet.init($deleteConfirmationPinny,  {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-confirmation-shade',
                zIndex: 100,
                opacity: '0.5' // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });

        _bindPinnyEvents();

    };

    var animationListener = function() {
        if (event.animationName === 'modalAdded') {
            var $deleteconfirmationModal = $('.gwt-gift-registry-delete-confirmation-dialog');

            if ($deleteconfirmationModal.length) {
                showDeleteConfirmationModal($deleteconfirmationModal);
            }
        }
    };


    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };


    var changeNumberOfImagesInCarousel = function() {
        /*eslint-disable*/
        gwt_recommendations_home_1_JSON.num_visible =
            gwt_recommendations_home_1_JSON.num_recommendations;
        /*eslint-enable*/
    };

    var homeUI = function() {
        changeNumberOfImagesInCarousel();
        carouselUI.init($('.rightSide'));
        bindAnimationListener();
        initPinnies();
    };

    return homeUI;
});
