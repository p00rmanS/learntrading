// Reading progress — each lesson has a "mark read" checkbox; state
// persists to localStorage and drives the progress bar in the nav rail.
const STORE = 'tape_reader_progress_v1';

function load() {
  try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; }
}
function save(state) {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
}

export function initProgress() {
  const checks = document.querySelectorAll('.progress-check');
  if (!checks.length) return;

  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const total = checks.length;

  function render() {
    const state = load();
    let read = 0;
    checks.forEach((box) => {
      const id = box.getAttribute('data-section');
      const isRead = !!state[id];
      box.checked = isRead;
      if (isRead) read++;
      const section = document.getElementById(id);
      if (section) section.classList.toggle('is-read', isRead);
    });
    if (fill) fill.style.width = Math.round((read / total) * 100) + '%';
    if (label) label.textContent = read + ' / ' + total + ' read';
  }

  checks.forEach((box) => {
    box.addEventListener('change', () => {
      const state = load();
      state[box.getAttribute('data-section')] = box.checked;
      save(state);
      render();
    });
  });

  render();
}
