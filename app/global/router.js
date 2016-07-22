define([
    '$',
    'adaptivejs/router',
    'pages/home/home-view',
    'pages/responsive-content/responsive-content-view',
    'pages/email-subscription/email-subscription-view',
    'pages/email-subscription-form/email-subscription-form-view',
    'pages/sign-in/sign-in-view',
    'pages/register/register-view',
    'pages/account-information/account-information-view',
    'pages/product-list/product-list-view',
    'pages/product-list-2/product-list-2-view',
    'pages/clp/clp-view',
    'pages/clp-david-bromstad/clp-david-bromstad-view',
    'pages/clp-sale/clp-sale-view',
    'pages/plp-br-seo/plp-br-seo-view',
    'pages/product-details/product-details-view',
    'pages/product-details-bundle/product-details-bundle-view',
    'pages/write-a-review/write-a-review-view',
    'pages/cart/cart-view',
    'pages/checkout-sign-in/checkout-sign-in-view',
    'pages/checkout-gift-options/checkout-gift-options-view',
    'pages/shipping-address/shipping-address-view',
    'pages/checkout-multi-address/checkout-multi-address-view',
    'pages/order-review-and-payment/order-review-and-payment-view',
    'pages/order-confirmation/order-confirmation-view',
    'pages/confirmation-details/confirmation-details-view',
    'pages/my-account-landing/my-account-landing-view',
    'pages/change-email-address/change-email-address-view',
    'pages/change-password/change-password-view',
    'pages/address-book/address-book-view',
    'pages/account-cc-edit/account-cc-edit-view',
    'pages/account-cc-info/account-cc-info-view',
    'pages/email-un-subscription/email-un-subscription-view',
    'pages/contact-us/contact-us-view',
    'pages/order-status/order-status-view',
    'pages/terms/terms-view',
    'pages/returns-exchanges/returns-exchanges-view',
    'pages/privacy-policy/privacy-policy-view',
    'pages/shipping-information/shipping-information-view',
    'pages/order-detail/order-detail-view',
    'pages/order-information/order-information-view',
    'pages/retail-stores/retail-stores-view',
    'pages/customer-service/customer-service-view',
    'pages/international-customer-service/international-customer-service-view',
    'pages/international-privacy-rights/international-privacy-rights-view',
    'pages/gift-cards/gift-cards-view',
    'pages/international-faq/international-faq-view',
    'pages/gift-services/gift-services-view',
    'pages/international-returns/international-returns-view',
    'pages/order-history/order-history-view',
    'pages/email-form-page/email-form-page-view',
    'pages/contact-us-confirmation/contact-us-confirmation-view',
    'pages/international-checkout/international-checkout-view',
    'pages/wishlist/wishlist-view',
    'pages/view-wishlist/view-wishlist-view',
    'pages/gift-registry-landing/gift-registry-landing-view',
    'pages/gift-registry-create/gift-registry-create-view',
    'pages/gift-registry-manage/gift-registry-manage-view',
    'pages/gift-registry-find/gift-registry-find-view',
    'pages/account-login/account-login-view',
    'pages/my-account-information/my-account-information-view'

],
function($, Router, Home, ResponsiveContent, EmailSubscription, EmailSubscriptionForm, SignIn, Register, AccountInformation, ProductList,
    ProductList2, CategoryLanding, CategoryLandingDavidBromstad, CategoryLandingSale, plpBrSeo, ProductDetails,
    ProductDetailsBundle, WriteAReview, Cart, CheckoutSignIn, CheckoutGiftOptions, ShippingAddress, CheckoutMultiAddress,
    OrderReviewAndPayment, OrderConfirmation, ConfirmationDetails, MyAccountlanding, ChangeEmailAddress, ChangePassword, AddressBook, AccountCreditCardEdit,
    AccountCreditCardInfo, EmailUnsubscribe, ContactUs, OrderStatus, Terms, ReturnsExchanges, PrivacyPolicy, ShippingInformation,
    OrderDetail, OrderInformation, RetailStores, CustomerService, InternationalCustomerService, InternationalPrivacyRights, Giftcards, InternationalFaq, GiftServices, InternationalReturns, OrderHistory, EmailFormPage, ContactUsConfirmation,
    InternationalCheckout, Wishlist, ViewWishlist, GiftRegistryLanding, GiftRegistryCreate, GiftRegistryManageView, GiftRegistryFind, accountLogin, myAccountInformation) {

    var router = new Router();

    router
        .add(Router.selectorMatch('#homepage'), Home)
        .add(Router.selectorMatch('#mobile-template:not([data-type="content"])'), ResponsiveContent)
        .add(Router.selectorMatch('.view-CheckoutUserLogonView'), CheckoutSignIn)
        .add(Router.urlMatch('/EmailSubscribeView'), EmailSubscription)
        .add(Router.urlMatch('pages.grandinroad-email.com'), EmailSubscriptionForm)
        .add(Router.selectorMatch('.view-SLIBodyView'), ProductList)
        .add(Router.selectorMatch('#gwt_bundledetail_json'), ProductDetailsBundle)
        .add(Router.selectorMatch('.view-ProductDetailView'), ProductDetails)
        .add(Router.urlMatch('/grand-finale-outlet'), CategoryLandingSale)
        .add(Router.selectorMatch('h1[title="Sign In/Register"]'), SignIn)
        .add(Router.selectorMatch('#userRegistrationForm'), Register)
        .add(Router.selectorMatch('.view-AccountInformationView'), AccountInformation)
        .add(Router.selectorMatch('#changepageSizeForm'), ProductList2)
        .add(Router.selectorMatch('#category'), CategoryLanding)
        .add(Router.selectorMatch('#Bromstad_wrapper.module-headline'), CategoryLandingDavidBromstad)
        .add(Router.selectorMatch('.view-BRThematicView'), plpBrSeo)
        .add(Router.selectorMatch('#BVSubmissionContainer'), WriteAReview)
        .add(Router.selectorMatch('.view-ShoppingCartView'), Cart)
        .add(Router.selectorMatch('.giftWrapSubHeader'), CheckoutGiftOptions)
        .add(Router.selectorMatch('.view-BillingShippingAddressDisplayView'), ShippingAddress)
        .add(Router.selectorMatch('.view-MultipleShippingAddressDisplayView'), CheckoutMultiAddress)
        .add(Router.selectorMatch('.view-OrderReviewDisplayView'), OrderReviewAndPayment)
        .add(Router.selectorMatch('.view-OrderConfirmationView'), OrderConfirmation)
        .add(Router.selectorMatch('.view-OrderConfirmationDisplayView'), ConfirmationDetails)
        .add(Router.urlMatch('/AccountOverView'), MyAccountlanding)
        // TODO: check if URL could be replaced through selector match/function match
        .add(Router.selectorMatch('#changeEmailForm'), ChangeEmailAddress)
        .add(Router.selectorMatch('#changePasswordForm'), ChangePassword)
        .add(Router.urlMatch('/AddressBookView'), AddressBook)
        .add(Router.selectorMatch('.view-CreditCardEditView'), AccountCreditCardEdit)
        .add(Router.selectorMatch('.view-CreditCardView'), AccountCreditCardInfo)
        .add(Router.selectorMatch('.emailUnsubscribeIframe'), EmailUnsubscribe)
        .add(function() {
            var regex = new RegExp('store-locs|WCM_STORE_LOCS', 'i');

            return regex.test(window.location.href);
        }, RetailStores)
        .add(Router.urlMatch('/wcs/stores/servlet/WCMContentView'), ContactUs)
        .add(Router.urlMatch('/contact-us/content'), ContactUs)
        .add(Router.selectorMatch('#orderStatusForm'), OrderStatus)
        .add(Router.urlMatch('/conditions-of-use/'), Terms)
        .add(Router.urlMatch('/returns-and-exchgs/'), ReturnsExchanges)
        .add(Router.urlMatch('/privacy-rights/'), PrivacyPolicy)
        .add(Router.urlMatch('/shipping/content'), ShippingInformation)
        .add(Router.selectorMatch('.orderDetailsUtil'), OrderDetail)
        .add(Router.urlMatch('/how-to-order'), OrderInformation)
        .add(Router.urlMatch('/customer-service/content'), CustomerService)
        .add(Router.urlMatch('/about-us/content'), CustomerService)
        .add(Router.urlMatch('/intl-cs/content'), InternationalCustomerService)
        .add(Router.urlMatch('/intl-your-privacy-right/content'), InternationalPrivacyRights)
        .add(Router.urlMatch('/Global/GiftCards/landing-path'), Giftcards)
        .add(Router.urlMatch('/intl-faqs/content'), InternationalFaq)
        .add(Router.urlMatch('/gift-services/content'), GiftServices)
        .add(Router.urlMatch('/intl-returns/content'), InternationalReturns)
        .add(Router.selectorMatch('#orderHistory'), OrderHistory)
        .add(Router.urlMatch('/CustomerServiceFormView'), EmailFormPage)
        .add(Router.urlMatch('/ConfirmationView'), ContactUsConfirmation)
        .add(Router.selectorMatch('#envoyId'), InternationalCheckout)
        .add(Router.selectorMatch('#wishListItemsForm'), ViewWishlist)
        .add(Router.selectorMatch('.view-WishListHomeView'), Wishlist)
        .add(Router.selectorMatch('.view-GiftRegistryStaticViewView, .view-GiftRegistryVisitView'), GiftRegistryManageView)

        .add(Router.selectorMatch('.gift-registry-home-leftWCMM'), GiftRegistryLanding)
        .add(Router.selectorMatch('#gwt_gift_registry_create'), GiftRegistryCreate)
        .add(Router.selectorMatch('.view-GiftRegistrySearchView'), GiftRegistryFind)
        .add(Router.selectorMatch('#login_container'), accountLogin)
        // .add(Router.urlMatch('/my-account'), myAccountInformation);

        .add(Router.selectorMatch('.regform_indent'), myAccountInformation);

        // .add(Router.selectorMatch('.view-GiftRegistryVisitView'), GiftRegistryView);

    return router;
});
