/**
 * CrimeRateChart
 * @param _parentElement -- the HTML element in which to draw the visualization
 * @param _data          -- the data
 */

CrimeRateChart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.timeline = [];

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


    vis.lineHeight = 200 - vis.margin.top - vis.margin.bottom;

    //Timeline drawing area
    vis.timelineGraph = d3.select('#' + vis.parentElement)
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.lineHeight)
        .append('g')
        .attr('transform', 'translate(' + vis.margin.left + ',0)');

    // SVG drawing area
    vis.svg = d3.select('#' + vis.parentElement)
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + vis.margin.left + ',' + (vis.margin.top-20) + ')');

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

    vis.timelineGraph.append('g')
        .attr('class', 'timeline-axis axis')
        .attr('transform', 'translate(0, ' + (vis.lineHeight/2) + ')');

    // Axis labels
    vis.timelineGraph.append('text')
        .attr('class', 'axis-label x-label')
        .attr('transform', 'translate(' + ((vis.width - vis.margin.left) / 3) + ',' + vis.margin.top + ')')
        .text('Events of Interest - Click to Learn More');

    vis.svg.append('text')
        .attr('class', 'axis-label x-label')
        .attr('transform', 'translate(' + (vis.width / 2) + ',' + (vis.height + vis.margin.top) + ')')
        .text('Year');

    vis.svg.append('text')
        .attr('class', 'axis-label y-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -vis.height / 2)
        .attr('y', -vis.margin.left + 10)
        .text('Population Rate %')
        .attr("transform", "rotate(-90)");

    d3.csv("data/crime rates/War on Drugs Timeline.csv", function(error, csvData) {
        vis.timeline = csvData;
        vis.wrangleData();
    });
}

/**
 * Wrangle data
 */
CrimeRateChart.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    // Convert strings to percentage values
    vis.displayData.forEach(function(d) {
        d["All Races"] = parseFloat((d["All Races"].replace(/,/g, ''))*100).toFixed(2);
        d["White Americans"] = parseFloat((d["White Americans"].replace(/,/g, ''))*100).toFixed(2);
        d["Black Americans"] = parseFloat((d["Black Americans"].replace(/,/g, ''))*100).toFixed(2);
        d["Native Americans"] = parseFloat((d["Native Americans"].replace(/,/g, ''))*100).toFixed(2);
        d["Asian Americans"] = parseFloat((d["Asian Americans"].replace(/,/g, ''))*100).toFixed(2);
        d.Year = +d.Year;
    });

    //Convert string to numeric values
    vis.timeline.forEach(function(d) {
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
    var races = ["Asian Americans", "Native Americans", "White Americans", "All Races", "Black Americans"];
    var colors = ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

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

    //For datasets with all races for one drug violation
    var offenseMaxes = [
        d3.max(vis.displayData, function(d) { return d["White Americans"]; }),
        d3.max(vis.displayData, function(d) { return d["Black Americans"]; }),
        d3.max(vis.displayData, function(d) { return d["Native Americans"]; }),
        d3.max(vis.displayData, function(d) { return d["Asian Americans"]; })
    ];

    var maxY = d3.max(offenseMaxes);

    vis.y.domain([0, maxY * 1.2]);

    // Scale axes
    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    // Call axis functions
    vis.svg.select('.x-axis').call(vis.xAxis);
    vis.timelineGraph.select('.timeline-axis').call(vis.xAxis);
    vis.svg.select('.y-axis').call(vis.yAxis);




    //Timeline w/ Events of interest
    var events = vis.timelineGraph.selectAll('#event')
        .data(vis.timeline);
    events.enter()
        .append('circle')
        .on("mouseover", function(d){
            vis.svg.selectAll(".event-line-clicked").remove();
            vis.svg.append("line")
                .attr("class", "event-line")
                .attr("x1", vis.x(d.Year))
                .attr("y1", 0)
                .attr("x2", vis.x(d.Year))
                .attr("y2", vis.height)
                .style("stroke-width", 2)
                .style("stroke", "red")
                .style("fill", "none");
        })
        .on("mouseout", function(d){
            vis.svg.selectAll(".event-line").remove();
        })
        .on("click", function(d){
            document.getElementById('crime-rates-text').innerHTML=
                "<center><span style='color:red; font-size:20px;'><strong>" + d.Event + "</span><br>" +
                "<span style='font-size:16px;'>" + d.Year +"</strong></span></center><br><br> " + d.Description + "<br>";
            vis.svg.append("line")
                .attr("class", "event-line-clicked")
                .attr("x1", vis.x(d.Year))
                .attr("y1", 0)
                .attr("x2", vis.x(d.Year))
                .attr("y2", vis.height)
                .style("stroke-width", 2)
                .style("stroke", "red")
                .style("fill", "none");
        })
        .transition()
        .delay(function(t,j){return 583*j})
        .attr("id", "event")
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('cx', function(a) {
            return vis.x(a.Year);
        })
        .attr('cy', (vis.lineHeight / 2));




    // Initialize tooltip
    // Thanks to http://bl.ocks.org/Caged/6476579
    vis.yeartip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id', 'rates-tip')
        .offset([-10, 0])
        .html(function(d) {

            // String to return for tooltip
            vis.yeartipString =
                "<center><strong>Rate of Population That <br> " +
                "Committed a Drug Offense in " + d.Year +"</strong> <span style='color:black'></span><br><br>";

            vis.yeartipString += "Black Americans: <span style='color:white'>" + d['Black Americans'] + "%" + "</span><br>";
            vis.yeartipString += "All Americans: <span style='color:white'>" + d['All Races'] + "%" + "</span><br>";
            vis.yeartipString += "White Americans: <span style='color:white'>" + d['White American'] + "%" + "</span><br>";
            vis.yeartipString += "Native Americans: <span style='color:white'>" + d['Native Americans'] + "%" + "</span><br>";
            vis.yeartipString += "Asian Americans: <span style='color:white'>" + d['Asian Americans'] + "%" + "</span><br>";

            vis.yeartipString +=  "</center>";
            return vis.yeartipString;

        });

    // Line chart
    // Call the tool tip
    vis.svg.call(vis.yeartip);
    vis.svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height);

    //Draw each dataset's line
    races.forEach(function(d, i){

        var path = vis.svg.append('path')
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

        //from http://bl.ocks.org/duopixel/4063326
        var totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(7000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        //Draw line labels
        vis.svg.append("text")
            .text(d)
            .attr("class", "race-labels")
            .attr('fill', colors[i])
            .attr('x', lastX + 10)
            .attr('y', lastY + 3);


        // Draw circles
        var years = vis.svg.selectAll('#year' + i)
            .data(vis.displayData);

       years.enter()
            .append('circle')
            .on("mouseover", vis.yeartip.show)
            .on("mouseout", vis.yeartip.hide)
            .transition()
                .delay(function(t,j){return 200*j})
           .attr("id", "year" + i)
            .attr('r', 3)
            .attr('fill', colors[i])
            .attr('cx', function(a) {
                return vis.x(a.Year);
            })
            .attr('cy', function(a) {
                return vis.y(a[d]);
            });
    });
}
