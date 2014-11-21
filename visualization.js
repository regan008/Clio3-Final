
  var mapwidth  = 750;
  var mapheight = 530;

  var vis = d3.select("#vis").append("svg")
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

