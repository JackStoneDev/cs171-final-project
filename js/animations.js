/**
 * Call all animations
 */
function animatePage() {
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

  $('#lead-copy').text(leadCopyText[0]);
}
