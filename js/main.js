$(document).ready(function() {
  $('#fullpage').fullpage();

  queue()
  .defer(d3.csv, 'data/drug-seizures.csv')
  .await(createVisualization);
});

/**
 * Render visualizations
 */
function createVisualization(error, drugSeizuresData) {
  seizuresChart = new SeizuresChart('drug-seizures-chart', drugSeizuresData);
}

// Variables for the visualization instances
var odChoropleth;

// Start application by loading the data
renderODChoropleth();

function renderODChoropleth() {
    d3.csv("data/drug-overdoses.csv", function(error, csvData){
        if(!error){
            odChoropleth = new ODChoropleth("OD-Choropleth", csvData);
        }
    });
}