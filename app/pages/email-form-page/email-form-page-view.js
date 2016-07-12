define([
    '$',
    'global/baseView',
    'dust!pages/email-form-page/email-form-page',
    'components/breadcrumb/parsers/breadcrumb'

],
function($, BaseView, template, breadcrumbParser) {

    var _parseForm = function($form) {

        $form.find('.spot').addClass('c-box c-arrange c--align-middle');
        $form.find('.spot label').addClass('c-field__label c-box__label');
        $form.find('.spot select').wrap('<div class="c-select" />');
        $form.find('input').wrap('<div class="c-input c-arrange__item"></div>');
        // $form.find('.primary').closest('div').removeClass('c-box-row');

        $form.find('#recieve_brand_email').removeClass('c-field__label c-box__label');
        $form.find('#quest_or_comm').closest('div').removeClass('c-box c-arrange c--align-middle');
        $form.find('#quest_or_comm').removeClass('c-field__label c-box__label');


        var $middleInitial = $form.find('#middleInitial').closest('.spot').addClass('c-box c--shrink').removeClass('c-arrange c--align-middle');
        $form.find('#middle_initial').addClass('u--hide');
        $middleInitial.find('label').text('Middle Initial');

        $('#email_address').text('Email');
        $('#email_address').prepend('<span class="u-text-error">*</span>');
        $('#phone_number').text('Phone');
        $('#phone_number').prepend('<span class="u-text-error">*</span>');
        $('#order_number').text('Order#');

        $('.family-name').attr('placeholder', 'Last name');
        $('.given-name').attr('placeholder', 'First name');
        $('.given-name').attr('placeholder', 'First name');
        $('#emailAddress').attr('placeholder', 'Your Email Address');
        $('#emailAddress').attr('type', 'email');
        $('#phoneNumber').attr('placeholder', 'Phone Number');
        $('#orderNumber').attr('placeholder', 'Order number');
        $('#zipCode').attr('placeholder', 'Zip code');
        $('#middleInitial').attr('placeholder', 'MI');
        $('#zipCode').attr('type', 'tel');


        return {
            formWrapper: $form,
            formInputs: $form.find('input[type="hidden"]'),
            firstName: $form.find('#firstName').closest('.spot').removeClass('c-arrange c--align-middle'),
            middleInitial: $middleInitial,
            lastName: $form.find('#lastName').closest('.spot'),
            email: $form.find('#email_address').closest('.spot'),
            topic: {
                label: $form.find('#topic_selection_label').addClass('c-arrange__item c--shrink'),
                select: $form.find('#topic')
            },
            phone: $form.find('#phoneNumber').closest('.spot'),
            auxLabel: $form.find('.auxLabel').addClass('c-aux-text u--normal'),
            order: $form.find('#orderNumber').closest('.spot'),
            zipCode: $form.find('#zipCode').closest('.spot'),
            country: $form.find('#gwt_countrySpot'),
            question: $form.find('#unencoded_questOrComm').closest('.spot'),
            signUpEmails: $form.find('#recieve_brand_email').closest('.spot'),
            submitButton: $form.find('.button.primary').addClass('c-continue-button c-button c--primary c--full-width')
        };
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'email-form-page',
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#sideBox li#sideBoxHeader'));
            },
            pageTitle: function() {
                return $('.data').find('h2').text();
            },
            form: function() {
                var $form = $('#customerServiceForm');

                return _parseForm($form);
            }
        }
    };
});
