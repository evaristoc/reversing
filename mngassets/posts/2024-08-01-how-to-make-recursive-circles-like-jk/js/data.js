/////////////
/* IMPORTS */
/////////////

//https://stackoverflow.com/questions/38946112/es6-import-error-handling

// //import {create, all} from 'https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm';
// //const config = { }
// //mathjs = create(all, config);
// //console.log('m', mathjs);

let mathjs;

// async function getMathjs(){
// 	const {create, all} = await import("https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm");
// 	const config = {};
// 	mathjs = create(all, config);
// 	console.log('m', mathjs);
// };

// function assignESM(v, fn){
// 	v = fn();
// }

// try{
// 	if(process.env.NODE_ENV == 'test'){
// 		const {create, all} = require('mathjs');
// 		const config = { }
// 		mathjs = create(all, config);
// 		//https://stackoverflow.com/questions/38946112/es6-import-error-handling
// 	}
// }catch(e){
// 	if(e instanceof ReferenceError){
// 		//https://stackoverflow.com/questions/38946112/es6-import-error-handling
// 		assignESM(mathjs, getMathjs);

		
// 		// import("https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm").then(({create, all})=>{
// 		// 	const config = { };
// 		// 	mathjs = create(all, config);
// 		// }).catch(err=>
// 		// 	console.log(err.message)
// 		// )
// 	}
// }



// 	console.log('m', mathjs.sqrt(2));
// }).catch(err=>
// 	console.log(err.message)
// )


const {create, all} = require('mathjs');
const config = { }
mathjs = create(all, config);

// import {create, all} from 'https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm';
// const config = { }
// mathjs = create(all, config);

////////////
/* SCHEMA */
////////////

class Point {
	
	pointName;


	
	constructor(x, y, pointName){
		this.position = {
			x: x,
			y: y
		}
		if(pointName && typeof pointName == 'string'){
			this.pointName = pointName;
		}

		//paramsFigure.points.push(this);
	}

	get x(){
		return this.position.x;
	}

	get y(){
		return this.position.y;
	}

	set x(x){
		this.position.x = x;
	}

	set y(y){
		this.position.y = y;
	}

	//get getName(){
	//	return this.name;
	//}

	//set setName(name){
	//	this.name = name;
	//}
	
	draw(){
	}
}

class Line{
	lineName; //in case I want to implement a watcher of point name changes: https://stackoverflow.com/questions/43461248/ecmascript-6-watch-changes-to-class-properties

	constructor(pointA, pointB, lineName){
		if(![pointA.x,pointA.y].every( (v,i) => v == [pointB.x,pointB.y][i])){
			//Because the approach and formulas, we need the points sorted by x values
			if(pointA.x <= pointB.x){
				this.pointA = pointA;
				this.pointB = pointB;
			}else{
				this.pointA = pointB;
				this.pointB = pointA;
			}					
		}else{
			throw new Error("Equal points", { cause: "Line Class - constructor: equal points" });
		}

		if(lineName && typeof lineName == 'string'){
			this.lineName = lineName;
		}else if(this.pointA.pointName && this.pointB.pointName){
			this.lineName = this.pointA.pointName + this.pointB.pointName;
		}
	}

	get middlePoint(){
		return this.__findMiddlePoint();
	}

	get distBtwPoints(){
		return this.__findDistBtwPoints();
	}

	get paramsNormal(){
		return this.__findParamsNormal();
	}

	get scope(){
		return this.__findScope();
	}

	get projectionSegment(){
		const scope = this.__findScope();
		const alpha = mathjs.atan(scope);
		return this.__trigProjectionSegment(alpha);
	}

	__findMiddlePoint(){
		return new Point((this.pointB.x + this.pointA.x)/2, (this.pointB.y + this.pointA.y)/2, 'M');
	}

	__findScope(){
		return (this.pointB.y - this.pointA.y)/(this.pointB.x - this.pointA.x);
	}

	__findParamsNormal(){
		let mT, cT, atanT, middlePoint;
		mT =  - 1/this.__findScope();
		atanT = Math.atan(mT);
		middlePoint = this.__findMiddlePoint();
		cT = middlePoint.y - mT*middlePoint.x;
		return {mT: mT, atanT: atanT, cT: cT};
	}

