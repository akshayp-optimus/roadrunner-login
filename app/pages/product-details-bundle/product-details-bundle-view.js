define([
    '$',
    'global/baseView',
    'dust!pages/product-details-bundle/product-details-bundle',
    'global/utils',
    'global/utils/template-reader',
    'global/parsers/breadcrumb-parser',
    'pages/product-details/parsers/product-info-parser',
    'pages/product-details/parsers/product-tile-parser',
    'pages/product-details/parsers/product-share-parser',
    'global/parsers/related-searches-parser',
    'dust!components/loading/loading',
    'global/parsers/related-products',
    'descript'
],
function($, BaseView, template, Utils, JSONTemplate, Breadcrumb, ProductDetailParser,
    ProductTileParser, ProductShareParser, RelatedSearchesParser, loadingTmpl, globalRelatedProductsParser, Descript) {

    var sortByAscending = function($objects, field) {
        return $objects.sort(function(a, b) {
            return parseFloat(a[field]) - parseFloat(b[field]);
        });
    };

    var bulidTabNameDictionary = function(pdpJSON) {
        var tabNames = {};
        // build tab name dictionary from JSON data
        $(pdpJSON.pageProduct.productAdditionalInfoTabs).filter(function() {
            return !!(this.tabName);
        }).each(function() {
            var tab = this;
            var id = tab.tabIdentifier.replace(/Tab Name/, 'Tab');
            tabNames[id] = tab.tabName;
        });

        return tabNames;
    };

    var _updateMeasurementImg = function($tabContent) {
        var $popupLink = $tabContent.find('a');
        var newImage = $popupLink.attr('data-mobify-src');

        if (newImage) {
            var oldImageMatch = /'(\/.*\.gif)'/.exec($popupLink.attr('onclick'));
            if (oldImageMatch) {
                var newOnClick = $popupLink.attr('onclick').replace(oldImageMatch[1], newImage);
                $popupLink.attr('onclick', newOnClick);
            }
        }

    };

    var _decorateTabContents = function($tabContent) {
        if (!$tabContent.length) {
            return;
        }

        if ($tabContent.find('[onclick*="popups/measure"]').length) {
            _updateMeasurementImg($tabContent);
        }

        $tabContent.find('ul:not(.moreinfo-tab)').addClass('c-list-bullets');
        $tabContent.find('a').addClass('needsclick');
        $tabContent.find('[href="#"]').removeAttr('href');
        $tabContent.find('br').remove();

        $tabContent.contents().filter(function() {
            return this.nodeType === 3;
        }).wrap('<p>');
    };

    var _appendTabItemsToBellows = function(_items, pdpJSON, tabNameDictionary) {
        // parse tab items into bellows items
        $(pdpJSON.pageProduct.productAdditionalInfoTabs).filter(function() {
            return !!(this.tabHtmlValue);
        }).each(function() {
            var tab = this;
            var $content = $('<div>');
            $content.html($('<div/>').html(tab.tabHtmlValue).text());

            _decorateTabContents($content);

            _items.push({
                sectionTitle: tabNameDictionary[tab.tabIdentifier],
                content: $content
            });
        });
    };

    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }
        },

        context: {
            templateName: 'product-details',
            hiddenData: function() {
                var $container = $('<div>');
                var $hiddenForm = $('form.hidden').remove();
                var $hiddenInputs = $('input[type="hidden"]');

                $container
                    .append($('.view-ProductDetailView #content'))
                    .append($hiddenInputs)
                    .append($hiddenForm);

                var $desktopDataContainer = $container.find('#gwt_bundledetail_json');


                var bundleJSON = JSONTemplate.parse($desktopDataContainer);
                var pdpJSON = bundleJSON.bundle[0];

                return {
                    container: $container,
                    pdp: $desktopDataContainer.remove(),
                    // used for other parsers below
                    JSONData: pdpJSON,
                    bundleData: bundleJSON
                };
            },
            breadcrumbs: function(context) {
                return {
                    breadcrumbLink: Breadcrumb.parseTranslated(context.hiddenData.container.find('#breadcrumbs_ul'))
                };
            },
            productImage: function(context) {
                var bundleJSON = context.hiddenData.bundleData;
                var $productMainImages = $('<div class="js-product-image c-main-image">');

                // Build all main image
                var partNumber = bundleJSON.bundleMfPartNumber;
                var imgSuffix = bundleJSON.xImages[0].imageSuffix;
                var imgBaseUrl = Utils.getImageBaseUrl() + partNumber;

                var image = bundleJSON.xImages[0];
                var imgSrc =  imgBaseUrl + image.imageSuffix;
                var $img = $('<img>')
                    .attr('src', imgSrc)
                    .attr('data-zoom-src', imgSrc + '?$wfih$');
                $productMainImages.append($img);

                return {
                    bodyContent: $productMainImages
                };
            },
            productInfo: function(context) {
                var pdpJSON = context.hiddenData.JSONData;
                var bundleJSON = context.hiddenData.bundleData;
                var title;

                if (bundleJSON) {
                    title = bundleJSON.bundleName;
                }
                return {
                    title: title || ProductDetailParser.parseTitle(pdpJSON.pageProduct),
                    starRating: ProductDetailParser.parseRating(pdpJSON.pageProduct),
                    shortDesciption: pdpJSON.pageProduct.shortDesc,
                    readMore: $('<p/>').html($('<div/>').html(pdpJSON.pageProduct.longDesc).text()).text().trim()
                };
            },
            detailsContent: function(context) {
                return {
                    bodyContent: $('<div/>').html($('<div/>').html(
                        context.hiddenData.JSONData.pageProduct.longDesc
                    ).text())
                };
            },
            productTabs: function(context) {
                var pdpJSON = context.hiddenData.JSONData;
                var _items = [];

                var tabNames = bulidTabNameDictionary(pdpJSON);

                _appendTabItemsToBellows(_items, pdpJSON, tabNames);

                _items.push({
                    sectionTitle: $('<div class="js-review-head">Product Reviews</div>'),
                    bellowsItemClass: 'js-reviews-bellows'
                });

                _items.push({
                    sectionTitle: $('<div class="js-qa-head">Product Q&A</div>'),
                    bellowsItemClass: 'js-qa-bellows'
                });

                // Append Social share icons in Bellows
                _items.push({
                    sectionTitle: 'Share',
                    content: context.hiddenData.container.find('#bundle-det-insp-iconbar').addClass('c-social-link-share').removeClass('nodisplay')
                });

                var _bellows = {
                    class: 'js-product-bellows c-product-bellows',
                    items: _items
                };

                return {
                    bellows: _bellows
                };
            },
            recentlyViewedProducts: function(context) {
                var $dataSourceContainer = context.hiddenData.container.find('#gwt_recently_viewed');
                if (!$dataSourceContainer.length) {
                    return;
                }
                var currencyConversion = context.hiddenData.container.find('#gwt_international_conversion_rate').val();
                var JSONData = JSONTemplate.parse($dataSourceContainer);

                if (!JSONData || !JSONData.products) {
                    return;
                }

                var parsedProducts = JSONData.products.map(function(product, _) {
                    return ProductTileParser.parseFromJSON(product, currencyConversion);
                });

                var scrollerData = {
                    slideshow: {
                        productTiles: parsedProducts
                    }
                };

                return scrollerData;
            },
            tellAFriendContainer: function() {
                return $('<div class="js-taf-content c-taf-content">');
            },
            moreInformationContainer: function() {
                return $('<div class="js-more-information-content">');
            },
            personalizationContainer: function() {
                return $('<div class="js-personalization-content c-personalization-content">');
            },
            suggestions: function(context) {
                return RelatedSearchesParser.parse(context.hiddenData.container.find('#br-related-searches-widget'));
            },
            isRelatedProductsExist: function(context) {
                return context.hiddenData.container.find('.br-found-heading').length > 0 ? true : false;
            },
            relatedProductsSection: function(context) {
                return {
                    heading: context.hiddenData.container.find('.br-found-heading').text(),
                    relatedProducts: globalRelatedProductsParser.parse(context.hiddenData.container.find('#br_related_products'))
                };
            }
        }
    };
});
