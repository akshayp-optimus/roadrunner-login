define([
    '$',
    'global/utils',
    'global/ui/tooltip-ui',
    'global/ui/cart-item-ui',
    'global/ui/promo-code-ui',
    'global/ui/carousel-ui',
    'components/sheet/sheet-ui'

], function($, utils, tooltipUI, cartItemUI, promoCodeUI, carouselUI, Sheet) {

    // Display all products of 'You may like' section in carousel
    var changeNumberOfImagesInCarousel = function() {
        /*eslint-disable*/
        gwt_recommendations_espots_category_1_JSON.num_visible =
            gwt_recommendations_espots_category_1_JSON.num_recommendations;
        /*eslint-enable*/
    };

    var handleStepperButtonVisibility = function($stepper, count) {
        $stepper.find('button').removeClass('c--disabled');
        if (count > 1 && count < 20) {
            $stepper.find('button').removeClass('c--disabled');
        } else if (count <= 1) {
            $stepper.find('.js-stepper-decrease').addClass('c--disabled');
        } else {
            $stepper.find('.js-stepper-increase').addClass('c--disabled');
        }
    };

    var bindQuantityDropdown = function() {
        $('.js-dropdown').on('change', function() {
            var $this = $(this);
            var count = $this.val();
            var $stepper = $this.closest('.c-stepper');
            var $count = $stepper.find('.js-stepper-count');
            var $desktopQuantitySelect = $stepper.find('.csb-quantity-listbox:first');
            $count.html(count);
            $desktopQuantitySelect.val(count);
            handleStepperButtonVisibility($stepper, count);
            $desktopQuantitySelect[0].dispatchEvent(new CustomEvent('change'));
        });
    };

    var bindStepper = function() {
        $('body').on('click', '.js-stepper-decrease, .js-stepper-increase', function(e) {
            e.preventDefault();

            var $this = $(this);
            var $stepper = $this.closest('.c-stepper');
            var $count = $stepper.find('.js-stepper-count');
            var count = parseInt($count.text());
            var $desktopQuantitySelect = $stepper.find('.csb-quantity-listbox:first');
            var $customQtySelect = $stepper.find('.js-dropdown');
            var highestCount = $desktopQuantitySelect.find('option:last-child').text();
            if ($this.hasClass('js-stepper-decrease')) {
                count--;
                if (count < 1) {
                    count = 1;
                }
            } else {
                count++;
                if (count > highestCount) {
                    count = highestCount;
                }
            }

            $count.html(count);
            $customQtySelect.val(count);

            handleStepperButtonVisibility($stepper, count);
            // update desktop div
            // need to use window dispatch event to trigger prototype events
            $desktopQuantitySelect.val(count);
            $desktopQuantitySelect[0].dispatchEvent(new CustomEvent('change'));
        });
    };



    var cartUI = function() {
        promoCodeUI.init();
        cartItemUI();
        tooltipUI();
        bindStepper();
        bindQuantityDropdown();
        carouselUI.init($('#gwt_recommendations_cart_1'));
    };

    return cartUI;
});
