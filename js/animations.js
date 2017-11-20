var leadCopyAnimated = false;

/**
 * Call all animations
 */
function animatePage() {
  $('#fullpage').fullpage({
    // Transition from hero to lead copy
    onLeave: function(index, nextIndex, direction) {
      if (index === 1 && nextIndex === 2) {
        setTimeout(function() {
          animateLeadCopy();
        }, 500);
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
