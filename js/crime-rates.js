/**
 * SeizuresChart
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

CrimeRateChart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVisualization();
}

/**
 * Initialize visualization
 */
CrimeRateChart.prototype.initVisualization = function() {
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

    vis.xAxis = d3.axisBottom()
        .tickFormat(d3.format('d'));
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
        .text('Number of Offenses');

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

    // Build checkboxes for gender, age, and race selections
    var gender = ["Male", "Female"];
    var age = ["Juvenile", "Adult"];
    var race = ["White", "Black", "Asian", "Native"];

    gender.forEach(function(d, i) {
        var checked = '';

        if (i === 0) {
            checked = 'checked';
        }

        $('#crime-rate-filter-gender').append('<br /><input type="selection" name="crime-rate-gender" id="' + d + '" value="' + d + '" ' + checked + '></input><label for="' + d + '">' + d + '</label>');
    });

    age.forEach(function(d, i) {
        var checked = '';

        if (i === 0) {
            checked = 'checked';
        }

        $('#crime-rate-filter-age').append('<br /><input type="selection" name="crime-rate-age" id="' + d + '" value="' + d + '" ' + checked + '></input><label for="' + d + '">' + d + '</label>');
    });

    //TODO later data set
    /*    race.forEach(function(d, i) {
            var checked = '';

            if (i === 0) {
                checked = 'checked';
            }

            $('#crime-rate-filter-race').append('<br /><input type="selection" name="crime-rate-race" id="' + d + '" value="' + d + '" ' + checked + '></input><label for="' + d + '">' + d + '</label>');
        });*/

    // Bind selections
    $('input[name="crime-rate-filter-gender"]').change(function() {
        vis.updateVisualization();
    });
    $('input[name="crime-rate-filter-age"]').change(function() {
        vis.updateVisualization();
    });

    //TODO later data set
/*    $('input[name="crime-rate-filter-race"]').change(function() {
        vis.updateVisualization();
    });*/

    vis.wrangleData();
}

/**
 * Wrangle data
 */
CrimeRateChart.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    // Convert strings to numeric values
    vis.displayData.forEach(function(d) {
        d["All Offenses"] = +d["All Offenses"].replace(/,/g, '');
        d["Drug Abuse Violations -Total"] = +d["Drug Abuse Violations -Total"].replace(/,/g, '');
        d["Drug-Sale-Manufacturing-Total"] = +d["Drug-Sale-Manufacturing-Total"].replace(/,/g, '');
        d["Drug-Possession-SubTotal"] = +d["Drug-Possession-SubTotal"].replace(/,/g, '');
        d.Year = +d.Year;
    });

    vis.updateVisualization();
}

/**
 * Update visualization
 */
CrimeRateChart.prototype.updateVisualization = function() {
    var vis = this;

    var gender = $('input[name="crime-rate-filter-gender"]:checked').val();
    var age = $('input[name="crime-rate-filter-age"]:checked').val();
   //TODO
   // var race = $('input[name="crime-rate-filter-race"]:checked').val();


    // Do data exist for this unit and drug type?
    if ('undefined' === typeof vis.displayData) {
        vis.svg.select('#line-chart')
            .attr('d', '');

        vis.svg.selectAll('circle')
            .remove();

        return;
    }

    // Axis domains
    vis.x.domain([1980, 2014]);

    /*var offenseMaxes = [
        d3.max(vis.displayData, function(d) { console.logreturn d.Year; }),
        d3.max(vis.displayData["Drug Abuse Violations -Total"], function(d) { return d.Year; }),
        d3.max(vis.displayData["Drug-Sale-Manufacturing-Total"], function(d) { return d.Year; }),
        d3.max(vis.displayData["Drug-Possession-SubTotal"], function(d) { return d.Year; }),
    ];
*/
    var offenses = ["All Offenses", "Drug Abuse Violations -Total", "Drug-Sale-Manufacturing-Total", "Drug-Possession-SubTotal"];

    var maxY = d3.max(vis.displayData, function(d) { return d["All Offenses"]; });

    vis.y.domain([0, maxY * 1.2]);

    // Scale axes
    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    // Call axis functions
    vis.svg.select('.x-axis').call(vis.xAxis);
    vis.svg.select('.y-axis').call(vis.yAxis);

    // Update y-axis text
    vis.svg.select('.y-label')
        .text('Number of Offenses');

    // Draw line chart
    vis.svg.select('#line-chart')
        .datum(vis.displayData);

    var line = d3.line()
        .x(function(d) {
            return vis.x(d.Year);
        })
        .y(function(d) {
            return vis.y(d["All Offenses"]);
        });

    vis.svg.select('#line-chart')
        .attr('d', line);

    // Draw circles
    var circle = vis.svg.selectAll('circle')
        .data(vis.displayData);

    circle.enter()
        .append('circle')
        .merge(circle)
        .attr('r', 5)
        .attr('fill', '#92c47d')
        .attr('cx', function(d) {
            return vis.x(d.Year);
        })
        .attr('cy', function(d) {
            return vis.y(d["All Offenses"]);
        });

    circle.exit()
        .remove();
}
