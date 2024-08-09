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

console.log('konva', Konva);

let result = new Triangle(new Point(0,0,'testA'), new Point(mathjs.sqrt(3),0,'testB'), new Point(mathjs.sqrt(3),1,'testC'), 'testtriangle');
console.log(result);

export {result};

let z = {a:5};

/* CIRCLE DRAWINGS */

export function circlesTheory(argts){
    //https://sbcode.net/threejs/dat-gui/
    //https://jasonsturges.medium.com/rapid-prototyping-with-dat-gui-3b1bf062f0a2
    
    const {section, canvas, ctx, guiElem, w, h, stage, layer} = argts;
    
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

// create our shape
    let cir = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    });

    let redLine = new Konva.Line({
        points: [stage.width() / 2, stage.height() / 2, stage.width() / 2 + 70, stage.height() / 2],
        stroke: 'blue',
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round',
    });

    let rct = new Konva.Rect({
        x: 50,
        y: 20,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2,
        opacity: 0.2,
      });
    // add the shape to the layer
    layer.add(cir);
    layer.add(redLine);
    layer.add(rct);
    // add the layer to the stage
    stage.add(layer);
    
    // draw the image
    layer.draw();
    
    // the tween has to be created after the node has been added to the layer
    let tween = new Konva.Tween({
    node: rct,
    duration: 1,
    x: 140,
    y: 90,
    fill: 'red',
    rotation: Math.PI * 2,
    opacity: 1,
    strokeWidth: 6,
    scaleX: 1.5,
    });

    // start tween after 2 seconds (delay)
    setTimeout(function () {
    tween.play();
    }, 2000);

    

};

/* LINE DRAWINGS */

/* ARC DRAWINGS */