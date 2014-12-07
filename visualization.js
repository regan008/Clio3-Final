
//When the slider changes log the slider val and call drawmap().
   $('#slider').on('change', function(){
   sliderval = $('#slider').attr('data-slider')
   // console.log(sliderval);
   drawmap();
 });
  //set base value for slider
  var sliderval = 1914;

////LOAD ALL THE DATA////
var data;
var datanativity;
var gymclass;

d3.csv("BostonGyms.csv", function(gyms3){
    gymdata = gyms3;
    drawmap();
  })
d3.csv("ages.csv", function(error, csv) {
 data = csv;
 // svg.selectAll("g").remove();
  data.forEach(function(d) {
    d.count = +d.count;  });
  drawAges();
});

d3.csv("nativity.csv", function(error, csvnat) {
 data_nat = csvnat;
 svg_nat.selectAll("g").remove();
  data.forEach(function(d) {
    d.count = +d.count;  });
  // console.log(data_nat);
  drawAges();
  drawNativity();
});
d3.csv("gyms_long.csv", function(error, csvgyms) {
  gymclass = csvgyms;
  gymclass.forEach(function(d) {
    d.count = +d.count;  });
  // drawGymClassatt();

})
d3.csv("pubgyms.csv", function(error, csvpubgyms) {
  publicgyms = csvpubgyms;
})

////***MAP***////
  var mapwidth  = 750;
  var mapheight = 425;
  var gymdata;  //puts the gym location data in global scope. 
  var currentGym = "Cabot Street Gymnasium"
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
                .domain([0, 2000])
                .range([0, 15]);
        
        // using the path determine the bounds of the current map and use 
        // these to determine better values for the scale and translation
        var bounds  = path.bounds(json);
        var hscale  = scale*mapwidth  / (bounds[1][0] - bounds[0][0]);
        var vscale  = scale*mapheight / (bounds[1][1] - bounds[0][1]);
        var scale   = (hscale < vscale) ? hscale : vscale;
        var offset  = [mapwidth - (bounds[0][0] + bounds[1][0])/2,
                          mapheight - (bounds[0][1] + bounds[1][1])/2];
        
        var tip_map = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<p class='tiptext'><strong>" + d.Gymname + "</strong><br>Total attendence in " + sliderval + " was " + d[sliderval] + "</p>"; })

        var tip_publicgyms = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<p class='tiptext'><strong>" + d.Gym + "</strong><br>No attendence data.</p>"; })

        // new projection
        projection = d3.geo.mercator().center(center)
          .scale(scale).translate(offset);
        path = path.projection(projection);
        
        //append the map paths to the svg.
        mapvis.selectAll(".ward").data(json.features)
            .enter().append("path")
                .attr("class", function(d) { return "space" + d.properties.SpaceType; })
                .attr("d", path)
                .on("click", function(d) {
                  currentWard = d.properties.wid;
                  drawAges();
                  drawNativity(); 
                });

        //add ward labels
        mapvis.selectAll(".ward-label")
              .data(json.features)
          .enter().append("text")
              .attr("class", function(d) { return "ward-label " + d.properties.wid; })
              .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function(d) { return d.properties.wid; });
        
        mapvis.call(tip_map);  
        //add the circles to the map
        mapvis.selectAll("circles.points")
            .data(gymdata)
            .enter()
            .append("circle")
            // .attr("class", function(d) {return d.WardNo; })
            // .attr("r", function(d) {return 2 * Math.sqrt(d.converts)})
            .attr("r", function(d) { return radius(+d[sliderval])})
            // .attr("r",  function(d) { return (+d["1914"])/scalefactor; })
            .attr("class","gym")
            .attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";})
            .on('mouseover', tip_map.show)
            .on('mouseout', tip_map.hide)  
            .on("click", function(d) { 
                // console.log(gymclass); 
                // console.log(gymclass.ward); 
                currentWard = d.WardNo; 
                drawAges(); 
                drawNativity(); 
                drawGymClassatt();
                console.log("the circle has been clicked");  });  
        mapvis.call(tip_publicgyms);
        mapvis.selectAll("circles.points")
          .data(publicgyms)
          .enter()
          .append("circle")
          // .attr("class", function(d) {return d.WardNo; })
          // .attr("r", function(d) {return 2 * Math.sqrt(d.converts)})
          .attr("r", 3.5)
          // .attr("r",  function(d) { return (+d["1914"])/scalefactor; })
          .attr("class","publicgym")
          .attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";})
          .on('mouseover', tip_publicgyms.show)
          .on('mouseout', tip_publicgyms.hide)  
          .on("click", function(d) { 
                // console.log(gymclass); 
                // console.log(gymclass.ward); 
                currentWard = d.WardNo; 
                drawAges(); 
                drawNativity();
                drawNoData(); });  
    }) //closes d3.json within drawmap()
}; //closes drawmap
function drawNoData() {
  svg_gymclassattendence.selectAll("g").remove();
  svg_gymclassattendence.selectAll(".arc").remove();
  var printnodata = "No data here."
  var nodata = d3.selectAll("#gymclassestext").text(printnodata);
  

}
//The functions filterYearAges and filterYear filter data based on the current year selected in each dropdown menu.
//filterYearAges() returns data where the year and ward is equal to the current selections and has a count of greater than 11.  This is done to simplify the chart and only show the significant age groups. 
function filterYearAges(d) {return +d.year === +currentYear && +d.ward === +currentWard && +d.count > 11}
//filterYear() returns data where the year and ward are equal to the current selections. 
function filterYear(d) {return +d.year === +currentYear && +d.ward === +currentWard}
function filterDates(d) {return +d.year === +1914 && +d.ward === +currentWard}
//menuyear and menuward both call the change function when the dropdown is updated. 
var menuyear = d3.select("#year select")
    .on("change", change);  
