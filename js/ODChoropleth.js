

/*
 * ODChoropleth - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

ODChoropleth = function(_parentElement, _data){
	this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling

    // DEBUG RAW DATA
    // console.log(this.data);

    var vis = this;

    // Time parser
    vis.parseTime = d3.timeParse("%Y");

    // convert variables that should be numeric to numeric
    for (var i = 0; i < this.data.length; i++) {
        vis.data[i].Deaths = +vis.data[i].Deaths;
        vis.data[i].Population = +vis.data[i].Population;
        vis.data[i].Date = vis.parseTime(vis.data[i].Year);
    }

    this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

ODChoropleth.prototype.initVis = function(){
	var vis = this;

    vis.width = $("#OD-Choropleth").width();
    vis.height = vis.width * .7;

    // Append new svg area
    vis.svg = d3.select("#OD-Choropleth").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    // Create new variable, display data
    vis.displayData = vis.data;

    // Preliminary data view
    // Sum based on state
    // Code modified from charlietfl on https://stackoverflow.com/questions/33282860/sum-object-of-array-by-same-element
    vis.tmp = {};
    vis.displayData.forEach(function (item) {
        vis.tempKey = item.State + item.category;
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

    for (var i = 0; i < vis.displayData.length; i++) {
        vis.displayData[i].Rate = (vis.displayData[i].Deaths / vis.displayData[i].Population) * 100000;
    }


    // Following code adapted from
    // http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
    // D3 Projection
    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width/2, vis.height/2])
        .scale([1000]);

    // Define path generator
    vis.path = d3.geoPath()
        .projection(vis.projection);

    // Color Scale
    // From http://leafletjs.com/examples/choropleth/
    vis.color = d3.scaleLinear()
        .range(['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976', '#FFEDA0'])
        .domain([0, 1, 2, 3, 100, 200, 500, 1000]);

    // Set up the legend text items
    vis.legendText = [' < 5', '5 - 10', '10 - 15', '15 - 20', '20 - 25', '25 - 30', '30 - 35', '35 +'];

    // Append Div for tooltip to SVG
    vis.div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // Legend
    // Modified Legend Code from http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
    vis.legendWidth = 0.1 * vis.width;
    vis.legendHeight = 0 * vis.height;
    vis.legend = d3.select("#OD-Choropleth-Legend").append("svg")
        .attr("class", "legend")
        .attr("width", vis.legendWidth)
        .attr("height", vis.height)
        .selectAll("g")
        .data(vis.color.domain().slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + (vis.legendHeight + i * 20) + ")"; });

    vis.legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", vis.color);

    vis.legend.append("text")
        .data(vis.legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });




    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! For time series plot !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Append new svg area
    vis.svgTimeSeries = d3.select("#OD-Time-Series").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);


    vis.xTime = d3.scaleTime()
        .rangeRound([0, vis.width]);

    vis.yTime = d3.scaleLinear()
        .rangeRound([vis.height, 0]);

    vis.line = d3.line()
        .x(function(d) { return vis.xTime(d.Date); })
        .y(function(d) { return vis.yTime(d.Rate)});

	// TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
};



/*
 * Data wrangling
 */

