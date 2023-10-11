window.onload = (event) => {
    // using d3 for convenience
    // E: could have been something like jQuery, etc...
    let container = document.querySelector("figure");
    var main = d3.select('main')
    var scrolly = main.select('#stickyoverlay');
    var figure = scrolly.select('figure');
    var article = scrolly.select('div .articlepost');
    var step = article.selectAll('.step');
    var baseCanvas = document.getElementById('context');
    var baseContext = baseCanvas.getContext('2d');
    var width;
    var height;

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        
    	console.log("container.offsetHeight handleResize ", container.offsetWidth);
        console.log("baseCanvas.height handleResize ", baseCanvas.height);
        console.log("container.offsetWidth handleResize ", container.offsetWidth);
        console.log("baseCanvas.width handleResize ", baseCanvas.width);
        console.log("width handleResize", width);
        console.log("height handleResize", height);
        console.log("figureHeight ", figureHeight);
    
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style('height', stepH + 'px');
        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;  
        figure
            //.style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
        //baseCanvas.width = figure.offsetWidth
        //baseCanvas.width = figureHeight;
        width = baseCanvas.width = container.offsetWidth;
        //baseContext.rect(20,20,150,100);
        height =  200;
        baseContext.fillRect(0, 0, width, height); 
        baseContext.fill();
        //baseCanvas.height = 150;
    // 3. tell scrollama to update new element dimensions
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