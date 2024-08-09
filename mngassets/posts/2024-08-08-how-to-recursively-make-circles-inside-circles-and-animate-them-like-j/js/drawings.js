/*

I am taking note from the interactions.js file

what I think it could be a possible solution is to take each element separated (circle, line, arc, etc)
and do the same way I think of coding routers, for example:

All circle functions go in one place
All line functions go in another place
etc etc etc

*/
let mathjs;
import {create, all} from 'https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm';
const config = { }
mathjs = create(all, config);

import dat from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/+esm';

import {Line, Triangle, Point, Circle} from './data.js';

let result = new Triangle(new Point(0,0,'testA'), new Point(mathjs.sqrt(3),0,'testB'), new Point(mathjs.sqrt(3),1,'testC'), 'testtriangle');
console.log(result);

export {result};

let z = {a:5};

/* CIRCLE DRAWINGS */

export function circlesTheory(argts){
    //https://sbcode.net/threejs/dat-gui/
    //https://jasonsturges.medium.com/rapid-prototyping-with-dat-gui-3b1bf062f0a2
    
    const {section, canvas, ctx, guiElem, w, h} = argts;
    
    //console.log(new dat.GUI());
    const gui = new dat.GUI({ autoPlace: false });

    const testFolder = gui.addFolder('Test');
    testFolder.add(z, 'a', 0, 360);
    testFolder.open();
    guiElem.append(gui.domElement);

    let circle = new Circle(new Point(w/2, h/2, 'test'), w/4, 'test');

    console.log(circle);

    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, circle.r, 0, 2*Math.PI);
    ctx.stroke();



    

};

/* LINE DRAWINGS */

/* ARC DRAWINGS */