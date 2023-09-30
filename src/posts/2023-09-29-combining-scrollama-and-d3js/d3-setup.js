var margin = 20;
var size = 400;
var chartSize = size - margin * 2;
let scaleX = null;
let scaleR = null;
let data = [8, 6, 7, 5, 3, 0, 9];
let extent = d3.extent(data);
let minR = 10;
let maxR = 24;

scaleR = d3.scaleLinear();
scaleX = d3.scaleBand();

let domainX = d3.range(data.length);

scaleX
    .domain(domainX)
    .range([0, chartSize])
    .padding(1);

scaleR
    .domain(extent)
    .range([minR, maxR]);

// append the svg object to the body of the page
const chart = (selector)=>{
    let svg = d3.select(selector)
                .append("svg")
                .attr("width", size + 'px')
                .attr("height", size + 'px');
                //.append("g")
                //.attr("transform", `translate(${margin.left},${margin.top})`);

    let chart = svg.append('g')
                .classed('chart', true)
                .attr('transform', 'translate(' + margin + ',' + margin + ')');
    
    let item = chart.selectAll('.item')
                .data(data)
                .enter()
                .append('g')
                .classed('item', true)
                .attr('transform', 'translate(' + chartSize / 2 + ',' + chartSize / 2+ ')');
            
    item.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
    
    item.append('text')
        .text(function(d) { return d })
        .attr('y', 1)
        .style('opacity', 0)

    return [svg, chart, item];

}





export default {
chart,
data,
minR,
chartSize,
scaleR,
scaleX
}