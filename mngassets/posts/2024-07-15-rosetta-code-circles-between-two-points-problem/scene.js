/* IMPORTS */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/*CLASSES*/

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

//let testPointCircleGeoms01 = new PointCircleGeoms(new Point(20, 30), new Point(50, 30), null);
//console.log("testPointCircleGeoms01", testPointCircleGeoms01);
//console.log(testPointCircleGeoms01.circleFamilythru2Points(2));

//let testPointCircleGeoms02 = new PointCircleGeoms(new Point(20, 30), new Point(50, 30), 30);
//console.log("testPointCircleGeoms02", testPointCircleGeoms02);

/*FIGURE, GENERAL PARAMETERS*/

let paramsFigure = {
	widthSVG: null,
	heightSVG: null,
	marginTopFig: 20,
	marginRightFig: 40,
	marginBottomFig: 20,
	marginLeftFig: 40
}

/*FIGURE SETUP*/

// Create the SVG container.
function SVGCreate(width, height){
	const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);


   //TO KEEP IN MIND: for this case I will 'dispacht' distinctive groups defined by geometry / svg shape
   // this might not be ideal if elements from different groups require to be animated simultaneously,
   // but it might work for this project 
   return svg;
}



export {paramsFigure};
export {SVGCreate};
export {Scene};