	__findDistBtwPoints(){
    	return Math.sqrt((this.pointB.x - this.pointA.x)**2 + (this.pointB.y - this.pointA.y)**2);
	}

	__trigProjectionSegment(alpha){
		const module = this.__findDistBtwPoints();
		let xA;
		xA = module*mathjs.cos(alpha);
		return new Triangle(this.pointA, new Point(this.pointA.x + xA, this.pointA.y), this.pointB, 'trigProjection');
	}

}

class Vector{
	//TODO
}

class Arc{

	arcName;

	constructor(segmentA, segmentB, arcName){
		this.segmentA = segmentA;
		this.segmentB = segmentB;
		
		if(arcName && typeof arcName == 'string'){
			this.arcName = arcName;
		}else {
			this.lineName = 'arcAB';
		}
	}

	get interiorAngle(){
		return this.__findIntAngle()
	}

	__findIntAngle(){
		/* Interior Angle between two segments */
		/*
		TODO:
		-- calculate angles
		https://www.cuemath.com/geometry/angle-between-vectors/
		https://unacademy.com/content/jee/study-material/mathematics/angle-between-two-lines
		*/
		//let tanAngle = (this.segmentA.scope - this.segmentB.scope)/(1 + this.segmentA.scope*this.segmentB.scope);
		let angle1 = mathjs.abs(mathjs.atan(this.segmentA.scope));
		let angle2 = mathjs.abs(mathjs.atan(this.segmentB.scope));
		let angle;

		angle = mathjs.max(angle1,angle2) - mathjs.min(angle1,angle2);
		return angle;

	}

}
class Triangle{

	/*
	TODO:
	https://stackoverflow.com/a/65510172
	*/

	/*
	useful table
		Angle in Degrees	Angle in Radians
		45°	π/4 = 0.785 Rad
		60°	π/3 = 1.047 Rad
		90°	π/2 = 1.571 Rad
		120°	2π/3 = 2.094 Rad
	*/

	triangleName;
	isRect = false;
	//constructor(pointA, pointB, pointC, alpha, beta, gamma, ab, bc, ca){
		constructor(pointA, pointB, pointC, triangleName){
		//this is incorrect: segments are one thing; length of segments other
		this.AB;
		this.BC;
		this.CA;
		if(pointA && pointB && pointC){
			try{
				this.AB = new Line(pointA, pointB, 'AB');
				this.BC = new Line(pointB, pointC, 'BC');
				this.CA = new Line(pointC, pointA, 'CA');
				let alpha1Arc = new Arc(this.AB, this.BC, 'alphaAC');
				let alpha2Arc = new Arc(this.BC, this.CA, 'alphaBA');
				let alpha3Arc = new Arc(this.CA, this.AB, 'alphaCB');
				let alpha1 = alpha1Arc.__findIntAngle();
				let alpha2 = alpha2Arc.__findIntAngle();
				let alpha3 = alpha3Arc.__findIntAngle();
				if(alpha1 == mathjs.PI/2 || alpha2 == mathjs.PI/2 || alpha3 == mathjs.PI/2 ){
					this.isRect = true;
				}
				if((alpha1 + alpha2 + alpha3) == mathjs.PI){
					this.alpha1 = alpha1Arc;
					this.alpha2 = alpha2Arc;
					this.alpha3 = alpha3Arc;
				}else{
					throw new Error("Triangle Class - constructor: incorrect calculation of angles");					
				}
				if(triangleName && typeof triangleName == 'string'){
					this.triangleName = triangleName;
				}else{
					this.triangleName = 'ABC';
				}
			}catch(e){
				throw new Error("Triangle Class - constructor: error in the construction of the triangle", { cause: e.message });
			}finally{
				this.triangleName = triangleName;
			}

		}else{
			throw new ReferenceError("Not all points", { cause: "Triangle Class - constructor: at least one of the points is not given" });
		}
	}


	__pitagoras(){
		if(this.isRect){
			/*
			TODO:
			-- confirm rectangular shape
			-- create a function that works for all possible combinations of segments using Math library
			*/
		}
	}

}


//let a = new Triangle(new Point(1,2,'testA'), new Point(1,2,'testB'), new Point(3,4,'testC'), 'testtriangle');
//console.log(a);
class Circle{

    circleName;

	constructor(point, r){
		this.center = point;
		this.r = r;
	}

}


