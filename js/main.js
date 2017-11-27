$(document).ready(function() {
  queue()
      .defer(d3.csv, 'data/drug-seizures.csv')
      .await(createVisualization);

  animatePage();
});

/**
 * Render visualizations
 */
function createVisualization(error, drugSeizuresData, crimeRatesData) {
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

function renderCrimeRatesGraph(){
    $('#rates-button').prop('onclick',null).off('click');

    d3.csv("data/crime rates/Race Rates All Drug Arrests.csv", function(error, csvData){
        if(!error){
            crimesChart = new CrimeRateChart('crime-rates-chart', csvData);
        }
    });
}