ODChoropleth.prototype.wrangleData = function(){
	var vis = this;

	// Create new variable, display data
    vis.displayData = vis.data;

    // Sex
    vis.sexSelect = [];
	if (document.getElementById("Male").checked){
        vis.sexSelect.push("M");
	}
    if (document.getElementById("Female").checked){
        vis.sexSelect.push("F");
    }

    // Race
    vis.raceSelect = [];
    if (document.getElementById("White").checked){
        vis.raceSelect.push("White");
    }
    if (document.getElementById("Black").checked){
        vis.raceSelect.push("Black or African American");
    }
    if (document.getElementById("Asian").checked){
        vis.raceSelect.push("Asian or Pacific Islander");
    }
    if (document.getElementById("OriginalAmerican").checked){
        vis.raceSelect.push("American Indian or Alaska Native");
    }

    // Age
    vis.ageSelect = [];
    if (document.getElementById("15-24").checked){
        vis.ageSelect.push("15-24");
    }
    if (document.getElementById("25-34").checked){
        vis.ageSelect.push("25-34");
    }
    if (document.getElementById("35-44").checked){
        vis.ageSelect.push("35-44");
    }
    if (document.getElementById("45-54").checked){
        vis.ageSelect.push("45-54");
    }
    if (document.getElementById("55-64").checked){
        vis.ageSelect.push("55-64");
    }
    if (document.getElementById("65-74").checked){
        vis.ageSelect.push("65-74");
    }
    if (document.getElementById("75-84").checked){
        vis.ageSelect.push("75-84");
    }
    if (document.getElementById("85+").checked){
        vis.ageSelect.push("85+");
    }

    // Filter the data based on selections
    vis.displayData = vis.displayData.filter(function(d){
        return (vis.sexSelect.includes(d['Gender Code']) & vis.raceSelect.includes(d['Race']) &
            vis.ageSelect.includes(d['Ten-Year Age Groups Code']));
    });

	// Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

ODChoropleth.prototype.updateVis = function(){
	var vis = this;

    // Render data from one state
    vis.stateData = vis.displayData;
    function click(stateName) {

        // Get the selected state name
        vis.selectedState = [stateName];
        vis.stateDisplayData = vis.stateData;

        // Filter the data based on state
        vis.stateDisplayData = vis.stateDisplayData.filter(function(d){
            return (vis.selectedState.includes(d['State']));
        });

        // Sum data based on year
        // Code modified from charlietfl on https://stackoverflow.com/questions/33282860/sum-object-of-array-by-same-element
        vis.tmp = {};
        vis.stateDisplayData.forEach(function (item) {
            vis.tempKey = item['Year Code'];
            if (!vis.tmp.hasOwnProperty(vis.tempKey)) {
                vis.tmp[vis.tempKey] = item;
            } else {
                vis.tmp[vis.tempKey].Deaths += item.Deaths;
                vis.tmp[vis.tempKey].Population += item.Population;
            }
        });

        vis.stateDisplayData = Object.keys(vis.tmp).map(function(key){
            return vis.tmp[key];
        });

        for (var i = 0; i < vis.stateDisplayData.length; i++) {
            vis.stateDisplayData[i].Rate = (vis.stateDisplayData[i].Deaths / vis.stateDisplayData[i].Population) * 100000;
        }

        vis.xTime.domain(d3.extent(vis.stateDisplayData, function(d) { return d.Date; }));
        vis.yTime.domain([0, d3.max(vis.stateDisplayData, function(d) { return d.Rate; })]);

        // Add the X Axis
        vis.svgTimeSeries.append("g")
            .attr("transform", "translate(0," + 500 +  ")")
            .call(d3.axisBottom(vis.xTime));

        // Add the Y Axis
        vis.svgTimeSeries.append("g")
            .call(d3.axisLeft(vis.yTime))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deaths");

        vis.svgTimeSeries.append("path")
            .datum(vis.stateDisplayData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", vis.line);


    }

    // Sum based on state
    // Code modified from charlietfl on https://stackoverflow.com/questions/33282860/sum-object-of-array-by-same-element
    vis.tmp = {};
    vis.displayData.forEach(function (item) {
        vis.tempKey = item.State + item.category;
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

    for (var i = 0; i < vis.displayData.length; i++) {
        vis.displayData[i].Rate = (vis.displayData[i].Deaths / vis.displayData[i].Population) * 100000;
    }

    // Initialize tooltip
    // Thanks to http://bl.ocks.org/Caged/6476579
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {

            // String to return for tooltip
            // Check which properties exist, and only return those properties
            vis.tooltipString =
                "<center><strong>"+ d.properties.name +"</strong> <span style='color:black'></span><br><br>";


            // If there is a rate given
            if (d.properties.Rate){
                vis.tooltipString += "Rate: <span style='color:white'>" + d.properties.Rate.toFixed(2) + "</span><br>";
                vis.tooltipString += "Deaths: <span style='color:white'>" + d.properties.Deaths.toLocaleString() + "</span><br>";
                vis.tooltipString += "Population: <span style='color:white'>" + d.properties.Population.toLocaleString() + "</span><br>";
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

    // Get Color function, modified from http://leafletjs.com/examples/choropleth/
    function getColor(d) {
        return d > 35 ? '#800026' :
            d > 30  ? '#BD0026' :
            d > 25  ? '#E31A1C' :
            d > 20  ? '#FC4E2A' :
            d > 15   ? '#FD8D3C' :
            d > 10   ? '#FEB24C' :
            d > 5   ? '#FED976' :
            '#FFEDA0';
    }

    // Load GeoJSON data and merge with states data
    d3.json("data/us-states.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < vis.displayData.length; i++) {

            // Grab State Name
            vis.dataState = vis.displayData[i].State;

            // Grab data value
            vis.dataValueRate = vis.displayData[i].Rate;
            vis.dataValueDeaths = vis.displayData[i].Deaths;
            vis.dataValuePopulation = vis.displayData[i].Population;

            // Find the corresponding state inside the GeoJSON
            for (vis.j = 0; vis.j < json.features.length; vis.j++) {
                vis.jsonState = json.features[vis.j].properties.name;

                if (vis.dataState === vis.jsonState) {

                    // Copy the data value into the JSON
                    json.features[vis.j].properties.Rate = vis.dataValueRate;
                    json.features[vis.j].properties.Deaths = vis.dataValueDeaths;
                    json.features[vis.j].properties.Population = vis.dataValuePopulation;

                    // Stop looking through the JSON
                    break;
                }
            }
        }


        vis.svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("stroke-width", 0)
            .attr("fill", function(d) {
                // Get data value
                // Thanks to http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 for idea to check if no value exists
                vis.value = d.properties.Rate;
                if (vis.value) {
                    return getColor(vis.value);
                } else {
                    // If there is no value for the state
                    return "rgb(213,222,217)";
                }})
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide)
            .on("click", function (d) {

                // Reset the other states
                d3.select('#OD-Container').selectAll("path").attr("stroke-width", 0);

                // Change style of selected state
                d3.select(this).style("stroke", "white")
                    .attr("stroke-width", 3);


                click(d.properties.name);
            })
            .attr("d", vis.path);
    });
};
