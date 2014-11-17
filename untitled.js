// loading sample.json
var sample2 = tributary.sample.sample2; 

// date manipulation to format UTC to js Date obj
sample2.forEach(function(d) { d.time = new Date(d.time * 1000); });

// helpers and constants
var margin = {"top": 50, "right": 100, "bottom": 56, "left": 50};
var width = 930 - margin.right - margin.left;
var height = 582 - margin.top - margin.bottom;
var timeFormat = d3.time.format("%c");
var X = width/sample2.length*0.25;
	
// find data range
var xDomain = d3.extent(sample2, function (d, i){ return d.time; });
var yMin = d3.min(sample2, function(d){ return Math.min(d.low); });
var yMax = d3.max(sample2, function(d){ return Math.max(d.high); });

// scales, add 10pc padding to x-domain
var xScale = d3.time.scale()
	.domain(xDomain);

xScale.domain([-0.1,1.1].map(xScale.invert))
	.range([margin.left, width - margin.right]);

var yScale = d3.scale.linear()
	.domain([yMin, yMax])
	.range([height - margin.top, margin.bottom]);

// set up axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
	.ticks(10)
	.tickPadding(10);
// .tickFormat(timeFormat)

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("right")
	.tickValues(yScale.domain());

// set up chart types
var area = d3.svg.area()
  .x(function(d){ return xScale(d.time); })
  .y0(height- margin.bottom)
  .y1(function(d){ return yScale(d.close); });

var line = d3.svg.line().interpolate("monotone")
  .x(function(d){ return xScale(d.time); })
  .y(function(d){ return yScale(d.close); });

// create svg container and offset
var canvas = d3.select("svg")
	.attr({"width": width, "height": height})
	.append("g")
	.attr("transform", "translate(" + margin.top/2 + "," + margin.left/2 + ")");

// grids
canvas.append("svg:rect")
  .attr({
    "width": width - margin.right - margin.left,
    "height": height - margin.bottom - margin.top,
    "class": "plot",
    "transform": "translate(" + margin.top + "," + margin.bottom + ")"
  });

// chart options by type
var chartDraw = {
  
  candle: function(){
     
      canvas.selectAll("line.candle")
          .data(sample2)
          .enter()
          .append("svg:line")
          .attr({
            "class": "candle alt-view",
            "x1": function(d,i) { return xScale(d.time) - X*0.5; },
            "x2": function(d,i) { return xScale(d.time) - X*0.5; },
            "y1": function(d,i) { return yScale(d.high); },
            "y2": function(d,i) { return yScale(d.low); },
            "stroke": "black" 
          });    
      
      canvas.selectAll("rect.candle")
          .data(sample2)
          .enter()
          .append("svg:rect")
          .attr({
            "class": "candle alt-view",
            "width": function(d){ return X},
            "x": function(d,i) { return xScale(d.time) - X; },
            "y": function(d,i) { return yScale(Math.max(d.open, d.close)); },
            "height": function(d,i) { return yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)); },
            "fill": function (d) { return d.open > d.close ? "#dc432c" : "#0CD1AA" },
            "stroke": "gray"
          });

    },
    
  line: function(){ 
   
      canvas.append("path")
        .datum(sample2)
        .attr("class", "line alt-view")
        .attr("d", line); 
  },

  area: function (){
        
      canvas.append("path")
        .datum(sample2)
        .attr("class", "area alt-view")
        .attr("d", area);
    }
}; 


// draw axes
canvas.append('g').call(xAxis)
	.attr('transform', 'translate(0, ' + (height - margin.bottom) + ')');

canvas.append('g').call(yAxis)
    .attr('transform', 'translate(' + (width - margin.right) + ', 0)');

// drop down menu
var chartOptions = ["candle", "line", "area"];

d3.select(".tributary_svg")
    .append("foreignObject")
    .attr({
      "height": 100,
      "width": 300,
      "transform": "translate(" + margin.left*1.3 + "," + margin.top*0.7 + ")"
    })
    .append("xhtml:select")
	.on("change", function () { 
          
        d3.selectAll(".alt-view").remove();
        
        selected = this.value;
        
        if (selected == "line") { chartDraw.line(); }
        else if (selected == "area") { chartDraw.area(); }
        else if (selected == "candle") { chartDraw.candle(); }
      
    })
    .attr("id", "drop-down")
    .selectAll("option")
    .data(chartOptions)
    .enter()
    .append("option")
    .text(function(d) { return d;})
    .attr("value", function(d){ return d; });

// default chart
chartDraw.candle();

