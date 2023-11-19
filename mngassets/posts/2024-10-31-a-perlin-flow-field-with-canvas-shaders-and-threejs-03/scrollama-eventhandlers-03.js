import {paramsPlane} from '../2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js';

//REMEMBER we are using d3.js to handle the DOM
//TODO:
//- make this an exportable object so it can be updated in scrollama-setup or any other script as required

//function updateSizeStepElements(){
//}

//function updateSizeCanvas(){
//}

// function update() {
// }

// scrollama event handlers
// function handleStepEnter(response) {
// }

//E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        //Stickyfill.add(this);
    });
};

function setupCharts(){
    return svg, chart, item = d3setup.chart("figure");
};

export let eventHandlers = {
    step : null,
    container: null,
    updateSizeStepElements : function(){
        //1. update height of step elements
        let stepH = Math.floor(window.innerHeight * 0.75);
        this.step.style('height', stepH + 'px');
        let figureHeight = window.innerHeight / 2;       
        let figureMarginTop = (window.innerHeight - figureHeight) / 2;  
        this.container
            .style('top', figureMarginTop + 'px');
        },
    width: null,
    height : null,
    baseCanvas: null,
    baseContext: null,
    //perlinCanvas: null,
    //perlinContext: null,
    hairs: null,
    passed: false,
    updateSizeCanvas : function(){
            /*TODO:
            - perlinCanvas to be added
            - also Three.js renderer
            */
            let containerNode = this.container.node();
            let width = this.baseCanvas.width = containerNode.offsetWidth;
            let height =  200;
            this.baseContext.fillRect(0, 0, width, height); 
            this.baseContext.fill();
        },
    updateCanvasBackground : function(){
        //this.baseContext.rect(0,0,500,200);
        //this.baseContext.fillStyle = "#f3f3f3";
        //this.baseContext.fill();
    },
    handleStepEnter01 : function(response){
        // response = { element, direction, index }

        /*
        ~~~~~~~~~~~~ OBSERVATION ~~~~~~~~~~~~~~
        E: baseContext and updateCanvasBackground had to be brought to scope
        they both will be called by a super-function that doesn't have those two in their inheritance hierarchy
        while they are called from a global-scope functionality (Tweenlite) that is called from a local function (this one, handleStepEnter01)
        which is then called from the event handler of the scrollama (!!!!)
        The worst placed is updateCanvasBackground
        So before calling it, I had to bind the scope of this object, eventHandlers
        
        If not asserting to capture the right scope, the variables/arguments of the functions (eg. step, baseContext) come as null

        It is working. However, I am passing copies to tweenToRamdomColor instead. 
        
        Is there a better solution? Probably bringing out the tweenToRamdomColor function to an upper scope?
        Another way to define the variables?
        */

        this.step.classed('is-active', function (d, i) { return i === response.index; });

        const baseContext = this.baseContext;
        const updateCanvasBackground = this.updateCanvasBackground.bind(this, this.baseContext);
        let perlinImgData = undefined;
        
        
        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
        if(response.index === 0){
            
            this.baseContext.clearRect(0,0,this.width,this.height);
            //const scrollfigure = document.getElementById("scrollfig");
            //gsap.to(scrollfigure, { x: 400, duration:.3 });
            
            function tweener() {
                const scrollfigure = document.getElementById("scrollfig");
                const charTl = gsap.timeline();
                charTl.to(scrollfigure, { opacity: 1, duration: 3 });
              }        
            tweener();

        }
        if(response.index === 1 && this.passed == false){
            let hairs = this.hairs;
            function delay(i){
                setTimeout(()=>{hairs[i].draw()}, i/2.);
            }
            for(let i = 0; i < hairs.length; i++){
                delay(i);
            }
            this.passed = true;
            this.baseContext.strokeStyle = "#AAAAFF";
        }
        if(response.index === 3){
            this.renderer = paramsPlane.renderer;
            // let perlinContext = this.perlinContext;
            // let baseContext = this.baseContext;
            // let width = this.width;
            // let height = this.height;
            // let hairs = this.hairs;
            // let renderer = paramsPlane.renderer.domElement;
            // function renderWaves(){
            //     //console.log(paramsPlane.renderer.domElement);
            //     this.perlinContext.drawImage(renderer, 0,0);
            //     perlinImgData = this.perlinContext.getImageData(0, 0, 200, 200);             
            //     this.baseContext.beginPath();
            //     this.hairs.map(hair => hair.draw());
            //     this.baseContext.stroke();
            //     requestAnimationFrame(renderWaves);
            // }

            // renderWaves.call(this, this.perlinContext, this.baseContext, this.hairs);
            
        }
    }
}