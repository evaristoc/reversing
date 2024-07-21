////////////
/* SCHEMA */
////////////

class Point {
	
	name;


	
	constructor(x, y, name){
		this.position = {
			x: x,
			y: y
		}
		if(name && typeof name == 'string'){
			this.name = name;
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
	linename; //in case I want to implement a watcher of point name changes: https://stackoverflow.com/questions/43461248/ecmascript-6-watch-changes-to-class-properties

	constructor(pointA, pointB, linename){
		
		//Because the approach and formulas, we need the points sorted by x values
		if(pointA.x <= pointB.x){
			this.pointA = pointA;
			this.pointB = pointB;
		}else{
			this.pointA = pointB;
			this.pointB = pointA;
		}
		if(linename && typeof linename == 'string'){
			this.linename = linename;
		}else if(this.pointA.name && this.pointB.name){
			this.linename = this.pointA.name + this.pointB.name;
		}
		this.middlePoint = this.findMiddlePoint();
		let a = this.findParamsNormal();
		this.mt = a.mt; 
		this.atanT = a.atanT; 
		this.cT = a.cT;
	}

	findMiddlePoint(){
		return new Point((this.pointB.x + this.pointA.x)/2, (this.pointB.y + this.pointA.y)/2);
	}

	findParamsNormal(){
		let mT, cT, atanT;
		mT =  - (this.pointB.x - this.pointA.x)/(this.pointB.y - this.pointA.y);
		atanT = Math.atan(mT);
		cT = this.middlePoint.y - mT*this.middlePoint.x;
		return {mT: mT, atanT: atanT, cT: cT};
	}

}

class Circle{

	constructor(point, r){
		this.center = point;
		this.r = r;
	}

}


//E: CHECK: https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance (super cool!!!)
class PointCircleGeoms extends Line{
	
	centerbasedonTrig;
	distPoint2Center;

	constructor(pointA, pointB, r){
		super(pointA, pointB);
		this.r = r;
		this.distBtwPoints = this.findDistBtwPoints();
		if(this.r){
			this.distPoint2Center = this.findDistPoint2Center();
			this.centerbasedonTrig = this.findCenterbasedonTrig();
		}
	}
	
	get getdistBtwPoints(){
		return this.distBtwPoints;
	}

	get getdistPoint2Center(){
		return this.distPoint2Center;
	}

	get getr(){
		return this.r;
	}

	set setr(r){
		this.r = r;
		if(this.r > 0){
			this.distPoint2Center = this.findDistPoint2Center();
			this.centerbasedonTrig = this.findCenterbasedonTrig();
		}
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
		let r = Math.sqrt(rA2);
		return new Circle(new Point(h, k), r);
	}

	findDistBtwPoints(){
    	return Math.sqrt((this.pointB.x - this.pointA.x)**2 + (this.pointB.y - this.pointA.y)**2);
	}

	findDistPoint2Center(){
		return Math.sqrt(this.r**2 - (this.distBtwPoints/2)**2); //Why? It is a square!!!
	}
	

	findCenterbasedonTrig(){ //here we are actually using the parametric equation of the circle
		let asinT = Math.asin(this.distBtwPoints/2/this.r);
		let theta1 = Math.PI - this.atanT - asinT;
		let theta2 = Math.PI - this.atanT + asinT;
		let theta3 = this.atanT + asinT;
		let theta4 = this.atanT - asinT;
		let theta5 = Math.PI + this.atanT + asinT;
		let theta6 = Math.PI + this.atanT - asinT;
		let theta7 = -this.atanT - asinT;
		let theta8 = -this.atanT + asinT;
	
		let angls = [ this.atanT, asinT, this.atanT*57.30, this.asinT*57.30];
		let calAngles = {'theta1 = Math.PI - atanT - asinT': theta1, 
						'theta2 = Math.PI - atanT + asinT': theta2, 
						'theta3 = atanT + asinT': theta3, 
						'theta4 = atanT - asinT': theta4, 
						'theta5 = Math.PI + atanT + asinT': theta5, 
						'theta6 = Math.PI + atanT - asinT': theta6, 
						'theta7 = -atanT - asinT': theta7, 
						'theta8 = -atanT + asinT': theta8};
	
		//TODO: Probably a test based on below?
		console.log(this.atanT > asinT, this.atanT == asinT, this.atanT > Math.PI/2, asinT > Math.PI/2, this.atanT > 0, asinT > 0, this.pointA.y == this.pointB.y);
		let xA, yA, xB, yB;
		if(this.atanT > 0 && this.pointA.y != this.pointB.y){
			console.log('FIRST COMPARISON')
			console.log(angls);
			console.log(calAngles);
			console.log(Object.values(calAngles).map(a=>Math.sin(a)));
			console.log(Object.values(calAngles).map(a=>Math.cos(a)));
			xA = this.pointA.x -this. r*Math.cos(theta3); //atanT + asinT
			yA = this.pointA.y - this.r*Math.sin(theta3); //atanT + asinT
			xB = this.pointB.x + this.r*Math.cos(theta3); //atanT + asinT
			yB = this.pointA.y + this.r*Math.sin(theta4); //atanT - asinT
		}else if(this.pointA.y == this.pointB.y){
			console.log('SECOND COMPARISON')
			console.log(angls);
			console.log(calAngles);
			console.log(Object.values(calAngles).map(a=>Math.sin(a)));
			console.log(Object.values(calAngles).map(a=>Math.cos(a)));
			xA = this.pointA.x - this.r*Math.cos(theta4); //atanT - asinT
			yA = this.pointA.y - this.r*Math.sin(theta3); //atanT + asinT
			xB = this.pointB.x + this.r*Math.cos(theta4); //atanT - asinT
			yB = this.pointA.y + this.r*Math.sin(theta4); //atanT - asinT       
		}else if(this.atanT <= 0 && this.pointA.y != this.pointB.y){
			console.log('THIRD COMPARISON')
			console.log(angls);
			console.log(calAngles);
			console.log(Object.values(calAngles).map(a=>Math.sin(a)));
			console.log(Object.values(calAngles).map(a=>Math.cos(a)));
			xA = this.pointA.x - this.r*Math.cos(theta4); //atanT - asinT
			yA = this.pointA.y -this. r*Math.sin(theta4); //atanT - asinT
			xB = this.pointB.x + this.r*Math.cos(theta4); //atanT - asinT
			yB = this.pointA.y + this.r*Math.sin(theta3); //atanT + asinT     
		}

	  
		return [[new Circle(xA, yA, this.r), new Circle(xB, yB, this.r)], {atanT: this.atanT, asinT: asinT}];
	}

}

let geometries = {
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
export {PointCircleGeoms};
export {geometries};