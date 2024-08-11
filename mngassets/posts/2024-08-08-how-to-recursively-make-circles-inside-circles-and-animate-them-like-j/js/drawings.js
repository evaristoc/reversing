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

/*
1) This is the final figure: three inner circles, all of same radius r and tangent to each other, inside an outer circle of radius R. But, how did it work?
2) If we draw the radius of the outer circle we can notice that they are in between arcs of same angle, all of them 120 degrees
3) Because we are using equidistant references, their centers are also separated by the same angle, each at a distance of 2 times their radii
4) The distance that separates them to the center is also the same for each of them
5) Let's now look at two of those circles. We the information we have we can now draw a triangle between the centers of 2 inner circles and the center of the outer circle. It is a isosceles triangle with one angle equal to 120 degrees and two of 30 degrees.
6) Its longer side is 2 times r. //??????????
7) But to solve this problem we need just one of those circles, and the half of that triangle.
8) By cutting the triangle in half, we go from one triangle of one angle of 120 degrees and 2 of 30 degrees, to on of 60 degrees (the half), one of 90 degrees and one preserved angle of 30 degrees.
9) Notice that one of the sizes of that triangle is equal to r.
10) Similarly, notice that R is equal to r plus the hypotenuse of the triangle. That is where the relation comes from.
11) We need to find a solution of that relation, as it helps to solve the distance between the center of the outer circle and any inner circle (the hypotenuse of the triangle).
12) We can find the hypotenuse, as we have a triangle with one side known, and all its angles known. It is xxxxxx.
13) The final value is xxxxx, which is xxxx, which solved of the relation xxx becomes xxxx.

*/

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
    let line02 = new Line(circleOuter.center, new Point(circleOuter.center.x + xA240, circleOuter.center.y + yA240, 'CenA'), 'line02');

    let xA360, yA360;
    ({xAApprox:xA360, yAApprox:yA360} = pointAtZero.findOtherPointCoordHavingAngleAndDist(2*Math.PI + rotLines, circleOuter.r));
    let line03 = new Line(circleOuter.center, new Point(circleOuter.center.x + xA360, circleOuter.center.y + yA360, 'CenA'), 'line03');

    let rInner = circleOuter.r*0.464;

    let dist2center = circleOuter.r - rInner;

    let xA1, yA1;
    ({xAApprox:xA1, yAApprox:yA1} = pointAtZero.findOtherPointCoordHavingAngleAndDist(5*Math.PI/3, dist2center));
    
    let xA2, yA2;
    ({xAApprox:xA2, yAApprox:yA2} = pointAtZero.findOtherPointCoordHavingAngleAndDist(3*Math.PI/3, dist2center));

    let xA3, yA3;
    ({xAApprox:xA3, yAApprox:yA3} = pointAtZero.findOtherPointCoordHavingAngleAndDist(Math.PI/3, dist2center));


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

    /* 1 - Three inner circles - */

    let cirInner01 = new Konva.Circle({
                    x: circleInner.center.x,
                    y: circleInner.center.y,
                    radius: circleInner.r,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 1
                });

    let cirInner02 = new Konva.Circle({
                    x: circleOuter.center.x + xA2,
                    y: circleOuter.center.y + yA2,
                    radius: circleInner.r,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 1
                });
    let cirInner03 = new Konva.Circle({
                    x: circleOuter.center.x + xA3,
                    y: circleOuter.center.y + yA3,
                    radius: circleInner.r,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 1
                });

        // since this text is inside of a defined area, we can center it using
    // align: 'center'
    let text01 = new Konva.Text({
        x: 20,
        y: 60,
        text: "This is the final figure: three inner circles, all of same radius r and tangent to each other, inside an outer circle of radius R. But, how was it calculated?",
        fontSize: 18,
        fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
        fill: '#3b3b3b',
        width: 300,
        padding: 20,
        align: 'center',
    });

