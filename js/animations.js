var leadCopyAnimated = false;
var crimeRatesAnimated = false;

/**
 * Call all animations
 */
function animatePage() {
  $('#fullpage').fullpage({
    navigation: true,
    lockAnchors: true,
    afterRender: function() {
      $('body').fadeIn(1200);
    },
    afterLoad: function(anchorLink) {
      if (anchorLink === 'lead') {
        setTimeout(function() {
          animateLeadCopy();
        }, 500);
      }
      else if (anchorLink === 'crime-rates') {
        if (crimeRatesAnimated) {
          return;
        }

        renderCrimeRatesGraph();
        crimeRatesAnimated = true;
      }
    }
  });
}

/**
 * Animate lead copy text
 */
function animateLeadCopy() {
  if (leadCopyAnimated) {
    return;
  }

  leadCopyAnimated = true;

  var leadCopyText = [
      'Since the War on Drugs began in the 1970s, drug usage has been declared a national epidemic in the United States.',
      'Over the last 45 years, the United States has spent over $1 trillion on this "War" in addition to causing a 500% increase in its prison population.  ',
      'Even with all of this effort, last year alone 64,000 Americans died from a drug overdose &mdash; and the overdose rate shows no sign of slowing down.',
      'This webpage looks into what demographics are hit the hardest, and to demonstrate the ineffectiveness of current policies. Scroll down to learn more.'
];

  leadCopyText.forEach(function(d, i) {
    $('#lead-copy').append('<p class="lead-snippet" id="lead-' + i + '">' + d + '</p>')

    $('#lead-copy #lead-' + i).delay(2700 * i)
                              .animate({
                                'margin-top': -190 + (i * 110),
                                'opacity': 1
                              }, 1000);
  });
}
