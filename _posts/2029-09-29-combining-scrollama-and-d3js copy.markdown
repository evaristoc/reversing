---
layout: post
title:  "How to combine scrollama and D3.js"
date:   2023-09-29 12:00:00 +0200
categories: blog update
---
<style>
/* reset stuff */
* {
    box-sizing: border-box;
  }
  a,
  body,
  div,
  h1,
  h2,
  html,
  p {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  main {
    display: block;
  }
  body,
  html {
    height: 100%;
  }
  html {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    font-feature-settings: "kern" 1, "onum" 1, "liga" 0;
  }
  
  body {
    background: #fff;
    font-size: 17px;
  }
  
  body {
    font-size: 17px;
    font-weight: 400;
    background-color: #fffffc;
    color: #1a1a1a;
    line-height: 1.8;
    font-family: "Whitney SSm A", "Whitney SSm B", Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  main {
    padding: 0.75rem;
    padding-bottom: 5rem;
  }
  
  p {
    margin: 1.5rem 0;
  }
  
  a {
    color: #1a1a1a;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
  }
  
  a:hover {
    color: #f33;
  }
  
  .intro {
    max-width: 60rem;
    margin: 4rem auto 2rem auto;
  }
  
  .intro p {
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
  }
  
  .hed {
    font-family: "Mercury SSm A", "Mercury SSm B", Georgia, serif;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 3rem;
    margin-left: auto;
    margin-right: auto;
    max-width: 40rem;
  }
  
  .hed a {
    border: none;
  }
  
  
  /* GRAPHIC CODE */
  .graphic {
      width: 100%;
      position: relative;
  }
  
  .graphic__prose {
      width: 24rem;
  }
  
  .graphic__prose .trigger {
      padding: 0;
      margin: 0;
      min-height: 240px;
      
  }
  
  .graphic__vis {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      margin-left: 30rem;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      height: 100vh;
  }
  
  .graphic__vis.is-fixed {
      position: fixed;
  }
  
  .graphic__vis.is-bottom {
      top: auto;
      bottom: 0;
  }
  
  .graphic__vis svg {
   background-color: blue;
      border: 1px dashed black;
      top: 20%;
      position: relative;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      transform: translateY(-50%);
  
  }
  
  .item circle {
      stroke: #666;
      stroke-width: 1px;
      fill: #fff;
  }
  
  .item text {
      fill: #666;
      font-size: 12px;
      text-anchor: middle;
      alignment-baseline: middle;
  }
  
  
  
  /* graph-scroll.js version */
  .graphic__vis.graph-scroll-fixed {
      position: fixed;
      right: auto;
  }
  
  .graphic__vis.graph-scroll-below {
      top: auto;
      bottom: 0;
  }    
</style>


<main>

    <div class='library'>
        <div class='library__graphic graphic'>
            <div class='graphic__prose'>
                <p class='trigger' data-step='0'>Step 1 in the graphic. It triggers in the middle of the viewport. For this graphic, it is the same as the initial state so the reader doesn&rsquo;t miss anything.</p>
                <p class='trigger' data-step='1'>Step 2 arrives. The graphic should be locking into a fixed position right about now. We could have a whole bunch of these &ldquo;fixed&rdquo; steps.</p>
                <p class='trigger' data-step='2'>Step 3 concludes our brief tour. The graphic should now go back to its original in-flow position, elegantly snapping back into place.</p>
            </div>
            <div class='graphic__vis'></div>
        </div>
    </div>
</main>
<script src="{{ site.baseurl }}{% link src/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script>
/* 
	Russell Goldenberg created a function that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic = function(graphicSelector) {
	
    // E: existing html elements using d3.js
    var graphicEl = d3.select('.graphic')
       var graphicVisEl = graphicEl.select('.graphic__vis')
       var graphicProseEl = graphicEl.select('.graphic__prose')
   
    // E: (constant) parameters of the chart
       var margin = 20
       var size = 400
       var chartSize = size - margin * 2
       var scaleX = null
       var scaleR = null
       var data = [8, 6, 7, 5, 3, 0, 9]
       var extent = d3.extent(data)
       var minR = 10
       var maxR = 24
       
       // actions to take on each step of our scroll-driven story
       var steps = [
           
     function step0() { // circles are centered and small
      
      // E: attributes of the transition t
               var t = d3.transition()
                   .duration(800)
                   .ease(d3.easeQuadInOut)
                   
      // E: remember - those items will be generated in another function further below when setting up the image
               var item = graphicVisEl.selectAll('.item')
               
      // E: assign transition t properties to a created item
               item.transition(t)
                   .attr('transform', translate(chartSize / 2, chartSize / 2))
   
      // E: item is now a d3.js element; now using select would attach a SVG circle to it
      // E: it is also assigning the transition to the circle, as well as it properties
               item.select('circle')
                   .transition(t)
                   .attr('r', minR)
   
      // E: same as above but for text
      item.select('text')
                   .transition(t)
                   .style('opacity', 0)
           },
   
           function step1() { // E: equal circles are positioned side by side
               var t = d3.transition()
                   .duration(800)
                   .ease(d3.easeQuadInOut)
               
               // circles are positioned
      // E: remember that they were created in the previous step.
      // E: don't forget that graphicsVisEl is a global to this function!!
               var item = graphicVisEl.selectAll('.item')
               
      // E: positioning the items according to scaleX(i)
               item.transition(t)
                   .attr('transform', function(d, i) {
                       return translate(scaleX(i), chartSize / 2)
                   })
   
      // E: defining the properties of each fo the circles and texts associated to their respective "item" HTML element
               item.select('circle')
                   .transition(t)
                   .attr('r', minR)
   
               item.select('text')
                   .transition(t)
                   .style('opacity', 0)
           },
   
           function step2() { // E: circles are resized to the value of data and text embedded
               var t = d3.transition()
                   .duration(800)
                   .ease(d3.easeQuadInOut)
   
               var item = graphicVisEl.selectAll('.item')
   
      // E: circles are sized and texts are assigned
               item.select('circle')
                   .transition(t)
                   .delay(function(d, i) { return i * 200 })
                   .attr('r', function(d, i) {
                       return scaleR(d)
                   })
   
               item.select('text')
                   .transition(t)
                   .delay(function(d, i) { return i * 200 })
                   .style('opacity', 1)
           },
       ]
   
       // update our chart
       function update(step) {
           steps[step].call() //E: call the function!
       }
       
       // little helper for string concat if using es5
       function translate(x, y) {
           return 'translate(' + x + ',' + y + ')'
       }
   
       function setupCharts() {
     
     //E: setting up the "canvas"
           var svg = graphicVisEl
                    .append('svg')
                    //.attr("viewBox", '0 0 300 600')
                    .attr('width', size + 'px')
                    .attr('height', size*1.2 + 'px')
                    .call(responsivefy)
            
            function responsivefy(svg) {
            // container will be the DOM element
            // that the svg is appended to
            // we then measure the container
            // and find its aspect ratio
            const container = d3.select(svg.node().parentNode),
                width = parseInt(svg.style('width'), 10),
                height = parseInt(svg.style('height'), 10),
                aspect = width / (height*.5);
            
            // set viewBox attribute to the initial size
            // control scaling with preserveAspectRatio
            // resize svg on inital page load
            svg.attr('viewBox', `0 0 ${width} ${height}`)
                .attr('preserveAspectRatio', 'xMinYMid')
                .call(resize);
            
            // add a listener so the chart will be resized
            // when the window resizes
            // multiple listeners for the same event type
            // requires a namespace, i.e., 'click.foo'
            // api docs: https://goo.gl/F3ZCFr
            d3.select(window).on(
                'resize.' + container.attr('id'), 
                resize
            );
            
            // this is the code that resizes the chart
            // it will be called on load
            // and in response to window resizes
            // gets the width of the container
            // and resizes the svg to fill it
            // while maintaining a consistent aspect ratio
            function resize() {
                const w = parseInt(container.style('width'));
                svg.attr('width', w);
                svg.attr('height', Math.round(w / aspect));
            }
            }
           
           var chart = svg.append('g')
               .classed('chart', true)
               .attr('transform', 'translate(' + margin + ',' + margin + ')')
   
           scaleR = d3.scaleLinear()
           scaleX = d3.scaleBand()
   
           var domainX = d3.range(data.length)
   
           scaleX
               .domain(domainX)
               .range([0, chartSize])
               .padding(1)
   
           scaleR
               .domain(extent)
               .range([minR, maxR])
   
           // E: setup the data; values should be appended to HTML elements of class item, which are created here
     var item = chart.selectAll('.item')
               .data(data)
               .enter()
      .append('g')
               .classed('item', true)
               .attr('transform', translate(chartSize / 2, chartSize / 2))
           
           item.append('circle')
               .attr('cx', 0)
               .attr('cy', 0)
   
           item.append('text')
               .text(function(d) { return d })
               .attr('y', 1)
               .style('opacity', 0)
       }
   
       function setupProse() { 
     
     // E: placing the written content
            var height = window.innerHeight * 0.5;
            graphicProseEl
            .selectAll('.trigger')
                     .style('height', height + 'px')
       }
   
       function init() {
           setupCharts()
           setupProse()
           update(0)
       }
       
       init()
       
       return {
           update: update,
       }
   }		
   
   
   //(function() {
   // helper function so we can map over dom selection
               
     function selectionToArray(selection) {
                   var len = selection.length
                   var result = []
                   for (var i = 0; i < len; i++) {
                       result.push(selection[i])
                   }
                   return result
               }
               
     function scrollmagic() {
                   // select elements
                   var graphicEl = document.querySelector('.graphic')
                   var graphicVisEl = graphicEl.querySelector('.graphic__vis')
                   var triggerEls = selectionToArray(graphicEl.querySelectorAll('.trigger'))
                   // viewport height
                   var viewportHeight = window.innerHeight
                   var halfViewportHeight = Math.floor(viewportHeight / 2)
                   // a global function creates and handles all the vis + updates
                   var graphic = createGraphic('.graphic')
                   
      // handle the fixed/static position of graphic
            var toggle = function(fixed, bottom) {
                       if (fixed) graphicVisEl.classList.add('is-fixed')
                       else graphicVisEl.classList.remove('is-fixed')
                       if (bottom) graphicVisEl.classList.add('is-bottom')
                       else graphicVisEl.classList.remove('is-bottom')
                   }
                   
       // init controller
                   var controller = new ScrollMagic.Controller()
                   
               // setup a scrollmagic trigger ("scene") for each trigger element
      // E: similar to waypoints combined with canvas/three.js
      // --- this library is made to link with TweenMax 
               var scenes = triggerEls.map(function(el) {
                       // get the step, cast as number					
                       var step = +el.getAttribute('data-step')
                       var scene = new ScrollMagic.Scene({
                           triggerElement: el, // our trigger element
                           triggerHook: 'onCenter', // 0.5, defaults to this
                           // duration: el.offsetHeight, // how long it lasts for (in pixels)
                       })
                       
        scene
           //E: entering and leaving phases are clearer than with waypoints, with specific event handlers
           //--- the library is very much declarative; more intuitive if you have experience with this declarative syntax
                             .on('enter', function(event) {
                                               // tell our graphic to update with a specific step
                                               graphic.update(step)
                             })
                             .on('leave', function(event) {
                                               var nextStep = Math.max(0, step - 1)
                                               graphic.update(nextStep)
                             })
                       
                       // add it to controller so it actually fires
        // E: required, nice!
                       scene.addTo(controller)
                   })
      
                   // create a scene to toggle fixed position
       // E: requires an overall understanding of the properties; eg. triggerHook?
       // --- enterExit is more like initial and final states
                   var enterExitScene = new ScrollMagic.Scene({
                       triggerElement: graphicEl,
                       triggerHook: '0',
                       duration: graphicEl.offsetHeight - viewportHeight,
                   })
                   
       enterExitScene
                         .on('enter', function(event) {
                                            var fixed = true
                                            var bottom = false
                                            toggle(fixed, bottom)
                         })
                         .on('leave', function(event) {
                                            var fixed = false
                                            var bottom = event.scrollDirection === 'FORWARD'
                                           toggle(fixed, bottom)
                          })
                   
        enterExitScene.addTo(controller)
               }
              scrollmagic()
           //})()    
</script>