let rect01 = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        fill: '#daa520',
        width: 300,
        height: text01.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });

    /* 2 - Three lines - */

    let lin01 = new Konva.Line({
                    points: [line01.pointA.x, line01.pointA.y, line01.pointB.x, line01.pointB.y],
                    stroke: 'black',
                    lineCap: 'round',

                });

    let lin02 = new Konva.Line({
                    points: [line02.pointA.x, line02.pointA.y, line02.pointB.x, line02.pointB.y],
                    stroke: 'black',
                    lineCap: 'round',

                });

    let lin03 = new Konva.Line({
                    points: [line03.pointA.x, line03.pointA.y, line03.pointB.x, line03.pointB.y],
                    stroke: 'black',
                    lineCap: 'round',

                });


        // since this text is inside of a defined area, we can center it using
    // align: 'center'
    let text02 = new Konva.Text({
        x: 20,
        y: 60,
        text: "If we draw the radius of the outer circle we can notice that they are in between arcs of same angle, all of them 120 degrees",
        fontSize: 18,
        fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
        fill: '#3b3b3b',
        width: 300,
        padding: 20,
        align: 'center',
    });

    let rect02 = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        fill: '#daa520',
        width: 300,
        height: text01.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });

      let group02 = new Konva.Group({
        opacity: 0,
      });

      group02.add(lin01);
      group02.add(lin02);
      group02.add(lin03);
      group02.add(rect02);
      group02.add(text02);
    
    /* 3- angle */

    //TODO: 


    let sideIsc01 = new Konva.Line({
      points: [circleOuter.center.x, circleOuter.center.y, circleOuter.center.x + xA2, circleOuter.center.y + yA2],
      stroke: 'green',
      lineCap: 'round',
      opacity: 0
  });

  let sideIsc02 = new Konva.Line({
    points: [circleInner.center.x, circleInner.center.y, circleOuter.center.x, circleOuter.center.y],
    stroke: 'green',
    lineCap: 'round',
    opacity: 0
});
  
  let nosideIsc = new Konva.Line({
    points: [circleOuter.center.x, circleOuter.center.y, circleOuter.center.x + xA3, circleOuter.center.y + yA3],
    stroke: 'green',
    lineCap: 'round',
    opacity: 0
});

  // since this text is inside of a defined area, we can center it using
    // align: 'center'
    let text03 = new Konva.Text({
        x: 20,
        y: 60,
        text: "Because we are using equidistant references, their centers are also separated by the same angle of 120 degrees, each at the same distance to the center of the outer circle",
        fontSize: 18,
        fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
        fill: '#3b3b3b',
        width: 300,
        padding: 20,
        align: 'center',
    });

    let rect03 = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        fill: '#daa520',
        width: 300,
        height: text01.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });

      let group03 = new Konva.Group({
        opacity: 0,
      });

      //group03.add(sidesIsc);  //a bit more complicated..
      //group03.add(nosideIsc); //a bit more complicated...
      group03.add(rect03);
      group03.add(text03);

    /* 4- line between center */

    let baseIsc01 = new Konva.Line({
        points: [circleOuter.center.x + xA2, circleOuter.center.y + yA2, (circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2],
        stroke: 'green',
        lineCap: 'round',
        opacity: 0
    });

    let baseIsc02 = new Konva.Line({
      points: [(circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2, circleInner.center.x, circleInner.center.y],
      stroke: 'green',
      lineCap: 'round',
      opacity: 0
  });

    let text04 = new Konva.Text({
        x: 20,
        y: 60,
        text: "The distance that separates them is 2 times their radius 'r'",
        fontSize: 18,
        fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
        fill: '#3b3b3b',
        width: 300,
        padding: 20,
        align: 'center',
    });

    let rect04 = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        fill: '#daa520',
        width: 300,
        height: text01.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });

      let group04 = new Konva.Group({
        opacity: 0,
      });

      //group06.add(baseIsc);
      group04.add(rect04);
      group04.add(text04);

    /* 5- two circles and isosceles triangle */

    //TODO: not sure if single triangle or just a single line to complete the existing one


    //TODO: follows above (no geom)
    let text05 = new Konva.Text({
        x: 20,
        y: 60,
        text: "Let's now look at two of those circles. We the information we have we can now draw a triangle between the centers of 2 inner circles and the center of the outer circle. It is a isosceles triangle with one angle equal to 120 degrees and two of 30 degrees.",
        fontSize: 18,
        fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
        fill: '#3b3b3b',
        width: 300,
        padding: 20,
        align: 'center',
    });

    let rect05 = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        fill: '#daa520',
        width: 300,
        height: text01.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });

      let group05 = new Konva.Group({
        opacity: 0,
      });

      //group06.add(baseIsc);
      group05.add(rect05);
      group05.add(text05);


    // since this text is inside of a defined area, we can center it using
    // align: 'center'


    /* 6- longer side of isosceles */

    //TODO: follows above (no geom)



    /* 7- one cirlce and the rectangular triangle */
    
    //TODO
          /*
       * create a triangle shape by defining a
       * drawing function which draws a triangle
       */
    console.log((circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2);

    let sideRect01 = new Konva.Line({
      points: [circleOuter.center.x, circleOuter.center.y, (circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2],
      stroke: 'green',
      lineCap: 'round',
      opacity: 1
  });

    let triangleRect = new Konva.Shape({
        //https://github.com/konvajs/react-konva/issues/201
            //width: 260,
            //height: 170,
            sceneFunc: function (context, shape) {
              //const width = shape.width();
              //const height = shape.height();
              context.beginPath();
              context.moveTo(circleOuter.center.x, circleOuter.center.y);
              context.lineTo(circleInner.center.x, circleInner.center.y);
              context.lineTo((circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2);
              //context.quadraticCurveTo(width - 110, height - 70, width, height);
              context.closePath();
    
              // (!) Konva specific method, it is very important
              context.fillStrokeShape(shape);
            },
            fill: '#00D2FF',
            opacity: 0.7,
            offset:{
                x: 517, //almost the width of the container...
                y: 122  //the half of the height
            },
            x: 517, //almost the width of the container...
            y: 122,  //the half of the height
            opacity: 0
            //stroke: 'black',
            //strokeWidth: 4,

          });
    
          let text07 = new Konva.Text({
            x: 20,
            y: 60,
            text: "But to solve this problem we need just one of those circles, and the half of that triangle.",
            fontSize: 18,
            fontFamily: "'Comic Sans MS', 'Papyrus', sans-serif",
            fill: '#3b3b3b',
            width: 300,
            padding: 20,
            align: 'center',
        });
    
        let rect07 = new Konva.Rect({
            x: 20,
            y: 60,
            stroke: '#555',
            strokeWidth: 2,
            fill: '#daa520',
            width: 300,
            height: text01.height(),
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
            cornerRadius: 10,
          });
    
          let group07 = new Konva.Group({
            opacity: 0,
          });
    
          //group06.add(baseIsc);
          group07.add(rect07);
          group07.add(text07);
    
    /* 8- explaining the rectangular triangle */

    //TODO: Zoom? Add arcs?

    /* 9- explain the hypotenuse of that triangle */

    //TODO (no geom)

    /* 10- explain R pt 1 */

    //TODO: (add r and the hypotenuse)

    let xA4, yA4;
    ({xAApprox:xA4, yAApprox:yA4} = pointAtZero.findOtherPointCoordHavingAngleAndDist(2*Math.PI/3 + Math.PI, circleOuter.r));

    let radiusInner = new Konva.Line({
        points: [(circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2, circleInner.center.x, circleInner.center.y, circleOuter.center.x + xA4, circleOuter.center.y + yA4],
        stroke: 'red',
        lineCap: 'round'
    });

    /* 11- explain R pt 2 */   

    //TODO

    /* 12- formula pt 1 */  

    /* 13- formula pt 2 */  




    // let triangle02 = new Konva.Line({
    //     points: [circleOuter.center.x, circleOuter.center.y, circleInner.center.x, circleInner.center.y, (circleInner.center.x + circleOuter.center.x + xA2)/2, (circleInner.center.y + circleOuter.center.y + yA2)/2, circleOuter.center.x, circleOuter.center.y],
    //     stroke: 'none',
    //     fill: 'lightgrey'
    // });







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
    layer.add(cirInner01);
    layer.add(cirInner02);
    layer.add(cirInner03);
    layer.add(rect01);
    layer.add(text01);

    //layer.add(lin01);
    //layer.add(lin02);
    //layer.add(lin03);
    //layer.add(rect02);
    //layer.add(text02);
    layer.add(group02);
      // the tween has to be created after the node has been added to the layer
    let tween02 = new Konva.Tween({
        node: group02,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
      });

    layer.add(nosideIsc);
    layer.add(sideIsc01);
    layer.add(sideIsc02);
    layer.add(group03);
    let tween03a = new Konva.Tween({
        node: nosideIsc,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });
    let tween03b1 = new Konva.Tween({
        node: sideIsc01,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });
    let tween03b2 = new Konva.Tween({
      node: sideIsc02,
      duration: 3,
      opacity: 1,
      easing: Konva.Easings.Linear
  });
    let tween03c = new Konva.Tween({
        node: group03,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });


    layer.add(baseIsc01);
    layer.add(baseIsc02);
    layer.add(group04);
    let tween04a1 = new Konva.Tween({
        node: baseIsc01,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });
    let tween04a2 = new Konva.Tween({
      node: baseIsc02,
      duration: 3,
      opacity: 1,
      easing: Konva.Easings.Linear
  });
    let tween04b = new Konva.Tween({
        node: group04,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });


    layer.add(group05);
    // let tween05a = new Konva.Tween({
    //     node: nosideIsc,
    //     duration: 3,
    //     opacity: 0,
    //     easing: Konva.Easings.Linear
    // });
    let tween05b = new Konva.Tween({
        node: cirInner03,
        duration: 3,
        opacity: 0,
        easing: Konva.Easings.Linear
    });
    let tween05c = new Konva.Tween({
        node: group05,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });

    layer.add(triangleRect);
    layer.add(group07);
    let tween07a = new Konva.Tween({
        node: triangleRect,
        duration: 3,
        opacity: 1,
        easing: Konva.Easings.Linear
    });
    let tween07b = new Konva.Tween({
        node: cirInner02,
        duration: 3,
        opacity: 0,
        easing: Konva.Easings.Linear
    });
  //   let tween07c = new Konva.Tween({
  //     node: sideRect01,
  //     duration: 3,
  //     opacity: 1,
  //     easing: Konva.Easings.Linear
  // });

    //layer.add(radiusInner);

    layer.add(simpleText);

    //layer.add(redLine);
    //layer.add(rct);
    // add the layer to the stage
    stage.add(layer);
    
    // draw the image
    layer.draw();

          // play tween forward
        document.getElementById('seek01').addEventListener(
          'click',
          function () {
            tween02.reverse();
          },
          false
        );
      // play tween forward
      document.getElementById('seek02').addEventListener(
        'click',
        function () {
          tween02.play();
          tween03a.reverse();
          tween03b1.reverse();
          tween03b2.reverse();
          tween03c.reverse();
        },
        false
      );

    //   document.getElementById('seek03').addEventListener(
    //     'click',
    //     function () {
    //       tween03.play();
    //     },
    //     false
    //   );

      document.getElementById('seek03').addEventListener(
        'click',
        function () {
            tween03a.play();
            tween03b1.play();
            tween03b2.play();
            tween03c.play();
            tween04a1.reverse();
            tween04a2.reverse();
            tween04b.reverse();

        },
        false
      );  

      document.getElementById('seek04').addEventListener(
        'click',
        function () {
            tween04a1.play();
            tween04a2.play();
            tween04b.play();
            tween03a.play();
            tween05b.reverse();
            tween05c.reverse();
        },
        false
      );

      document.getElementById('seek05').addEventListener(
        'click',
        function () {
            //tween05a.play();
            tween03a.reverse();
            //tween06a.reverse();
            tween05b.play();
            tween05c.play();
        },
        false
      );

      document.getElementById('seek06').addEventListener(
        'click',
        function () {
          let groupAll = new Konva.Group();

          group02.opacity(0);


          let _lin01 = new Konva.Line({
            points: [line01.pointA.x, line01.pointA.y, line01.pointB.x, line01.pointB.y],
            stroke: 'black',
            lineCap: 'round',
            opacity: 1
        });

        let _lin02 = new Konva.Line({
          points: [line02.pointA.x, line02.pointA.y, line02.pointB.x, line02.pointB.y],
          stroke: 'black',
          lineCap: 'round',
          opacity: 1
      });

      let _lin03 = new Konva.Line({
        points: [line03.pointA.x, line03.pointA.y, line03.pointB.x, line03.pointB.y],
        stroke: 'black',
        lineCap: 'round',
        opacity: 1
    });

          layer.add(sideRect01);
          groupAll.add(cirOuter);
          groupAll.add(cirInner01);
          groupAll.add(cirInner02);
          groupAll.add(sideRect01);
          groupAll.add(triangleRect);
          groupAll.add(baseIsc01);
          groupAll.add(sideIsc01);
          groupAll.add(baseIsc02);
          groupAll.add(sideIsc02);
          groupAll.add(_lin01);
          groupAll.add(_lin02);
          groupAll.add(_lin03);      
          layer.add(groupAll);
      
          let tween06a = new Konva.Tween({
              node: groupAll,
              duration: 3,
              easing: Konva.Easings.Linear,
              scaleX: 1.7,
              scaleY: 1.7,
              x: -300
          });
            tween06a.play();
        },
        false
      );
    
      document.getElementById('seek07').addEventListener(
        'click',
        function () {
            tween03b1.reverse();
            tween04a1.reverse();
            tween07a.play();
            tween07b.play();
            sideRect01.opacity(1);
            //tween07c.play();
        },
        false
      );













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

    // // one revolution per 4 seconds
    // let angularSpeed = 90;
    // let anim = new Konva.Animation(function (frame) {
    //     let angleDiff = (frame.timeDiff * angularSpeed) / 1000;
    //     triangleRect.rotate(angleDiff);
    // }, layer);

    // anim.start();
    

};

/* LINE DRAWINGS */

/* ARC DRAWINGS */