//E: CHECK: https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance (super cool!!!)
class PointCircleGeoms extends Line{
	
	centerProjection;
	distPoint2Center;

	constructor(pointA, pointB, r, lineName){
		super(pointA, pointB, lineName);
		this.r = r;
	}

	get distPoint2Center(){
		return this.__findDistPoint2Center();
	}

	get centerProjection(){
		if(this.r){
			return this.centerProjection = this.__findCenterByProjection();
		}

		return;
	}

	circleFamilythru2Points(lambda){
		/* From
		https://testbook.com/question-answer/find-the-equation-of-the-family-of-circles-which-a--5f7c9e2f9c609e28bb4ea4cb
		Question: find-the-equation-of-the-family-of-circles-which-are-passing-through-...

		https://www.quora.com/How-do-you-convert-a-general-form-to-a-standard-form-circle
		
		finding the Standard Equation:

		(x - h)**2 + (y - k)**2 = r**2
		
		from the General Equation:

		x**2 + 2hx + y**2 + 2ky + C = 0

		where: C = h**2 + k**2 + r**2 (A from the equation is equal for x and y and in this case is 1)

		using:

			//solving cuadratica
			X*X-X*(pointA.x+pointB.x)+pointA.x*pointB.x +
			Y*Y-Y*(pointA.y+pointB.y)+pointA.y*pointB.y +
			//solving determinante
			Y*(pointB.x*1 - pointA.x*1)*lambda +
			X*(pointA.y*1 - pointB.y*1)*lambda +
			(pointA.x*pointB.y*1 - pointA.y*pointB.x*1)*lambda
		*/
		let h = ((this.pointA.x+this.pointB.x)-(this.pointA.y*1 - this.pointB.y*1)*lambda)/2; // NOTICE: I changed the sign of the second expression (the determinant solution) and it was correct
		let k = ((this.pointA.y+this.pointB.y)-(this.pointB.x*1 - this.pointA.x*1)*lambda)/2; // NOTICE: same as above
		let C = this.pointA.x*this.pointB.x + this.pointA.y*this.pointB.y + (this.pointA.x*this.pointB.y*1.0 - this.pointA.y*this.pointB.x*1.0)*lambda;
		let rA2 =  -C + h**2 + k**2;
		let r = mathjs.sqrt(rA2);
		return new Circle(new Point(h, k), r);
	}


	__findDistPoint2Center(){
		return mathjs.sqrt(this.r**2 - (this.__findDistBtwPoints()/2)**2);
	}
	
	/*TODO: 
	Check this method, as it is giving strange results when called, like two different radii when 
	only one is possible???
	A correct result is calculated at interactive block number 20 on 'interactions.js'
	*/
	__findCenterByProjection(r){ //here we are actually using the parametric equation of the circle
		const {mT, atanT, cT} = this.__findParamsNormal();
		const distPoint2Center = this.__findDistPoint2Center();
		const middlePoint = this.__findMiddlePoint();
		let xA, yA, xB, yB;
        xA = middlePoint.x - distPoint2Center*Math.cos(atanT);
        yA = middlePoint.y - distPoint2Center*Math.sin(atanT);
        xB = middlePoint.x + distPoint2Center*Math.cos(atanT);
        yB = middlePoint.y + distPoint2Center*Math.sin(atanT);
	  
		return [[new Circle(xA, yA, r), new Circle(xB, yB, r)], {atanT: atanT}];
	}

}


let geometryData = {
    // points:{
    //     pointA: new Point(175, 300, 'A'),
    //     pointB: new Point(425, 300, 'B'),
    //     middlePoint: null,
    //     C1: null,
    //     C2: null
    // },
    //each point: {x:value, y:value, name: value}
    points:[], 
    //d3 works with list indexes so each {names:[], extremes:[], dists:[], colors:[]} should be ordered accordingly; 
    //each extremes should be [{x:value, y:value}, {x:value, y:value}]
    segments:[],
    circles:[],
    circlesFam:[],
    r: 180
};


/////////////
/* EXPORTS */
/////////////
export {Point};
export {Circle};
export {Line};
export {Triangle};
export {PointCircleGeoms};
//OBSERVATION: need to prevent shallow copy of the geometryData object: https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
export let geometries = [geometryData, JSON.parse(JSON.stringify(geometryData))];