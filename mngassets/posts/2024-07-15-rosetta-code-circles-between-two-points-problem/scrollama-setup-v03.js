/* IMPORTS */
import {SVGCreate} from './scene.js';
import {paramsFigure} from './scene.js';
import {geometries} from './data.js';
import {eventHandlers} from './interactions.js';

SVGCreate(paramsFigure.widthSVG, paramsFigure.heightSVG);

window.onload = (event) => {

    ////////////////////
    /*HELPER FUNCTIONS*/
    ////////////////////

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

    //// scrollama event handlers
    //function handleStepEnter(response) {
    //    eventHandlers.handleStepEnter01(response, svg);
    //}

    /////////////////////////////////////////
    /*SCROLLAMA SETUP AND ELEMENT GATHERING*/
    /////////////////////////////////////////

    const scrolly = getElementD3js(d3, "#stickyoverlay");
    const container = getElementD3js(scrolly, "figure");
    //const container = getElementD3js(d3, "#figuretest");
    
    //const container = getElementD3js(scrolly, "svg");
    //paramsFigure.container = getElementD3js(scrolly, "figure");
    paramsFigure.widthSVG = container.node().offsetWidth;
    paramsFigure.heightSVG = 200;
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


    //////////
    /* INIT */
    //////////

    function init() {
 
        //const geometries = new PointCircleGeoms(paramsFigure.geoms.points.pointA, paramsFigure.geoms.points.pointB, paramsFigure.geoms.points.r);
        //geometries.middlePoint.name = 'M';
        //paramsFigure.geoms.points.middlePoint = geometries.middlePoint;

        //console.log(svg);
        let svg = SVGCreate(paramsFigure.widthSVG, paramsFigure.heightSVG);
        // Append the SVG element.
        // E: It was not appended until: https://stackoverflow.com/questions/25516078/d3-create-object-without-appending
        container.node().appendChild(svg.node());
        //container.append(()=> svg.node);

        
        /* INIT IMAGE at eventHandlers */
        let handleStepEnter = eventHandlers.handleStepEnter01(svg, paramsFigure, geometries);

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