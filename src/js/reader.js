// E-book style reader: one lesson per screen, edge hover/click to flip,
// swipe on touch devices, a table-of-contents drawer, and a
// resume-where-you-left-off bookmark.
const STORE = 'tape_reader_page_v1';
const HINT_STORE = 'tape_reader_hint_seen_v1';

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
  const tocFilter = document.getElementById('tocFilter');
  const tocEmpty = document.getElementById('tocEmpty');
  const beginBtn = document.getElementById('beginReading');
  const hint = document.getElementById('onboardingHint');
  const hintDismiss = document.getElementById('onboardingDismiss');

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (index === current && !opts.force) return;

    const direction = index > current ? 1 : (index < current ? -1 : 0);
    const oldPage = pages[current];
    current = index;
    const page = pages[current];

    if (direction !== 0 && !reduceMotion) {
      page.style.transition = 'none';
      page.style.transform = 'translateX(' + (direction * 24) + 'px)';
      void page.offsetWidth; // force reflow so the transition below actually animates
      page.style.transition = '';
    }

    if (oldPage && oldPage !== page) oldPage.classList.remove('active');
    page.classList.add('active');
    if (!opts.keepScroll) page.scrollTop = 0;
    requestAnimationFrame(() => { page.style.transform = 'translateX(0)'; });

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

  function next() { showPage(current + 1); dismissHint(); }
  function prev() { showPage(current - 1); dismissHint(); }

  edgeLeft?.addEventListener('click', prev);
  edgeRight?.addEventListener('click', next);
  beginBtn?.addEventListener('click', () => { showPage(1); dismissHint(); });

  function filterToc(query) {
    const q = query.trim().toLowerCase();
    let visible = 0;
    tocLinks.forEach((a) => {
      const match = !q || a.textContent.toLowerCase().includes(q);
      a.closest('li').hidden = !match;
      if (match) visible++;
    });
    if (tocEmpty) tocEmpty.hidden = visible !== 0;
  }
  tocFilter?.addEventListener('input', () => filterToc(tocFilter.value));

  function openToc() {
    tocDrawer.hidden = false;
    tocBackdrop.hidden = false;
    requestAnimationFrame(() => {
      tocDrawer.classList.add('open');
      tocBackdrop.classList.add('open');
    });
    if (tocFilter) requestAnimationFrame(() => tocFilter.focus());
  }
  function closeToc() {
    tocDrawer.classList.remove('open');
    tocBackdrop.classList.remove('open');
    setTimeout(() => { tocDrawer.hidden = true; tocBackdrop.hidden = true; }, 250);
    if (tocFilter && tocFilter.value) { tocFilter.value = ''; filterToc(''); }
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
      dismissHint();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeToc(); return; }
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (typing) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // swipe via Pointer Events, covering touch, mouse-drag, and pen in one
  // listener. Touch keeps the original whole-viewport behavior (a quick
  // touch-drag never starts a text selection, so swiping from anywhere on
  // the page reads naturally). A mouse drag is scoped to start outside the
  // readable text (.page-inner) so click-dragging to select and copy a
  // passage is never hijacked into a page flip — only dragging from the
  // page's outer margin, the reader bar, or an edge zone triggers it.
  let dragStartX = 0;
  let dragStartY = 0;
  let dragActive = false;
  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') {
      if (e.button !== 0) return;
      if (e.target.closest('.page-inner')) return;
    }
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragActive = true;
  });
  viewport.addEventListener('pointerup', (e) => {
    if (!dragActive) return;
    dragActive = false;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next(); else prev();
    }
  });
  viewport.addEventListener('pointercancel', () => { dragActive = false; });

  // first-visit hint
  let hintShowTimer = null;
  let hintHideTimer = null;
  function dismissHint() {
    clearTimeout(hintShowTimer);
    clearTimeout(hintHideTimer);
    try { localStorage.setItem(HINT_STORE, '1'); } catch (e) {}
    if (!hint || !hint.classList.contains('visible')) return;
    hint.classList.remove('visible');
  }
  hintDismiss?.addEventListener('click', dismissHint);
  let hintSeen = false;
  try { hintSeen = localStorage.getItem(HINT_STORE) === '1'; } catch (e) {}
  if (hint && !hintSeen) {
    hintShowTimer = setTimeout(() => {
      // force a reflow before toggling the class, or the opacity/transform
      // transition can fail to kick off on its very first trigger
      hint.style.transition = 'none';
      void hint.offsetHeight;
      hint.style.transition = '';
      hint.classList.add('visible');
    }, 900);
    hintHideTimer = setTimeout(dismissHint, 9000);
  }

  let saved = 0;
  try { saved = parseInt(localStorage.getItem(STORE) || '0', 10) || 0; } catch (e) {}
  showPage(saved, { keepScroll: false, force: true });
}
