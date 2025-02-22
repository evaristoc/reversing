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
		
		//Because the approach and formulas, we need the points sorted by x values
		if(pointA.x <= pointB.x){
			this.pointA = pointA;
			this.pointB = pointB;
		}else{
			this.pointA = pointB;
			this.pointB = pointA;
		}
		if(lineName && typeof lineName == 'string'){
			this.lineName = lineName;
		}else if(this.pointA.pointName && this.pointB.pointName){
			this.lineName = this.pointA.pointName + this.pointB.pointName;
		}
		this.distBtwPoints = this.findDistBtwPoints();
		this.middlePoint = this.findMiddlePoint();
		let a = this.findParamsNormal();
		this.mt = a.mT; 
		this.atanT = a.atanT; 
		this.cT = a.cT;
	}

	findMiddlePoint(){
		return new Point((this.pointB.x + this.pointA.x)/2, (this.pointB.y + this.pointA.y)/2, 'M');
	}

	findParamsNormal(){
		let mT, cT, atanT;
		mT =  - (this.pointB.x - this.pointA.x)/(this.pointB.y - this.pointA.y);
		atanT = Math.atan(mT);
		cT = this.middlePoint.y - mT*this.middlePoint.x;
		return {mT: mT, atanT: atanT, cT: cT};
	}

	findDistBtwPoints(){
    	return Math.sqrt((this.pointB.x - this.pointA.x)**2 + (this.pointB.y - this.pointA.y)**2);
	}

}

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
		if(this.r){
			this.distPoint2Center = this.findDistPoint2Center();
			this.centerProjection = this.findCenterByProjection();
		}
	}
	
	get getdistBtwPoints(){
		return this.distBtwPoints;
	}

	get getdistPoint2Center(){
		return this.distPoint2Center;
	}

	// get getr(){
	// 	return this.r;
	// }

	// set setr(r){
	// 	this.r = r;
	// 	if(this.r > 0){
	// 		this.distPoint2Center = this.findDistPoint2Center();
	// 		this.centerProjection = this.findCenterByProjection();
	// 	}
	// }

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
		let r = Math.sqrt(rA2);
		return new Circle(new Point(h, k), r);
	}


	findDistPoint2Center(){
		return Math.sqrt(this.r**2 - (this.distBtwPoints/2)**2); //Why? It is a square!!!
	}
	
	/*TODO: 
	Check this method, as it is giving strange results when called, like two different radii when 
	only one is possible???
	A correct result is calculated at interactive block number 20 on 'interactions.js'
	*/
	findCenterByProjection(){ //here we are actually using the parametric equation of the circle
		console.log(this.atanT, this.r)
		let xA, yA, xB, yB;
        xA = this.middlePoint.x - this.distPoint2Center*Math.cos(this.atanT);
        yA = this.middlePoint.y - this.distPoint2Center*Math.sin(this.atanT);
        xB = this.middlePoint.x + this.distPoint2Center*Math.cos(this.atanT);
        yB = this.middlePoint.y + this.distPoint2Center*Math.sin(this.atanT);
	  
		return [[new Circle(xA, yA, this.r), new Circle(xB, yB, this.r)], {atanT: this.atanT}];
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
export {PointCircleGeoms};
//OBSERVATION: need to prevent shallow copy of the geometryData object: https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
export let geometries = [geometryData, JSON.parse(JSON.stringify(geometryData))];