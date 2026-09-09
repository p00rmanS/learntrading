// Trading plan form — saves to localStorage (Section 25)
export function initPlan() {
(function(){
  var STORE = 'tape_reader_plan_v1';
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch(e){ return null; } }
  function save(obj){ try { localStorage.setItem(STORE, JSON.stringify(obj)); } catch(e){} }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function render(){
    var p = load();
    var host = document.getElementById('planDisplay');
    if(!p){ host.innerHTML = '<p class="empty">No plan saved yet — fill out the form above.</p>'; return; }
    host.innerHTML =
      '<div class="readout">' +
      'markets: ' + esc(p.markets || '-') + '<br>' +
      'entry criteria: ' + esc(p.entry || '-') + '<br>' +
      'max risk per trade: ' + esc(p.riskPct || '-') + '%<br>' +
      'max trades per day: ' + esc(p.maxTrades || '-') + '<br>' +
      'no-trade days/times: ' + esc(p.noTrade || '-') +
      '</div>';
  }

  var form = document.getElementById('planForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    save({
      markets: document.getElementById('planMarkets').value,
      entry: document.getElementById('planEntry').value,
      riskPct: document.getElementById('planRiskPct').value,
      maxTrades: document.getElementById('planMaxTrades').value,
      noTrade: document.getElementById('planNoTrade').value
    });
    render();
  });
  render();
})();
}
