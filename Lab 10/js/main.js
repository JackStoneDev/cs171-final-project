var marriges =
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
        var data = csvData;

        // convert variables that should be numeric to numeric
        // add the marrige and business ties
        for (var i = 0; i < data.length; i++) {
            data[i].index = i;
            data[i].allRelations = business[i].reduce(getSum) + marriges[i].reduce(getSum);
            data[i].businessTies = business[i].reduce(getSum);
            data[i].businessValues = business[i];
            data[i].marriges = marriges[i].reduce(getSum);
            data[i].marrigeValues = marriges[i];
            data[i].Priorates = +data[i].Priorates;
            data[i].Wealth = +data[i].Wealth;

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
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 800,
            height = 800;

        var cellHeight = 21, cellWidth = 21, cellPadding = 10;

        var svg = d3.select("body").append("svg")
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

        var x = d3.scaleBand()
            .domain(d3.range(numcols))
            .rangeRound([0, width - 300]);

        var y = d3.scaleBand()
            .domain(d3.range(numrows))
            .rangeRound([0, height - 300]);

        var colorMap = d3.scaleLinear()
            .domain([0, 1])
            .range(["lightgray", "purple"]);
        //.range(["red", "black", "green"]);
        //.range(["brown", "#ddd", "darkgreen"]);

        var row = svg.selectAll(".row")
            .data(business)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

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

        row.append("text")
            .data(data)
            .attr("x", 0)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function(d, i) { return d.Family; })
            .attr("transform", function(d, i) { return "translate(-5," + (-5) + ")"; });



        var squarecounter = -1;
        var columncounter = 0;

        // D3's enter, update, exit pattern
        // From lab
        var trianglePathMarrige = row.selectAll(".triangle-path")
            .data(data);

        trianglePathMarrige.enter().append("path")
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


        squarecounter = -1;
        columncounter = 0;

        var trianglePathBiz = row.selectAll(".triangle-path")
            .data(data);

        trianglePathBiz.enter().append("path")
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

        row.selectAll(".cell")
            .data(function(d, i) { return business[i]; })
            .style("fill", colorMap);

    }
});
