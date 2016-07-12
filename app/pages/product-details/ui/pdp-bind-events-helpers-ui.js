define([
    '$',
    'translator',
    // Parsers

    // UI
    'pages/product-details/ui/add-to-cart-ui',
    'global/ui/wishlist-ui',
    'pages/product-details-bundle/ui/product-detail-widget-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    // Templates
], function($, Translator, AddToCartUI, WishlistUI,
    ProductDetailWidgetUI, BuildHelpersUI, HelpersUI) {

    // zoom image on zoom-toggle, not on image click
    var bindProductImage = function() {
        $('body').on('click', '.c-product-image__zoom-toggle', function(e) {
            e.preventDefault();

            $(this).siblings('.magnifik').find('img').click();
        });

        // Bind 360 view clicks.
        $('body').on('click', '.js-interactive-image', function(e) {
            var $image = $(this);
            var $desktopContainer = $('.js-desktop-pdp');
            var $widgetContainer = $image.parents('[data-widget-id]');
            var $interactiveThumbnail;
            var $interactiveImageContainer;
            var index = -1;

            if ($widgetContainer.length) {
                // We've clicked a video/360 that is in a widget.
                var widgetId = $widgetContainer.attr('data-widget-id');
                $interactiveImageContainer = $desktopContainer.find('#' + widgetId);
                index = $image.parents('.js-widget-container').find('.js-interactive-image').index($image);
            } else {
                // We've clicked a 360/video that isn't in a bundle widget.
                $interactiveImageContainer = $desktopContainer.find('.gwt-product-detail:first');
                index = $('.js-interactive-image').index($image);
            }

            // Find the desktop 360/video thumbnail and click it.
            $interactiveThumbnail = $interactiveImageContainer.find('.iwc-thumb-img[src*="alt_360"], .iwc-thumb-img[src*="alt_video"]').eq(index).parent();
            $interactiveThumbnail.triggerGWT('click');
        });

    };

    var bindThumbnails = function() {
        $('body').on('click', '.js-thumbnails', function(e) {
            e.preventDefault();

            var $selectedThumbnail = $(this);

            // give new image some time to load
            setTimeout(function() {
                var isWidget = !!$selectedThumbnail.parents('.js-widget-container').length;

                HelpersUI.updateMainImageSrc($selectedThumbnail, isWidget);
            }, 50);
        });
    };

    var resetPdpBuilderOptions = function(isLoaded) {
        var $productDetailWidgetPinny = $('.js-product-detail-widget-pinny');
        var $itemDesktopContainer = $('#' + $productDetailWidgetPinny.attr('data-widget-id'));
        BuildHelpersUI.buildPrice($('.js-pdp-price'), $itemDesktopContainer);

        if (!isLoaded) {
            BuildHelpersUI.buildProductOptions(
                $productDetailWidgetPinny.find('.js-product-options'),
                $itemDesktopContainer.find('.gwt-product-option-panel')
            );
        }
    };

    var bindSwatches = function() {
        $('body').on('click', '.js-swatches', function(e) {
            var $target = $(e.target);

            if ($target.is('.gwt-pdp-swatch-thumbnail-image')) {
                HelpersUI.updateProductImageCaption($target.attr('alt'));
            }
        });

        $(document).on('click', '.js-swatches .js-product-option', function(e) {
            // Change the first image of swatches as per desktop functionality
            var $clickedSwatch = $(this);
            var $heroCarousel = $('.js-product-hero-carousel > .c-carousel');
            var $firstCarouselItem = $heroCarousel.find('.c-carousel__item:eq(0) img');
            var dataBindId = $clickedSwatch.attr('data-bind-click');
            var imageSrc = $clickedSwatch.find('img').attr('src').replace('$wgcp', '$wfpm');

            var productImageSrc = $firstCarouselItem.attr('src');
            var selectedColor = $clickedSwatch.find('img').attr('color');

            if (selectedColor && productImageSrc !== undefined) {
                $heroCarousel.scooch('move', 1);
                productImageSrc = productImageSrc.replace(/\/\d+(\_.*)\?/.exec(productImageSrc)[1], '_' + $clickedSwatch.find('img').attr('color'));
                $firstCarouselItem.attr('src', productImageSrc);
                $firstCarouselItem.attr('href', productImageSrc);
            }

            $firstCarouselItem.parents('.js-product-option').attr('data-bind-click', dataBindId);
        });
    };

    var bindProductWidgetClick = function() {
        $('.js-product-tile[data-widget-id*="gwt"]').on('click', function(ev) {
            // This is requried to override default scroll happening due to anchor
            ev.preventDefault();
            ProductDetailWidgetUI.showProductDetailWidgetModal($(this));
        });
    };

    var bindClicks = function() {
        $('body').on('click', '.js-bind', function(e) {
            e.preventDefault();

            var $this = $(this);
            var bindId = $this.attr('data-bind-click');
            var $original = $('[data-bind-click="' + bindId + '"]');

            $original[$original.length - 1].dispatchEvent(new CustomEvent('click'));

            // sometimes the event handlers are on the inputs
            if ($original.siblings('input').length) {
                $original.siblings('input').click();
            }
            HelpersUI.updateMainImageSrc($original[$original.length - 1]);
        });
    };

    var bindProductImageOptionClick = function() {
        $('body').on('click', '.gwt-image-picker-option-image', function() {
            setTimeout(function() {
                HelpersUI.updateSwatchboxText();
            }, 1000);
        });
    };

    // Product thumbnails are loaded from scene7, intercept them and use them later
    // when building the product thumbnails.
    var bindS7JsonResponse = function() {
        var originalFn = window.s7jsonResponse;

        window._thumbnailSets = [];

        window.s7jsonResponse = function() {
            var imageSetText = arguments[0].IMAGE_SET;
            var productThumbnails = [];

            if (imageSetText.length) {
                var images = imageSetText.split(/[,;]/);
                $.each(images, function(index, image) {
                    if (productThumbnails.indexOf(image) < 0) {
                        productThumbnails.push(image);
                    }
                });
            }

            // Add new set.
            window._thumbnailSets.push(productThumbnails);
        };
    };

    var bindEvents = function(isLoaded) {
        bindClicks();

        if (!isLoaded) {
            bindProductWidgetClick();
            bindThumbnails();
            bindProductImage();
            WishlistUI.bindEvents();
            AddToCartUI.bindEvents();
        }
    };

    var bindCustomEvents = function() {
        $(document).on('addedToCart', function() {
            // Reset this if it is PDP #1 and PDP #2
            if ($('#gwt-bundle-det-insp-see-coll').length === 0) {
                HelpersUI.updateMainImageSrc(Adaptive.$('.iwc-main-img-wrapper'));
                BuildHelpersUI.buildProductHeroCarousel();
                BuildHelpersUI.buildPrice($('.js-pdp-price'), $('.gwt-product-detail-left-panel'));
            }
            HelpersUI.disableAddToCartWishlist($('.js-add-to-cart'), $('.js-add-to-wishlist'));

            // TODO: Move to Translator
            $('.js-color-text').text('Select...');
            $('.js-pdp-price-total').addClass('u--hide');

            bindEvents(true);

            // GRRD-701: Reset ATC flag
            window.Adaptive.atcReady = false;
        });
    };

    // This override will happen as soon as the file is required in.
    bindS7JsonResponse();

    return {
        bindEvents: bindEvents,
        bindCustomEvents: bindCustomEvents,
        bindProductImageOptionClick: bindProductImageOptionClick,
        resetPdpBuilderOptions: resetPdpBuilderOptions
    };
});
