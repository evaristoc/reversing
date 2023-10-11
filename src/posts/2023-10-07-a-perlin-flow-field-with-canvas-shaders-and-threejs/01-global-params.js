let paramsFigure = {
	rendererThree: new THREE.WebGLRenderer({ alpha: true }),
	baseCanvasD3js: null,
	baseContextD3js: null,
	perlinCanvasD3js: null,
	perlinContext: null,
}

let paramScrollama = {
    containerD3js : null,
    //mainD3js : null,
    scrollyD3js : null,
    figureD3js : null,
    articleD3js: null,
    stepD3js : null,
    width : null,
    height : null
}

// function getElement(parent, selector, all=false){
//     if(!all) {
//         return parent.querySelector(selector);
//     }else{
//         return parent.querySelectorAll(selector);
//     }
    
// }

// function getElementById(parent, selector){
//     return parent.getElementById(selector);
// }

function getElementD3js(parent, selector, all=false){
    console.warn("Using D3.js to manipulate the DOM elements");
    if(!all) {
        return parent.select(selector);
    }else{
        return parent.selectAll(selector);
    }
    
}

const scrolly = paramScrollama.scrollyD3js = getElementD3js(d3, "#stickyoverlay");
const container = paramScrollama.containerD3js = getElementD3js(scrolly, "figure");
const figure = paramScrollama.figureD3js = container;
const article = paramScrollama.articleD3js = getElementD3js(scrolly, "div .articlepost");
const step = paramScrollama.stepD3js = getElementD3js(article, ".step", true);
const baseCanvas = paramsFigure.baseCanvasD3js = getElementD3js(container, "#context");
let baseCanvasNode = baseCanvas.node();
const baseContext = paramsFigure.baseContext = paramScrollama.baseCanvas.getContext("2d");