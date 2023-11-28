//import {hello} from './huffman-flow-field-setup.js';
import {eventHandlers} from './scrollama-eventhandlers-03.js';
import {paramsFigure} from './huffman-flow-field-setup-03.js';
import {Hair} from './huffman-flow-field-setup-03.js';
import {canvasScene} from './huffman-flow-field-setup-03.js';

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
    paramsFigure.width = paramsFigure.container.node().offsetWidth;
    paramsFigure.height = 200;
    const article = getElementD3js(scrolly, "div .articlepost");
    eventHandlers.step = getElementD3js(article, ".step", true);
    const baseCanvasInst = new canvasScene(paramsFigure.container, "context");
    baseCanvasInst.setDimensionsD3(paramsFigure.width, paramsFigure.height);
    baseCanvasInst.appendCanvasD3();
    const perlinCanvasInst = new canvasScene(paramsFigure.container, "noiseAdapt");
    perlinCanvasInst.setDimensionsD3(paramsFigure.width, paramsFigure.height);

    eventHandlers.baseCanvas = getElementById(document, "context");
    paramsFigure.baseContext = eventHandlers.baseContext = baseCanvasInst.scene;
    eventHandlers.perlinCanvas = getElementById(document, "noiseAdapt");
    eventHandlers.perlinContext = perlinCanvasInst.scene;

    paramsFigure.circle = {
        x: paramsFigure.container.node().offsetWidth / 2,
        y: 100,
        r: paramsFigure.container.node().offsetWidth / 2. / 2. / 2.
    }

    eventHandlers["renderer"] = paramsFigure.rendererFunc();
    eventHandlers.renderer.setSize(paramsFigure.width, paramsFigure.height);

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


    function init() {
 
       
        //E: instantiate all the hairs and save them in the hairs container
        // but don't draw them yet... 
        for(var i = 0; i < 700; i++){
            new Hair();
        }

        //eventHandlers.hairs = [];
        eventHandlers.hairs = [];

        handleResize();

        //eventHandlers.baseContext.fillStyle = "#404040";
        //eventHandlers.baseContext.fillStyle = "#004040";

        function figRender(){
            let now = new Date().getTime();
            let startTime = paramsFigure.startTime;
            let currentTime = (now - startTime)/10000;
            //console.log(currentTime);
            let width = paramsFigure.width;
            let height = paramsFigure.height;
            //console.log(width, height);
            eventHandlers.baseContext.clearRect(0,0,width,height);
            eventHandlers.perlinContext.clearRect(0, 0, width, height);
            eventHandlers.perlinContext.drawImage(eventHandlers.renderer.domElement, 0, 0)
            paramsFigure.perlinImgData = eventHandlers.perlinContext.getImageData(0, 0, width, height);
            eventHandlers.baseContext.beginPath();
            if(eventHandlers.hairs.length > 0){
                eventHandlers.hairs.map(hair => hair.draw());
            }
            eventHandlers.baseContext.fillRect(0, 0, width, height);
            eventHandlers.baseContext.stroke();
            requestAnimationFrame( figRender );
        }

        figRender();

        //E: order of the functions is important!
        //After rendering the canvas and before running the handler
        
       
        

        // 2. setup the scroller passing options
            // 		this will also initialize trigger observations
            
        // 3. bind scrollama event handlers (this can be chained like below)
        
        scroller.setup({
                step: '#stickyoverlay div.articlepost .step',
                offset: .39,
                debug: false,
            })
                .onStepEnter(handleStepEnter);
            
        // setup resize event
        window.addEventListener('resize', handleResize);
    
    
    }
    
    // kick things off
    init();
}