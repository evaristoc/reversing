---
layout: post
title:  "Sticky figure with scrollama"
date:   2023-09-29 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-09-29-sticky-figure-with-scrollama/2023-09-29-sticky-figure-with-scrollama.css %}">

# Sticky figure with scrollama

This is a dissection of [Russell Samora's scrollama sticky-side example](https://russellsamora.github.io/scrollama/sticky-side/), which is also on [github](https://github.com/russellsamora/scrollama).

Russell Samora made **scrollama** to use [the intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in favor of scroll events, with excellent results. As stated in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), the API: '... observes changes in the intersection of target elements with an ancestor element or with a top-level document's viewport'.

> By 2023 **scrollama** was still maintained and included other 20 contributors, with version 3 already available.

# The code

The first that the original author of the demo did was to instatiate all the libraries used in the example:

#### **D3.js**

**D3.js** is used in this example mostly to facilitate the DOM manipulation but it is also a pre-entry to explain the use of **D3.js** (it could be any other library though)

```javascript
var main = d3.select('main')
var scrolly = main.select('#scrolly');
var figure = scrolly.select('figure');
var article = scrolly.select('div .articlepost');
var step = article.selectAll('.step');
```

With **D3.js** the author selected and named the main HTML elements that will characterize the animation:
- A ***main*** HTML element enclosing all other elements that will be animated
- A HTML section with an id with ***scrolly*** as value
- A HTML ***figure*** tag, having the area that will be sticked
- A *div*, which was an ***article*** tag in the original code
- A list of divs children of the HTML **article** all of class **step** with a digit from 1 to 4 as value for their corresponding *data-step* attributes


#### **scrollama**

```javascript
var scroller = scrollama();
```

The **scrollama** instance was called within several functions in the code:
* In a resizing function, **```handleResize```**, where **scrollama** instance (*scroller*) was called to update the dimensions of the HTML elements that would be eventually registered on it.

```javascript
function handleResize() {
    ...
   // 2. tell scrollama to update new element dimensions
	scroller.resize();
}
```

* The **```init```** function, where the variable *scroller* is setup

```javascript
function init() {
    ...
   // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        step: '#scrolly div.articlepost .step',
        offset: 0.33,
        debug: false,
    })
        .onStepEnter(handleStepEnter)
    ...
}
```

In the example, setting up the values of 3 *scroller* properties were required:
* The **```step```** property, which get as value(s) the target HTML elements that will be subject to animation; in our case are all those classed as **step**

```javascript
{
    step: '#scrolly div.articlepost .step'
}
```

* The **```offset```** property, which is the "location" of the intersection observer somewhere on the **viewport**. Once the target element crosses the offset, **scrollama** will add an **is-active** class to it, and it will remove it from any other target that is already handled.

```javascript
{
    offset: 0.33
}
```
* Passing a custom event handler callback function, **```handleStepEnter```**, containing the actions to be taken every time the offset is crossed. In this case it was assigned to **scrollama** **```onStepEnter```** (there are other options). This was the callback function:

```javascript
// scrollama event handlers
function handleStepEnter(response) {
			
    // response = { element, direction, index }
    // add color to current step only
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })
			
    // update graphic based on step
	figure.select('p').text(response.index + 1);
}
```
The **scrollama** **```onStepEnter```** event handler functionality passes a *response* parameter to your custom callback function holding information about the DOM status (*{ element, direction, index }*), allowing you to set different *scenes* using, for example, **``if-else``** statements.

# In Action

The example by Russell Samora used the *response*'s index property to change color and modify the value of a "figure":


<section id='scrolly'>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>This div with a gold background has a class '<strong>step</strong>' and just crossed an offset of 33% of your viewport calculated from top to down.</p>            
            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>This is the second target that cross the offset. Everytime a target crosses the offset, its index is passed as value to be shown in the figure.</p>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>The <em>index</em> is a property hold by a <em>response</em> that is passed from  <strong>scrollama</strong> into your animation handler (eg. the <strong>handleStepEnter</strong>).</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>Every time that a target passes the offset, an  <strong>is-active</strong> class is assigned to it.</p>            
            </div>
        </div>
    </div>

    <figure>
        <p>0</p>
    </figure>
</section>




# So... What did we learn from this code?

It seems that when what you want is to change the status of your page based on up/down scrolling, the use of **scrollama** seems to be easier and natural. That, at least, was my impression. The use of a simple offset of the viewport based on the intersection observer API might be much more convenient for several cases.

The package makes use of very simple settings, and that also affects the custom code you want to use for handling events. A simple event handler callback with ```if-else``` statements is something very appealing if you are looking to keep things simple.

And in case you need some help identifying where the offset is placed on your device viewport, **scrollama** has a *debug* setup that shows you a line crossing the offset. In our example, you just have to set debug to **true**:

```javascript
function init() {
    ...
   // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        ...
        debug: true,
    })
    ...
}
```

**scrollMagic** and other packages using scroll events are harder to set. However, they seem to offer more possibilities and they might be more appropriate for situations where a more advanced animation is required. For example, I don't know if **scrollama** could be easy to use when the reposition of an HTML element is the trigger of another event.

# Final remarks

A more detailed post dated back to 2017 about the Russell Samora's sticky side demo could be found at [The Pudding](https://pudding.cool/process/introducing-scrollama/), which includes a better description of the "sticky graphic pattern"  and gives a look at the css used in the demo. (*Observation: the post assumes the use of jQuery for the javascript part*)

There are many examples out there using **scrollama**. A simple one I came across while looking for some was this one by [Erik Driessen](https://github.com/edriessen/scrollytelling-scrollama-d3-demo). Like me, Erik is interested in the use of this tools for storytelling and also incorporates **D3.js** in his demos. Just like I did, the code by Erik's appears to be based on the Russell Samora's demos but Erik goes a bit further by including more D3.js animations.

And that's it! I hope you found this post useful for your projects. I think I will be using **scrollama** myself for some of my post in the future. Meanwhile, happy coding! 

<script src="{{ site.baseurl }}{% link mngassets/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-09-29-sticky-figure-with-scrollama/2023-09-29-sticky-figure-with-scrollama.js %}"></script>