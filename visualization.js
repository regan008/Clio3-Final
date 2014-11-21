
  var mapwidth  = 750;
  var mapheight = 530;

  var mapvis = d3.select("#mapvis").append("svg")
      .attr("width", mapwidth).attr("height", mapheight)

  d3.json("wardsandparks.json", function(json) {
      // create a first guess for the projection
      var center = d3.geo.centroid(json)
      var scale  = 150;
      var offset = [mapwidth/2, mapheight/2];
      var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);

      // create the path
      var path = d3.geo.path().projection(projection);

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

      // add a rectangle to see the bound of the svg
      //vis.append("rect").attr('width', width).attr('height', height)
        //.style('stroke', 'black').style('fill', 'none');
      mapvis.selectAll(".ward").data(json.features)
          .enter().append("path")
              .attr("class", function(d) { return "space" + d.properties.SpaceType; })
              .attr("d", path);
      mapvis.selectAll(".ward-label")
            .data(json.features)
        .enter().append("text")
            .attr("class", function(d) { return "ward-label " + d.properties.wid; })
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.properties.wid; });

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
var svg = d3.select("#ages").append("svg")
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
    .each(drawnativity);
}


function redraw() {

  svg.selectAll("g").remove();
  svg.selectAll(".arc").remove()

  var g = svg.selectAll(".arc")
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
  legend = svg.append("g")
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
  console.log(data_nat);
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

