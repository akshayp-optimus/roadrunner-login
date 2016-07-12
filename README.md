#BV Reviews

##Implementation Refactor
Previously, the reviews and Q&A implementation here was just pulling in the desktop container as a whole, then styling on top of that. After this refactor, we’ll be parsing out all the reviews and Q&A content, resulting in much cleaner code and new additional functionality / a much better look as we’ll have complete control of the markup now. 

##Hook to access reviews markup
Take a look at the product-details-ui.js file. Look for the bindBVModuleLoad function. This is where our hook in point for capturing the bazaar voice reviews markup as they come in. We’re creating a hook within the window.$BV.Internal.define function, and looking for an injection module where we’ll hook into. This is already defined, look for this line of code:

```
arguments[1].inject = function() {
	..
}
```

In here is where we can check for the reviews/q&a coming in. There’s two arguments saved out as variables here, appendToID and also content. appendToID is the ID that the content is going to be appended to, and content is the content that will be appended there. You’ll notice in this project we have it set up to check for when the appendToID is the appropriate one we’re looking for, in this case BVRRContainer and BVQAContainer. You can also check the contents within the content variable to see if it has the appropriate container you’re looking for as well, for example:

```
if ($(content).find(‘.BVRRSecondaryContainer’).length > 0) { 
	… 
	do stuff 
}
```

Or just do it how we’re currently doing it in Grandin Road.

This hook will fire anytime the BV API receives a request and wants to output any BV markup. So find the appropriate content you wish to render and do your parsing out in there. You can reference the populateReviewsContent function within the bazaar-voice-handler-ui.js file to see how we go about parsing it out in detail. To give a quick rundown of how its done: We hook into the BV calls, and find out when its appending review markup. We hook into there, then pass that review markup into a parser and then throw that data into a template to render out that new markup on the page. Very straightforward and standard parser component practice here. There’s a modal being used for the detailed view of reviews + Q&A, so we actually parse it twice since theres specific things for the detailed view of reviews that’ll probably differ from project to project.

##Product Review Template
A new component we created for reviews is within a file called product-reviews.dust. You can probably reuse most of this component across all the different cornerstone sites. You’ll probably have to adjust the markup here and there on a project to project basis as there’ll probably be things that are specific to each project. All the variable names are self explanatory, and there’s nothing new you haven’t seen before already.

##Implementing Functionality for Reviews + Q&A
A pattern you’ll see for all the functionality implementation for reviews and Q&A is the facade pattern. We keep the desktop BV container in a hidden element labelled with the class js-desktop-pdp. We’ll parse out all of the reviews content and show it visually but keep the desktop markup hidden on the page. For all the features here, we’ll create event listeners for the parsed out content, and trigger the appropriate events to the hidden desktop markup, which will trigger the hook we have set up before which will then allow us to appropriately update the parsed markup as well. We created a function within the PDP ui.js called bindBVReviews where we keep all our event handlers for doing this, so please follow a similar approach when building reviews + Q&A out. Please reference this section if you’re having troubles understanding the facade pattern.

##Implemented Functionality
While this will be different from build to build, in the Grandin Road reviews + Q&A implementation, we have the following features already built out: 
Upvoting reviews/Q&A, pagination, choosing sort order, refine filtering, searching questions, and additional smaller touch ups: touching the # of reviews should scroll to the review bellows and open it if it isn’t, loading spinners for BV api calls. Please do not re-implement these features, and just follow how we’re doing it. You can find all the implementations within product-details-ui.js and bazaar-voice-handler-ui.js

##Don’t hesitate to reach out to us if you have questions on anything.

