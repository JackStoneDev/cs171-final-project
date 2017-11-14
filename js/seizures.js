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
    right: 40,
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
  vis.x = d3.scaleLinear()
            .range([0, vis.width]);

  vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

  vis.xAxis = d3.axisBottom()
                .tickFormat(d3.format('d'))
                .ticks(5);
  vis.yAxis = d3.axisLeft();

  vis.svg.append('g')
         .attr('class', 'x-axis axis')
         .attr('transform', 'translate(0, ' + vis.height + ')');

  vis.svg.append('g')
         .attr('class', 'y-axis axis');

  // Axis labels
  vis.svg.append('text')
         .attr('class', 'axis-label x-label')
         .attr('transform', 'translate(' + (vis.width / 2) + ',' + (vis.height + vis.margin.top) + ')')
         .text('Year');

  vis.svg.append('text')
         .attr('class', 'axis-label y-label')
         .attr('transform', 'rotate(-90)')
         .attr('x', -vis.height / 2)
         .attr('y', -vis.margin.left + 15)
         .text('Quantity');

  // Line chart
  vis.svg.append('clipPath')
         .attr('id', 'clip')
         .append('rect')
         .attr('width', vis.width)
         .attr('height', vis.height);

  vis.svg.append('path')
         .datum(vis.data)
         .attr('id', 'line-chart')
         .attr('fill', 'none')
         .attr('stroke', '#38761d')
         .attr('stroke-width', 2.0)
         .attr('clip-path', 'url(#clip)');

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
    vis.updateVisualization();
  });

  // Bind drug selection
  $('input[name="drug-seizures-drug"]').change(function() {
    vis.updateVisualization();
  });

  vis.wrangleData();
}

/**
 * Wrangle data
 */
SeizuresChart.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data;

  // Convert strings to numeric values
  vis.displayData.forEach(function(d) {
    d.Year = +d.Year;
    d.Quantity = +d.Quantity;
  });

  // Nest by drug
  vis.displayData = d3.nest()
                      .key(function(d) {
                        return d.Drug;
                      })
                      .object(vis.displayData);

  // Nest drugs by unit
  for (var drugKey in vis.displayData) {
    var unit = d3.nest()
                 .key(function(d) {
                   return d.Unit;
                 })
                 .object(vis.displayData[drugKey]);

    vis.displayData[drugKey] = unit;
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
  vis.x.domain([2011, 2015]);

  var maxY = d3.max(vis.displayData[drug][unit], function(d) {
    return d.Quantity;
  });

  vis.y.domain([0, maxY * 1.2]);

  // Scale axes
  vis.xAxis.scale(vis.x);
  vis.yAxis.scale(vis.y);

  // Call axis functions
  vis.svg.select('.x-axis').call(vis.xAxis);
  vis.svg.select('.y-axis').call(vis.yAxis);

  // Update y-axis text
  vis.svg.select('.y-label')
         .text('Quantity (' + unit + ')');

  // Draw line chart
  vis.svg.select('#line-chart')
         .datum(vis.displayData[drug][unit]);

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
