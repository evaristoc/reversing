/* 
!!!NOTE!!!
from 20-07-24 this file is renamed from 'eventHlanders' to 'interactions'

This file could be also called 'controllers' but I would keep 'interactions' for now, as controllers sounds a higher level of order

I am for now also adding the animations as part of this interactions.js file, but this might be separated in the future

I am also using this file to set the non-exisisting data required for the animations

*/

/////////////
/* IMPORTS */
/////////////
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {PointCircleGeoms} from './data.js';
import {Circle} from './data.js';
import {Line} from './data.js';
import {Point} from './data.js';
import {geometries} from './data.js';
// TO KEEP IN MIND:
// In this project I am modifying Point properties so it can accept drawing attributes
// but I would like to keep Point class as defined in data for future projects
// 
// The whole idea is to keep it re-usable and simple
Point.dx = null;
Point.dy = null;

/////////////
/* HELPERS */
/////////////

//REMEMBER we are using d3.js to handle the DOM
//TODO:
//- make this an exportable object so it can be updated in scrollama-setup or any other script as required

//function updateSizeStepElements(){
//}

//function updateSizeCanvas(){
//}

// function update() {
// }

// scrollama event handlers
// function handleStepEnter(response) {
// }

//E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        //Stickyfill.add(this);
    });
};

function setupCharts(){
    return svg, chart, item = d3setup.chart("figure");
};


////////////////////
/* EVENT HANDLERS */
////////////////////

/* TODO: this evenHandlers might require revisions. Doesn't seem to be clearly thought */

