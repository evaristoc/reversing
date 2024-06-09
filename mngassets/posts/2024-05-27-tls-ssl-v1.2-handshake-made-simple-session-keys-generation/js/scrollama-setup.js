
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
    (function(divsteps){
        console.log(divsteps);
        for(let i = 0; i < divsteps.length; i++){
            if(divsteps.classList?.contains('is-active')){
                console.log(divsteps.classList[i]);
                break;
            }
        }
    })(document.querySelectorAll('div.step'))


    //   (function(scroll){
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
    //   })(document.querySelector('div.step'));

    //   (function(smoothScroll){
    //     console.log(smoothScroll);
    //   })(document.getElementsByClassName('is-active'));

    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) { return i === response.index; });
            //console.log('response', response);
            //response.element.querySelector('.explain').style.display = 'inline';
    // update graphic based on step
        //figure.select('p').text(response.index + 1);
        let figElem = document.getElementById('scrollfig');

        const resourcesImgs = '../../../../../mngassets/posts/2024-05-27-tls-ssl-v1.2-handshake-made-simple-session-keys-generation/img/';

        let skipExplain = [0,5,11,15,17];

        if(skipExplain.includes(response.index)){
            figElem.innerHTML = "";
        }
        else if(response.index == 1){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - asymmetric keys.png';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);

        }
        else if(response.index == 2){
            //let scrolly = document.querySelector('#scrolly');
            //let a = scrolly.querySelector('figure');
            //a.style.flexBasis = '0%';
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - client asymmetric encryption.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 3){
            figElem.innerHTML = "";
            //let step4Elem = document.querySelector(".step[data-step='4']");
            //step4Elem.style.width = '1px';
            //step4Elem.parentNode.style.width = '0px';
            //let scrolly = document.querySelector('#scrolly');
            //let a = scrolly.querySelector('figure');
            //a.style.flexBasis = '80%';
            //let b = scrolly.querySelector('articlepost');
            //b.style.flexBasis = '20%';
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - clientPREMASTER2server airplane.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 4){
            //let scrolly = document.querySelector('#scrolly');
            //let a = scrolly.querySelector('figure');
            //a.style.flexBasis = '0%';
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - server asymmetric decryption.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 6){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - randoms and pre-master.png';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 7){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - PRF Master Secret.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 8){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - randoms and master.png';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 9){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - pre-master or master.png';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 10){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - PRF Session Keys.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);            
        }
        else if(response.index == 12 && figElem.getElementsByClassName('scrollamaImg')[0] == null){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - session keys.png';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);
        }
        else if(response.index == 13){
            console.log(response.element.querySelector('.explain'));
            (function(scroll){
                scroll.onscroll = function(){
                    let sibling = scroll.parentNode.querySelector('.arrow');
                    sibling.style.opacity = 1 - scroll.scrollTop/(scroll.scrollHeight - scroll.clientHeight);
                }
            })(response.element.querySelector('.explain'));
            
            response.element.querySelector('.arrow')

            response.element.querySelector('.arrow').onclick = function(){
                let sibling = response.element.querySelector('.explain');
                console.log(response.element);
                sibling.scrollBy({
                    top:10,
                    left:0,
                    behaviour:'smooth'
                });
            };
            
            if(!figElem.getElementsByClassName('scrollamaImg')[0].src.includes('TLS%20-%20session%20keys.png')){
                //response.index == 13 && figElem.getElementsByClassName('scrollamaImg')[0] == null
                //console.log(figElem.getElementsByClassName('scrollamaImg')[0].src);
                figElem.innerHTML = "";
                let img = document.createElement("img");
                img.src = resourcesImgs + 'TLS - session keys.png';
                img.classList.add('scrollamaImg');
                figElem.appendChild(img);
            }
        } 

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
        else if(response.index == 14){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - clientFINISHED2server airplane.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);                
        }
        else if(response.index == 16){
            figElem.innerHTML = "";
            let img = document.createElement("img");
            img.src = resourcesImgs + 'TLS - serverFINISHED2client airplane.svg';
            img.classList.add('scrollamaImg');
            figElem.appendChild(img);                
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