  $('#slider').on('change', function(){
  sliderval = $('#slider').attr('data-slider')
  console.log(sliderval);
});
  var mapwidth  = 750;
  var mapheight = 475;
  var gymdata;
  // var scalefactor= 3000;
  // console.print(gymdata.T1914);
  var mapvis = d3.select("#mapvis").append("svg")
      .attr("width", mapwidth).attr("height", mapheight)

  // d3.json("gyms.json", function(gyms2){
  //       gymdata = gyms2;
  //       //console.log(gymdata);
  //     })
  d3.csv("BostonGyms.csv", function(gyms3){
    gymdata = gyms3;
  })

  d3.json("wardsandparks.json", function(json) {
      // create a first guess for the projection
      // var scalefactor= function (d){return gymdata.T1914};
      
      var center = d3.geo.centroid(json)
      var scale  = 150;
      var offset = [mapwidth/2, mapheight/2];
      var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);
      
      // create the path
      var path = d3.geo.path().projection(projection);
      var circle = d3.geo.path().projection(projection);
      var radius = d3.scale.sqrt()
              .domain([0, 1e4])
              .range([0, 15]);
      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*mapwidth  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*mapheight / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [mapwidth - (bounds[0][0] + bounds[1][0])/2,
                        mapheight - (bounds[0][1] + bounds[1][1])/2];
      

      // new projection
      projection = d3.geo.mercator().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);
      // circle = circle.projection(projection);
      // add a rectangle to see the bound of the svg
      //vis.append("rect").attr('width', width).attr('height', height)
        //.style('stroke', 'black').style('fill', 'none');
      mapvis.selectAll(".ward").data(json.features)
          .enter().append("path")
              .attr("class", function(d) { return "space" + d.properties.SpaceType; })
              .attr("d", path);
      // mapvis.selectAll(".ward").data(gymdata.features)
      //     .enter().append("path")
      //     .attr("d", path)
      //     .attr("r", 125);
      // console.log(json.features)
      mapvis.selectAll(".ward-label")
            .data(json.features)
        .enter().append("text")
            .attr("class", function(d) { return "ward-label " + d.properties.wid; })
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.properties.wid; });
      // console.log(gymdata.features);
      mapvis.selectAll("circles.points")
          .data(gymdata)
          .enter()
          .append("circle")
          // .attr("r", function(d) {return 2 * Math.sqrt(d.converts)})
          .attr("r", function(d) { return radius(+d[sliderval])})
          // .attr("r",  function(d) { return (+d["1914"])/scalefactor; })
          .attr("class","gym")
          .attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";});
            
    });



function filterYearAges(d) {return +d.year === +currentYear && +d.ward === +currentWard && +d.count > 11}

function filterYear(d) {return +d.year === +currentYear && +d.ward === +currentWard}
var menuyear = d3.select("#year select")
    .on("change", change);  
var menuward = d3.select("#ward select")
    .on("change", change);    
var currentYear = 1910;
var currentWard = 1;

var agewidth = 300,
    ageheight = 400,
    radius = Math.min(agewidth, ageheight) / 2;

var color = d3.scale.ordinal()
    .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);

// "#3BB9C4", "#D4502F","#C2C14C","#9865CF","#D19E45", "#7F301C", "#1F6369"
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
var data;
var datanativity;
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });
var pienativity = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });   
var svg_age = d3.select("#ages").append("svg")
    .attr("width", agewidth)
    .attr("height", ageheight)
  .append("g")
    .attr("transform", "translate(" + agewidth / 2 + "," + ageheight / 2 + ")");

d3.csv("ages.csv", function(error, csv) {
 data = csv;
 svg.selectAll("g").remove();
  data.forEach(function(d) {
    d.count = +d.count;  });
  redraw();
});


function change() {

  currentYear = menuyear.property("value")
  currentWard = menuward.property("value")
  d3.transition()
    .duration(750)
    .each(redraw)
    .each(drawnativity)
    .each(drawgenders);
}


