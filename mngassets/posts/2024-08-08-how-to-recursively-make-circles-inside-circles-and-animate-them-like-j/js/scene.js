/////////////
/* IMPORTS */
/////////////

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

	let guiElem = section.querySelector("div");
    
	let canvas = section.querySelector("canvas");

	canvas.setAttribute('width', w);
	canvas.setAttribute('height', h);
	

	let ctx = canvas.getContext("2d");

		//ctx.fillRect(0, 0, w, h);
	ctx.lineWidth = 10;
	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.rect(175, 25, 100, 100);
	ctx.stroke();
	ctx.fill();


	__resize(w, h, canvas);
	

   return {section, canvas, ctx, guiElem, w, h};
}

function __resize(w, h, c){
	let container = document.querySelector('div.wrapper');
	w = c.width = container.offsetWidth;
	h = c.height = 300;
}


/////////////
/* EXPORTS */
/////////////
export {paramsFigure};
export {canvasCreate};
export {Scene};