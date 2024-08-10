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
    
    // //console.log(new dat.GUI());
    // const gui = new dat.GUI({ autoPlace: false });

    // const testFolder = gui.addFolder('Test');
    // testFolder.add(z, 'a', 0, 360);
    // testFolder.open();
    // guiElem.append(gui.domElement);
    //let xA1, yA1;
    let circleOuter = new Circle(new Point(stage.width() / 1.5, stage.height() / 2, 'test'), stage.height() / 2.5, 'test');
    let pointAtZero = new Point(0,0,'zero');
    let rotLines = 0; //-Math.PI + Math.PI/6

    let xA120, yA120;
    ({xAApprox:xA120, yAApprox:yA120} = pointAtZero.findOtherPointCoordHavingAngleAndDist(2*Math.PI/3 + rotLines, circleOuter.r));
    let line01 = new Line(circleOuter.center, new Point(circleOuter.center.x + xA120, circleOuter.center.y + yA120, 'CenA'), 'line01');

    console.log(circleOuter);
    console.log({xA120, yA120}, line01);

    let xA240, yA240;
    ({xAApprox:xA240, yAApprox:yA240} = pointAtZero.findOtherPointCoordHavingAngleAndDist(4*Math.PI/3 + rotLines, circleOuter.r));
    let line02 = new Line(circleOuter.center, new Point(circleOuter.center.x + xA240, circleOuter.center.y + yA240, 'CenA'), 'line01');

    let xA360, yA360;
    ({xAApprox:xA360, yAApprox:yA360} = pointAtZero.findOtherPointCoordHavingAngleAndDist(2*Math.PI + rotLines, circleOuter.r));
    let line03 = new Line(circleOuter.center, new Point(circleOuter.center.x + xA360, circleOuter.center.y + yA360, 'CenA'), 'line01');

    let rInner = circleOuter.r*0.464;

    let dist2center = circleOuter.r - rInner;

    let xA1, yA1;
    ({xAApprox:xA1, yAApprox:yA1} = pointAtZero.findOtherPointCoordHavingAngleAndDist(5*Math.PI/3, dist2center));
    
    let xA2, yA2;
    ({xAApprox:xA2, yAApprox:yA2} = pointAtZero.findOtherPointCoordHavingAngleAndDist(3*Math.PI/3, dist2center));

    let circleInner = new Circle(new Point(circleOuter.center.x + xA1, circleOuter.center.y + yA1, 'innerCirCenter'), rInner,'innerCircle');


    // ctx.beginPath();
    // ctx.arc(circle.center.x, circle.center.y, circle.r, 0, 2*Math.PI);
    // ctx.stroke();

// create our shape
    let cirOuter = new Konva.Circle({
                    x: circleOuter.center.x,
                    y: circleOuter.center.y,
                    radius: circleOuter.r,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4
                });

    let cirInner = new Konva.Circle({
                    x: circleInner.center.x,
                    y: circleInner.center.y,
                    radius: circleInner.r,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4
                });

    let lin01 = new Konva.Line({
                    points: [line01.pointA.x, line01.pointA.y, line01.pointB.x, line01.pointB.y],
                    stroke: 'blue',
                    lineCap: 'round'
                });

    let lin02 = new Konva.Line({
                    points: [line02.pointA.x, line02.pointA.y, line02.pointB.x, line02.pointB.y],
                    stroke: 'blue',
                    lineCap: 'round'
                });

    let lin03 = new Konva.Line({
                    points: [line03.pointA.x, line03.pointA.y, line03.pointB.x, line03.pointB.y],
                    stroke: 'blue',
                    lineCap: 'round'
                });

    let triangle01 = new Konva.Line({
        points: [circleOuter.center.x, circleOuter.center.y, circleInner.center.x, circleInner.center.y, circleOuter.center.x + xA2, circleOuter.center.y + yA2, circleOuter.center.x, circleOuter.center.y],
        stroke: 'green',
        lineCap: 'round'
    });

    let radiusInner = new Konva.Line({
        points: [circleInner.center.x, circleInner.center.y, circleOuter.center.x + xA2, circleOuter.center.y + yA2],
        stroke: 'red',
        lineCap: 'round'
    });



    let simpleText = new Konva.Text({
                    x: stage.width() / 2,
                    y: 15,
                    text: 'Simple Text',
                    fontSize: 30,
                    fontFamily: 'Calibri',
                    fill: 'green',
                });

    // to align text in the middle of the screen, we can set the
    // shape offset to the center of the text shape after instantiating it
    simpleText.offsetX(simpleText.width() / 2);

    // since this text is inside of a defined area, we can center it using
    // align: 'center'
    let complexText = new Konva.Text({
                        x: 20,
                        y: 60,
                        text: "COMPLEX TEXT\n\nAll the world's a stage, and all the men and women merely players. They have their exits and their entrances.",
                        fontSize: 18,
                        fontFamily: 'Calibri',
                        fill: '#555',
                        width: 300,
                        padding: 20,
                        align: 'center',
                    });

    let rect = new Konva.Rect({
                        x: 20,
                        y: 60,
                        stroke: '#555',
                        strokeWidth: 5,
                        fill: '#ddd',
                        width: 300,
                        height: complexText.height(),
                        shadowColor: 'black',
                        shadowBlur: 10,
                        shadowOffsetX: 10,
                        shadowOffsetY: 10,
                        shadowOpacity: 0.2,
                        cornerRadius: 10,
                      });

    // let redLine = new Konva.Line({
    //     points: [stage.width() / 2, stage.height() / 2, stage.width() / 2 + 70, stage.height() / 2],
    //     stroke: 'blue',
    //     strokeWidth: 5,
    //     lineCap: 'round',
    //     lineJoin: 'round',
    // });

    // let rct = new Konva.Rect({
    //     x: 50,
    //     y: 20,
    //     width: 100,
    //     height: 50,
    //     fill: 'green',
    //     stroke: 'black',
    //     strokeWidth: 2,
    //     opacity: 0.2,
    //   });
    // add the shape to the layer
    layer.add(cirOuter);
    layer.add(cirInner);
    layer.add(triangle01);
    layer.add(radiusInner);
    layer.add(lin01);
    layer.add(lin02);
    layer.add(lin03);
    layer.add(simpleText);
    layer.add(rect);
    layer.add(complexText);
    //layer.add(redLine);
    //layer.add(rct);
    // add the layer to the stage
    stage.add(layer);
    
    // draw the image
    layer.draw();
    
    // // the tween has to be created after the node has been added to the layer
    // let tween = new Konva.Tween({
    // node: rct,
    // duration: 1,
    // x: 140,
    // y: 90,
    // fill: 'red',
    // rotation: Math.PI * 2,
    // opacity: 1,
    // strokeWidth: 6,
    // scaleX: 1.5,
    // });

    // // start tween after 2 seconds (delay)
    // setTimeout(function () {
    // tween.play();
    // }, 2000);

    

};

/* LINE DRAWINGS */

/* ARC DRAWINGS */