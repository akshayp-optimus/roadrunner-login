define([
    '$',
    'global/baseView',
    'dust!pages/sign-in/sign-in',
    'pages/sign-in/parsers/sign-in__sign-in',
    'pages/sign-in/parsers/sign-in__register',
    'dust!pages/sign-in/partials/sign-in__sign-in',
    'dust!pages/sign-in/partials/sign-in__register',
    'translator'
],
function($, BaseView, template, signInParser, registerParser, signInTemplate, registerTemplate, Translator) {

    var getLoginSection = function() {
        var $loginInForm = $('#userLogonForm');
        var $content;
        var data = signInParser.parse($loginInForm);

        signInTemplate(data, function(err, html) {
            $content = $(html);
        });

        return {
            title: Translator.translate('sign_in'),
            subtitle: Translator.translate('sign_in_subtitle'),
            content: $content
        };
    };

    var getRegsiterSection = function() {
        var $registerForm = $('#userLogonRegistration');
        var $content;
        var data = registerParser.parse($registerForm);

        registerTemplate(data, function(err, html) {
            $content = $(html);
        });

        return {
            title: Translator.translate('register'),
            subtitle: Translator.translate('register_subtitle'),
            content: $content
        };
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'sign-in',
            errorContainer: function() {
                return $('#gwt-error-placement-div');
            },
            signInTabs: function() {
                var tabs = [];

                tabs.push(getLoginSection());
                tabs.push(getRegsiterSection());

                return {
                    tabs: tabs
                };
            }
        }
    };
});
