/*
REMEMBER we are using d3.js to handle the DOM

TODO:
- make this an exportable object so it can be updated in scrollama-setup or any other script as required

*/

let eventHandlers = {
    step : null,
    container: null,
    updateSizeStepElements : function(){
`            // 1. update height of step elements
            let stepH = Math.floor(window.innerHeight * 0.75);
            this.step.style('height', stepH + 'px');

            let figureHeight = window.innerHeight / 2;
            let figureMarginTop = (window.innerHeight - figureHeight) / 2;  
            this.container
                .style('top', figureMarginTop + 'px');`
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
            this.baseContext.fillRect(0, 0, this.width, this.height); 
            this.baseContext.fill();
        },
    updateCanvasBackground : function(){
        this.baseContext.rect(20,20,150,100);
        this.baseContext.fill();
    },
    handleStepEnter01 : function(response){
        // response = { element, direction, index }
        this.step.classed('is-active', function (d, i) { return i === response.index; });

        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
        function tweenToRandomColor() {
            TweenLite.to(
                    this.baseContext, 
                    1, 
                    {
                        colorProps:{
                            fillStyle: `#${response.index}0${response.index*2}0${response.index*2}0`,
                        }, 
                        onUpdate: this.updateCanvasBackground, 
                    //onComplete:tweenToRandomColor
                    });
        }        
        tweenToRandomColor();
        
        this.baseContext.strokeStyle = "#000075";
    }
}


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
}

function setupCharts(){
    return svg, chart, item = d3setup.chart("figure");
}