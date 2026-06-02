const bar     = document.getElementById('hover-bar');
const barText = document.getElementById('hover-bar-text');
let transitioning = false;

/* ── Hover bar helpers ── */
function showBar(label) {
  barText.innerHTML =
    `<span class="txt-top"><span>${label}</span></span>` +
    `<span class="txt-bot"><span>${label}</span></span>`;
  bar.classList.add('active');
  barText.classList.add('active');
}

function hideBar() {
  if (transitioning) return;
  bar.classList.remove('active');
  barText.classList.remove('active');
}

/* ── Content reveals per page ── */
const PAGE_REVEALS = {
  'index.html':      [['hero-photo', 200], ['name-sachin', 200], ['name-shrestha', 200]],
  'skills.html':     [['page-title', 900]],
  'experience.html': [['page-title', 900]],
  'projects.html':   [['page-title', 900]],
  'contact.html':    [['page-title', 900]],
};

function runReveals(pageName) {
  (PAGE_REVEALS[pageName] || []).forEach(([id, delay]) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('visible');
    }, delay);
  });
}

/* ── Nav active state ── */
function updateNavActive(pageName) {
  document.querySelectorAll('nav a').forEach(a => {
    a.style.opacity    = '';
    a.style.fontWeight = '';
    if (a.getAttribute('href') === pageName) {
      a.style.opacity    = '1';
      a.style.fontWeight = '700';
    }
  });
}

/* ══════════════════════════════════════════════════
   ENTRY ANIMATION
   Bar sweeps upward. Text rides up with it and fades.
══════════════════════════════════════════════════ */
function runEntryAnimation(label) {
  barText.innerHTML =
    `<span class="txt-top"><span>${label}</span></span>` +
    `<span class="txt-bot"><span>${label}</span></span>`;

  bar.classList.add('entry-cover');
  barText.classList.add('entry-cover');
  bar.offsetHeight; /* force reflow — instant paint before animating */

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      /* bar sweeps up; text rides along and fades out */
      bar.classList.add('entry-sweep');
      barText.classList.remove('entry-cover');
      barText.classList.add('entry-sweep');
    });
  });

  /* cleanup after sweep finishes */
  setTimeout(() => {
    /* Step 1 — inline transition:none prevents the CSS 0.55s transition from
       firing when !important is lifted in step 2.
       scaleY(0) will take effect once the !important classes are removed. */
    bar.querySelectorAll('.bar-top, .bar-bot').forEach(el => {
      el.style.transition = 'none';
      el.style.transform  = 'scaleY(0)';
    });

    /* Step 2 — remove all classes. !important is gone so inline wins:
       transition:none stops the scaleY(1)→scaleY(0) from animating. */
    bar.classList.remove('entry-cover', 'entry-sweep', 'text-white', 'active', 'fullscreen');
    barText.classList.remove('entry-cover', 'entry-sweep', 'text-white', 'active');
    barText.style.opacity    = '';
    barText.style.transition = '';
    barText.innerHTML        = '';

    /* Step 3 — reflow AFTER class removal captures scaleY(0) as the snapshot,
       not the previous scaleY(1). */
    bar.offsetHeight;

    /* Step 4 — restore CSS. Previous snapshot is scaleY(0), CSS default is
       also scaleY(0) → no change → no transition fires. */
    bar.querySelectorAll('.bar-top, .bar-bot').forEach(el => {
      el.style.transition = '';
      el.style.transform  = '';
    });

    transitioning = false;
  }, 1400);
}

/* ══════════════════════════════════════════════════
   SPA NAVIGATION
   Covers screen, fetches HTML, swaps section in DOM,
   then plays entry animation — no page reload.
══════════════════════════════════════════════════ */
async function goToPage(href, label, { pushState: shouldPush = true } = {}) {
  if (transitioning) return;

  /* skip transition if already on the target page */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const targetPage  = href.split('/').pop() || 'index.html';
  if (currentPage === targetPage) return;

  transitioning = true;

  const pageName = href.split('/').pop() || 'index.html';

  /* cover screen — bar expands + text starts turning white at the same time */
  showBar(label);
  requestAnimationFrame(() => {
    bar.classList.add('fullscreen');
    barText.classList.add('text-white'); /* slow color transition synced with bar */
  });

  /* fetch new page + wait for screen to be covered — in parallel */
  const coverDone = new Promise(r => setTimeout(r, 800));
  let html;
  try {
    html = await fetch(href).then(r => r.text());
  } catch {
    await coverDone;
    window.location.href = href; /* hard fallback if fetch fails */
    return;
  }
  await coverDone; /* ensure screen is covered before swap */

  /* parse and adopt the new section */
  const fetchedDoc  = new DOMParser().parseFromString(html, 'text/html');
  const oldSection  = document.querySelector('section.hero, section.page-hero');
  const newSection  = fetchedDoc.querySelector('section.hero, section.page-hero');
  if (oldSection && newSection) {
    oldSection.replaceWith(document.adoptNode(newSection));
  }

  /* update URL, title, nav */
  if (shouldPush) {
    history.pushState({ pageName, label }, fetchedDoc.title, href);
  }
  document.title = fetchedDoc.title;
  updateNavActive(pageName);

  /* animate entry and reveal new content */
  runEntryAnimation(label);
  runReveals(pageName);
}

/* ── Nav event listeners ── */
document.querySelectorAll('.nav-left a, .nav-right a').forEach(a => {
  a.addEventListener('mouseenter', () => { if (!transitioning) showBar(a.dataset.label); });
  a.addEventListener('mouseleave', hideBar);
  a.addEventListener('click', e => {
    e.preventDefault();
    goToPage(a.getAttribute('href'), a.dataset.label);
  });
});

const logo = document.getElementById('nav-logo');
if (logo) {
  logo.addEventListener('mouseenter', () => { if (!transitioning) showBar(logo.dataset.label); });
  logo.addEventListener('mouseleave', hideBar);
  logo.addEventListener('click', e => {
    e.preventDefault();
    goToPage('index.html', 'Home');
  });
}

/* ── Browser back / forward ── */
window.addEventListener('popstate', e => {
  if (!e.state) return;
  goToPage(e.state.pageName, e.state.label, { pushState: false });
});

/* ── Record current page in history state so popstate works ── */
(function recordInitialState() {
  const labels = {
    'index.html': 'Home', 'skills.html': 'Skills',
    'experience.html': 'Experience', 'projects.html': 'Projects',
    'contact.html': 'Contact',
  };
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  history.replaceState({ pageName, label: labels[pageName] || pageName }, document.title);
  updateNavActive(pageName);
})();
