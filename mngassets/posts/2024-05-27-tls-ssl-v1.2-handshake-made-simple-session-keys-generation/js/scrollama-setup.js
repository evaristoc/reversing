
window.onload = (event) => {
    // using d3 for convenience
    // E: could have been something like jQuery, etc...
    var main = d3.select('main')
    var scrolly = main.select('#scrolly');
    var figure = scrolly.select('figure');
    var article = scrolly.select('div .articlepost');
    var step = article.selectAll('.step');
    
    // initialize the scrollama
    var scroller = scrollama();



    // generic window resize listener event
    function handleResize() {
        
    // 1. update height of step elements
    // E: I removed a div element from the figure element and now it fits all the space
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style('height', stepH + 'px');

        let figureHeight = window.innerHeight / 2;
        //let figureWidth = window.innerWidth / 2;
        let figureMarginTop = (window.innerHeight - figureHeight) / 2;  
        figure
            .style('height', figureHeight + 'px')
            //.style('width', figureWidth + 'px')
            .style('top', figureMarginTop + 'px');
        
    // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }
    
    /* E: the following for another day... */
    // const isActiveFigure = document.querySelector("#scrollfig.scrollamaImg");
    
    // function isFigActiveEvent(resource){
    //     isActiveFigure.addEventListener("animationended", () => {
    //         figElem.innerHTML = "";
    //         let img = document.createElement("img");
    //         img.src = resourcesImgs + resource;
    //         figElem.classList.add('scrollamaImg');
    //         figElem.appendChild(img);
    //     })
    // }

    // (function(scroll){
    //     scroll.onscroll = function(){
    //         let sibling = scroll.parentNode.querySelector('.arrow');
    //         //console.log(sibling.style.opacity);
    //         //console.log(scroll.parentNode.style.height, scroll.parentNode.getBoundingClientRect(), scroll.scrollTop, scroll.clientHeight, scroll.scrollHeight);  
    //         //sibling.style.opacity = 1 - (scroll.scrollTop + scroll.clientHeight)/scroll.scrollHeight;
    //         //console.log(scroll.scrollTop, scroll.clientHeight, scroll.scrollHeight);
    //         sibling.style.opacity = 1 - scroll.scrollTop/(scroll.scrollHeight - scroll.clientHeight)             
    //         if (scroll.scrollTop + scroll.clientHeight == scroll.scrollHeight) {
    //             //console.log('hither!');
    //         }
    //         }
    //   })(document.getElementById('scroll'));

    //console.log(document.querySelectorAll('div.step'))
    // (function(divsteps){
    //     console.log(divsteps);
    //     for(let i = 0; i < divsteps.length; i++){
    //         if(divsteps.classList?.contains('is-active')){
    //             console.log(divsteps.classList[i]);
    //             break;
    //         }
    //     }
    // })(document.querySelectorAll('div.step'))


    const resourcesImgs = '../../../../../mngassets/posts/2024-05-27-tls-ssl-v1.2-handshake-made-simple-session-keys-generation/img/';

    let imageNamesObj = {
         0: {img:null,type:'t',text:true},
         1: {img:'TLS - asymmetric keys.png',type:'e',text:true},
         2: {img:'TLS - client asymmetric encryption.svg',type:'e',text:true},
         3: {img:'TLS - clientPREMASTER2server airplane.svg',type:'i',text:false},
         4: {img:'TLS - server asymmetric decryption.svg',type:'e',text:true},
         5: {img:null,type:'t',text:true},
         6: {img:'TLS - randoms and pre-master.png',type:'e',text:true},
         7: {img:'TLS - PRF Master Secret.svg',type:'e',text:true},
         8: {img:'TLS - randoms and master.png',type:'e',text:true},
         9: {img:'TLS - pre-master or master.png',type:'e',text:true},
         10: {img:'TLS - PRF Session Keys.svg',type:'e',text:true},
         11: {img:null,type:'t',text:true},
         12: {img:'TLS - session keys.png',type:'e',text:true},
         13: {img:'TLS - session keys.png',type:'e',text:true},
         14: {img:'TLS - clientFINISHED2server airplane.svg',type:'i',text:false},
         15: {img:null,type:'e',text:true},
         16: {img:'TLS - serverFINISHED2client airplane.svg',type:'i',text:false},
         17: {img:null,type:'e',text:true}
    }


    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        // E: add class active to the step which response.index is entering
        step.classed('is-active', function (d, i) { return i === response.index; });
            //console.log('response', response);
            //response.element.querySelector('.explain').style.display = 'inline';
        // update graphic based on step
        //figure.select('p').text(response.index + 1);
        let figElem = document.getElementById('scrollfig');

        function imagePlacing(imageName){
            figElem.innerHTML = "";
            if(imageName){
                let img = document.createElement("img");
                img.src = resourcesImgs + imageName;
                img.classList.add('scrollamaImg');
                figElem.appendChild(img);
            }
       }
   
        function arrowOpacityAnimationScroll(){
            let scroll = response.element.querySelector('.explain');
            //if(response.element.querySelector('.explain').style.height > '50px'){
                scroll.onscroll = function(){
                    let arrowDown = scroll.parentNode.querySelector('.arrow.down');
                    arrowDown.style.opacity = 1 - scroll.scrollTop/(scroll.scrollHeight - scroll.clientHeight);
                    let arrowTop = scroll.parentNode.querySelector('.arrow.top');
                    arrowTop.style.opacity = scroll.scrollTop/(scroll.scrollHeight - scroll.clientHeight);
                }
            //}else{
            //    response.element.querySelectorAll('.arrow-wrap .arrow').forEach((v)=>{console.log(v);v.style.display = 'none';}) 
            //}

       };
   
   
       function arrowAnimationClick(){
           response.element.querySelector('.arrow.down').onclick = function(){
               let sibling = response.element.querySelector('.explain');
               sibling.scrollBy({
                   top:10,
                   left:0,
                   behaviour:'smooth'
               });
           };
           response.element.querySelector('.arrow.top').onclick = function(){
               let sibling = response.element.querySelector('.explain');
                sibling.scrollBy({
                   top:-10,
                   left:0,
                   behaviour:'smooth'
               });
           };    
       }

        try{
            if(response.index in imageNamesObj){
                let currentActive = imageNamesObj[response.index];
                if([0,1,2,3,4,5,6,7,8,9,10,11,14,15,16,17].includes(response.index)){
                    imagePlacing(currentActive.img);
                    if(currentActive.text && currentActive.type == 'e'){
                        let totalHeight = 0;
                        response.element.querySelector('.explain').querySelectorAll('p').forEach((v)=>{totalHeight += v.clientHeight;})
                        if(totalHeight > .97*response.element.querySelector('.explain').clientHeight){
                            arrowOpacityAnimationScroll();
                            arrowAnimationClick();
                        }else{
                            response.element.querySelectorAll('.arrow-wrap').forEach((v)=>{v.style.display = 'none';})
                        }
                    }
                }else if(response.index == 12 && figElem.getElementsByClassName('scrollamaImg')[0] == null){
                    imagePlacing(currentActive.img);
                    let totalHeight = 0;
                    response.element.querySelector('.explain').querySelectorAll('p').forEach((v)=>{totalHeight += v.clientHeight;})
                    if(totalHeight > .97*response.element.querySelector('.explain').clientHeight){
                        arrowOpacityAnimationScroll();
                        arrowAnimationClick();
                    }else{
                        response.element.querySelectorAll('.arrow-wrap').forEach((v)=>{v.style.display = 'none';})
                    }
                }
                else if(response.index == 13){
                    let totalHeight = 0;
                    response.element.querySelector('.explain').querySelectorAll('p').forEach((v)=>{totalHeight += v.clientHeight;})
                    //console.log(total, Array.from(response.element.querySelector('.explain').querySelectorAll('p')).reduce((t,p)=>{return t += p.clientHeight;}), .95*response.element.querySelector('.explain').clientHeight);
                    if(totalHeight > .97*response.element.querySelector('.explain').clientHeight){
                        arrowOpacityAnimationScroll();
                        arrowAnimationClick();
                    }else{
                        response.element.querySelectorAll('.arrow-wrap').forEach((v)=>{v.style.display = 'none';})
                    }
                    if(!figElem.getElementsByClassName('scrollamaImg')[0].src.includes('TLS%20-%20session%20keys.png')){
                        imagePlacing(currentActive.img);
                    }
                }
            }else{
                alert('step not found');
            }
        }catch(err){
            alert(err.message);
            document.getElementById("error").innerHTML = err.message;          
        }

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
            step: '#scrolly div.articlepost .step',
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