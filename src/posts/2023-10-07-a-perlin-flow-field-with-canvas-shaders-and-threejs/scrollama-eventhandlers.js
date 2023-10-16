
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
    updateSizeCanvas : function(){
            /*TODO:
            - perlinCanvas to be added
            - also Three.js renderer
            */
            let containerNode = this.container.node();
            this.width = this.baseCanvas.width = containerNode.offsetWidth;
            this.height =  200;
            this.baseContext.fillRect(0, 0, this.baseCanvas.width, this.height); 
            this.baseContext.fill();
        },
    updateCanvasBackground : function(){
        this.baseContext.rect(20,20,150,100);
        this.baseContext.fill();
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
        
        
        
        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
        function tweenToRandomColor() {
            TweenLite.to(
                    baseContext, 
                    1, 
                    {
                        colorProps:{
                            fillStyle: `#${response.index}0${response.index*2}0${response.index*2}0`,
                        }, 
                        onUpdate: updateCanvasBackground, 
                    //onComplete:tweenToRandomColor
                    });
        }        
        tweenToRandomColor();
        
        this.baseContext.strokeStyle = "#000075";
    }
}