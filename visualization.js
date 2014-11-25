//TO DO: 
    // *style dots
    // *add pie chart of breakdown of classes
    // *add labels to all pie charts
    // *add pop-up with info
    // *write an if statement to automatically draw the 1920s data if the slider is at or over 1920
    // *add labels to slider
    // *start slider at 1914 rather than in middle
    // *fix font family
    // *style background
    // *add behavior where clicking on ward changes the ward in dropdown
    // *comment code


//When the slider changes log the slider val and call drawmap().
   $('#slider').on('change', function(){
   sliderval = $('#slider').attr('data-slider')
   console.log(sliderval);
   drawmap();
 });
  //set base value for slider
  var sliderval = 1914;

////LOAD ALL THE DATA////
var data;
var datanativity;

////***MAP***////
d3.csv("BostonGyms.csv", function(gyms3){
    gymdata = gyms3;
    drawmap()
  })

  var mapwidth  = 750;
  var mapheight = 475;
  var gymdata;  //puts the gym location data in global scope. 

  //select the #mapvis div and append a svg object to it.  Get the width and heigh from variables.
  var mapvis = d3.select("#mapvis").append("svg")
      .attr("width", mapwidth).attr("height", mapheight)

//The function drawmap() takes a json object and creates the basemap.  It automatically calcualates the scope based on coordinates in the file. 
//The function then appends ward labels to the map based on properties within the geojson file.
//Lastly it appends circles on top of the map.  The radius of the circles is calculated based on the attendence figures in the BostonGyms.csv file. 
function drawmap(){
    d3.json("wardsandparks.json", function(json) {
      
        // create a first guess for the projection
        // var scalefactor= function (d){return gymdata.T1914};
        mapvis.selectAll("path").remove();
        mapvis.selectAll("text").remove();
        mapvis.selectAll("circle").remove();
        var center = d3.geo.centroid(json)
        var scale  = 150;
        var offset = [mapwidth/2, mapheight/2];
        var projection = d3.geo.mercator().scale(scale).center(center)
            .translate(offset);
        
        // create the path
        var path = d3.geo.path().projection(projection);
        
        //projection for the circle
        var circle = d3.geo.path().projection(projection);
        //calculate the radius for the circles 
        var radius = d3.scale.sqrt()
                .domain([0, 1e3])
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
        
        //append the map paths to the svg.
        mapvis.selectAll(".ward").data(json.features)
            .enter().append("path")
                .attr("class", function(d) { return "space" + d.properties.SpaceType; })
                .attr("d", path);

        //add ward labels
        mapvis.selectAll(".ward-label")
              .data(json.features)
          .enter().append("text")
              .attr("class", function(d) { return "ward-label " + d.properties.wid; })
              .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function(d) { return d.properties.wid; });
        //add the circles to the map
        mapvis.selectAll("circles.points")
            .data(gymdata)
            .enter()
            .append("circle")
            // .attr("r", function(d) {return 2 * Math.sqrt(d.converts)})
            .attr("r", function(d) { return radius(+d[sliderval])})
            // .attr("r",  function(d) { return (+d["1914"])/scalefactor; })
            .attr("class","gym")
            .attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";});         
    }) //closes d3.json within drawmap()
}; //closes drawmap


//The functions filterYearAges and filterYear filter data based on the current year selected in each dropdown menu.
//filterYearAges() returns data where the year and ward is equal to the current selections and has a count of greater than 11.  This is done to simplify the chart and only show the significant age groups. 
function filterYearAges(d) {return +d.year === +currentYear && +d.ward === +currentWard && +d.count > 11}
//filterYear() returns data where the year and ward are equal to the current selections. 
function filterYear(d) {return +d.year === +currentYear && +d.ward === +currentWard}

//menuyear and menuward both call the change function when the dropdown is updated. 
var menuyear = d3.select("#year select")
    .on("change", change);  
var menuward = d3.select("#ward select")
    .on("change", change);    

//sets the default current values on page load and creates a variable to store the current value.
var currentYear = 1910;
var currentWard = 1;


var color = d3.scale.ordinal()
    .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
///PIE CHARTS SET UP///

var widthPie = 300,
    heightPie = 400,
    radius = Math.min(widthPie, heightPie) / 2;

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });

var pienativity = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });   

var svg_age = d3.select("#ages").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
  .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");


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

  var data_age_filt = data.filter(filterYear);
  var total = d3.sum(data_age_filt, function(d) { return d.count;});
  var toPercent = d3.format("0.1%");
  //format the tip when hovering over section of the pie chart. 
  var tip_age = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Residents between the ages of: " + d.data.agegrp + "</strong></br><strong>Percentage:</strong> <span style='color:red'>" + toPercent(d.data.count / total) + "</span>"; })

  var g = svg_age.selectAll(".arc")
      .data(pie(data.filter(filterYearAges)))
    .enter().append("g")
      .attr("class", "arc");
  svg_nat.call(tip_age);   
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.agegrp); })
      .attr("data-legend", function(d){return d.data.agegrp})
      .on('mouseover', tip_age.show)
      .on('mouseout', tip_age.hide);

  // g.append("text")
  //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "middle")
  //     .text(function(d) { return d.data.agegrp; });
  //   legend = svg_age.append("g")
  //       .attr("class", "legend")
  //       .attr("transform", "translate(50,30)")
  //       .style("font-size", "12px")
  //       .call(d3.legend)
};
var svg_nat = d3.select("#nativity").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
  .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

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

  //selects and removes any existing chart piece before redrawing. 
  svg_nat.selectAll("g").remove();
  svg_nat.selectAll(".arc_nat").remove()
  
  //filter data and calculate a total for generating percentages 
  var data_nat_filt = data_nat.filter(filterYear);
  var total = d3.sum(data_nat_filt, function(d) { return d.count;});
  var toPercent = d3.format("0.1%");
  //format the tip when hovering over section of the pie chart. 
   var tip_nat = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.data.nativity + "</strong></br><strong>Percentage:</strong> <span style='color:red'>" + toPercent(d.data.count / total) + "</span>"; })
  
 
  var g = svg_nat.selectAll(".arc_nat")
      .data(pienativity(data_nat.filter(filterYear)))
    .enter().append("g")
      .attr("class", "arc");

  svg_nat.call(tip_nat);    
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.nativity); })
      .attr("data-legend", function(d){return d.data.nativity})
      .on('mouseover', tip_nat.show)
      .on('mouseout', tip_nat.hide);
  
      // .attr("d", arc)
      
      //.style("fill", function (d) { return color(d.data.nativity); });
  // g.append("text")
      // .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      // .attr("dy", ".35em")
      // .style("text-anchor", "middle")
      // .text(function(d) { return d.data.nativity; });
  // legend = svg_nat.append("g")
  //     .attr("class", "legend")
  //     .attr("transform", "translate(-10,50)")
  //     .style("font-size", "11px")
  //     .call(d3.legend)
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