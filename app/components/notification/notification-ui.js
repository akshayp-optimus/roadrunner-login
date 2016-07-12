define([
    '$',
    'sheet-top',
    'translator',
    'dust!components/notification/partials/error-item',
    'dust!components/notification/partials/success-item',
    'pinny'
],
function($, sheetTop, translator, ErrorItemTemplate, SuccessItemTemplate) {

    var $notificationPinny = $('.js-notification-pinny');
    var $notificationPreview = $notificationPinny.find('.js-notification-preview');
    var $notificationPreviewContent = $notificationPreview.find('.js-notification');
    var $fullNotification = $notificationPinny.find('.js-full-notification');
    var $fullNotificationContent = $fullNotification.find('.js-notification');
    // var $errorIcon = $fullNotification.find('.js-error-icon');

    var resetPinny = function() {
        $fullNotification.children().removeClass('c--active');
    };

    var unlockPage = function() {
        // We want the page to function normally with the error notification open
        // So un-lock lockup when the error pinny opens.
        $notificationPinny.parent().lockup('unlock');
    };

    var showExpandableContent = function($content) {
        var $preview = $(this);
        $notificationPreview.addClass('js--expand');
        $notificationPreview.addClass('c--active');
        // jQuery's class functions don't work on SVGs
        $notificationPreview.find('.c-icon')[0].classList.remove('c--active');
        $fullNotification.children().removeClass('c--active');
        $fullNotification.html($content.html());
    };

    var showSingleMessage = function($message) {
        $notificationPreview.removeClass('c--active');
        $fullNotification.html($message);
        $fullNotification.children().addClass('c--active');
    };

    var showSingleError = function($errors) {

        new ErrorItemTemplate({errors: $errors, isErrorIcon: true, className: 'c-single-notification'}, function(err, html) {
            showSingleMessage($(html));
        });
    };

    var showMultipleErrors = function($errors) {
        // $notificationPreviewContent.html(translator.translate('error_notification_text'));
        // $errorIcon.removeClass('u-visually-hidden');

        new ErrorItemTemplate({errors: $errors, isErrorIcon: false, className: 'c-multiple-notifications'}, function(err, html) {
            showExpandableContent($(html));
        });

    };

    var triggerError = function($errorContainer) {
        var $errors = $errorContainer.children();
        $fullNotification.addClass('c--error');

        // Remove empty div with no errors
        $errors = $errors.filter(function() {
            return (!!$(this).text().trim());
        });
        if (!$errors.length) {
            return;
        }

        if ($errors.length === 1) {
            showSingleError($errors.first());
        } else {
            showMultipleErrors($errors);
        }
        $notificationPinny.pinny('open');
    };

    var triggerSuccessMessage = function(message) {
        new SuccessItemTemplate({message: message}, function(err, html) {
            showSingleMessage($(html));
            $notificationPinny.pinny('open');
        });
    };

    var triggerAddToCart = function($addToCartContents, previewText) {
        // $fullNotification.removeClass('c--error');
        $notificationPreviewContent.html(previewText);

        showExpandableContent($addToCartContents);

        $notificationPinny.notify('open');
    };

    var initPinny = function() {
        $notificationPinny.pinny({
            effect: sheetTop,
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            coverage: '',
            shade: false,
            structure: false,
            closed: resetPinny,
            opened: unlockPage
        });
    };

    var bindEvents = function() {
        $notificationPreview.on('click', function(e) {
            var $preview = $(this);
            var $previewShowHideText = $preview.find('.js-notification__show-hide-text');
            if ($preview.hasClass('js--expand')) {
                $fullNotification.children().toggleClass('c--active');
                // jQuery's toggle class function doesn't work on SVGs
                $preview.find('.c-icon')[0].classList.toggle('c--active');
                if ($previewShowHideText.text() === 'hide') {
                    $previewShowHideText.text(translator.translate('show'));
                } else {
                    if ($previewShowHideText.text() === 'show') {
                        $previewShowHideText.text(translator.translate('hide'));
                    }
                }
            }
        });

        $('body').on('click', '.js-notification-close', function(e) {
            $notificationPinny.pinny('close');
        });
    };

    var handleErrors = function() {
        if (event.animationName === 'errorAdded' && !$('.gwt_confirmation_div').length) {
            var $errorElements = $('.errortxt');
            var $errorContainer = $('.gwt-csb-error-panel');

            // Prevent error messages to open in pinny when pinny is opened
            if ($errorContainer.parents('.pinny.pinny--is-open').length) {
                return;
            }

            $errorContainer.addClass('u-visually-hidden');
            $errorElements.parents('.c-box-row').addClass('c--error-row');
            $errorElements.removeAttr('style');
            triggerError($errorContainer);
        }
    };

    var defaultErrorHandler = function() {
        document.addEventListener('animationStart', handleErrors);
        document.addEventListener('webkitAnimationStart', handleErrors);
    };

    var closeNotification = function() {
        $notificationPinny.notify('close');
    };


    // Set usesDefault to true if errors are found in
    // #gwt-error-placement-div .gwt-csb-error-panel
    var init = function(useDefault) {
        initPinny();
        bindEvents();

        defaultErrorHandler();
    };

    return {
        init: init,
        triggerError: triggerError,
        triggerSuccessMessage: triggerSuccessMessage,
        triggerAddToCart: triggerAddToCart,
        closeNotification: closeNotification

    };
});
