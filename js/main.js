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
