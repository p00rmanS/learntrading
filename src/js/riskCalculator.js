// Position size calculator (Section 17)
export function initRiskCalculator() {
(function(){
  var form = document.getElementById('riskCalcForm');
  var result = document.getElementById('riskCalcResult');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var account = parseFloat(document.getElementById('rAccount').value);
    var riskPct = parseFloat(document.getElementById('rRiskPct').value);
    var entry = parseFloat(document.getElementById('rEntry').value);
    var stop = parseFloat(document.getElementById('rStop').value);
    var dollarRisk = account * (riskPct / 100);
    var distance = Math.abs(entry - stop);
    var size = distance > 0 ? dollarRisk / distance : 0;
    result.style.display = 'block';
    result.innerHTML =
      '$ position-size --account ' + account + ' --risk ' + riskPct + '%<br>' +
      'Dollar risk: $' + dollarRisk.toFixed(2) + '<br>' +
      'Stop distance: ' + distance.toFixed(2) + '<br>' +
      'Max position size: ' + size.toFixed(4) + ' units (contracts, shares, or coins, depending on your instrument)';
  });
})();
}
