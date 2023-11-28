import {paramsPlane} from '../2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js';
import {paramsFigure} from './huffman-flow-field-setup-03.js';

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
        if(response.index === 1){
            function strokes(hairs, otherHairs){
                baseContext.beginPath();
                function delay(i){
                    setTimeout(()=>{hairs[i].draw(); otherHairs.push(hairs[i])}, i/1.);
                }
                for(let i = 0; i < hairs.length; i++){
                    delay(i);
                    baseContext.stroke();
                }
            }
            strokes(paramsFigure.hairs, this.hairs);
            baseContext.strokeStyle = "#AAAAFF";
            this.passed = response.index;
            //this.baseContext.strokeStyle = "#AAAAFF";
        }
        if(response.index === 3){
            this.renderer = paramsPlane.renderer;
            this.passed = response.index;
        }
        if(response.index === 7){
            //this.baseContext.fillStyle = "#ffffff00";
            gsap.to(baseContext,
                {
                    fillStyle:"rgba(255,255,255,0)",
                    duration:3
                }
            );
            this.passed = response.index;
        }
        if(response.index === 8){
            let noiseContainer = document.getElementById("threejs-container");
            const charT2 = gsap.timeline();
            charT2.to(noiseContainer, { y: -200, duration: 3 });
            //noiseContainer.style.top = "200px";
            this.passed = response.index;
        }
    }
}