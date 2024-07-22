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
    handleStepEnter01 : function(svgCreate, scene, geometries){

        /* DATA GATHERING AND - SETTING */


        const ABgeo = new PointCircleGeoms(new Point(scene.widthSVG *.333, scene.heightSVG/2, 'A'), new Point(scene.widthSVG * .666, scene.heightSVG/2, 'B'), geometries.r);
        ABgeo.pointA.dx = -20;
        ABgeo.pointA.dy = 0;
        ABgeo.pointB.dx = 15;
        ABgeo.pointB.dy = 0;
        ABgeo.middlePoint.name = 'M';
        ABgeo.middlePoint.dx = -7;
        ABgeo.middlePoint.dy = -10;        

        geometries.points.push(ABgeo.pointA);
        geometries.points.push(ABgeo.pointB);
        geometries.segments.push(ABgeo);
        geometries.circles.push(new Circle(ABgeo.middlePoint, ABgeo.distBtwPoints/2) );

        let counter = 0;
        for(let i = -9; i < 10; i++){
            let c = ABgeo.circleFamilythru2Points(i);
            c.circleName = counter.toString();
            geometries.circlesFam.push(c);
            counter++;
        }


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

       
            //E - from https://codepen.io/GreenSock/pen/bGbQwo
            //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
            if(response.index === 0){

                svgCreate.symbols.selectAll('path').remove();
                svgCreate.texts.selectAll('text').remove();
                
                svgCreate.symbols
                    .selectAll('.g-symbols')
                    .data(geometries.points, (d) => {return d.name})
                    .enter()
                    .append('path')
                    .attr('id', (d) => {return d.name})
                    .attr('d', d3.symbol().type(d3.symbolCross).size(50))
                    .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`)
                    .style('opacity', 0);

                svgCreate.texts
                    .selectAll('.g-texts')
                    .data(geometries.points)
                    .enter()      
                    .append('text')
                    .text((d) => d.name)
                    .attr('x', (d) => xScale(d.x))
                    .attr('y', (d) => yScale(d.y))
                    .attr('dx', (d) => d.dx)
                    .attr('dy', (d) => d.dy)
                    .style('opacity', 0);

                svgCreate.symbols
                        .selectAll('path')
                        .transition()
                        .ease(d3.easePolyIn)
                        .duration(8000)
                        .style('opacity', 1);

                           
                svgCreate.texts
                        .selectAll('text')
                        .transition()
                        .ease(d3.easePolyIn)
                        .duration(8000)
                        .style('opacity', 1);

            }
            if(response.index === 2){
                
                svgCreate.lines
                    .selectAll('.g-segments')
                    .data(geometries.segments)
                    .enter()
                    .append("line")
                    .attr('x1', (d) => {return xScale(d.pointA.x)})
                    .attr('y1', (d) => {return yScale(d.pointA.y)})
                    .attr('x2', (d) => {return xScale(d.pointA.x)})
                    .attr('y2', (d) => {return yScale(d.pointA.y)})
                    .attr("fill", "none")
                    //.attr("stroke", (d,i) => {return d[2]})
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.);

                svgCreate.lines
                        .selectAll('line')
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr('x2', (d) => {return xScale(d.pointB.x)})
                        .attr('y2', (d) => {return yScale(d.pointB.y)});
            }
            if(response.index === 3){
            }
            if(response.index == 4){
                
                geometries.points.push(ABgeo.middlePoint);
                let circlesFamData = geometries.circlesFam.slice(Math.floor(geometries.circlesFam.length/2));
                let circlesData = [geometries.circlesFam[9]];

                svgCreate.symbols.selectAll('path').remove();
                svgCreate.texts.selectAll('text').remove();
                svgCreate.circles.selectAll('circle').data(circlesFamData).exit().remove(); //?

                svgCreate.symbols
                    .selectAll('.g-symbols')
                    .data(geometries.points, (d) => {return d.name})
                    .enter()
                    .append('path')
                    .merge(svgCreate.symbols)
                    .attr('id', (d) => {return d.name})
                    .attr('d', d3.symbol().type(d3.symbolCross).size(50))
                    .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`)
                    .style('opacity', 1);

                svgCreate.texts
                    .selectAll('.g-texts')
                    .data(geometries.points)
                    .enter()      
                    .append('text')
                    .merge(svgCreate.texts)
                    .text((d) => d.name)
                    .attr('x', (d) => xScale(d.x))
                    .attr('y', (d) => yScale(d.y))
                    .attr('dx', (d) => d.dx)
                    .attr('dy', (d) => d.dy)
                    .style('opacity', 1);

                svgCreate.circles
                    .selectAll('.g-circles')
                    .data(circlesData, d => d.circleName)
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
            }
            if(response.index == 5){
            }
            if(response.index === 6){
                
                let circlesFamData = geometries.circlesFam.slice(Math.floor(geometries.circlesFam.length/2), geometries.circlesFam.length);

                svgCreate.circles.selectAll('circle').remove();

                svgCreate.circles
                        .selectAll('circle')
                        .data(circlesFamData, d => d.circleName)
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
            }
            if(response.index === 9){
                
                let circlesFamData = geometries.circlesFam.slice(0, Math.floor(geometries.circlesFam.length/2));

                svgCreate.circles
                        .selectAll('circle')
                        .data(circlesFamData, d => d.circleName)
                        .enter()
                        .append("circle")
                        .attr('r', (d)=>{return d.r})
                        .attr('cx', (d)=>{return d.center.x})
                        .attr('cy', (d)=>{return d.center.y})
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr('stroke-width', 1.0);              
            }
            if(response.index === 10){
                
                svgCreate.lines
                    .selectAll('.g-segments')
                    .data([new Line(geometries.circlesFam[0].center, geometries.circlesFam[geometries.circlesFam.length -1].center)])
                    .enter()
                    .append("line")
                    .attr('x1', (d) => {return xScale(d.pointA.x)})
                    .attr('y1', (d) => {return yScale(d.pointA.y)})
                    .attr('x2', (d) => {return xScale(d.pointB.x)})
                    .attr('y2', (d) => {return yScale(d.pointB.y)})
                    .attr("fill", "none")
                    //.attr("stroke", (d,i) => {return d[2]})
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.);
            }
            if(response.index === 11){
                //https://www.geeksforgeeks.org/d3-js-selection-exit-function/
                //https://gist.github.com/Petrlds/4045315
                //let circlesFamData = [,,,,,,,,,geometries.circlesFam[9],,geometries.circlesFam[11],,,,,,,,];
                //let circlesFamData = [geometries.circlesFam[8],geometries.circlesFam[10]];
                let circlesExit = geometries.circlesFam.filter((v,i) => {return (v.circleName != "8") && (v.circleName != "10");})

                svgCreate.circles
                        .selectAll('circle')
                        .data(circlesExit, d => d.circleName)
                        //.exit() //WAUW! not required????????????????? probably yes only if as a separated declaration???
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .delay((d, i) => i * 100)
                        .attr('stroke-width', 0.0)
                        .remove();
            }
            if(response.index === 14){
                //let MC = new Line(geometries.circlesFam[8].center, ABgeo.middlePoint, 'MC');
                let AM = new Line(ABgeo.pointA, ABgeo.middlePoint, 'AM');
                let radius = new Line(ABgeo.pointA, geometries.circlesFam[8].center, 'radius');
                let newSegments = [AM, radius];

                svgCreate.lines
                    .selectAll('.g-segments')
                    .data(newSegments)
                    .enter()
                    .append("line")
                    .attr('x1', (d) => {return xScale(d.pointA.x)})
                    .attr('y1', (d) => {return yScale(d.pointA.y)})
                    .attr('x2', (d) => {return xScale(d.pointB.x)})
                    .attr('y2', (d) => {return yScale(d.pointB.y)})
                    .attr("fill", "none")
                    //.attr("stroke", (d,i) => {return d[2]})
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(2000)
                    .delay((d, i) => i * 100)
                    .attr('stroke-width', 1.0)   
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2.5);

            }
            if(response.index === 16){
                let MC = new Line(ABgeo.middlePoint, geometries.circlesFam[8].center, 'MC');
                let newSegments = [MC];

                svgCreate.lines
                    .selectAll('.g-segments')
                    .data(newSegments)
                    .enter()
                    .append("line")
                    .attr('x1', (d) => {return xScale(d.pointA.x)})
                    .attr('y1', (d) => {return yScale(d.pointA.y)})
                    .attr('x2', (d) => {return xScale(d.pointB.x)})
                    .attr('y2', (d) => {return yScale(d.pointB.y)})
                    .attr("fill", "none")
                    //.attr("stroke", (d,i) => {return d[2]})
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(2000)
                    .delay((d, i) => i * 100)
                    .attr('stroke-width', 1.0)   
                    .attr("stroke", "green")
                    .attr("stroke-width", 2.5);

            }
        }

    }
}


/////////////
/* EXPORTS */
/////////////
export {eventHandlers};