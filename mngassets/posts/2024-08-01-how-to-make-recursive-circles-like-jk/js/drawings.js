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

import {Line, Triangle, Point} from './data.js';

let result = new Triangle(new Point(0,0,'testA'), new Point(mathjs.sqrt(3),0,'testB'), new Point(mathjs.sqrt(3),1,'testC'), 'testtriangle');
console.log(result);

export {result};

/* CIRCLE DRAWINGS */

/* LINE DRAWINGS */

/* ARC DRAWINGS */