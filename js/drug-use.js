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

  // Axis labels
  vis.svg.append('text')
         .attr('class', 'axis-label x-label')
         .attr('transform', 'translate(' + (vis.width / 2) + ',' + (vis.height + vis.margin.top) + ')')
         .text('Year');

  vis.svg.append('text')
         .attr('class', 'axis-label y-label')
         .attr('transform', 'rotate(-90)')
         .attr('x', -vis.height / 2)
         .attr('y', -vis.margin.left + 10)
         .text('Percent Using in Past Month');

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

  vis.svg.append('path')
         .datum(vis.data)
         .attr('id', 'line-chart')
         .attr('fill', 'none')
         .attr('stroke', '#af070d')
         .attr('stroke-width', 2.0)
         .attr('clip-path', 'url(#clip)');

  // Tooltip
  vis.tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                var tooltipString = d.Percent;

                return vis.tooltipString;
              });

  vis.svg.call(vis.tip);

  vis.wrangleData();
}

/**
 * Wrangle data
 */
DrugUseChart.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data;

  vis.updateVisualization();
}

/**
 * Update visualization
 */
DrugUseChart.prototype.updateVisualization = function() {
  var vis = this;

  // Axis domains
  vis.x.domain([2002, 2013]);

  var maxY = d3.max(vis.displayData, function(d) {
    return d.Quantity;
  });

  vis.y.domain([0, maxY * 1.2]);

  // Scale axes
  vis.xAxis.scale(vis.x);
  vis.yAxis.scale(vis.y);

  // Call axis functions
  vis.svg.select('.x-axis').call(vis.xAxis);
  vis.svg.select('.y-axis').call(vis.yAxis);

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
                      .data(vis.displayData, function(d, i) {
                        return i
                      });

  circle.enter()
        .append('circle')
        .merge(circle)
        .attr('r', 5)
        .attr('fill', '#c3c3c3')
        .attr('cx', function(d) {
          return vis.x(d.Year);
        })
        .attr('cy', function(d) {
          return vis.y(d.Quantity);
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

  circle.exit()
        .remove();
}
