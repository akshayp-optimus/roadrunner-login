define([
    '$',
    'global/baseView',
    'dust!pages/product-details/product-details',
    'global/utils',
    'global/utils/template-reader',
    'global/parsers/breadcrumb-parser',
    'pages/product-details/parsers/product-info-parser',
    'pages/product-details/parsers/product-tile-parser',
    'pages/product-details/parsers/product-share-parser',
    'global/parsers/related-searches-parser',
    'global/parsers/related-products',
    'descript'
],
function($, BaseView, template, Utils, JSONTemplate, Breadcrumb, ProductDetailParser, ProductTileParser, ProductShareParser,
    RelatedSearchesParser, globalRelatedProductsParser, Descript) {

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
                bellowsItemClass: 'c-additional-info' + tab.tabValueReferenceNumber,
                content: $content
            });
        });
    };

    var _getYouTubeEmbed = function($videoThumbnail) {
        var onclick = $videoThumbnail.find('[onclick]').attr('onclick');
        var videoID = onclick && onclick.match(/YouTube=([^']+)/);

        return videoID ?
            $('<iframe src="//youtube.com/embed/' + videoID[1] + '"></iframe>') : $();
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

                var $desktopDataContainer = $container.find('#gwt_productdetail_json').length ?
                    $container.find('#gwt_productdetail_json') :
                    $container.find('#gwt_bundledetail_json');

                var pdpJSON = JSONTemplate.parse($desktopDataContainer);
                var bundleJSON;

                if (pdpJSON.bundle) {
                    // PDP 2
                    bundleJSON = pdpJSON;
                    pdpJSON = pdpJSON.bundle[0];
                }

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
            // readMore: function(context) {
            //     return (context.hiddenData.container.pdpJSON.pageProduct.longDesc.text());
            // },
            productImage: function(context) {
                var bodyContent;
                var productJSON = context.hiddenData.JSONData;
                if (productJSON) {
                    var partNumber = productJSON.pageProduct.mfPartNumber;
                    var imgSuffix = '_main';
                    var imgSrc = Utils.getImageBaseUrl() + partNumber + imgSuffix + '?$wfis$';
                    return {
                        bodyContent: $('<img src="' + imgSrc + '" /></div>')
                    };
                } else {
                    return;
                }
            },
            productInfo: function(context) {
                var pdpJSON = context.hiddenData.JSONData;
                var bundleJSON = context.hiddenData.bundleData;
                var title;
                $('p:empty').remove();

                if (bundleJSON) {
                    title = bundleJSON.bundleName;
                }
                return {
                    title: title || ProductDetailParser.parseTitle(pdpJSON.pageProduct),
                    starRating: ProductDetailParser.parseRating(pdpJSON.pageProduct),
                    skuId: pdpJSON.pageProduct.mfPartNumber,
                    shortDesciption: pdpJSON.pageProduct.shortDesc,
                    readMore: $('<p/>').html($('<div/>').html(pdpJSON.pageProduct.longDesc).text()).text().trim(),
                };
            },
            detailsContent: function(context) {
                var $content = $('<div/>').html($('<div/>').html(
                        context.hiddenData.JSONData.pageProduct.longDesc
                    ).text());

                var $videoThumbnail = $content.find('.cin-media.cin-video').remove();
                if ($videoThumbnail.length > 0) {
                    $content.append(_getYouTubeEmbed($videoThumbnail));
                }

                return {
                    bodyContent: $content
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
                    class: 'js-product-bellows',
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

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
