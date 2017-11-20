var marriages =
    [[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0]];

var business =
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]];

// Function to sum an array
// From https://www.w3schools.com/jsref/jsref_reduce.asp
function getSum(total, num) {
    return total + num;
}


// combine all the data
d3.csv("data/florentine-familiy-attributes.csv", function(error, csvData){
    if(!error){
        data = csvData;

        // convert variables that should be numeric to numeric
        // add the marrige and business ties
        for (var i = 0; i < data.length; i++) {
            data[i].index = i;
            data[i].allRelations = business[i].reduce(getSum) + marriages[i].reduce(getSum);
            data[i].businessTies = business[i].reduce(getSum);
            data[i].businessValues = business[i];
            data[i].marriages = marriages[i].reduce(getSum);
            data[i].marrigeValues = marriages[i];
            data[i].Wealth = +data[i].Wealth;
            data[i].Priorates = +data[i].Priorates;
            if(isNaN(data[i].Priorates)){
                data[i].Priorates = 0;
            }
        }

        // Declare number of rows and columns
        // From http://bl.ocks.org/srosenthal/2770072
        var numrows = business[0].length;
        var numcols = business.length;

        // // Append new svg area
        // // From http://bl.ocks.org/srosenthal/2770072
        // var width = 500,
        //     height = 500;
        //
        // var svg = d3.select("body").append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g");
        //
        // svg.append("rect")
        //     .attr("class", "background")
        //     .attr("width", width)
        //     .attr("height", height);

        // From http://bl.ocks.org/srosenthal/2770072
        margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 800,
            height = 800;

        cellHeight = 21, cellWidth = 21, cellPadding = 10;

        svg = d3.select("#matrix").append("svg")
            .attr("width", width + margin.left + margin.right - 100)
            .attr("height", height + margin.top + margin.bottom - 100)
            .style("margin-left", -margin.left + "px")
            .append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        svg.append("rect")
            .attr("class", "background")
            .attr("fill", "white")
            .attr("width", width)
            .attr("height", height);

        x = d3.scaleBand()
            .domain(d3.range(numcols))
            .rangeRound([0, width - 300]);

        y = d3.scaleBand()
            .domain(d3.range(numrows))
            .rangeRound([0, height - 300]);

        colorMap = d3.scaleLinear()
            .domain([0, 1])
            .range(["lightgray", "purple"]);
        //.range(["red", "black", "green"]);
        //.range(["brown", "#ddd", "darkgreen"]);


        // row.selectAll(".cell")
        //     .data(function(d) { return d; })
        //     .enter().append("rect")
        //     .attr("class", "cell")
        //     .attr("x", function(d, i) { return x(i); })
        //     .attr("width", x.bandwidth() - 10)
        //     .attr("height", y.bandwidth() - 10)
        //     .style("stroke-width", 0);
        //
        // row.append("line")
        //     .attr("x2", width);


        var column = svg.selectAll(".column")
            .data(data)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function(d, i) {
                return "translate(" + x(i) + ")rotate(-90)";
            });

        column.append("line")
            .attr("x1", -width);

        column.append("text")
            .attr("x", 6)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .text(function(d, i) { return d.Family; });

        updateVis();

    }
});

function updateVis(){
    displayData = data;

    var selected = document.getElementById("sortable").value;

    switch (selected){
        case "businesses":
            displayData.sort(function(a,b){
                 return b.businessTies - a.businessTies;
            });
            break;
        case "marriages":
            displayData.sort(function(a,b){
                return b.marriages - a.marriages;
            });
            break;
        case "relationships":
            displayData.sort(function(a,b){
                return b.allRelations - a.allRelations;
            });
            break;
        case "wealth":
            displayData.sort(function(a,b){
                return b.Wealth - a.Wealth;
            });
            break;
        case "seats":
            displayData.sort(function(a,b){
                return b.Priorates - a.Priorates;
            });
            break;
    }

    var row = svg.selectAll(".row")
        .data(displayData);

    row.enter().append("g").merge(row).transition()
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })

    row.selectAll("text").remove();

    row
        .append("text")
        .data(displayData)
        .transition()
        .attr("x", 0)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d.Family; })
        .attr("transform", function(d, i) { return "translate(-5," + (-5) + ")"; })

    row.selectAll(".cell")
        .data(function(d, i) { return business[i]; })
        .style("fill", colorMap);

    row.exit().transition().remove();

    var squarecounter = -1;
    var columncounter = 0;

    // D3's enter, update, exit pattern
    // From lab
    var trianglePathMarriage = row.selectAll(".triangle-path")
        .data(displayData);

    trianglePathMarriage.enter().append("path").merge(trianglePathMarriage).transition()
        .attr("d", function(d, index) {
            // Shift the triangles on the x-axis (columns)
            var x = (cellWidth + cellPadding) * index;

            // All triangles of the same row have the same y-coordinates
            // Vertical shifting is already done by transforming the group elements
            var y = 0;

            return 'M ' + x +' '+ y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
        })
        .attr("fill", function(d, index){
            squarecounter = squarecounter + 1;
            columncounter = parseInt(squarecounter / 16);
            if (d.marrigeValues[columncounter]===1){
                return "blue";
            }
            else{
                return "gray";
            }
        });

    trianglePathMarriage.exit().transition().remove();

    squarecounter = -1;
    columncounter = 0;

    var trianglePathBiz = row.selectAll(".triangle-path")
        .data(displayData);

    trianglePathBiz.enter().append("path").merge(trianglePathBiz).transition()
        .attr("d", function(d, index) {
            // Shift the triangles on the x-axis (columns)
            var x = (cellWidth + cellPadding) * index;

            // All triangles of the same row have the same y-coordinates
            // Vertical shifting is already done by transforming the group elements
            var y = 0;

            return 'M ' + x +' '+ y + ' l 0 ' + cellWidth + ' l ' + cellHeight + ' 0 z';
        })
        .attr("fill", function(d, index){
            squarecounter = squarecounter + 1;
            columncounter = parseInt(squarecounter / 16);
            if (d.businessValues[columncounter]===1){
                return "orange";
            }
            else{
                return "gray";
            }
        })
        .attr("stroke", "none");

    trianglePathBiz.exit().transition().remove();
}