function redraw() {

  svg_age.selectAll("g").remove();
  svg_age.selectAll(".arc").remove()

  var g = svg_age.selectAll(".arc")
      .data(pie(data.filter(filterYearAges)))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.agegrp); })
      .attr("data-legend", function(d){return d.data.agegrp});

  // g.append("text")
  //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "middle")
  //     .text(function(d) { return d.data.agegrp; });
  legend = svg_age.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(50,30)")
      .style("font-size", "12px")
      .call(d3.legend)
};
var svg_nat = d3.select("#nativity").append("svg")
    .attr("width", agewidth)
    .attr("height", ageheight)
  .append("g")
    .attr("transform", "translate(" + agewidth / 2 + "," + ageheight / 2 + ")");

d3.csv("nativity.csv", function(error, csvnat) {
 data_nat = csvnat;
 svg_nat.selectAll("g").remove();
  data.forEach(function(d) {
    d.count = +d.count;  });
  // console.log(data_nat);
  redraw();
  drawnativity();
});


function drawnativity() {

  svg_nat.selectAll("g").remove();
  svg_nat.selectAll(".arc_nat").remove()
  
  var g = svg_nat.selectAll(".arc_nat")
      .data(pienativity(data_nat.filter(filterYear)))
    .enter().append("g")
      .attr("class", "arc");
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.nativity); })
      .attr("data-legend", function(d){return d.data.nativity});
      
      // .attr("d", arc)
      
      //.style("fill", function (d) { return color(d.data.nativity); });
  // g.append("text")
      // .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      // .attr("dy", ".35em")
      // .style("text-anchor", "middle")
      // .text(function(d) { return d.data.nativity; });
  legend = svg_nat.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(-10,50)")
      .style("font-size", "11px")
      .call(d3.legend)
};
function filterYearGenders(d) {return +d.year === +currentYear}
var formatted;
// var currentYear = 1910;
//set the margins
var margin_gender = {top: 50, right: 160, bottom: 80, left: 50},
    width = 960 - margin_gender.left - margin_gender.right,
    height = 275 - margin_gender.top - margin_gender.bottom;
var x = d3.scale.ordinal()
    .rangeRoundBands([0,width], .1);
var y = d3.scale.linear()
    .rangeRound([height, 0]);
 var x0 = d3.scale.ordinal()
     .rangeRoundBands([0, width], .1);
 var x1 = d3.scale.ordinal();
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .tickFormat(d3.format(".2s"));
// var menuyear = d3.select("#year select")
//     .on("change", changegenders);    
var color_genders = d3.scale.ordinal()
  .range(["#e74c3c","#2980b9"])
var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin_gender.left + margin_gender.right)
    .attr("height", height + margin_gender.top + margin_gender.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_gender.left + "," + margin_gender.top + ")");  
//this sucks in the data, stores it in a variable called data that is then renamed to formatted (don't know why).  Keys are created for each series in the graph.  The data is then mapped into those key sand the scales are created (from Bostock's example).
d3.csv("data.csv", function(data) {
        formatted = data;
    //Create keys for each gender
        genderNames = d3.keys(formatted[0]).filter(function(key) {return key !== "ward" && key !== "year" && key !== "citizen" && key !=="non-citizen" ; });
    //formats and maps each gender to a new variable called d.genders with the values name and value.   
        formatted.forEach(function(d) {
          d.genders = genderNames.map(function(name) { 
            return {name: name, value: +d[name]};});
        });
    //creates some scales. No positive exactly what it does.  Pulled from mbostock's Grouped Bar Chart at bl.ocks.org/mbostock/3887051
        x0.domain(data.map(function(d) { return d.ward; }));
        x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.genders, function(d) { return d.value; }); })]);
    //Call the redraw function    
        drawgenders();
          });
//This function gets thte current property of the dropdown and on a change it redraws the chart. 
function changegenders() {
  currentYear = menuyear.property("value")
  d3.transition()
    .duration(750)
    .each(drawgenders);
}
function drawgenders() {
  svg.selectAll("g").remove();
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");
  var ward = svg.selectAll(".ward")
      .data(formatted.filter(filterYearGenders))
      .enter()
      .append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.ward) + ",0)"; })
      .attr("class", "grouping")
      .attr("id", function(d) {return d.ward});
  ward.selectAll("rect")
      .data(function(d) {  return d.genders; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color_genders(d.name); });
  var legend = svg.selectAll(".legend")
      .data(genderNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color_genders);
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
} //end redraw