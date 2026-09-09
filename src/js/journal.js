// Demo trade journal — logs trades to localStorage
export function initJournal() {
(function(){
  var STORE = 'tape_reader_journal_v1';
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch(e){ return []; } }
  function save(rows){ try { localStorage.setItem(STORE, JSON.stringify(rows)); } catch(e){} }

  function render(){
    var rows = load();
    var host = document.getElementById('journalTable');
    if(!rows.length){ host.innerHTML = '<p class="empty">No trades logged yet — your first entry will show up here.</p>'; return; }
    var html = '<div class="tablewrap"><table><thead><tr><th>Date</th><th>Symbol</th><th>Side</th><th>Entry</th><th>Stop</th><th>Target</th><th>R:R</th><th>P/L</th><th>Notes</th><th></th></tr></thead><tbody>';
    rows.forEach(function(r, i){
      var risk = Math.abs(r.entry - r.stop);
      var reward = Math.abs(r.target - r.entry);
      var rr = risk > 0 ? (reward / risk).toFixed(2) : '—';
      var plClass = r.result > 0 ? 'pl-pos' : (r.result < 0 ? 'pl-neg' : '');
      html += '<tr>' +
        '<td class="mono">' + r.date + '</td>' +
        '<td class="mono">' + esc(r.symbol) + '</td>' +
        '<td>' + r.side + '</td>' +
        '<td class="mono">' + r.entry + '</td>' +
        '<td class="mono">' + r.stop + '</td>' +
        '<td class="mono">' + r.target + '</td>' +
        '<td class="mono">' + rr + '</td>' +
        '<td class="mono ' + plClass + '">' + (r.result !== null && r.result !== '' ? r.result : '—') + '</td>' +
        '<td>' + esc(r.notes || '') + '</td>' +
        '<td><button class="del-btn" data-i="' + i + '">remove</button></td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    host.innerHTML = html;
    host.querySelectorAll('.del-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var rows = load();
        rows.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
        save(rows);
        render();
      });
    });
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  var form = document.getElementById('journalForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var rows = load();
    rows.unshift({
      date: document.getElementById('jDate').value,
      symbol: document.getElementById('jSymbol').value,
      side: document.getElementById('jSide').value,
      entry: parseFloat(document.getElementById('jEntry').value),
      stop: parseFloat(document.getElementById('jStop').value),
      target: parseFloat(document.getElementById('jTarget').value),
      result: document.getElementById('jResult').value === '' ? null : parseFloat(document.getElementById('jResult').value),
      notes: document.getElementById('jNotes').value
    });
    save(rows);
    form.reset();
    render();
  });
  render();
})();
}
