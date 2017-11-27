

/*
 * ODChoropleth - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

CompareDemographics = function(_parentElement, _data){
	this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    var vis = this;

    // convert variables that should be numeric to numeric
    for (var i = 0; i < this.data.length; i++) {
        vis.data[i].Deaths = +vis.data[i].Deaths;
        vis.data[i].Population = +vis.data[i].Population;
        vis.data[i].Year = +vis.data[i].Year;
    }

    this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

CompareDemographics.prototype.initVis = function(){
	var vis = this;

    vis.width = $("#compare-demographics-number").width();
    vis.height = vis.width * .7;

    // Append new svg area
    vis.svg = d3.select("#compare-demographics-number").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    // Sum total
    vis.deathsOverall = 0;
    vis.populationOverall = 0;


    for (var i = 0; i < vis.data.length; i++) {
        vis.deathsOverall = vis.deathsOverall + vis.data[i].Deaths;
        vis.populationOverall = vis.populationOverall + vis.data[i].Population;
    }

    // Average death rate
    vis.overallRate = vis.deathsOverall / vis.populationOverall;

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
};



/*
 * Data wrangling
 */

CompareDemographics.prototype.wrangleData = function(){
	var vis = this;

	// Create new variable, display data
    vis.displayData = vis.data;

    // For profile A ....
    // Sex
    vis.sexSelect = [];
	if (document.getElementById("AMale").checked){
        vis.sexSelect.push("M");
	}
    if (document.getElementById("AFemale").checked){
        vis.sexSelect.push("F");
    }

    // Race
    vis.raceSelect = [];
    if (document.getElementById("AWhite").checked){
        vis.raceSelect.push("White");
    }
    if (document.getElementById("ABlack").checked){
        vis.raceSelect.push("Black or African American");
    }
    if (document.getElementById("AAsian").checked){
        vis.raceSelect.push("Asian or Pacific Islander");
    }
    if (document.getElementById("AOriginalAmerican").checked){
        vis.raceSelect.push("American Indian or Alaska Native");
    }

    // Age
    vis.ageSelect = [];
    if (document.getElementById("A15-24").checked){
        vis.ageSelect.push("15-24");
    }
    if (document.getElementById("A25-34").checked){
        vis.ageSelect.push("25-34");
    }
    if (document.getElementById("A35-44").checked){
        vis.ageSelect.push("35-44");
    }
    if (document.getElementById("A45-54").checked){
        vis.ageSelect.push("45-54");
    }
    if (document.getElementById("A55-64").checked){
        vis.ageSelect.push("55-64");
    }
    if (document.getElementById("A65-74").checked){
        vis.ageSelect.push("65-74");
    }
    if (document.getElementById("A75-84").checked){
        vis.ageSelect.push("75-84");
    }
    if (document.getElementById("A85+").checked){
        vis.ageSelect.push("85+");
    }

    // Filter the data based on selections
    vis.displayData = vis.displayData.filter(function(d){
        return (vis.sexSelect.includes(d['Gender Code']) & vis.raceSelect.includes(d['Race']) &
            vis.ageSelect.includes(d['Ten-Year Age Groups Code']));
    });

    // For profile B ....
    vis.BdisplayData = vis.data;

    // Sex
    vis.BsexSelect = [];
    if (document.getElementById("BMale").checked){
        vis.BsexSelect.push("M");
    }
    if (document.getElementById("BFemale").checked){
        vis.BsexSelect.push("F");
    }

    // Race
    vis.BraceSelect = [];
    if (document.getElementById("BWhite").checked){
        vis.BraceSelect.push("White");
    }
    if (document.getElementById("BBlack").checked){
        vis.BraceSelect.push("Black or African American");
    }
    if (document.getElementById("BAsian").checked){
        vis.BraceSelect.push("Asian or Pacific Islander");
    }
    if (document.getElementById("BOriginalAmerican").checked){
        vis.BraceSelect.push("American Indian or Alaska Native");
    }

    // Age
    vis.BageSelect = [];
    if (document.getElementById("B15-24").checked){
        vis.BageSelect.push("15-24");
    }
    if (document.getElementById("B25-34").checked){
        vis.BageSelect.push("25-34");
    }
    if (document.getElementById("B35-44").checked){
        vis.BageSelect.push("35-44");
    }
    if (document.getElementById("B45-54").checked){
        vis.BageSelect.push("45-54");
    }
    if (document.getElementById("B55-64").checked){
        vis.BageSelect.push("55-64");
    }
    if (document.getElementById("B65-74").checked){
        vis.BageSelect.push("65-74");
    }
    if (document.getElementById("B75-84").checked){
        vis.BageSelect.push("75-84");
    }
    if (document.getElementById("B85+").checked){
        vis.BageSelect.push("85+");
    }

    // Filter the data based on selections
    vis.BdisplayData = vis.BdisplayData.filter(function(d){
        return (vis.BsexSelect.includes(d['Gender Code']) & vis.BraceSelect.includes(d['Race']) &
            vis.BageSelect.includes(d['Ten-Year Age Groups Code']));
    });

	// Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

CompareDemographics.prototype.updateVis = function(){
	var vis = this;

	// For comparison to average...
    // Sum total
    vis.deaths = 0;
    vis.population = 0;

    for (var i = 0; i < vis.displayData.length; i++) {
        vis.deaths = vis.deaths + vis.displayData[i].Deaths;
        vis.population = vis.population + vis.displayData[i].Population;
    }

    // Profile A rate
    vis.ARate = vis.deaths / vis.population;

    // Factor
    vis.factor = (vis.ARate) /  (vis.overallRate);
    if (isNaN(vis.factor)) {
        vis.factor = 1;
    }

    // Transition the number
    // Thanks to https://bl.ocks.org/mbostock/7004f92cac972edef365
    var format = d3.format(",.2f");
    d3.select("#compare-demographics-average-number")
        .transition()
        .duration(2000)
        .on("start", function repeat() {
            var t = d3.active(this)
                .remove();

            d3.active(this)
                .tween("text", function() {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), vis.factor);
                    return function(t) { that.text(format(i(t))); };
                })
                // Thanks to color brewer for color scale http://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=9
                .style("color", function(d){
                    if (vis.factor > 1.6) {
                        return "#d73027";
                    }
                    else if (vis.factor > 1.4) {
                        return "#f46d43";
                    }
                    else if (vis.factor > 1.2) {
                        return "#fdae61";
                    }
                    else if (vis.factor > 1.1) {
                        return "#fee08b";
                    }
                    else if (vis.factor > .99) {
                        return "#fdff65";
                    }
                    else if (vis.factor > .9) {
                        return "#d9ef8b";
                    }
                    else if (vis.factor > .8) {
                        return "#a6d96a";
                    }
                    else if (vis.factor > .6) {
                        return "#66bd63";
                    }
                    else {
                        return "#1a9850";
                    }
                })
                .transition(t)
                .transition()
        });

    // For comparison to B...
    // Sum total of B
    vis.Bdeaths = 0;
    vis.Bpopulation = 0;

    for (var i = 0; i < vis.BdisplayData.length; i++) {
        vis.Bdeaths = vis.Bdeaths + vis.BdisplayData[i].Deaths;
        vis.Bpopulation = vis.Bpopulation + vis.BdisplayData[i].Population;
    }

    // Profile B rate
    vis.BRate = vis.Bdeaths / vis.Bpopulation;

    // Factor
    vis.Bfactor = (vis.ARate) /  (vis.BRate);
    if (isNaN(vis.Bfactor)) {
        vis.Bfactor = 1;
    }

    // Transition the number
    // Thanks to https://bl.ocks.org/mbostock/7004f92cac972edef365
    d3.select("#compare-demographics-compare-number")
        .transition()
        .duration(2000)
        .on("start", function repeat() {
            var t = d3.active(this)
                .remove();

            d3.active(this)
                .tween("text", function() {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), vis.Bfactor);
                    return function(t) { that.text(format(i(t))); };
                })
                // Thanks to color brewer for color scale http://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=9
                .style("color", function(d){
                    if (vis.Bfactor > 1.6) {
                        return "#d73027";
                    }
                    else if (vis.Bfactor > 1.4) {
                        return "#f46d43";
                    }
                    else if (vis.Bfactor > 1.2) {
                        return "#fdae61";
                    }
                    else if (vis.Bfactor > 1.1) {
                        return "#fee08b";
                    }
                    else if (vis.Bfactor > .99) {
                        return "#fdff65";
                    }
                    else if (vis.Bfactor > .9) {
                        return "#d9ef8b";
                    }
                    else if (vis.Bfactor > .8) {
                        return "#a6d96a";
                    }
                    else if (vis.Bfactor > .6) {
                        return "#66bd63";
                    }
                    else {
                        return "#1a9850";
                    }
                })
                .transition(t)
                .transition()
        });

};
