/*
window.onload = (event) {

    TODO 
    Move eventually the init function here
    it should contain the init of the scrollama and the figure, all in one function
    then it should start the rendering of both, and the effects of resizing and scrolling
    so far, the init rendering function of the whole project is in the scrollama setup

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
    */