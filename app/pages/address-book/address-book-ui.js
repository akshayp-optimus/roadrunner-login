define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'global/ui/address-modal-ui',
    'global/ui/handle-form-fields'
// TODO: AddressModal should be in camel case and name should be addressModalUI
], function($, Utils, DomOverride, AddressModal, handleFormFieldsUI) {

    var transformAddressBook = function() {
        var $container = $('#gwt_address_display_panel');
        $container.find('.gwt-addrbk-addrmessage').insertBefore('.gwt-addrbk-addrlist');
        $container.find('.gwt-HTML').addClass('c-no-adddress-defined');
        $container.find('.gwt-addrbk-addrmessage').addClass('u-text-success u-margin-bottom-md u-text-align-start u--bold');
        $container.find('.gwt-addrbk-addritempanel').addClass('u-padding-bottom-0 u-margin-bottom-sm');
        $container.find('.gwt-addrbk-billshipind-off').remove();
        $container.find('.gwt-addrbk-addritem-btnpanel').addClass('c-edit-and-remove-links u-margin-bottom-sm');
        $container.find('.gwt-addrbk-addritem-btnpanel button').addClass('c-button c--link c--edit-link c--no-padding');
        $container.find('.gwt-addrbk-addritem-btnpanel button + button').addClass('u-margin-start-sm');
        $container.find('.gwt-addrbk-addrpanel').addClass('u-border-grey u-no-bottom-padding u-padding-all u--tight c-address-panel u-margin-top-0');
        $container.find('.gwt-addrbk-billshipindpanel').addClass('c-shipping-and-billing-tag');
        $container.find('.gwt-addrbk-billshipindpanel').addClass('c-shipping-and-billing-tag');
        $container.find('.gwt-addrbk-billshipind span').removeAttr('style');
        $container.find('.gwt-addrbk-billshipind.gwt-addrbk-billshipind-on').addClass('u-margin-bottom-sm');
        $container.find('.gwt-addrbk-billshipind-on').each(function(i, tag) {
            var $tag = $(tag);
            $tag.addClass('c-tag c--dark-grey c--large u-margin-end-tn');
            $tag.closest('.gwt-addrbk-addritempanel').prepend($tag.parent());
        });

        // Replacing &nbsp so as to match mock
        $container.find('.gwt-addrbk-billshipindpanel').each(function(i, itm) {
            var $itm = $(itm);
            $itm.html($itm.html().replace(/&nbsp;/g, ''));
        });

        $container.find('.gwt-addrbk-addritempanel').map(function(i, links) {
            var $links = $(links);
            var $addressPanel = $links.find('.gwt-addrbk-addrpanel');
            $links.find('.gwt-addrbk-addritem-btnpanel').insertBefore($addressPanel);
        });

        // the decoration needs to happen after domAppend function is finished
        // since we're hooking onto the btn panel itself, it's not ready for the DOM yet
        setTimeout(function() {
            $container.find('.gwt-addrbk-btnpanel button').addClass('c-button c--primary c--full-width c--primary u-margin-start-lg c-add-new-address-button u-margin-end-0 c--full-width u-margin-bottom-md');
        }, 10);
    };

    var _nodeInserted = function() {
        if (event.animationName === 'editAddress') {
            var $editAddressModal = $('#editAddressModal');
            var $addAddressModal = $('#addAddressModal');

            if ($editAddressModal.length) {
                AddressModal.showModal($editAddressModal);
            } else if ($addAddressModal.length) {
                AddressModal.showModal($addAddressModal);
            }
            // Update placeholders in inputs
            handleFormFieldsUI.updatePlaceholder();
        }
    };

    var _removeAddress = function() {
        if (event.animationName === 'modalAdded') {
            var $removeAddressModal = $('#gwt-removeConfirmDlog-content_modal');
            if ($removeAddressModal.length) {
                AddressModal.showRemoveAddressModal($removeAddressModal);
            }
        }
    };

    var handleErrors = function() {
        if (event.animationName === 'errorAdded' && !$('.gwt_confirmation_div').length) {
            var $errorElements = $('.errortxt');
            $errorElements.parents('.c-box-row').addClass('c--error-row');
        }
    };

    var defaultErrorHandler = function() {
        document.addEventListener('animationStart', handleErrors);
        document.addEventListener('webkitAnimationStart', handleErrors);
    };


    var addressBookUI = function() {
        AddressModal.initSheet();
        DomOverride.on('domAppend', '', transformAddressBook, '.gwt-addrbk-btnpanel');

        document.addEventListener('animationStart', _nodeInserted);
        document.addEventListener('webkitAnimationStart', _nodeInserted);

        document.addEventListener('animationStart', _removeAddress);
        document.addEventListener('webkitAnimationStart', _removeAddress);

        defaultErrorHandler();
    };

    return addressBookUI;
});
