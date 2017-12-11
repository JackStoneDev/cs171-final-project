/**
 * DrugUseChart
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

DrugUseChart = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = [];

  this.initVisualization();
}

/**
 * Initialize visualization
 */
DrugUseChart.prototype.initVisualization = function() {
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
            .range([0, vis.width - 50]);

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
         .attr('transform', 'translate(' + ((vis.width - vis.margin.left) / 2) + ',' + (vis.height + vis.margin.top) + ')')
         .text('Year');

  vis.svg.append('text')
         .attr('class', 'axis-label y-label')
         .attr('transform', 'rotate(-90)')
         .attr('x', -vis.height / 2)
         .attr('y', -vis.margin.left + 10)
         .text('Percent');

  // Axis title
  vis.svg.append('text')
         .attr('class', 'axis-title')
         .attr('transform', 'translate(' + (vis.width / 2) + ',0)')
         .text('Drug Use');

  // Line chart
  vis.svg.append('clipPath')
         .attr('id', 'clip')
         .append('rect')
         .attr('width', vis.width)
         .attr('height', vis.height);

  // Color palette
  vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

  // Tooltip
  vis.tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return d.percent + '%';
              });

  vis.svg.call(vis.tip);

  vis.wrangleData();
}

/**
 * Wrangle data
 */
DrugUseChart.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = {};
  vis.races = [];

  // Nest by race.
  var raceNested = d3.nest()
                      .key(function(d) {
                        return d.Race;
                      })
                      .object(vis.data);

  for (race in raceNested) {
    vis.races.push(race);

    vis.displayData[race] = [];

    for (year in raceNested[race][0]) {
      if (isNaN(year)) {
        continue;
      }

      vis.displayData[race].push({
        year: year,
        percent: raceNested[race][0][year]
      })
    }
  }

  vis.updateVisualization();
}

/**
 * Update visualization
 */
DrugUseChart.prototype.updateVisualization = function() {
  var vis = this;

  // Axis domains
  vis.x.domain([2002, 2013]);
  vis.y.domain([0, 12]);

  // Color domain
  vis.colorPalette.domain(vis.races);

  // Scale axes
  vis.xAxis.scale(vis.x);
  vis.yAxis.scale(vis.y);

  // Call axis functions
  vis.svg.select('.x-axis').call(vis.xAxis);
  vis.svg.select('.y-axis').call(vis.yAxis);

  // Draw lines
  for (race in vis.displayData) {
    // Store last values for later use in line labels.
    var lastX = 0;
    var lastY = 0;

    var line = d3.line()
                 .x(function(d) {
                   lastX = vis.x(d.year);

                   return lastX;
                 })
                 .y(function(d) {
                   lastY = vis.y(d.percent);

                   return lastY;
                 });

    // Draw line chart
    vis.svg.append('path')
           .attr('id', 'line-chart')
           .attr('fill', 'none')
           .attr('stroke-width', 2.0)
           .attr('clip-path', 'url(#clip)')
           .datum(vis.displayData[race])
           .attr('stroke', vis.colorPalette(race))
           .attr('d', line);

    // Draw circles
    var circle = vis.svg.selectAll('circle#' + race)
                        .data(vis.displayData[race], function(d, i) {
                          return i
                        });

    circle.enter()
          .append('circle')
          .merge(circle)
          .attr('id', race)
          .attr('r', 3)
          .attr('fill', '#c3c3c3')
          .attr('cx', function(d) {
            return vis.x(d.year);
          })
          .attr('cy', function(d) {
            return vis.y(d.percent);
          })
          .on('mouseover', vis.tip.show)
          .on('mouseout', vis.tip.hide);

    circle.exit()
          .remove();

    // Draw line labels
    vis.svg.append('text')
           .text(race)
           .attr('fill', vis.colorPalette(race))
           .attr('x', lastX + 10)
           .attr('y', lastY + 3);
  }
}
