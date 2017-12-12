$(document).ready(function() {
  queue()
      .defer(d3.csv, 'data/drug-use-rates.csv')
      .defer(d3.csv, 'data/drug-overdoses-innovative.csv')
      .await(createVisualization);

  animatePage();
});

/**
 * Render visualizations
 */
function createVisualization(error, drugUseData, drugOverdoseInnovativeData) {
  drugUseChart = new DrugUseChart('drug-use-chart', drugUseData);
  InnovativeChart = new InnovativeChart('innovative-chart', drugOverdoseInnovativeData);
}

// Variables for the visualization instances
var odChoropleth;
var compDemographics;

// Start application by loading the data
renderODChoropleth();

function renderODChoropleth() {
    d3.csv("data/drug-overdoses.csv", function(error, csvData){
        if(!error){
            odChoropleth = new ODChoropleth("OD-Choropleth", csvData);
            compDemographics = new CompareDemographics("compare-demographics-number", csvData);
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
