/**
 * ODTimeSeries
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

ODTimeSeries = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.displayDataOverall = [];
    this.stateName = "Pennsylvania";

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

    vis.width = 500;
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
        .range([0, vis.width * .8]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .tickFormat(d3.format('d'))
        .ticks(8);
    vis.yAxis = d3.axisLeft();

    vis.xAxisLine = vis.svg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0, ' + vis.height + ')');

    vis.svg.append('g')
        .attr('class', 'y-axis axis');

    // Axis labels
    vis.svg.append('text')
        .attr('class', 'axis-label x-label')
        .attr('transform', 'translate(' + (200) + ',' + (vis.height + vis.margin.top) + ')')
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
        .attr('transform', 'translate(' + 210 + ',0)')
        .text('Overdose Rate by Year');

    // Line chart
    vis.svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height);

    // Path
    vis.path1 = vis.svg.append('path')
        .datum(vis.data)
        .attr('id', 'od-line-chart')
        .attr('fill', 'none')
        .attr('stroke', '#af070d')
        .attr('stroke-width', 2.0)
        .attr('clip-path', 'url(#clip)');

    // Path
    vis.path2 = vis.svg.append('path')
        .datum(vis.data)
        .attr('id', 'od-line-chart2')
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

    // Initialize tooltip
    // Thanks to http://bl.ocks.org/Caged/6476579
    vis.tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {

            // String to return for tooltip
            // Check which properties exist, and only return those properties
            vis.tooltipString =
                "<center><strong>All States " + d.Year +"</strong> <span style='color:black'></span><br><br>";


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
    vis.svg.call(vis.tip2);

    // convert variables that should be numeric to numeric
    for (var i = 0; i < this.data.length; i++) {
        vis.data[i].Deaths = +vis.data[i].Deaths;
        vis.data[i].Population = +vis.data[i].Population;
        vis.data[i].Year = +vis.data[i].Year;
    }

    // Render a default view of the data, overall year by year trend
    vis.displayData = JSON.parse(JSON.stringify(vis.data));

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

    // Legend
    // Color Scale
    // From http://leafletjs.com/examples/choropleth/
    vis.color = d3.scaleLinear()
        .range(['#c3c3c3','#BD0026'])
        .domain([0, 1]);

    // Modified Legend Code from http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
    vis.legendWidth = 300;
    vis.legendHeight = 100;
    vis.legend = vis.svg.append("g")
        .attr("class", "legend")
        .attr("width", vis.legendWidth)
        .attr("height", vis.height)
        .selectAll("g")
        .data(vis.color.domain().slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(260," + (vis.height - 50 + i * 20) + ")"; });

    vis.legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", vis.color);

    // Set up the legend text items
    vis.legendText = ['', 'Overall'];

    // Change legend text
    vis.legend.append("text")
        .data(vis.legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(function(d) { return d; });

    vis.updateVisualization();
}

/**
 * Update data
 */
ODTimeSeries.prototype.updateData = function(stateData, allData, stateName) {
    var vis = this;

    vis.displayData = stateData;
    vis.displayDataOverall = allData;
    vis.stateName = stateName;

    vis.updateVisualization();
}



/**
 * Update visualization
 */
ODTimeSeries.prototype.updateVisualization = function() {
    var vis = this;

    // Set up the legend text items
    vis.legendText = [vis.stateName, ''];

    // Change legend text
    vis.legend.append("text")
        .attr("id", "legendTextODTime")
        .data(vis.legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(function(d) { return d; });

    // Draw circles
    var legendStateText = vis.svg.selectAll('#legendTextODTime')
        .data(vis.legendText);

    legendStateText.enter()
        .append('text')
        .attr("id", "legendTextODTime")
        .merge(legendStateText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(function(d) { return d; });


    legendStateText.exit()
        .remove();

    // Axis domains
    vis.x.domain([1999, 2015]);

    // Maximum of state data
    var maxY = d3.max(vis.displayData, function(d) {
        return d.Rate;
    });

    // Maximum of overall data
    var maxYAll = d3.max(vis.displayDataOverall, function(d) {
        return d.Rate;
    });

    // Set Y domain
    vis.y.domain([0, (d3.max([maxY, maxYAll])) * 1.2]);

    // Scale axes
    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    // Call axis functions
    vis.svg.select('.x-axis').call(vis.xAxis);
    vis.svg.select('.y-axis')
        .transition()
        .duration(300)
        .call(vis.yAxis);

    // Update y-axis text
    vis.svg.select('.y-label')
        .text('Deaths per 100,000 Population');

    // Update title
    vis.svg.select('.axis-title')
        .text('Overdose Rate by Year');

    // Draw line chart - STATES
    vis.svg.select('#od-line-chart')
        .datum(vis.displayData);

    //save last xy coordinates of line for line label
    var lastX;
    var lastY;

    vis.line = d3.line()
        .x(function(d) {
            lastX = vis.x(d.Year);
            return lastX;
        })
        .y(function(d) {
            lastY = vis.y(d.Rate);
            return lastY;
        });

    vis.svg.select('#od-line-chart')
        .transition()
        .duration(300)
        .attr('d', vis.line);

    // Draw line chart -- OVERALL
    vis.svg.select('#od-line-chart2')
        .datum(vis.displayDataOverall);

    vis.svg.select('#od-line-chart2')
        .transition()
        .duration(300)
        .attr('d', vis.line)
        .attr('stroke', '#c3c3c3');

    // Draw circles
    var circle = vis.svg.selectAll('#circles1')
        .data(vis.displayData, function(d, i) {
            return i
        });

    circle.enter()
        .append('circle')
        .attr("id", "circles1")
        .merge(circle)
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide)
        .attr('r', 3)
        .attr('fill', '#BD0026')
        .transition()
        .duration(300)
        .attr('cx', function(d) {
            return vis.x(d.Year);
        })
        .attr('cy', function(d) {
            return vis.y(d.Rate);
        });

    circle.exit()
        .remove();

    // Draw circles for all states
    vis.circle2 = vis.svg.selectAll('#circles2')
        .data(vis.displayDataOverall, function(d, i) {
            return i
        });

    vis.circle2.enter()
        .append('circle')
        .attr("id", "circles2")
        .merge(vis.circle2)
        .on('mouseover', vis.tip2.show)
        .on('mouseout', vis.tip2.hide)
        .attr('r', 3)
        .attr('fill', '#c3c3c3')
        .transition()
        .duration(300)
        .attr('cx', function(d) {
            return vis.x(d.Year);
        })
        .attr('cy', function(d) {
            return vis.y(d.Rate);
        });

    vis.circle2.exit()
        .remove();

}
