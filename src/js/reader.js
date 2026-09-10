// E-book style reader: one lesson per screen, edge hover/click to flip,
// a table-of-contents drawer, and a resume-where-you-left-off bookmark.
const STORE = 'tape_reader_page_v1';

export function initReader() {
  const viewport = document.getElementById('pageViewport');
  if (!viewport) return;

  const pages = Array.from(viewport.querySelectorAll('.page'));
  const total = pages.length;
  const lessonCount = total - 2; // minus cover + mentor letter

  const pageIndicator = document.getElementById('pageIndicator');
  const progressFill = document.getElementById('pageProgressFill');
  const edgeLeft = document.getElementById('edgeLeft');
  const edgeRight = document.getElementById('edgeRight');
  const prevPeek = document.getElementById('prevPeek');
  const nextPeek = document.getElementById('nextPeek');
  const tocToggle = document.getElementById('tocToggle');
  const tocClose = document.getElementById('tocClose');
  const tocDrawer = document.getElementById('tocDrawer');
  const tocBackdrop = document.getElementById('tocBackdrop');
  const tocLinks = Array.from(document.querySelectorAll('#tocList a[href^="#"]'));
  const beginBtn = document.getElementById('beginReading');

  let current = 0;

  function labelFor(index) {
    const p = pages[index];
    if (index === 0) return 'Cover';
    if (index === 1) return p.dataset.title || 'Before You Start';
    return 'Lesson ' + (index - 1) + ' / ' + lessonCount;
  }

  function showPage(index, opts) {
    opts = opts || {};
    index = Math.max(0, Math.min(total - 1, index));
    pages[current]?.classList.remove('active');
    current = index;
    const page = pages[current];
    page.classList.add('active');
    if (!opts.keepScroll) page.scrollTop = 0;

    if (pageIndicator) pageIndicator.textContent = labelFor(current);
    if (progressFill) progressFill.style.width = Math.round((current / (total - 1)) * 100) + '%';

    if (edgeLeft) edgeLeft.disabled = current === 0;
    if (edgeRight) edgeRight.disabled = current === total - 1;
    if (prevPeek) prevPeek.textContent = current > 0 ? pages[current - 1].dataset.title : '';
    if (nextPeek) nextPeek.textContent = current < total - 1 ? pages[current + 1].dataset.title : '';

    tocLinks.forEach((a) => {
      const targetId = a.getAttribute('href').slice(1);
      a.classList.toggle('current', page.querySelector('#' + CSS.escape(targetId)) !== null || page.id === targetId);
    });

    try { localStorage.setItem(STORE, String(current)); } catch (e) {}
  }

  function next() { showPage(current + 1); }
  function prev() { showPage(current - 1); }

  edgeLeft?.addEventListener('click', prev);
  edgeRight?.addEventListener('click', next);
  beginBtn?.addEventListener('click', () => showPage(1));

  function openToc() {
    tocDrawer.hidden = false;
    tocBackdrop.hidden = false;
    requestAnimationFrame(() => {
      tocDrawer.classList.add('open');
      tocBackdrop.classList.add('open');
    });
  }
  function closeToc() {
    tocDrawer.classList.remove('open');
    tocBackdrop.classList.remove('open');
    setTimeout(() => { tocDrawer.hidden = true; tocBackdrop.hidden = true; }, 250);
  }
  tocToggle?.addEventListener('click', openToc);
  tocClose?.addEventListener('click', closeToc);
  tocBackdrop?.addEventListener('click', closeToc);

  tocLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = a.getAttribute('href').slice(1);
      const idx = pages.findIndex((p) => p.id === targetId || p.querySelector('#' + CSS.escape(targetId)));
      if (idx !== -1) showPage(idx);
      closeToc();
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (typing) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Escape') closeToc();
  });

  let saved = 0;
  try { saved = parseInt(localStorage.getItem(STORE) || '0', 10) || 0; } catch (e) {}
  showPage(saved, { keepScroll: false });
}
