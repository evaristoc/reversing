//import {hello} from './huffman-flow-field-setup.js';
//import {Hair} from './huffman-flow-field-setup-03.js';
//import {canvasScene} from './huffman-flow-field-setup-03.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {paramsFigure} from './parameters-setup-v03.js';
//import {Point} from './parameters-setup-v03.js';
import {PointCircleGeoms} from './parameters-setup-v03.js';
import {eventHandlers} from './scrollama-eventhandlers-v03.js';
//import {paramsFigure} from './parameters-setup-v03.js';

window.onload = (event) => {

    /*HELPER FUNCTIONS*/

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


    // scrollama event handlers
    function handleStepEnter(response) {
        eventHandlers.handleStepEnter01(response);
    }

    /*SCROLLAMA SETUP AND ELEMENT GATHERING*/  
    const scrolly = getElementD3js(d3, "#stickyoverlay");
    paramsFigure.container = eventHandlers.container = getElementD3js(scrolly, "figure");
    paramsFigure.width = paramsFigure.container.node().offsetWidth;
    paramsFigure.height = 200;
    const article = getElementD3js(scrolly, "div .articlepost");
    eventHandlers.step = getElementD3js(article, ".step", true);

    //var width;
    //var height;

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    // TODO - should stay here!
    function handleResize() {
        
        //eventHandlers.updateSizeStepElements();
        //eventHandlers.updateSizeCanvas();

    // tell scrollama to update new element dimensions
        scroller.resize();
    }

    function init() {
 
        const geometries = new PointCircleGeoms(paramsFigure.geoms.points.pointA, paramsFigure.geoms.points.pointB, paramsFigure.geoms.points.r);

       
        handleResize();
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