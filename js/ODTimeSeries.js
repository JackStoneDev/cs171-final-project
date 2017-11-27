/**
 * ODTimeSeries
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

ODTimeSeries = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVisualization();
}

/**
 * Initialize visualization
 */
ODTimeSeries.prototype.initVisualization = function() {
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
    vis.svg = d3.select('#OD-Time-Series')
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
        .ticks(16);
    vis.yAxis = d3.axisLeft();

    vis.xAxisLine = vis.svg.append('g')
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
        .attr('x', -vis.height / 1.2)
        .attr('y', -vis.margin.left + 10)
        .text('Deaths per 100,000 Population');

    // Axis title
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'translate(' + vis.width / 2 + ',0)')
        .text('Rate by Year');

    // Line chart
    vis.svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height);

    // Path
    vis.svg.append('path')
        .datum(vis.data)
        .attr('id', 'od-line-chart')
        .attr('fill', 'none')
        .attr('stroke', '#af070d')
        .attr('stroke-width', 2.0)
        .attr('clip-path', 'url(#clip)');


    // Initialize tooltip
    // Thanks to http://bl.ocks.org/Caged/6476579
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {

            // String to return for tooltip
            // Check which properties exist, and only return those properties
            vis.tooltipString =
                "<center><strong>"+ d.State +" " + d.Year +"</strong> <span style='color:black'></span><br><br>";


            // If there is a rate given
            if (d.Rate){
                vis.tooltipString += "Rate (per 100,000): <span style='color:white'>" + d.Rate.toFixed(2) + "</span><br>";
                vis.tooltipString += "Deaths: <span style='color:white'>" + d.Deaths.toLocaleString() + "</span><br>";
                vis.tooltipString += "Population: <span style='color:white'>" + d.Population.toLocaleString() + "</span><br>";
            }

            // If there is no rate given
            else {
                vis.tooltipString += "<span style='color:white'>No Data</span>";
            }

            vis.tooltipString +=  "</center>";

            return vis.tooltipString;
        });

    // Call the tool tip
    vis.svg.call(vis.tip);

    // convert variables that should be numeric to numeric
    for (var i = 0; i < this.data.length; i++) {
        vis.data[i].Deaths = +vis.data[i].Deaths;
        vis.data[i].Population = +vis.data[i].Population;
        vis.data[i].Year = +vis.data[i].Year;
    }

    // Render a default view of the data, overall year by year trend
    vis.displayData = vis.data;

    // Sum data based on year
    // Code modified from charlietfl on https://stackoverflow.com/questions/33282860/sum-object-of-array-by-same-element
    vis.tmp = {};
    vis.displayData.forEach(function (item) {
        vis.tempKey = item['Year Code'];
        if (!vis.tmp.hasOwnProperty(vis.tempKey)) {
            vis.tmp[vis.tempKey] = item;
        } else {
            vis.tmp[vis.tempKey].Deaths += item.Deaths;
            vis.tmp[vis.tempKey].Population += item.Population;
        }
    });

    vis.displayData = Object.keys(vis.tmp).map(function(key){
        return vis.tmp[key];
    });

    // State year by year data
    for (var i = 0; i < vis.displayData.length; i++) {
        vis.displayData[i].Rate = (vis.displayData[i].Deaths / vis.displayData[i].Population) * 100000;
    }

    vis.updateVisualization();
}

/**
 * Update data
 */
ODTimeSeries.prototype.updateData = function(newData) {
    var vis = this;

    vis.displayData = newData;
    vis.updateVisualization();
}



/**
 * Update visualization
 */
ODTimeSeries.prototype.updateVisualization = function() {
    var vis = this;

    // Axis domains
    vis.x.domain([1999, 2015]);

    var maxY = d3.max(vis.displayData, function(d) {
        return d.Rate;
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
        .text('Deaths per 100,000 Population');

    // Draw line chart
    vis.svg.select('#od-line-chart')
        .datum(vis.displayData);

    vis.line = d3.line()
        .x(function(d) {
            return vis.x(d.Year);
        })
        .y(function(d) {
            return vis.y(d.Rate);
        });

    vis.svg.select('#od-line-chart')
        .attr('d', vis.line);

    // Draw circles
    var circle = vis.svg.selectAll('circle')
        .data(vis.displayData, function(d, i) {
            return i
        });

    circle.enter()
        .append('circle')
        .merge(circle)
        .attr('r', 3)
        .attr('fill', '#c3c3c3')
        .attr('cx', function(d) {
            return vis.x(d.Year);
        })
        .attr('cy', function(d) {
            return vis.y(d.Rate);
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    circle.exit()
        .remove();


}
