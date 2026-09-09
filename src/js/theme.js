// Light/dark theme toggle — flips the data-theme override already
// wired up in main.css (prefers-color-scheme handles the OS default).
const STORE = 'tape_reader_theme_v1';

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function apply(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) {}
  if (saved) apply(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
      || (systemPrefersDark() ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(STORE, next); } catch (e) {}
  });
}
