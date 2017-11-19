/**
 * Call all animations
 */
function animatePage() {
  $('#fullpage').fullpage({
    onLeave: function(index, nextIndex, direction) {
      if (index === 1 && nextIndex === 2) {
        setTimeout(function() {
          animateLeadCopy();
        }, 500);
      }
    }
  });

  animateLeadCopy();
}

/**
 * Animate lead copy text
 */
function animateLeadCopy() {
  var leadCopyText = [
    'Since the war on drugs in 1980, drug usage has been declared a national epidemic in the United States.',
    'Last year 64,000 Americans died from a drug overdose &mdash; and the overdose rate shows no sign of slowing down.'
  ];

  leadCopyText.forEach(function(d, i) {
    console.log(d);
    $('#lead-copy').append('<p>' + d + '</p>')

    $('#lead-copy').last()
                   .delay(1000 * (i + 1))
                   .animate({
                     'margin-top': -20
                   }, 1000);
  });
}
