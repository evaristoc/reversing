let paramsFigure = {
	widthSVG:640,
	heightSVG: 640,
	marginTopFig: 20,
	marginRightFig: 40,
	marginBottomFig: 20,
	marginLeftFig: 40,
	circle: {
		x: null,
		y: null,
		r: null
	},

	startTime : new Date().getTime(),
	pointA: null,
	pointB: null,
	middlePoint: null,
	points: []
}

class canvasScene {
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

class Point {
	constructor(x, y){
		this.position = {
			x: x,
			y: y
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
	
	draw(){
	}
}

class Line{
	constructor(pointA, pointB){
		this.pointA = pointA;
		this.pointB = pointB;
		this.middlePoint = this.findMiddlePoint();
		let a = this.findParamsNormal();
		this.mt = a.mt; 
		this.atanT = a.atanT; 
		this.cT = a.cT;
	}

	//get pointA(){
	//	return this.pointA;
	//}

	//get pointB(){
	//	return this.pointB;
	//}

	//set pointA(pointA){
	//	this.pointA = pointA;
	//}

	//set pointB(pointB){
	//	this.pointB = pointB;
	//}	

	//get middlePoint(){
	//	return this.middlePoint;
	//}

	//get atanT(){
	//	return this.atanT;
	//}

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

class Circle extends Point{

	constructor(x, y, r){
		super(x, y);
		this.r = r;
	}

}


//E: https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
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
		*/
		//if(lambda != -1){
			/*
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
			return new Circle(h, k, r);;
		//}
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

let testPointCircleGeoms01 = new PointCircleGeoms(new Point(20, 30), new Point(50, 30), null);
console.log("testPointCircleGeoms01", testPointCircleGeoms01);
console.log(testPointCircleGeoms01.circleFamilythru2Points(2));

let testPointCircleGeoms02 = new PointCircleGeoms(new Point(20, 30), new Point(50, 30), 30);
console.log("testPointCircleGeoms02", testPointCircleGeoms02);


export {paramsFigure};
export {canvasScene};
export {Point};
export {PointCircleGeoms};
