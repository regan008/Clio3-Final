<!DOCTYPE html>
<meta charset="utf-8">
<style>
</style>
<body>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<script>
var margin = {topL 30, right: 10, bottom: 10, left: 100},
	width = 960 - margin.left - margin.right,
	height = 900 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.range([0, width])
	.domain([0, 100]);

var y = d3.scale.ordinal()
	.rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var input; //initialize input to do something

var color = d3.scale.ordinal()
	.range(["red", "orange", "blue"]);

d3.csv("data.csv", function (error, data){
	data.forEach(function(d) {
    d.ward = +d.ward;
    d.male = +d.male;
    d.female = +d.female;
  });
	var test = d3.keys(year[0]).filter(function(key) {
		return key != "year";
	});
	console.log(test);
	})
</script>