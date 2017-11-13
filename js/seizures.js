/**
 * SeizuresChart
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

SeizuresChart = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = [];

  this.initVisualization();
}

/**
 * Initialize visualization
 */
SeizuresChart.prototype.initVisualization = function() {
  var vis = this;

  vis.margin = {
    top: 40,
    right: 0,
    bottom: 60,
    left: 60
  };

  vis.width = 600 - vis.margin.left - vis.margin.right,
  vis.height = 400 - vis.margin.top - vis.margin.bottom;

  // SVG drawing area
  vis.svg = d3.select('#' + vis.parentElement)
              .append('svg')
              .attr('width', vis.width + vis.margin.left + vis.margin.right)
              .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');

  // Axes
  vis.x = d3.scaleTime()
            .range([0, vis.width]);

  vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

  vis.xAxis = d3.axisBottom();
  vis.yAxis = d3.axisLeft();

  vis.svg.append('g')
         .attr('class', 'x-axis axis')
         .attr('transform', 'translate(0, ' + vis.height + ')');

  vis.svg.append('g')
         .attr('class', 'y-axis axis');

  // Line chart
  vis.svg.append('clipPath')
         .attr('id', 'clip')
         .append('rect')
         .attr('width', vis.width)
         .attr('height', vis.height);

  // Build radio for unit/drug selections
  var units = d3.map(vis.data, function(d) {
    return d.Unit;
  }).keys();

  var drugs = d3.map(vis.data, function(d) {
    return d.Drug;
  }).keys();

  drugs = drugs.filter(function(d) {
    return d === 'Ecstasy' || d === 'Methamphetamine' || d === 'Marijuana' || d === 'Crack' || d === 'Heroin' || d === 'Cocaine';
  });

  units.forEach(function(d, i) {
    var checked = '';

    if (i === 0) {
      checked = 'checked';
    }

    $('#' + vis.parentElement).append('<br /><input type="radio" name="drug-seizures-unit" id="' + d + '" value="' + d + '" ' + checked + '></input><label for="' + d + '">' + d + '</label>');
  });

  drugs.forEach(function(d, i) {
    var checked = '';

    if (i === 0) {
      checked = 'checked';
    }

    $('#' + vis.parentElement).append('<br /><input type="radio" name="drug-seizures-drug" id="' + d + '" value="' + d + '" ' + checked + '></input><label for="' + d + '">' + d + '</label>');
  });

  // Bind unit selection
  $('input[name="drug-seizures-unit"]').change(function() {
    vis.wrangleData();
  });

  // Bind drug selection
  $('input[name="drug-seizures-drug"]').change(function() {
    vis.wrangleData();
  });

  vis.wrangleData();
}

/**
 * Wrangle data
 */
SeizuresChart.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data;

  // Filter display data by unit and drug
  var unit = $('input[name="drug-seizures-unit"]:checked').val();
  var drug = $('input[name="drug-seizures-drug"]:checked').val();

  vis.displayData = vis.displayData.filter(function(d) {
    return d.Unit === unit;
  });

  vis.displayData = vis.displayData.filter(function(d) {
    return d.Drug === drug;
  });

  // Convert strings to numeric values
  vis.displayData.forEach(function(d) {
    d.Year = +d.Year;
    d.Quantity = +d.Quantity;
  });

  // Nest by drug group
  vis.displayData = d3.nest()
                      .key(function(d) {
                        return d['Drug Group'];
                      })
                      .object(vis.displayData);

  // Nest drugs in drug group by drug type
  for (var groupKey in vis.displayData) {
    var group = d3.nest()
              .key(function(d) {
                return d.Drug;
              })
              .object(vis.displayData[groupKey]);

    vis.displayData[groupKey] = {};

    // Nest drugs by unit
    for (var unitKey in group) {
      var unit = d3.nest()
                   .key(function(d) {
                     return d.Unit;
                   })
                   .object(group[unitKey]);

      vis.displayData[groupKey][unitKey] = unit;
    }
  }

  vis.updateVisualization();
}

/**
 * Update visualization
 */
SeizuresChart.prototype.updateVisualization = function() {
  var vis = this;

  var unit = $('input[name="drug-seizures-unit"]:checked').val();
  var drug = $('input[name="drug-seizures-drug"]:checked').val();

  // Axis domains
  vis.x.domain(d3.extent(vis.displayData[drug][unit], function(d) {
    return d.Year;
  }));

  vis.y.domain(d3.extent(vis.displayData[drug][unit], function(d) {
    return d.Quantity;
  }));

  // Scale axes
  vis.xAxis.scale(vis.x);
  vis.yAxis.scale(vis.y);

  // Call axis functions
  vis.svg.select('.x-axis').call(vis.xAxis);
  vis.svg.select('.y-axis').call(vis.yAxis);

  // Draw line chart
  vis.svg.select('#line-chart')
         .datum(vis.displayData['ATS']['Kilogram']['Amphetamine']);

  var line = d3.line()
               .x(function(d) {
                 return vis.x(d.Year);
               })
               .y(function(d) {
                 return vis.y(d.Quantity);
               });

  vis.svg.select('#line-chart')
         .attr('d', line);

  // Draw circles
  var circle = vis.svg.selectAll('circle')
                      .data(vis.displayData[drug][unit], function(d, i) {
                        return i
                      });

  circle.enter()
        .append('circle')
        .merge(circle)
        .attr('r', 5)
        .attr('fill', '#92c47d')
        .attr('cx', function(d) {
          return vis.x(d.Year);
        })
        .attr('cy', function(d) {
          return vis.y(d.Quantity);
        });

  circle.exit()
        .remove();
}
