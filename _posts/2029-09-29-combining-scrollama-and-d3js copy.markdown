---
layout: post
title:  "How to combine scrollama and D3.js"
date:   2023-09-29 12:00:00 +0200
categories: blog update
---
<style>

#outro {
  height: 640px;
}


#scrolly {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    background-color: #f3f3f3;
    padding: 1rem;
}
		
#scrolly > * {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
div .articlepost {
    position: relative;
    padding: 0 1rem 0 0;
    max-width: 20rem;
}
		
figure {
    position: -webkit-sticky;
    position: sticky;
    width: 100%;
    margin: 0;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    background-color: #8a8a8a;
}
figure p {
    text-align: center;
    padding: 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 8rem;
    font-weight: 900;
    color: #ff1;
}

.step {
    margin: 0 auto 2rem auto;
    background-color: #3b3b3b;
    color: #fff;
}
.step:last-child {
    margin-bottom: 0;
}
.step.is-active {
    background-color: goldenrod;
    color: #3b3b3b;
}

.step p {
    text-align: center;
    padding: 1.5rem;
    font-size: 1.5rem;
} 

.step p .title {
    color: #3b3b3b;
} 

div .explain p {
    color: #3b3b3b;
    text-align: start;
    font-size: 1rem;
} 

</style>

# Sticky figure with Scrollama

This is a dissection of [Russell Goldenberg's scrollama sticky-side "Basic" example](https://russellsamora.github.io/scrollama/sticky-side/), which is also on [github](https://github.com/russellsamora/scrollama).

Russell Goldenberg made **Scrollama** to use [the intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in favor of scroll events, with excellent results.

> What is the intersection observer API? As stated in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), the API '*... observes changes in the intersection of target elements with an ancestor element or with a top-level document's viewport*'.

# Using Scrollama

In this example the first action was to instatiate all the libraries used in the example:

#### **D3.js**

**D3.js** is used in this example mostly to facilitate the DOM manipulation

```javascript
var main = d3.select('main')
var scrolly = main.select('#scrolly');
var figure = scrolly.select('figure');
var article = scrolly.select('div .articlepost');
var step = article.selectAll('.step');
```

With **D3.js** the author selected and named the main html elements that will characterize the animation:
- A ***main*** HTML element enclosing all other elements that will be animated
- A HTML section with an id with ***scrolly*** as value
- A HTML ***figure*** tag, having the area that will be sticked
- A *div* which was an ***article*** tag in the original code
- A list of divs children of the HTML **article** all of class **step** with a digit from 1 to 4 as value for their corresponding *data-step* attributes


#### **Scrollama**

```javascript
var scroller = scrollama();
```

The name of the **Scrollama** instantiation is a choice made by the coder. The resulting variable though can be compared to the practice of calling it ***scene*** when using other technologies. 

**Scrollama** object will be called again within several functions in the code:
* A resizing function, **```handleResize```**, where **scrollama** is called to update the dimensions of the elements that are registered in its instance - *scroller*

```javascript
function handleResize() {
			
   // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style('height', stepH + 'px');
    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;  
    figure
        .style('height', figureHeight + 'px')
        .style('top', figureMarginTop + 'px');
			
   
   // 2. tell scrollama to update new element dimensions
	scroller.resize();
}
```

* The **```init```** function, where the variable *scroller* is setup

```javascript
function init() {
			
    setupStickyfill();
			
    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();
			
   // 2. setup the scroller passing options
	// 		this will also initialize trigger observations
			
   // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        step: '#scrolly div.articlepost .step',
        offset: 0.33,
        //debug: true,
    })
        .onStepEnter(handleStepEnter)
    
    // setup resize event
    window.addEventListener('resize', handleResize);
}
```

In the example, setting up the *scroller* required at least 3 properties:
* The **```step```** property, which get as value(s) the target elements that will be subject to animation; in our case are all those classed as **step**

```javascript
{
    step: '#scrolly div.articlepost .step'
}
```

* The **```offset```** property, which "locates" the intersection observer on the physical view in relation to the **viewport** dimensions; once the target element crosses the offset, **Scrollama** will add a **is-active** class.

```javascript
{
    offset: 0.33
}
```
* An event handler every time the offset is crossed, the **```handleStepEnter```**, assigned to the **```onStepEnter```** **Scrollama** event handler 

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
The key of the **Scrollama** **```onStepEnter```** event handler is that it passes a *response* object to the handler function that contains information about the DOM, allowing the definition of different handling functionalities using, for example, **``if-else``** statements. 

In this example, the *response*'s index is used to add color only to the active step.


<section id='scrolly'>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>This target (a HTML div classed as '<strong>step</strong>') crossed the 33% viewport offset calculated from top to down. Its index is now passed to the figure.</p>            
            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>This is the second target that cross the offset. Its index is now passed to the figure.</p>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p><em>index</em> property is passed through the <em>response</em> object from the <strong>scrollama</strong> instance into your animation handler (in the exercise the <strong>handleStepEnter</strong>).</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>Every time that a target passes the offset, a  <strong>is-active</strong> class is assigned to it.</p>            
            </div>
        </div>
    </div>

    <figure>
        <p>0</p>
    </figure>
</section>
<section id='outro'></section>

<script src="{{ site.baseurl }}{% link src/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script>
		// using d3 for convenience
  // E: could have been something like jQuery, etc...
		var main = d3.select('main')
		var scrolly = main.select('#scrolly');
		var figure = scrolly.select('figure');
		var article = scrolly.select('div .articlepost');
		var step = article.selectAll('.step');
		
// initialize the scrollama
		var scroller = scrollama();
		
// generic window resize listener event
function handleResize() {
			
   // 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.75);
			step.style('height', stepH + 'px');
			var figureHeight = window.innerHeight / 2
			var figureMarginTop = (window.innerHeight - figureHeight) / 2  
			figure
				.style('height', figureHeight + 'px')
				.style('top', figureMarginTop + 'px');
			
   // 3. tell scrollama to update new element dimensions
			scroller.resize();
		}

// scrollama event handlers
function handleStepEnter(response) {
			//console.log(response)
			
   // response = { element, direction, index }
			// add color to current step only
			step.classed('is-active', function (d, i) {
                //console.log('response', response);
                //response.element.querySelector('.explain').style.display = 'inline';
				return i === response.index;
			})
			
   // update graphic based on step
            figure.select('p').text(response.index + 1);
		}

//E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
function setupStickyfill() {
			d3.selectAll('.sticky').each(function () {
				//Stickyfill.add(this);
			});
		}
	

function init() {
			setupStickyfill();
			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
			handleResize();
			
   // 2. setup the scroller passing options
			// 		this will also initialize trigger observations
			
   // 3. bind scrollama event handlers (this can be chained like below)
			scroller.setup({
				step: '#scrolly div.articlepost .step',
				offset: .33,
				//debug: true,
			})
				.onStepEnter(handleStepEnter)
			
   // setup resize event
			window.addEventListener('resize', handleResize);
		}
		
  // kick things off
		init();
</script>