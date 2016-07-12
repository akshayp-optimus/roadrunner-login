define([
    '$',
    'global/utils',
    'bellows',
    'components/sheet/sheet-ui',
    // Templates
    'dust!pages/product-details-bundle/partials/product-widget-popup',
    // UI
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    'translator',
    'magnifik'
], function($, Utils, bellows, sheet,
    // Templates
    ProductWidgetPopupTmpl,
    // UI
    BuildHelpersUI,
    HelpersUI,
    translator,
    magnifik
) {

    var $productDetailWidgetPinny = $('.js-product-detail-widget-pinny');

    // Product Info - Title
    var _getProductInfo = function($itemDesktopContainer) {
        return {
            title: $itemDesktopContainer.find('.gwt-product-title-panel h3').text(),
            shortDesciption: $itemDesktopContainer.find('.gwt-product-detail-bold-label').text(),
            skuId: $itemDesktopContainer.find('.gwt-product-part-number-panel').text()
        };
    };

    var _getBellows = function($itemDesktopContainer) {
        var _items = $itemDesktopContainer.find('.gwt-accordion-tab').map(function(_, tab) {
            var $tab = $(tab);
            $tab.find('.gwt-accordion-tab-content a').addClass('needsclick');
            return {
                sectionTitle: $tab.find('.gwt-header .gwt-HTML').text(),
                content: $tab.find('.gwt-accordion-tab-content')
            };
        });

        return {
            class: 'js-product-bellows c-product-bellows js-widget-bellows',
            items: _items
        };
    };

    var _getProductTabs = function($itemDesktopContainer) {
        return {
            bellows: _getBellows($itemDesktopContainer)
        };
    };

    var _showProductDetailWidgetModal = function($widgetContainer) {
        var title = '< Collection';
        var $itemDesktopContainer = $('#' + $widgetContainer.attr('data-widget-id'));
        $productDetailWidgetPinny.attr('data-widget-id', $widgetContainer.attr('data-widget-id'));
        var data = {
            widgetContent: {
                title: '< Collection',
                productInfo: _getProductInfo($itemDesktopContainer),
                productTabs: _getProductTabs($itemDesktopContainer),
                atcBtnText: $itemDesktopContainer.find('#gwt-add-to-cart-btn').text()
            }
        };
        $productDetailWidgetPinny.find('.c-sheet__title').addClass('pinny__close').html(title);

        new ProductWidgetPopupTmpl(data, function(err, html) {
            $productDetailWidgetPinny.find('.js-product-detail-widget-pinny__body').html(html);
        });

        BuildHelpersUI.buildPrice($('.js-pdp-price'), $itemDesktopContainer);
        BuildHelpersUI.buildProductImages(
            false, $productDetailWidgetPinny.find('.js-product-image'), $itemDesktopContainer, true
        );

        BuildHelpersUI.buildProductOptions(
            $productDetailWidgetPinny.find('.js-product-options-container'),
            $itemDesktopContainer
        );

        $('.bellows').bellows();
        // Updates Svg's
        HelpersUI.initBellows();

        $productDetailWidgetPinny.pinny('open');

        $('.js-product-hero-carousel img').on('error', function() {
            var $image = $(this);
            var imageSrc = $image.attr('src');
            var match = imageSrc.match(/\/\d+_(\w*)/i);

            if (match) {
                $image.attr('src', imageSrc.replace(match[1], 'main'));
            }
        });
    };

    var _initSheet = function() {
        sheet.init($productDetailWidgetPinny, {
            shade: {
                cssClass: 'js-product-detail-widget-shade'
            },
            coverage: '100%',
            appendTo: '.js-widget-container',
            opened: function() {
                $('.magnifik').magnifik();
                $('html').removeAttr('style');
            },
            close: function() {
                $('.c-cart-container')
                    .append(jQuery('.js-cart-toggle')
                    .find('svg')
                    .remove()
                    .end()
                    .append('<svg class="c-icon " data-fallback="img/png/cart.png"> <title>cart</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use></svg>'));
            }
        });
    };

    return {
        initSheet: _initSheet,
        showProductDetailWidgetModal: _showProductDetailWidgetModal,
    };
});