let eventHandlers = {
    step : null,
    container: null,
    updateSizeStepElements : function(){
        //1. update height of step elements
        let stepH = Math.floor(window.innerHeight);
        this.step.style('height', stepH + 'px');
        let figureHeight = window.innerHeight;       
        let figureMarginTop = (window.innerHeight - figureHeight);  
        this.container
            .style('top', figureMarginTop + 'px');
        },
    updateSizeCanvas : function(){
        },
    updateCanvasBackground : function(){
    },
    handleStepEnter01 : function(svgCreate, scene){

        /* DATA GATHERING AND - SETTING */
        /*
        I decided to create data in this script because its reliance on scene settings

        Although doing that appears to oppose the "separation of concerns" criterion, it seems to agree with the 
        "one source of truth" and "keep it simple (and small)" criteria, at least for the existing code (jul-24).
        */

        const [geom, geomRot] = geometries;

        const ABgeo = new PointCircleGeoms(new Point(scene.widthSVG *.333, scene.heightSVG/2, 'A'), new Point(scene.widthSVG * .666, scene.heightSVG/2, 'B'), geom.r);
        ABgeo.pointA.dx = -20;
        ABgeo.pointA.dy = 0;
        ABgeo.pointB.dx = 15;
        ABgeo.pointB.dy = 0;
        //ABgeo.middlePoint.pointName = 'M';
        ABgeo.middlePoint.dx = -20;
        ABgeo.middlePoint.dy = 15;    


        geom.points.push(ABgeo.pointA);
        geom.points.push(ABgeo.pointB);
        geom.points.push(ABgeo.middlePoint);
        geom.segments.push(ABgeo);
        geom.circles.push(new Circle(ABgeo.middlePoint, ABgeo.distBtwPoints/2) );

        let counter = 0;
        for(let i = -9; i < 10; i++){
            let c = ABgeo.circleFamilythru2Points(i);
            c.circleName = counter.toString();
            geom.circlesFam.push(c);
            counter++;
        }

        let perpendicular = new Line(geom.circlesFam[geom.circlesFam.length -1].center, geom.circlesFam[0].center, 'perpendicular');
        let MC = new Line(ABgeo.middlePoint, geom.circlesFam[8].center, 'MC');
        let AM = new Line(ABgeo.pointA, ABgeo.middlePoint, 'AM');
        let rad = new Line(ABgeo.pointA, ABgeo.middlePoint, 'r');

        geom.circlesFam[8].center.pointName = 'C';
        geom.circlesFam[8].center.dx = 10;

        geom.points.push(geom.circlesFam[8].center);

        geom.segments.push(perpendicular);
        geom.segments.push(MC);
        geom.segments.push(AM);
        geom.segments.push(rad);

        //////////////////////////////////////////////////////////
        /*rotated figure (notice different y-coord for point A) 
        
        values are calculated based on trigonometric functions:

        y / AB = sin( alpha )

        and:

        x / AB = cos( alpha )
        
        */

        //Found the resulting animation accidentally using below numbers and I loved what happened!!!
        let ddx = ABgeo.distBtwPoints - ABgeo.distBtwPoints * Math.cos( 180 - 30.3 );
        let ddy = ABgeo.distBtwPoints * Math.sin( 180 - 30.3 );
        //let ddx = ABgeo.distBtwPoints - ABgeo.distBtwPoints * Math.cos( Math.PI/4 );
        //let ddy = ABgeo.distBtwPoints * Math.sin( Math.PI/4 );
        //let ddx = ABgeo.distBtwPoints - ABgeo.distBtwPoints * Math.cos( Math.PI/3 );
        //let ddy = ABgeo.distBtwPoints * Math.sin( Math.PI/3 );
        console.log(ddx, ddy);

        const ABgeoRot = new PointCircleGeoms(new Point(scene.widthSVG *.333 + ddx, scene.heightSVG/2 + ddy, 'A'), new Point(scene.widthSVG * .666, scene.heightSVG/2, 'B'), geomRot.r);
        ABgeoRot.pointA.dx = -20;
        ABgeoRot.pointA.dy = 0;
        ABgeoRot.pointB.dx = 15;
        ABgeoRot.pointB.dy = 0;
        ABgeoRot.middlePoint.dx = -20;
        ABgeoRot.middlePoint.dy = 15;    


        geomRot.points.push(ABgeoRot.pointA);
        geomRot.points.push(ABgeoRot.pointB);
        geomRot.points.push(ABgeoRot.middlePoint);
        geomRot.segments.push(ABgeoRot);

        counter = 0;
        for(let i = -9; i < 10; i++){
            let c = ABgeoRot.circleFamilythru2Points(i);
            c.circleName = counter.toString();
            geomRot.circlesFam.push(c);
            counter++;
        }

        let perpendicularRot = new Line(geomRot.circlesFam[0].center, geomRot.circlesFam[geomRot.circlesFam.length -1].center, 'perpendicular');
        let MCRot = new Line(ABgeoRot.middlePoint, geomRot.circlesFam[8].center, 'MC');
        let AMRot = new Line(ABgeoRot.pointA, ABgeoRot.middlePoint, 'AM');
        //let rad = new Line(ABgeo.pointA, geom.circlesFam[8].center, 'r');
        let radRot = new Line(ABgeoRot.pointA, geomRot.circlesFam[8].center, 'r');

        geomRot.circlesFam[8].center.pointName = 'C';
        geomRot.circlesFam[8].center.dx = 10;
        
        geomRot.points.push(geomRot.circlesFam[8].center);
        //geomRot.points.push(radRot.middlePoint);
        
        geomRot.segments.push(perpendicularRot);
        geomRot.segments.push(MCRot);
        geomRot.segments.push(AMRot);
        geomRot.segments.push(radRot);

        /* SCENE INITIALIZATION */        
        
        // Declare the x (horizontal position) scale.
        const xScale = d3.scaleLinear()
            .domain([0, scene.widthSVG])
            .range([0, scene.widthSVG]);

        // Declare the y (vertical position) scale.
        const yScale = d3.scaleLinear()
            .domain([0, scene.heightSVG])
            .range([scene.heightSVG, 0]);
            
;


        /* SCENE HANDLERS (AS PASSED FUNCTION) */
        
        let zelf = this;
        
        return function(response){
            zelf.step.classed('is-active', function (d, i) { return i === response.index; });
            //console.log(response);
       
            //E - from https://codepen.io/GreenSock/pen/bGbQwo
            //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
            if(response.index === 0){

                if(response.direction == 'down'){
                    svgCreate.symbols.selectAll('path').remove();
                    svgCreate.texts.selectAll('text').remove();

                    let pointsIN = geom.points.filter(d => (d.pointName == 'A') || (d.pointName == 'B'));
                    console.log(pointsIN);

                    svgCreate.symbols
                        .selectAll('.g-symbols')
                        .data(pointsIN, d => d.pointName)
                        .enter()
                        .append('path')
                        .attr('id', (d) => {return d.pointName})
                        .attr('d', d3.symbol().type(d3.symbolCross).size(50))
                        .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`)
                        .style('opacity', 0);
    
                    svgCreate.texts
                        .selectAll('.g-texts')
                        .data(pointsIN, d => d.pointName)
                        .enter()      
                        .append('text')
                        .text((d) => d.pointName)
                        .attr('x', (d) => xScale(d.x))
                        .attr('y', (d) => yScale(d.y))
                        .attr('dx', (d) => d.dx)
                        .attr('dy', (d) => d.dy)
                        .attr('fill', '#36454F')
                        .style('opacity', 0);
    
                    svgCreate.symbols
                            .selectAll('path')
                            .transition()
                            .ease(d3.easePolyIn)
                            .duration(5000)
                            .style('opacity', 1);
    
                               
                    svgCreate.texts
                            .selectAll('text')
                            .transition()
                            .ease(d3.easePolyIn)
                            .duration(5000)
                            .style('opacity', 1);
                }else{
                    svgCreate.symbols.selectAll('path').remove();
                    svgCreate.texts.selectAll('text').remove();                    
                }
            }
            if(response.index === 2){
                if(response.direction == 'down'){
                    let segmentsIN = geom.segments.filter(d => d.lineName == 'AB');

                    svgCreate.lines
                        .selectAll('.g-segments')
                        .data(segmentsIN, d => d.lineName)
                        .enter()
                        .append("line")
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointA.x)})
                        .attr('y2', (d) => {return yScale(d.pointA.y)})
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1.);
    
                    svgCreate.lines
                            .selectAll('line')
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(2000)
                            .attr('x2', (d) => {return xScale(d.pointB.x)})
                            .attr('y2', (d) => {return yScale(d.pointB.y)});
                }else{
                    svgCreate.lines.selectAll('line').remove();
                }

            }
            if(response.index == 4){
                
                if(response.direction == 'down'){
                    //let circlesOUT = geom.circlesFam.slice(Math.floor(geom.circlesFam.length/2));
                    let pointsIN = geom.points.filter(d => (d.pointName == 'M'));
                    let circlesIN = [geom.circlesFam[9]];
                        
                    svgCreate.symbols
                        .selectAll('.g-symbols')
                        .data(pointsIN, d => d.pointName)
                        .enter()
                        .append('path')
                        .merge(svgCreate.symbols)
                        .attr('d', d3.symbol().type(d3.symbolCross).size(50))
                        .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`)
                        .style('opacity', 1);
    
                    svgCreate.texts
                        .selectAll('.g-texts')
                        .data(pointsIN, d => d.pointName)
                        .enter()      
                        .append('text')
                        .merge(svgCreate.texts)
                        .text((d) => d.pointName)
                        .attr('x', (d) => xScale(d.x))
                        .attr('y', (d) => yScale(d.y))
                        .attr('dx', (d) => d.dx)
                        .attr('dy', (d) => d.dy)
                        .attr('fill', '#36454F')
                        .style('opacity', 1);
    
                    svgCreate.circles
                        .selectAll('.g-circles')
                        .data(circlesIN, d => d.circleName)
                        .enter()
                        .append("circle")
                        .attr('r', (d)=>{return d.r})
                        .attr('cx', (d)=>{return d.center.x})
                        .attr('cy', (d)=>{return d.center.y})
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 0.);
    
                    svgCreate.circles
                            .selectAll('circle')
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(2000)
                            .attr('stroke-width', 1.0);
                }else{
                    //console.log(5, 'o');
                    let pointsOUT = geom.points.filter(d => (d.pointName == 'A') || (d.pointName == 'B'));
                    svgCreate.circles.selectAll('circle').remove();
                    svgCreate.symbols.selectAll('path').data(pointsOUT, d => d.pointName).exit().remove();
                    svgCreate.texts.selectAll('text').data(pointsOUT, d => d.pointName).exit().remove();
                }

            }
            if(response.index === 6){
                
                if(response.direction == 'down'){
                    let circlesIN = geom.circlesFam.slice(Math.floor(geom.circlesFam.length/2), geom.circlesFam.length);
                    //svgCreate.circles.selectAll('circle').remove();
    
                    svgCreate.circles
                            .selectAll('circle')
                            .data(circlesIN, d => d.circleName)
                            .enter()
                            .append("circle")
                            .attr('r', (d)=>{return d.r})
                            .attr('cx', (d)=>{return d.center.x})
                            .attr('cy', (d)=>{return d.center.y})
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(2000)
                            .delay((d, i) => i * 100)
                            .attr('stroke-width', 1.0);   
                }else{
                    console.log(7, 'o');
                    let circlesOUT = [geom.circlesFam[9]];
                    svgCreate.circles.selectAll('circle').data(circlesOUT, d => d.circleName).exit().remove();
                  
                }
           
            }
            if(response.index === 9){
                
                if(response.direction == 'down'){
                    let circlesIN = geom.circlesFam.slice(0, Math.floor(geom.circlesFam.length/2));

                    svgCreate.circles
                            .selectAll('circle')
                            .data(circlesIN, d => d.circleName)
                            .enter()
                            .append("circle")
                            .attr('r', (d)=>{return d.r})
                            .attr('cx', (d)=>{return d.center.x})
                            .attr('cy', (d)=>{return d.center.y})
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr('stroke-width', 1.0);  
                }else{
                    let circlesOUT = geom.circlesFam.slice(Math.floor(geom.circlesFam.length/2), geom.circlesFam.length);
                    svgCreate.circles.selectAll('circle').data(circlesOUT, d => d.circleName).exit().remove();
                }
            }
            if(response.index === 10){
                if(response.direction == 'down'){
                    let segmentsIN = geom.segments.filter(d => d.lineName == 'perpendicular');
                    console.log(11, 'i', segmentsIN);
                
                    svgCreate.lines
                        .selectAll('.g-segments')
                        .data(segmentsIN,  d => d.lineName)
                        .enter()
                        .append("line")
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)})
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1.);
                }else{
                    let segmentsOUT = geom.segments.filter(d => d.lineName == 'AB');
                    svgCreate.lines.selectAll('line').data(segmentsOUT).exit().remove();
                }
            }
            if(response.index === 11){
                if(response.direction == 'down'){
                    //https://www.geeksforgeeks.org/d3-js-selection-exit-function/
                    //https://gist.github.com/Petrlds/4045315
                    //let circlesFamData = [,,,,,,,,,geom.circlesFam[9],,geom.circlesFam[11],,,,,,,,];
                    //let circlesFamData = [geom.circlesFam[8],geom.circlesFam[10]];
                    let circlesOUT = geom.circlesFam.filter((v,i) => {return (v.circleName != "8") && (v.circleName != "10");})
                    svgCreate.circles
                            .selectAll('circle')
                            .data(circlesOUT, d => d.circleName)
                            //.exit() //WAUW! not required????????????????? probably yes only if as a separated declaration???
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(2000)
                            .delay((d, i) => i * 100)
                            .attr('stroke-width', 0.0)
                            .remove();
                }else{
                    let circlesIN = geom.circlesFam.filter((v,i) => {return (v.circleName != "8") && (v.circleName != "10");});
                    svgCreate.circles
                            .selectAll('circle')
                            .data(circlesIN, d => d.circleName)
                            .enter()
                            .append("circle")
                            .attr('r', (d)=>{return d.r})
                            .attr('cx', (d)=>{return d.center.x})
                            .attr('cy', (d)=>{return d.center.y})
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr('stroke-width', 1.0);
                }
            }
            if(response.index === 12){
                if(response.direction == 'down'){
                    svgCreate.circles.selectAll('circle').remove();
                }else{
                    let circlesIN = geom.circlesFam.filter((v,i) => {return (v.circleName == "8") || (v.circleName == "10");});
                    svgCreate.circles
                            .selectAll('circle')
                            .data(circlesIN, d => d.circleName)
                            .enter()
                            .append("circle")
                            .attr('r', (d)=>{return d.r})
                            .attr('cx', (d)=>{return d.center.x})
                            .attr('cy', (d)=>{return d.center.y})
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr('stroke-width', 1.0);
                }
            }
            if(response.index === 14){
                if(response.direction == 'down'){
                    let radiusIN = geom.segments.filter(d => d.lineName == 'r');
                    let segmentsIN = geom.segments.filter(d => d.lineName == 'AM');
                    console.log(15, 'i', radiusIN, segmentsIN);

                    let radiusAnim = svgCreate.lines
                            .selectAll('.g-segments')
                            .data(radiusIN, d => d.lineName)
                            .enter()
                            .append("line")
                            .attr('x1', (d) => {return xScale(d.pointA.x)})
                            .attr('y1', (d) => {return yScale(d.pointA.y)})
                            .attr('x2', (d) => {return xScale(d.pointB.x)})
                            .attr('y2', (d) => {return yScale(d.pointB.y)})
                            .attr("fill", "none")
                            .attr("stroke", "red")
                            .attr("stroke-width", 1.0);

                    //IMPORTANT: d3 will accept a mutation of a shallow copy if that occurs before the delay of the transition is completed!!!
                    //MORE IMPORTANT: with the following change there is NO automatic re-calculation of associated parameters :(
                    radiusIN[0].pointB = geom.circlesFam[8].center;
                    radiusIN[0].middlePoint = radiusIN[0].findMiddlePoint();
                    radiusIN[0].middlePoint.dx = -10;

                    //let segmentsNames = [radiusIN[0]];

                    radiusAnim
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('y2', (d) => {return yScale(d.pointB.y)})
                        .delay(2000)
                        .duration(2000)
                        .ease(d3.easeLinear)
                        .attr('stroke-width', 1.5)
                        .attr("stroke", "red");

                    
                    let amAnim = svgCreate.lines
                            .selectAll('.g-segments')
                            .data(segmentsIN, d => d.lineName)
                            .enter()
                            .append('line')
                            .attr('x1', (d) => {return xScale(d.pointA.x)})
                            .attr('y1', (d) => {return yScale(d.pointA.y)})
                            .attr('x2', (d) => {return xScale(d.pointB.x)})
                            .attr('y2', (d) => {return yScale(d.pointB.y)});


                    amAnim
                            .transition()
                            .delay(4000)
                            .ease(d3.easeLinear)
                            .duration(2000)
                            .attr("stroke", "blue")
                            .attr("stroke-width", 1.5);

                    svgCreate.texts
                            .selectAll('.g-texts')
                            .data(radiusIN, d => d.lineName)
                            .enter()      
                            .append('text')
                            //.merge(svgCreate.texts)
                            .text((d) => d.lineName)
                            .attr('x', (d) => xScale(d.middlePoint.x))
                            .attr('y', (d) => yScale(d.middlePoint.y))
                            .attr('dx', (d) => xScale(d.middlePoint.dx))
                            .attr('fill', '#36454F')
                            .style('opacity', 0);

                    svgCreate.texts
                            .selectAll('text')
                            .transition()
                            .delay(4000)
                            .duration(1000)
                            .style('opacity', 1);

                }else{
                    let segmentsOUT = geom.segments.filter(d => d.lineName != 'AM' && d.lineName != 'r' && d.lineName != 'MC');
                    let textsOUT = geom.points;
                    console.log(15, 'o', segmentsOUT);

                    svgCreate.lines.selectAll('line').data(segmentsOUT, d => d.lineName).exit().remove();
                    svgCreate.texts.selectAll('text').data(textsOUT, d => d.pointName).exit().remove();
                }

            }
            if(response.index === 15){
                if(response.direction == 'down'){
                    let segmentsIN = geom.segments.filter(d => d.lineName == 'MC');
                    let pointsIN = geom.points.filter(d => d.pointName == 'C');

                    console.log(15, 'i', segmentsIN, pointsIN);

                    svgCreate.lines
                        .selectAll('.g-segments')
                        .data(segmentsIN, d => d.lineName)
                        .enter()
                        .append("line")
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)})
                        .attr("fill", "none")
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('stroke-width', 1.0)   
                        .attr("stroke", "green")
                        .attr("stroke-width", 3.5);

                    svgCreate.texts
                        .selectAll('.g-texts')
                        .data(pointsIN, d => d.pointName)
                        .enter()      
                        .append('text')
                        .merge(svgCreate.texts)
                        .text((d) => d.pointName)
                        .attr('x', (d) => xScale(d.x))
                        .attr('y', (d) => yScale(d.y))
                        .attr('dx', (d) => xScale(d.dx))
                        .attr('fill', '#36454F')
                        .style('opacity', 0)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(3500)
                        .style('opacity', 1);

                }else{
                    let segmentsOUT = geom.segments.filter(d => d.lineName != 'MC');
                    console.log(15, 'o', segmentsOUT);

                    svgCreate.lines.selectAll('line').data(segmentsOUT, d => d.lineName).exit().remove();                    
                }

            }if(response.index === 16){
                if(response.direction == 'up'){
                    let segmentsIN = geom.segments;
                    let pointsIN = geom.points;

                    // SAME AS following animation!!
                    //there are some issues with the point handling because the way the are defined
                    //in the classes and other functions.
                    //ordering by naming is not working and right now I don't have an answer.
                    //it would take some thought to solve it so I am using a bad hack instead.
                    //I am working on the pointsIN so I am manage the project based on its position 
                    //in the Array (which corresponds with its position in the html)
                    let radius = geom.segments.filter(d => d.lineName == 'r');
                    let radiusPoint = {
                        x: radius[0].middlePoint.x,
                        y: radius[0].middlePoint.y,
                        pointName: 'r',
                        dx: 7               
                    };

                    //https://www.geeksforgeeks.org/how-to-insert-an-item-into-array-at-specific-index-in-javascript/
                    pointsIN = [...pointsIN.slice(0, 3), radiusPoint, pointsIN[3]];
                    
                    svgCreate.lines
                        .selectAll('line')
                        .data(segmentsIN,  d => d.lineName)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)});
    
                    svgCreate.symbols
                        .selectAll('path')
                        .data(pointsIN)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`);
    
                    svgCreate.texts
                        .selectAll('text')
                        .data(pointsIN)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('x', (d) => xScale(d.x))
                        .attr('y', (d) => yScale(d.y));      
                }
            }if(response.index === 17){
                if(response.direction == 'down'){
                    let segmentsIN = geomRot.segments;
                    
                    //there are some issues with the point handling because the way the are defined
                    //in the classes and other functions.
                    //ordering by naming is not working and right now I don't have an answer.
                    //it would take some thought to solve it so I am using a bad hack instead.
                    //I am working on the pointsIN so I am manage the project based on its position 
                    //in the Array (which corresponds with its position in the html)
                    let pointsIN = geomRot.points;
                    let radius = geomRot.segments.filter(d => d.lineName == 'r');
                    let radiusPoint = {
                        x: radius[0].middlePoint.x,
                        y: radius[0].middlePoint.y,
                        pointName: 'r',
                        dx: 7               
                    };
                    
                    //https://www.geeksforgeeks.org/how-to-insert-an-item-into-array-at-specific-index-in-javascript/
                    pointsIN = [...pointsIN.slice(0, 3), radiusPoint, pointsIN[3]];
                    console.log(pointsIN);


                    svgCreate.lines
                        .selectAll('line')
                        .data(segmentsIN,  d => d.lineName)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)});


                    svgCreate.symbols
                        .selectAll('path')
                        .data(pointsIN)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`);
    
                    svgCreate.texts
                        .selectAll('text')
                        .data(pointsIN)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('x', (d) => {return xScale(d.x)})
                        .attr('y', (d) => yScale(d.y));
               }else{
               }         
            }if(response.index === 18){
                if(response.direction == 'down'){
                    let dxSegment = new Line(new Point(geomRot.points[2].x, geomRot.points[2].y),  new Point(geomRot.points[3].x, geomRot.points[2].y), 'dx');
                    let dySegment = new Line(new Point(geomRot.points[3].x, geomRot.points[2].y),  new Point(geomRot.points[3].x, geomRot.points[3].y), 'dy');
    
                    let segmentsIN = [dxSegment, dySegment];
                    console.log(segmentsIN);
    
                    svgCreate.lines
                        .selectAll('.g-segments')
                        .data(segmentsIN,  d => d.lineName)
                        .enter()
                        .append('line')
                        .attr('x1', (d) => {return xScale(d.pointA.x)})
                        .attr('y1', (d) => {return yScale(d.pointA.y)})
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)})
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('stroke-width', 1.0)   
                        .attr("stroke", "black");
    
                    svgCreate.texts
                        .selectAll('.g-texts')
                        .data(segmentsIN,  d => d.lineName)
                        .enter()
                        .append('text')
                        .text((d) => d.lineName)
                        .attr('x', (d) => xScale(d.middlePoint.x))
                        .attr('y', (d) => yScale(d.middlePoint.y))
                        .attr('fill', '#36454F')
                        .style('font-size', '0.75rem')
                        .style('opacity', 1);
                }else{
                    svgCreate.arcs.selectAll('path').remove();
                    svgCreate.circles.selectAll('circle').remove();
                }
            }if(response.index == 19){
                
                if(response.direction = 'down'){
                    let axis = geomRot.points[2];
                    let angle = ABgeoRot.atanT;
    
                   
                    svgCreate.arcs
                        .append('path')
                        .attr('transform', `translate(${xScale(axis.x)},${yScale(axis.y)})`)
                        .attr('d', d3.arc()({
                            innerRadius:25,
                            outerRadius: 28,
                            startAngle: angle < 0? -Math.PI/2 : Math.PI/2,
                            endAngle: angle < 0? -Math.PI/2 - angle : Math.PI/2 - angle
                        }))
                        .attr('fill','orange')
                        .attr('stroke','#FF8C00')                    
                }else{
                    svgCreate.circles.selectAll('circle').remove();
                }

            }if(response.index == 20){
                if(response.direction == 'down'){
                    //WARNING: found a serious bug with this method (see data.js); keeping for later...
                    //let [circlesIN, angleD] = ABgeoRot.findCenterByProjection();
                    //console.log(angle, angleD, circlesIN);                    //let circlesIN = ABgeoRot.findCenterByProjection()[0];
                    let angle = ABgeoRot.atanT;
                    //let r = geomRot.circlesFam[8].r;
                    let r = geomRot.segments.filter(d => d.lineName == 'r')[0].distBtwPoints;
                    let lengthMC = geomRot.segments.filter(d => d.lineName == 'MC')[0].distBtwPoints;
                    console.log('r', r);
                    let x1 = ABgeoRot.middlePoint.x + lengthMC*Math.cos(angle);
                    let y1 = ABgeoRot.middlePoint.y + lengthMC*Math.sin(angle);
                    //console.log( ABgeoRot.middlePoint.x, ABgeoRot.distPoint2Center, Math.cos(angle));
                    let c = [new Circle(new Point(x1, y1), r)];
    
   
                    svgCreate.circles
                        .selectAll('circle')
                        .data(c)
                        .enter()
                        .append("circle")
                        .attr('r', (d)=>{return d.r})
                        .attr('cx', (d)=>{return xScale(d.center.x)})
                        .attr('cy', (d)=>{return yScale(d.center.y)})
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr('stroke-width', 1.0);
                }
            }
        }

    }
}


/////////////
/* EXPORTS */
/////////////
export {eventHandlers};