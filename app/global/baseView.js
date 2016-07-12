define([
    '$',
    'resizeImages',
    'descript',
    'adaptivejs/utils',
    'adaptivejs/defaults',
    'settings',
    'global/includes/header/header-context',
    'global/includes/footer/footer-context',
    'global/includes/left-sidebar/left-sidebar-context',
    'dust!global/base',
    'text!../../static/icons/sprite.svg',
    'global/utils'
],
function($, ResizeImages, Descript, Utils, Defaults, Settings, header, footer, leftSidebar, baseTemplate, iconSprite, globalUtils) {
    var descript;

    /**
     * Grab the default cache breaker variable from the Mobify Config
     */
    if (ResizeImages && Settings) {
        ResizeImages.defaults.cacheBreaker = Settings.cacheBreaker;
    }

    /**
     *  Grabs the images which you would like to run through
     *  imageResizer and sends them away. Can be setup
     *  with more profiles for different types of images
     *  if needed.
     */
    var resizeImages = function() {
        var $imgs = $('img');
        var defaultOpts = {
            projectName: Defaults.projectName
        };

        ResizeImages.resize($imgs, defaultOpts);

        return $imgs;
    };

    var createMobileScripts = function() {
        $('.mobile-script').map(function(i, scriptContainer) {
            var $script = $('<script>');
            var $scriptContainer = $(scriptContainer);
            var src = $scriptContainer.attr('data-href') || $scriptContainer.attr('data-src');
            $script.attr('x-src', src);
            $scriptContainer.replaceWith($script);
        });
    };

    var createMobileStyles = function() {
        $('.mobile-style').each(function(i, styleContainer) {
            var $stylesheet = $('<link rel="stylesheet" type="text/css">');
            var $styleContainer = $(styleContainer);
            $stylesheet.attr('href', $styleContainer.attr('data-href'));
            $styleContainer.replaceWith($stylesheet);
        });

    };

    return {
        template: baseTemplate,
        includes: {
            header: header,
            footer: footer,
            leftSidebar: leftSidebar
        },
        /**
        * preProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * before keys in `context` are executed
        */
        preProcess: function(context) {
            createMobileStyles();
            createMobileScripts();
            $('#mobile-template').find('style, link[rel="stylesheet"]').addClass('js-leave');
            // An example of a DOM transform:
            $('head').find('meta[name="viewport"]').remove();
            $('style, link[rel="stylesheet"]').not('.js-leave').remove();

            // We need to remove the useDefaultKeyboard function definition,
            // Without descript so we can leave the function calls to useDefaultKeyboard in place
            // Overriden in postProcess
            $('head script:contains(useNonDefaultKeyboard)').remove();

            //GRRD-468: Remove elements with these classes at Grandin Road's request
            $('.hidden-xs, .hidden-mobile, .visible-sm, .visible-md, .visible-lg, .visible-desktop').not('.js-leave').remove();


            // Use Descript to manipulate the desktop scripts. Please see
            // https://github.com/mobify/descript for detailed documentation.
            // useNonDefaultKeyboard: needed for the register/sign in page. Used to create the sign in email input
            descript = Descript.init({preserve: {
                // src: /template-/,
                contains: ['new Date().getFullYear())', 'if(useNonDefaultKeyboard', 'isInternational', 'subcategories', '"pageProduct":', '"products":']
            }});


            descript.remove({
                contains: [
                    'className += "desktop"',
                    'display_source_code'
                ]
            });

            return context;
        },

        /**
        * postProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * after keys in `context` are executed
        */
        postProcess: function(context) {
            // Transforms should take place here rather then within `context`.

            // Uncomment the following line to use Mobify's image resizer:
            // resizeImages();

            // Add the current `t-template-name` class to the body
            var $body = $('body');
            $body.last().addClass('t-' + context.templateName);

            //GRRD-465: update body class per request from Grandin Road's team
            $body.attr('id', 'mobileBody');

            // The desktop site outputs email fields as either type=text or type=email
            // based on what useNonDefaultKeyboard returns, so we need to override it
            // to always be true and output type=email
            window.useNonDefaultKeyboard = function() {return true;};

            return context;
        },
        context: {
            templateName: 'base',
            html: function() {
                return $('html');
            },
            head: function() {
                return $('head');
            },
            body: function() {
                return $('body');
            },
            responsiveContent: function() {
                var $content = $('#mobile-template').filter('[data-type="content"]');
                globalUtils.swapImages($content);

                return $content;
            },
            desktopScripts: function() {
                return descript.get('default');
            },
            deferredScripts: function() {
                try {
                    return descript.get('defer');
                } catch (e) {
                    return;
                }
            },
            waterMark: function() {
                return $('#environment-watermark');
            },
            hiddenForms: function() {
                return $('form[class="hidden"]');
            },
            perzContentBoxg1: function() {
                return $('#perzContentBoxg1');
            },
            perzContentBoxg2: function() {
                return $('#perzContentBoxg2');
            },
            hiddenViewForm: function() {
                return $('#gwt_view_name').parent();
            },
            iconSprite: iconSprite,
            mobileTemplateStyles: function() {
                // FRGT-315: Preserve styles for the #mobile-template div but move them to the head tag
                return $('style, link[rel="stylesheet"]').filter('.js-leave').remove();
            },
            sourceCode: function() {
                return $('#display_source_code');
            }
        }
    };

});
