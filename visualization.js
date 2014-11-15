var width  = 700;
  var height = 430;

  var vis = d3.select("#vis").append("svg")
      .attr("width", width).attr("height", height)

  d3.json("wardsandparks.json", function(json) {
      // create a first guess for the projection
      var center = d3.geo.centroid(json)
      var scale  = 150;
      var offset = [width/2, height/2];
      var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);

      // create the path
      var path = d3.geo.path().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                        height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      projection = d3.geo.mercator().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);

      // add a rectangle to see the bound of the svg
      //vis.append("rect").attr('width', width).attr('height', height)
        //.style('stroke', 'black').style('fill', 'none');
      vis.selectAll(".ward").data(json.features)
          .enter().append("path")
              .attr("class", function(d) { return "space" + d.properties.SpaceType; })
              .attr("d", path);
      vis.selectAll(".ward-label")
            .data(json.features)
        .enter().append("text")
            .attr("class", function(d) { return "ward-label " + d.properties.wid; })
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.properties.wid; });
    }); 
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
 
// Parse the date / time
var parseDate = d3.time.format("%Y-%m").parse;
 
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
var y = d3.scale.linear().range([height, 0]);
 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y-%m"));
 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);
 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
 
d3.csv("bar-data.csv", function(error, data) {
 
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
  
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
 
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");
 
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });
 
});
