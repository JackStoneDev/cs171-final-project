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
              .attr('id', 'innovative-svg')
              .attr('width', vis.width + vis.margin.left + vis.margin.right)
              .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');

  // Define scales
  vis.x = d3.scaleLinear()
            .domain([0, 10])
            .range([0, vis.width]);

  vis.y = d3.scaleLinear()
            .domain([0, 10])
            .range([vis.height, 0]);

  vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

  // Bind category selection
  $('input[name="innovative-category"]').change(function() {
    vis.updateVisualization();
  });

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
  var nestCategories = ['Age', 'Gender', 'Race'];
  var dataRollup = {};

  nestCategories.forEach(function(category) {
    dataRollup[category] = d3.nest()
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

  // Calculate relative percentages and build array of values for categories
  vis.categories = {};

  for (category in dataRollup) {
    vis.displayData[category] = {};
    vis.categories[category] = [];

    for (grouping in dataRollup[category]) {
      vis.displayData[category][grouping] = {};

      vis.displayData[category][grouping] = Math.round((dataRollup[category][grouping].total / vis.totalDeaths) * 100);
      vis.categories[category].push(grouping);
    }
  }

  vis.updateVisualization();
}

/**
 * Update visualization
 */
InnovativeChart.prototype.updateVisualization = function() {
  var vis = this;

  var category = $('input[name="innovative-category"]:checked').val();

  // Calculate color domain
  vis.colorPalette.domain(vis.categories[category]);

  var columnPosition = 0;
  var rowPosition = 0;

  // Clone display data
  var displayData = $.extend(true, {}, vis.displayData);

  // Calculate grid positions
  var gridPositions = [];

  grouping: for (grouping in displayData[category]) {
    for (; columnPosition < 10; columnPosition++) {
      for (; rowPosition < 10; rowPosition++) {
        if (displayData[category][grouping] === 0) {
          continue grouping;
        }

        displayData[category][grouping]--;

        gridPositions.push({
          x: columnPosition,
          y: rowPosition,
          value: grouping
        });

         if (rowPosition === 9) {
           rowPosition = 0;
           break;
         }
      }
    }
  }

  // Draw people
  var personRect = vis.svg.selectAll('image.person-rect')
                      .data(gridPositions, function(d, i) {
                        return i;
                      });
  personRect.enter()
        .append('rect')
        .merge(personRect)
        .transition(1000)
        .attr('class', 'person-rect')
        .attr('x', function(d) {
          return vis.x(d.x) + 1;
        })
        .attr('y', function(d) {
          return vis.y(d.y) * 1.6;
        })
        .attr('width', 28)
        .attr('height', 35)
        .attr('fill', function(d) {
          return vis.colorPalette(d.value);
        });

  personRect.exit()
        .remove();

  var person = vis.svg.selectAll('image.person')
                      .data(gridPositions, function(d, i) {
                        return i;
                      });
  person.enter()
        .append('image')
        .merge(person)
        .transition(1000)
        .attr('class', 'person')
        .attr('x', function(d) {
          return vis.x(d.x);
        })
        .attr('y', function(d) {
          return vis.y(d.y) * 1.6;
        })
        .attr('width', 30)
        .attr('height', 35)
        .attr('xlink:href', 'img/body.png');

  person.exit()
        .remove();

  // Draw legend
  var legendText = vis.svg.selectAll('text.legend')
                          .data(vis.categories[category], function(d, i) {
                            return i;
                          });

  legendText.enter()
            .append('text')
            .merge(legendText)
            .transition(1000)
            .attr('class', 'legend')
            .attr('x', -250)
            .attr('y', function(d, i) {
              return i * 50 + 30;
            })
            .attr('height', 50)
            .attr('width', 100)
            .attr('fill', function(d) {
              return vis.colorPalette(d);
            })
            .text(function(d) {
              return vis.displayData[category][d] + '%' + (category === 'Age' ? ' age' : '') + ' ' + d;
            });

  legendText.exit()
            .remove();
}
