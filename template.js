///http://jsfiddle.net/sspann/5JRMt/
// config, add svg
var canvas = d3.select('body')
    .append('svg')
    .attr('width',100)
    .attr('height',100) 
    .appeng('g');


// function that wraps around the d3 pattern (bind, add, update, remove)
function updateLegend(newData) {

    // bind data
    var appending = canvas.selectAll('rect')
       .data(newData);

    // add new elements
    appending.enter().append('rect');

    // update existing elements
    appending.transition()
        .duration(0)
        .attr("width",function (d) {return d.y; });

    // remove old elements
    appending.exit().remove();

}

// generate initial legend
updateLegend(initialValues);

// handle on click event
d3.select('#opts')
  .on('change', function() {
    var newData = eval(d3.select(this).property('value'));
    updateLegend(newData);
});