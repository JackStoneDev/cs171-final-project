$(document).ready(function() {
  $('#fullpage').fullpage();

  queue()
      .defer(d3.csv, 'data/drug-seizures.csv')
      .defer(d3.csv, 'data/crime rates/men and women all ages.csv')
      .await(createVisualization);

  animatePage();
});

/**
 * Render visualizations
 */
function createVisualization(error, drugSeizuresData, crimeRatesData) {
  seizuresChart = new SeizuresChart('drug-seizures-chart', drugSeizuresData);
  crimesChart = new CrimeRateChart('crime-rates-chart', crimeRatesData);
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
