function filterYearGenders(d) {return +d.year === +currentYear}
// var formatted;
// // var currentYear = 1910;
// //set the margins
// var margin_gender = {top: 50, right: 160, bottom: 80, left: 50},
//     width = 960 - margin_gender.left - margin_gender.right,
//     height = 275 - margin_gender.top - margin_gender.bottom;
// var x = d3.scale.ordinal()
//     .rangeRoundBands([0,width], .1);
// var y = d3.scale.linear()
//     .rangeRound([height, 0]);
//  var x0 = d3.scale.ordinal()
//      .rangeRoundBands([0, width], .1);
//  var x1 = d3.scale.ordinal();
// var xAxis = d3.svg.axis()
//     .scale(x0)
//     .orient("bottom");
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     // .tickFormat(d3.format(".2s"));
// // var menuyear = d3.select("#year select")
// //     .on("change", changegenders);    
// var color_genders = d3.scale.ordinal()
//   .range(["#e74c3c","#2980b9"])
// var svg = d3.select("#vis").append("svg")
//     .attr("width", width + margin_gender.left + margin_gender.right)
//     .attr("height", height + margin_gender.top + margin_gender.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin_gender.left + "," + margin_gender.top + ")");  
// //this sucks in the data, stores it in a variable called data that is then renamed to formatted (don't know why).  Keys are created for each series in the graph.  The data is then mapped into those key sand the scales are created (from Bostock's example).
// d3.csv("data.csv", function(data) {
//         formatted = data;
//     //Create keys for each gender
//         genderNames = d3.keys(formatted[0]).filter(function(key) {return key !== "ward" && key !== "year" && key !== "citizen" && key !=="non-citizen" ; });
//     //formats and maps each gender to a new variable called d.genders with the values name and value.   
//         formatted.forEach(function(d) {
//           d.genders = genderNames.map(function(name) { 
//             return {name: name, value: +d[name]};});
//         });
//     //creates some scales. No positive exactly what it does.  Pulled from mbostock's Grouped Bar Chart at bl.ocks.org/mbostock/3887051
//         x0.domain(data.map(function(d) { return d.ward; }));
//         x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]);
//         y.domain([0, d3.max(data, function(d) { return d3.max(d.genders, function(d) { return d.value; }); })]);
//     //Call the redraw function    
//         drawgenders();
//           });
// //This function gets thte current property of the dropdown and on a change it redraws the chart. 
// function changegenders() {
//   currentYear = menuyear.property("value")
//   d3.transition()
//     .duration(750)
//     .each(drawgenders);
// }
// function drawgenders() {
//   svg.selectAll("g").remove();
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Population");
//   var ward = svg.selectAll(".ward")
//       .data(formatted.filter(filterYearGenders))
//       .enter()
//       .append("g")
//       .attr("transform", function(d) { return "translate(" + x0(d.ward) + ",0)"; })
//       .attr("class", "grouping")
//       .attr("id", function(d) {return d.ward});
//   ward.selectAll("rect")
//       .data(function(d) {  return d.genders; })
//     .enter().append("rect")
//       .attr("width", x1.rangeBand())
//       .attr("x", function(d) { return x1(d.name); })
//       .attr("y", function(d) { return y(d.value); })
//       .attr("height", function(d) { return height - y(d.value); })
//       .style("fill", function(d) { return color_genders(d.name); });
//   var legend = svg.selectAll(".legend")
//       .data(genderNames.slice().reverse())
//     .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//   legend.append("rect")
//       .attr("x", width - 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color_genders);
//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });
// } //end redraw