/* 
!!!NOTE!!!
from 20-07-24 this file is renamed from 'eventHlanders' to 'interactions

I am for now also adding the animations as part of the interactions.js file, but this might be separated in the future

*/

/* IMPORTS */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {Point} from './data.js';
import {PointCircleGeoms} from './data.js';

// TO KEEP IN MIND:
// In this project I am modifying Point properties so it can accept drawing attributes
// but I would like to keep Point class as defined in data for future projects
// 
// The whole idea is to keep it re-usable and simple


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

export let eventHandlers = {
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
    handleStepEnter01 : function(svg, scene, geometries){

        /* DATA GATHERING */
        geometries.points.push(new Point(scene.widthSVG *.333, scene.heightSVG/2, 'A'));
        geometries.points.push(new Point(scene.widthSVG * .666, scene.heightSVG/2, 'B'));
        const geo01 = new PointCircleGeoms(geometries.points[0], geometries.points[1], geometries.r);
        //geometries.points.push(geo01.middlePoint);
                
        geometries.segments.push(geo01);
        
        let zelf = this;

        // Declare the x (horizontal position) scale.
        const xScale = d3.scaleLinear()
            .domain([0, scene.widthSVG])
            .range([0, scene.widthSVG]);

        // Declare the y (vertical position) scale.
        const yScale = d3.scaleLinear()
            .domain([0, scene.heightSVG])
            .range([scene.heightSVG, 0]);   

        let symbols = svg
            .append('g')
            .attr('class', 'g-symbols');

        symbols
                .selectAll('.g-symbols')
                .data(geometries.points)
                .enter()
                .append('path')
                .attr('d', d3.symbol().type(d3.symbolCross).size(50))
                .attr('transform', (d) => `translate(${xScale(d.x)} , ${yScale(d.y)})`)
                .style('opacity', 0);

        return function(response){
            zelf.step.classed('is-active', function (d, i) { return i === response.index; });

       
            //E - from https://codepen.io/GreenSock/pen/bGbQwo
            //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
            if(response.index === 1){
                symbols
                        .selectAll('path')
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .style('opacity', 1);


                let texts = svg
                        .append('g')
                        .attr('class', 'g-texts');
                            
                texts
                        .selectAll('.g-texts')
                        .data(geometries.points)
                        .enter()      
                        .append('text')
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .text((d) => d.name)
                        .attr('x', (d) => xScale(d.x))
                        .attr('y', (d) => yScale(d.y))
                        .attr('dx', 20)
                        .attr('dy', 20)


            }
            if(response.index === 2){
            }
            if(response.index === 3){
            }
            if(response.index == 4){
                let lines = svg
                    .append('g')
                    .attr('class', 'g-segments');

                lines
                    .selectAll('.g-segments')
                    .data(geometries.segments)
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
            if(response.index === 7){
            }
            if(response.index === 8){
            }
        }

    }
}