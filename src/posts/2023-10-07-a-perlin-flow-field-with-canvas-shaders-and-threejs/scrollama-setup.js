import {hello} from './huffman-flow-field-setup.js';
import {eventHandlers} from './scrollama-eventhandlers.js';
//console.log("eventHandlers",eventHandlers);

window.onload = (event) => {
    // using d3 for convenience
    // E: could have been something like jQuery, etc...
    let paramScrollama = {
        container : null,
        main : null,
        scrolly : null,
        figure : null,
        article: null,
        step : null,
        baseCanvas : null,
        baseContext : null,
        width : null,
        height : null
    }

    function getElement(parent, selector, all=false){
        if(!all) {
            return parent.querySelector(selector);
        }else{
            return parent.querySelectorAll(selector);
        }
        
    }

    function getElementById(parent, selector){
        return parent.getElementById(selector);
    }

    function getElementD3js(parent, selector, all=false){
        console.warn("Using D3.js to manipulate the DOM elements");
        if(!all) {
            return parent.select(selector);
        }else{
            return parent.selectAll(selector);
        }
        
    }

    const scrolly = paramScrollama.scrolly = getElementD3js(d3, "#stickyoverlay");
    const container = eventHandlers.container = getElementD3js(scrolly, "figure");
    const figure = paramScrollama.figure = container;
    const article = paramScrollama.article = getElementD3js(scrolly, "div .articlepost");
    const step = eventHandlers.step = getElementD3js(article, ".step", true);
    const baseCanvas = eventHandlers.baseCanvas = getElementById(document, "context");
    const baseContext = eventHandlers.baseContext = baseCanvas.getContext("2d");

    var width;
    var height;

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    // TODO - should stay here!
    function handleResize() {
        
        eventHandlers.updateSizeStepElements();
        eventHandlers.updateSizeCanvas();

    // tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        eventHandlers.step.classed('is-active', function (d, i) { return i === response.index; });
            //console.log('response', response);
            //response.element.querySelector('.explain').style.display = 'inline';
        
    // update graphic based on step
    // figure.select('p').text(response.index + 1);
        //console.log(baseContext);
        //console.log(baseContext.fillStyle);
        //returns a random integer in a range
        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        function random(min, max) {
            return (min + Math.random() * (max - min) + 0.5) | 0;
        }
    
        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        function update() {
            eventHandlers.baseContext.rect(20,20,150,100);
            eventHandlers.baseContext.fill();
        }
        //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
        function tweenToRandomColor() {
            TweenLite.to(baseContext, 1, {
                     colorProps:{
                         //fillStyle:"rgb(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + ")"
                        fillStyle: `#${response.index}0${response.index*2}0${response.index*2}0`,
                    }, 
                     onUpdate:update, 
                     //onComplete:tweenToRandomColor
                 });
         }        
        tweenToRandomColor();
        
        baseContext.strokeStyle = "#000075";
        //baseContext.fillRect(0,0,900,500);
        //console.log(baseContext.fillStyle);
        //baseContext.stroke(); 
    }

    //E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
    function setupStickyfill() {
        d3.selectAll('.sticky').each(function () {
            //Stickyfill.add(this);
        });
    }

    function setupCharts(){
        return svg, chart, item = d3setup.chart("figure");
    }

    function init() {
        setupStickyfill();
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        //console.log("initFigure", initFigure);
        //hello();
        
        handleResize();

    // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        
    // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            step: '#stickyoverlay div.articlepost .step',
            offset: .33,
            debug: false,
        })
            .onStepEnter(handleStepEnter);
        
    // setup resize event
        window.addEventListener('resize', handleResize);
    
    
    }
    
    // kick things off
    init();
}