var menuward = d3.select("#ward select")
    .on("change", change);    

//sets the default current values on page load and creates a variable to store the current value.
var currentYear = 1910;
var currentWard = 1;

///PIE CHARTS SET UP///
var color = d3.scale.ordinal()
    .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
    
var widthPie = 200,
    heightPie = 200,
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

var svg_nat = d3.select("#nativity").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
  .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

var svg_gymclassattendence = d3.select("#gymclasses").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
  .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

//change() is called when any of the dropdowns is updated.  It gets the current values for ward and year and then calls each redraw function. 
function change() {
    
    //get the current values of currentyear and currentward. Call the redraw functions drawAges(), drawNativity
    currentYear = menuyear.property("value")
    currentWard = menuward.property("value")
    
    d3.transition()
      .duration(750)
      .each(drawAges)
      .each(drawNativity)
      .each(drawGymClassatt);
} //end change()

function drawGymClassatt() {

    svg_gymclassattendence.selectAll("g").remove();
    svg_gymclassattendence.selectAll(".arc").remove();
    d3.select("#gymclassestext").remove();

    //filter in order to calculate percentages for tooltips.
    var data_class_filt = gymclass.filter(filterDates);
    var total = d3.sum(data_class_filt, function(d) { return +d.count;});
    var toPercent = d3.format("0.1%");
    
    // //format the tip when hovering over section of the pie chart. 
    var tip_gymclass = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return d.data.classtype + ": " + toPercent(d.data.count / d.data.totals) ; })

    //append an filter data to each arc
    var g = svg_gymclassattendence.selectAll(".arc")
        .data(pie(gymclass.filter(filterDates)))
      .enter().append("g")
        .attr("class", "arc");
    //call tooltips
    svg_gymclassattendence.call(tip_gymclass);   

    //apend data to path. call tooltops on mouseover/mouseout
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.classtype); })
        // .attr("data-legend", function(d){return d.gymclass.classtype});
         .on('mouseover', tip_gymclass.show)
         .on('mouseout', tip_gymclass.hide);
}; //end drawAges



//drawAges() draw a pie chart for each ward per year based on IPUMS data.
function drawAges() {

    svg_age.selectAll("g").remove();
    svg_age.selectAll(".arc").remove()

    //filter in order to calculate percentages for tooltips.
    var data_age_filt = data.filter(filterYear);
    var total = d3.sum(data_age_filt, function(d) { return d.count;});
    var toPercent = d3.format("0.1%");
    
    //format the tip when hovering over section of the pie chart. 
    var tip_age = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Residents between the ages of: " + d.data.agegrp + "</strong></br><strong>Percentage:</strong> <span style='color:red'>" + toPercent(d.data.count / total) + "</span>"; })

    //append an filter data to each arc
    var g = svg_age.selectAll(".arc")
        .data(pie(data.filter(filterYearAges)))
      .enter().append("g")
        .attr("class", "arc");
    //call tooltips
    svg_age.call(tip_age);   

    //apend data to path. call tooltops on mouseover/mouseout
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.agegrp); })
        .attr("data-legend", function(d){return d.data.agegrp})
        .on('mouseover', tip_age.show)
        .on('mouseout', tip_age.hide);

    d3.select("#ageslabels").append("text")
}; //end drawAges

//drawNativity() draw the pie chart of nativity by ward/year. 
function drawNativity() {
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
  
}; //end drawNativity()