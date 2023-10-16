let paramsFigure = {
	rendererFunc: ()=>{return new THREE.WebGLRenderer({ alpha: true })},
	//renderer: this.rendererFunc(),
	container: null,
	baseCanvas: null,
	baseContext: null,
	perlinCanvas: null,
	perlinContext: null,
	perlinImageData: null,
	width: 10,
	height: 200,
	// circle: function(){
		
	// 	var zelf = this;
	// 	return {
	// 		x: zelf.container.offsetWidth / 2,
	// 		y: 100,
	// 		r: zelf.container.offsetWidth / 2. / 2. / 2.
	// 	};
	// },
	circle: {
		x: null,
		y: null,
		r: null
	},

	startTime : new Date().getTime(),
	hairs: [],
	// renderingFunc: {
	// 	now : new Date().getTime(),
	// 	startTime: null,
	// 	currentTime: function(){return (this.now - this.startTime)/10000},
	// 	renderer : null,
	// 	render: function(){
	// 		var zelf = this;
	// 		console.log(zelf.startTime);
	// 		console.log(zelf.now);
	// 		//requestAnimationFrame(zelf.render.bind(zelf));
	// 	}

	// }
	
        //requestAnimationFrame( render );
}
	

class Hair {
	constructor(){
		let r = 2 * Math.PI * Math.random(),
			d = Math.sqrt(Math.random())

		this.position = {
			x: Math.floor(paramsFigure.circle.x + Math.cos(r) * d * paramsFigure.circle.r),
			y: Math.floor(paramsFigure.circle.y + Math.sin(r) * d * paramsFigure.circle.r)
		}
		
		this.length = Math.floor(Math.random() * 10) + 10;
		paramsFigure.hairs.push(this);
	}
	
	draw(){
			let { position, length } = this,
			{ x, y } = position,
			i = (y * paramsFigure.width + x) * 4,
			d = paramsFigure.perlinImgData.data,
			noise = d[i],
			angle = (noise / 255) * Math.PI
		
		paramsFigure.baseContext.moveTo(x, y)
		paramsFigure.baseContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
	}
}


for(var i = 0; i < 6000; i++){
	new Hair()
}

//paramsFigure.hairs = hairs;

export {paramsFigure}



// function init(){
// 	console.log(container);
//     const baseCanvas = document.createElement('canvas');
// 	const baseContext = baseCanvas.getContext('2d');
// 	const perlinCanvas = document.createElement('canvas');
// 	const perlinContext = perlinCanvas.getContext('2d');
// 	//const width = baseCanvas.width = container.offsetWidth;
// 		 //height = baseCanvas.height = container.offsetHeight,
// 		 //height = baseCanvas.height = container.offsetWidth/2,
//     const  width = container.offsetWidth;
// 	//const height = baseCanvas.height = baseCanvas.width / 2.;
// 	const height = baseCanvas.height = 200;
// 	const circle = {
// 			 //y: container.offsetHeight === 0? container.offsetWidth/ 2. : container.offsetHeight / 2., 
// 			 x:  container.offsetWidth / 2.,
// 			 y: 100,
// 			 r: container.offsetWidth / 2. / 2. / 2.
// 		 };
// 	const hairs = [];
	

// 	console.log("container.offsetHeight ", container.offsetWidth);
// 	console.log("baseCanvas.height ", baseCanvas.height);
// 	console.log("container.offsetWidth ", container.offsetWidth);
// 	console.log("baseCanvas.width ", baseCanvas.width);
// 	console.log("width ", width);
// 	console.log("height ", height);
// 	console.log("circle ", circle);

//     baseCanvas.setAttribute("id", "context");
//     perlinCanvas.setAttribute("id", "perlinCanvas");
// 	container.appendChild(baseCanvas);
//     renderer.setSize( width, height );

//     let perlinImgData = undefined
	
// 	perlinCanvas.width = width
// 	perlinCanvas.height = height
	
// 	baseContext.strokeStyle = '#111'
//     baseContext.fillStyle = "rgb(200,200,200)";
//     baseContext.fillRect(0, 0, width, height);

// 	class Hair {
// 		constructor(){
// 			let r = 2 * Math.PI * Math.random(),
// 			    d = Math.sqrt(Math.random())

// 			this.position = {
// 				x: Math.floor(circle.x + Math.cos(r) * d * circle.r),
// 				y: Math.floor(circle.y + Math.sin(r) * d * circle.r)
// 			}
			
// 			this.length = Math.floor(Math.random() * 10) + 10
// 			hairs.push(this)
// 		}
		
// 		draw(){
//     			let { position, length } = this,
// 			    { x, y } = position,
// 			    i = (y * width + x) * 4,
// 			    d = perlinImgData.data,
// 			    noise = d[i],
// 			    angle = (noise / 255) * Math.PI
			
// 			baseContext.moveTo(x, y)
// 			baseContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
// 		}
// 	}
	
	
// 	for(var i = 0; i < 6000; i++){
// 		new Hair()
// 	}
	
// 	paramsFigure.hairs = hairs;
	
// 	function render() {
// 		var now = new Date().getTime();
// 		var currentTime = (now - startTime) / 1000
		
// 		baseContext.clearRect(0,0,width,height)

// 		perlinContext.clearRect(0, 0, width, height)
// 		perlinContext.drawImage(renderer.domElement, 0, 0)
// 		perlinImgData = perlinContext.getImageData(0, 0, width, height)

//     	baseContext.beginPath()
// 		hairs.map(hair => hair.draw())
        
//         baseContext.fillRect(0, 0, width, height); 
//         baseContext.stroke()
	
//         requestAnimationFrame( render );
// 	}
// 	render()
	
// }

// init();
// export function hello(){
// 	alert(hello);
// }

// function(){
// 	var now = new Date().getTime();
// 	var currentTime = (now - this.startTime) / 1000;
// 	let width = this.width;
// 	let height = this.height;
// 	let renderer = this.rendererFunc();
// 	let render = this.render;
	
// 	this.baseContext.clearRect(0,0,width,height);

// 	this.perlinContext.clearRect(0, 0, width, height);
// 	this.perlinContext.drawImage(renderer.domElement, 0, 0);
// 	this.perlinImgData = this.perlinContext.getImageData(0, 0, width, height);

// 	this.baseContext.beginPath();
// 	this.hairs.map(hair => hair.draw())
	
// 	this.baseContext.fillRect(0, 0, width, height); 
// 	this.baseContext.stroke();
// }
// let container = document.querySelector("figure");
// let startTime = new Date().getTime();
// let renderer = paramsFigure.rendererFunc();

//const hairs = [];
	

// console.log("container.offsetHeight ", container.offsetWidth);
// console.log("baseCanvas.height ", baseCanvas.height);
// console.log("container.offsetWidth ", container.offsetWidth);
// console.log("baseCanvas.width ", baseCanvas.width);
// console.log("width ", width);
// console.log("height ", height);
// console.log("circle ", circle);

//baseCanvas.setAttribute("id", "context");
//perlinCanvas.setAttribute("id", "perlinCanvas");
//container.appendChild(baseCanvas);
//renderer.setSize( width, height );

//let perlinImgData = undefined

//perlinCanvas.width = width
//perlinCanvas.height = height

//baseContext.strokeStyle = '#111'
//baseContext.fillStyle = "rgb(200,200,200)";
//baseContext.fillRect(0, 0, width, height);