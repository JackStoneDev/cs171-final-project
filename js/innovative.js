/**
 * InnovativeChart
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

InnovativeChart = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = {};

  this.initVisualization();
}

/**
 * Initialize visualization
 */
InnovativeChart.prototype.initVisualization = function() {
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

  vis.wrangleData();
}

/**
 * Wrangle data
 */
InnovativeChart.prototype.wrangleData = function() {
  var vis = this;

  // Get total deaths
  vis.totalDeaths = 0;

  vis.data.forEach(function(d) {
    vis.totalDeaths += +d.Deaths;
  });

  // Rollup data by age, gender, and race
  var nestCategories = ['Ten-Year Age Groups Code', 'Gender Code', 'Race'];

  nestCategories.forEach(function(category) {
    vis.displayData[category] = d3.nest()
                                  .key(function(d) {
                                    return d[category];
                                  })
                                  .rollup(function(v) {
                                    return {
                                      count: v.length,
                                      total: d3.sum(v, function(d) {
                                        return d.Deaths;
                                      })
                                    };
                                  })
                                  .object(vis.data);
  });
}

/**
 * Update visualization
 */
InnovativeChart.prototype.updateVisualization = function() {
  var vis = this;
}
