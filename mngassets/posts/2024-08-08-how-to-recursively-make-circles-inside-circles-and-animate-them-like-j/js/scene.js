/////////////
/* IMPORTS */
/////////////

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

///////////
/*CLASSES*/
///////////
class Scene {
	constructor(container, id){
		this.container = container;
		this.canvasElem = document.createElement('canvas');
		this.scene = this.canvasElem.getContext('2d');
		if(id){
			this.canvasElem.setAttribute('id', id);
		}

	}

	setDimensionsD3(w,h){
		if(w){
			this.width = w;
		}else{
			this.width = this.container.node().offsetWidth;
		}
		if(h){
			this.height = h;
		}
		this.canvasElem.width = this.width;
		this.canvasElem.height = this.height;


	}

	appendCanvasD3(){
		this.container.node().appendChild(this.canvasElem);
	}
}

//////////////////////////////
/*FIGURE, GENERAL PARAMETERS*/
//////////////////////////////

let paramsFigure = {
	widthSVG: null,
	heightSVG: null,
	marginTopFig: 20,
	marginRightFig: 40,
	marginBottomFig: 20,
	marginLeftFig: 40
}

////////////////
/*FIGURE SETUP*/
////////////////

// Create the Canvas container.
function canvasCreate(w, h, selector){
	let section = document.querySelector(selector);

	// let guiElem = section.querySelector("div");
    
	// let canvas = section.querySelector("canvas");

	// canvas.setAttribute('width', w);
	// canvas.setAttribute('height', h);
	

	// let ctx = canvas.getContext("2d");

	// 	//ctx.fillRect(0, 0, w, h);
	// ctx.lineWidth = 10;
	// ctx.strokeStyle = 'red';
	// ctx.beginPath();
	// ctx.rect(175, 25, 100, 100);
	// ctx.stroke();
	// ctx.fill();


	//const konvaContainer = section.querySelector('#konvacontainer');
	const stage = new Konva.Stage({
		container: '#konvacontainer',
		width: w,
		height:h
	});

	const layer = new Konva.Layer();



	//__resize(w, h, canvas);
	

   //return {section, canvas, ctx, guiElem, w, h, stage, layer};
   return {stage, layer};
}

// function __resize(w, h, c){
// 	//w = c.width = window.innerWidth;
// 	//h = c.height = window.innerHeight;
// 	let container = document.querySelector('div.wrapper');
// 	w = c.width = container.offsetWidth;
// 	h = c.height = 300;
// }


/////////////
/* EXPORTS */
/////////////
export {paramsFigure};
export {canvasCreate};
export {Scene};