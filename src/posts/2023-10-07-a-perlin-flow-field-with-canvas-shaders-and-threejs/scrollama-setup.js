//import {hello} from './huffman-flow-field-setup.js';
import {eventHandlers} from './scrollama-eventhandlers.js';
import {paramsFigure} from './huffman-flow-field-setup.js';
//console.log("eventHandlers",eventHandlers);
//console.log("paramsFigure", paramsFigure);

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


    class Hair {
        constructor(){
            let r = 2 * Math.PI * Math.random(),
                d = Math.sqrt(Math.random())
    
            this.position = {
                x: Math.floor(paramsFigure.circle.x + Math.cos(r) * d * paramsFigure.circle.r),
                y: Math.floor(paramsFigure.circle.y + Math.sin(r) * d * paramsFigure.circle.r)
            }
            
            this.length = Math.floor(Math.random() * 10) + 10;
            paramsFigure.hairs.push(this);
        }
        
        draw(){
                let { position, length } = this,
                { x, y } = position,
                i = (y * paramsFigure.width + x) * 4,
                d = paramsFigure.perlinImgData.data,
                noise = d[i],
                angle = (noise / 255) * Math.PI
            
            paramsFigure.baseContext.moveTo(x, y)
            paramsFigure.baseContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
        }
    }
    
    
    const scrolly = paramScrollama.scrolly = getElementD3js(d3, "#stickyoverlay");
    paramsFigure.container = eventHandlers.container = getElementD3js(scrolly, "figure");
    const figure = paramScrollama.figure = paramsFigure.container;
    const article = paramScrollama.article = getElementD3js(scrolly, "div .articlepost");
    const step = eventHandlers.step = getElementD3js(article, ".step", true);
    const baseCanvas = document.createElement('canvas');
    const baseContext = baseCanvas.getContext('2d');
    const perlinCanvas = document.createElement('canvas');
    const perlinContext = perlinCanvas.getContext('2d');
    //const baseCanvas = getElementD3js(paramsFigure.container, "canvas");
    //const perlinCanvas = getElementD3js(paramsFigure.container, "canvas");
    baseCanvas.setAttribute("id", "context");
    perlinCanvas.setAttribute("id", "perlinCanvas");
    paramsFigure.container.node().appendChild(baseCanvas);
    paramsFigure.baseCanvas = eventHandlers.baseCanvas = getElementById(document, "context");
    paramsFigure.baseContext = eventHandlers.baseContext = baseContext;
    paramsFigure.perlinCanvas = getElementById(document, "perlinCanvas");
    paramsFigure.perlinContext = perlinContext;
    //paramsFigure.renderer.setSize( 300, 200 );
    paramsFigure.width = paramsFigure.container.node().offsetWidth;
    paramsFigure.height = 200;
    //paramsFigure.renderingFunc.startTime = paramsFigure.startTime;

    for(var i = 0; i < 6000; i++){
        new Hair();
    }

    console.log(paramsFigure.hairs.length)
    console.log(paramsFigure.hairs[0])


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
        setupStickyfill();
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        //console.log("initFigure", initFigure);
        //hello();
        
        handleResize();

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
            paramsFigure.baseContext.clearRect(0,0,width,height);
            paramsFigure.perlinContext.clearRect(0, 0, width, height);
            paramsFigure.perlinImgData = paramsFigure.perlinContext.getImageData(0, 0, width, height);
            paramsFigure.baseContext.beginPath();
            paramsFigure.hairs.map(hair => hair.draw());
            paramsFigure.baseContext.fillRect(0, 0, width, height);
            paramsFigure.baseContext.stroke();
            requestAnimationFrame( figRender );
        }
        
        figRender();

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