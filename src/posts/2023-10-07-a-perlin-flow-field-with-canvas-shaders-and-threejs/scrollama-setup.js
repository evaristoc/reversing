import {hello} from './huffman-flow-field-example.js';

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
    const container = paramScrollama.container = getElementD3js(scrolly, "figure");
    const figure = paramScrollama.figure = container;
    const article = paramScrollama.article = getElementD3js(scrolly, "div .articlepost");
    const step = paramScrollama.step = getElementD3js(article, ".step", true);
    const baseCanvas = paramScrollama.baseCanvas = getElementById(document, "context");
    const baseContext = paramScrollama.baseContext = paramScrollama.baseCanvas.getContext("2d");

    var width;
    var height;

    // initialize the scrollama
    var scroller = scrollama();

    function updateSizeStepElements(){
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style('height', stepH + 'px');

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;  
        container
            //.style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
    
        //DEBUG
        console.log("figureHeight ", figureHeight);
    }

    function updateSizeCanvas(){
        //baseCanvas.width = figure.offsetWidth
        //baseCanvas.width = figureHeight;
        let containerNode = container.node();
        width = baseCanvas.width = containerNode.offsetWidth;
        //baseContext.rect(20,20,150,100);
        height =  200;
        baseContext.fillRect(0, 0, width, height); 
        baseContext.fill();
        //baseCanvas.height = 150;

        //DEBUG
        console.log("container.offsetHeight handleResize ", container.offsetWidth);
        console.log("baseCanvas.height handleResize ", baseCanvas.height);
        console.log("container.offsetWidth handleResize ", container.offsetWidth);
        console.log("baseCanvas.width handleResize ", baseCanvas.width);
        console.log("width handleResize", width);
        console.log("height handleResize", height);
    }

    // generic window resize listener event
    function handleResize() {
        
        updateSizeStepElements();
        updateSizeCanvas();

    // tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) { return i === response.index; });
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
            baseContext.rect(20,20,150,100);
            baseContext.fill();
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
        hello();
        
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