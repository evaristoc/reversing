//import {hello} from './huffman-flow-field-setup.js';
import {eventHandlers} from './scrollama-eventhandlers.js';
import {paramsFigure} from './huffman-flow-field-setup.js';
import {Hair} from './huffman-flow-field-setup.js';
//console.log("eventHandlers",eventHandlers);
//console.log("paramsFigure", paramsFigure);

window.onload = (event) => {
    // using d3 for convenience
    // E: could have been something like jQuery, etc...
    // let paramScrollama = {
    //     container : null,
    //     main : null,
    //     scrolly : null,
    //     figure : null,
    //     article: null,
    //     step : null,
    //     baseCanvas : null,
    //     baseContext : null,
    //     width : null,
    //     height : null
    // }

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


  
    const scrolly = getElementD3js(d3, "#stickyoverlay");
    paramsFigure.container = eventHandlers.container = getElementD3js(scrolly, "figure");
    //const figure = paramsFigure.container;
    const article = getElementD3js(scrolly, "div .articlepost");
    eventHandlers.step = getElementD3js(article, ".step", true);
    const baseCanvas = document.createElement('canvas');
    const baseContext = baseCanvas.getContext('2d');
    const perlinCanvas = document.createElement('canvas');
    const perlinContext = perlinCanvas.getContext('2d');
    baseCanvas.setAttribute("id", "context");
    perlinCanvas.setAttribute("id", "perlinCanvas");
    paramsFigure.width = paramsFigure.container.node().offsetWidth;
    paramsFigure.height = baseCanvas.height = 200;
    paramsFigure.container.node().appendChild(baseCanvas);
    paramsFigure.baseCanvas = eventHandlers.baseCanvas = getElementById(document, "context");
    paramsFigure.baseContext = eventHandlers.baseContext = baseContext;
    paramsFigure.perlinCanvas = getElementById(document, "perlinCanvas");
    paramsFigure.perlinContext = perlinContext;
    //paramsFigure.renderer.setSize( 300, 200 );

    //paramsFigure.renderingFunc.startTime = paramsFigure.startTime;

    paramsFigure.circle = {
        x: paramsFigure.container.node().offsetWidth / 2,
        y: 100,
        r: paramsFigure.container.node().offsetWidth / 2. / 2. / 2.
    }

    paramsFigure["renderer"] = paramsFigure.rendererFunc();
    paramsFigure.renderer.setSize(paramsFigure.width, paramsFigure.height);

    //console.log(paramsFigure.hairs.length)
    //console.log(paramsFigure.hairs[0])


    //var width;
    //var height;

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
        eventHandlers.handleStepEnter01(response);
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
 
        function start(){
            return setTimeout(new Hair(), 10);
        }

        
        //E: instantiate all the hairs and save them in the hairs container
        // but don't draw them yet... 
        for(var i = 0; i < 6000; i++){
            new Hair();
        }

        setupStickyfill();
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        //console.log("initFigure", initFigure);
        //hello();
        
        handleResize();

        paramsFigure.baseContext.fillStyle = "#f3f3f3";
        //paramsFigure.baseContext.strokeStyle = "#f3f3f3";

        //paramsFigure.renderFunc.renderer = paramsFigure.renderer;
        //requestAnimationFrame(paramsFigure.render);
        //paramsFigure.renderingFunc.render();
        function figRender(){
            let now = new Date().getTime();
            let startTime = paramsFigure.startTime;
            let currentTime = (now - startTime)/10000;
            //console.log(currentTime);
            let width = paramsFigure.width;
            let height = paramsFigure.height;
            //console.log(width, height);
            paramsFigure.baseContext.clearRect(0,0,width,height);
            paramsFigure.perlinContext.clearRect(0, 0, width, height);
            paramsFigure.perlinImgData = paramsFigure.perlinContext.getImageData(0, 0, width, height);
            //paramsFigure.baseContext.beginPath();
            //paramsFigure.hairs.map(hair => hair.draw());
            paramsFigure.baseContext.fillRect(0, 0, width, height);
            paramsFigure.baseContext.stroke();
            requestAnimationFrame( figRender );
        }
        
        figRender();

        //E: order of the functions is important!
        //After rendering the canvas and before running the handler
        eventHandlers.hairs = paramsFigure.hairs;

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