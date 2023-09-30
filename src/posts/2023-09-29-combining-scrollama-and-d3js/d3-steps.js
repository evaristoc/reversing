	// actions to take on each step of our scroll-driven story
	export let steps = {
		
        chart : null,

        chartSize : null,

        minR : null,

        scaleR : null,

        scaleX : null,
        
        step01 : function () { // circles are centered and small
         
         // E: attributes of the transition t
                  var t = d3.transition()
                      .duration(800)
                      .ease(d3.easeQuadInOut)
                      
         // E: remember - those items will be generated in another function further below when setting up the image
                  var item = this.chart.selectAll('.item');

                  //let zelf = this;
                  
         // E: assign transition t properties to a created item
                  item.transition(t)
                      .attr('transform', 'translate('+ this.chartSize / 2 +',' + this.chartSize / 2 +')')
      
         // E: item is now a d3.js element; now using select would attach a SVG circle to it
         // E: it is also assigning the transition to the circle, as well as it properties
                  item.select('circle')
                      .transition(t)
                      .attr('r', this.minR)
      
         // E: same as above but for text
         item.select('text')
                      .transition(t)
                      .style('opacity', 0)
              },
      
        step02 : function () { // E: equal circles are positioned side by side
            let zelf = this;
            var t = d3.transition()
                      .duration(800)
                      .ease(d3.easeQuadInOut)
                  
                  // circles are positioned
         // E: remember that they were created in the previous step.
         // E: don't forget that graphicsVisEl is a global to this function!!
                  var item = this.chart.selectAll('.item')

         // E: positioning the items according to scaleX(i)
                  item.transition(t)
                      .attr('transform', function(d, i) {
                          return 'translate('+zelf.scaleX(i)+','+zelf.chartSize / 2+')';
                      })
      
         // E: defining the properties of each fo the circles and texts associated to their respective "item" HTML element
                  item.select('circle')
                      .transition(t)
                      .attr('r', this.minR)
      
                  item.select('text')
                      .transition(t)
                      .style('opacity', 0)
              },
      
            step03 : function () { // E: circles are resized to the value of data and text embedded
                let zelf = this;
                var t = d3.transition()
                      .duration(800)
                      .ease(d3.easeQuadInOut)
      
                  var item = this.chart.selectAll('.item')
      
         // E: circles are sized and texts are assigned
                  item.select('circle')
                      .transition(t)
                      .delay(function(d, i) { return i * 200 })
                      .attr('r', function(d, i) {
                        return zelf.scaleR(d);
                      })
      
                  item.select('text')
                      .transition(t)
                      .delay(function(d, i) { return i * 200 })
                      .style('opacity', 1)
              },
            }