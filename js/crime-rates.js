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
        right: 120,
        bottom: 60,
        left: 100
    };

    vis.width = (document.getElementById(vis.parentElement).offsetWidth) - vis.margin.right - vis.margin.left,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

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
        .text('Population Rate')
        .attr("transform", "rotate(-90)");

    vis.wrangleData();
}

/**
 * Wrangle data
 */
CrimeRateChart.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

/*    // Convert strings to numeric values
    vis.displayData.forEach(function(d) {
        d["All Offenses"] = +d["All Offenses"].replace(/,/g, '');
        d["Drug Abuse Violations -Total"] = +d["Drug Abuse Violations -Total"].replace(/,/g, '');
        d["Drug-Sale-Manufacturing-Total"] = +d["Drug-Sale-Manufacturing-Total"].replace(/,/g, '');
        d["Drug-Possession-SubTotal"] = +d["Drug-Possession-SubTotal"].replace(/,/g, '');
        d.Year = +d.Year;
    });*/

    // Convert strings to percentage values
    vis.displayData.forEach(function(d) {
        d["All Races"] = parseFloat((d["All Races"].replace(/,/g, ''))*100).toFixed(2);
        d["Whites"] = parseFloat((d["Whites"].replace(/,/g, ''))*100).toFixed(2);
        d["Blacks"] = parseFloat((d["Blacks"].replace(/,/g, ''))*100).toFixed(2);
        d["Native Americans"] = parseFloat((d["Native Americans"].replace(/,/g, ''))*100).toFixed(2);
        d["Asians"] = parseFloat((d["Asians"].replace(/,/g, ''))*100).toFixed(2);
        d.Year = +d.Year;
    });

    vis.updateVisualization();
}

/**
 * Update visualization
 */
CrimeRateChart.prototype.updateVisualization = function() {
    var vis = this;


  //  var offenses = ["All Offenses", "Drug Abuse Violations -Total", "Drug-Sale-Manufacturing-Total", "Drug-Possession-SubTotal"];
    var races = ["All Races", "Whites", "Blacks", "Native Americans", "Asians"];
    var colors = ["green", "blue", "purple", "yellow", "orange"];


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

    //For datasets  with each drug violation
/*    var offenseMaxes = [
        d3.max(vis.displayData, function(d) { return d["All Offenses"]; }),
        d3.max(vis.displayData, function(d) { return d["Drug Abuse Violations -Total"]; }),
        d3.max(vis.displayData, function(d) { return d["Drug-Sale-Manufacturing-Total"]; }),
        d3.max(vis.displayData, function(d) { return d["Drug-Possession-SubTotal"]; })
    ];*/

    //For datasets with all races for one drug violation
    var offenseMaxes = [
        d3.max(vis.displayData, function(d) { return d["Whites"]; }),
        d3.max(vis.displayData, function(d) { return d["Blacks"]; }),
        d3.max(vis.displayData, function(d) { return d["Native Americans"]; }),
        d3.max(vis.displayData, function(d) { return d["Asians"]; })
    ];

    var maxY = d3.max(offenseMaxes);

    vis.y.domain([0, maxY * 1.2]);

    // Scale axes
    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    // Call axis functions
    vis.svg.select('.x-axis').call(vis.xAxis);
    vis.svg.select('.y-axis').call(vis.yAxis);

    // Line chart
    vis.svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height);

    // Initialize tooltip
    // Thanks to http://bl.ocks.org/Caged/6476579
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id', 'rates-tip')
        .offset([-10, 0])
        .html(function(d) {

            // String to return for tooltip
            vis.tooltipString =
                "<center><strong>Rate of Population That <br> " +
                "Committed a Drug Offense in " + d.Year +"</strong> <span style='color:black'></span><br><br>";

            vis.tooltipString += "All Americans: <span style='color:white'>" + d['All Races'] + "%" + "</span><br>";
            vis.tooltipString += "White Americans: <span style='color:white'>" + d.Whites + "%" + "</span><br>";
            vis.tooltipString += "Black Americans: <span style='color:white'>" + d.Blacks + "%" + "</span><br>";
            vis.tooltipString += "Native Americans: <span style='color:white'>" + d['Native Americans'] + "%" + "</span><br>";
            vis.tooltipString += "Asian Americans: <span style='color:white'>" + d.Asians + "%" + "</span><br>";

            //TODO can integrate ODs that year as well
//            vis.tooltipString += "Deaths: <span style='color:white'>" + d.properties.Deaths.toLocaleString() + "</span><br>";
//            vis.tooltipString += "Population: <span style='color:white'>" + d.properties.Population.toLocaleString() + "</span><br>";

            vis.tooltipString +=  "</center>";
            return vis.tooltipString;

        });

    // Call the tool tip
    vis.svg.call(vis.tip);



    //Draw each dataset's line
    races.forEach(function(d, i){

        vis.svg.append('path')
            .datum(vis.displayData)
            .attr('id', 'line-chart' + i)
            .attr('fill', 'none')
            .attr('stroke', colors[i])
            .attr('stroke-width', 2.0)
            .attr('clip-path', 'url(#clip' + i + ')');

        // Draw line chart
        vis.svg.select('#line-chart' + i)
            .datum(vis.displayData);

        //save last xy coordinates of line for line label
        var lastX;
        var lastY;

        var line = d3.line()
            .x(function(a) {
                lastX = vis.x(a.Year)
                return lastX;
            })
            .y(function(a) {
                lastY = vis.y(a[d])
                return lastY;
            });

        vis.svg.select('#line-chart' + i)
            .attr('d', line);

        //Draw line labels
        vis.svg.append("text")
            .text(d)
            .attr("class", "race-labels")
            .attr('fill', colors[i])
            .attr('x', lastX + 10)
            .attr('y', lastY + 3);


        // Draw circles
        var circle = vis.svg.selectAll('#circle' + i)
            .data(vis.displayData);
        //TODO make this data for interesting historical event data

        circle.enter()
            .append('circle')
            .attr("id", "circle" + i)
            .attr('r', 3)
            .attr('fill', 'red')
            .attr('cx', function(a) {
                return vis.x(a.Year);
            })
            .attr('cy', function(a) {
                return vis.y(a[d]);
            })
            .on("mouseover", vis.tip.show)
            .on("mouseout", vis.tip.hide);

    });
}
