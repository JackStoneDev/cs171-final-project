var leadCopyAnimated = false;
var crimeRatesAnimated = false;

/**
 * Call all animations
 */
function animatePage() {
  $('#fullpage').fullpage({
    navigation: true,
    onLeave: function(index, nextIndex, direction) {
      // Transition from hero to lead copy
      if (nextIndex === 2) {
        setTimeout(function() {
          animateLeadCopy();
        }, 500);
      }
      // Transition to crime rates graph
      else if (nextIndex === 7) {
        if (crimeRatesAnimated) {
          return;
        }

        renderCrimeRatesGraph();
        crimeRatesAnimated = true;
      }
      else if (nextIndex === 4){
          $('select>option:eq(0)').prop('selected', true);
          compDemographics.wrangleData();
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
    'Since the war on drugs in 1980, drug usage has been declared a national epidemic in the United States.',
    'Last year, 64,000 Americans died from a drug overdose &mdash; and the overdose rate shows no sign of slowing down.',
    'This webpage looks into what demographics were hit the hardest. Scroll down to read more.'
  ];

  leadCopyText.forEach(function(d, i) {
    $('#lead-copy').append('<p class="lead-snippet" id="lead-' + i + '">' + d + '</p>')

    $('#lead-copy #lead-' + i).delay(2000 * i)
                              .animate({
                                'margin-top': -140 + (i * 110),
                                'opacity': 1
                              }, 1000);
  });
}
