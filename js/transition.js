/* ══════════════════════════════════════════════════
   PAGE TRANSITION — shared across all pages
   
   ON CLICK any nav link:
   1. Bar splits open from center (hover effect)
   2. Bar expands FULL UP + FULL DOWN to cover 100vh
   3. Text turns full white
   4. After 2s — bar sweeps from BOTTOM TO TOP off screen
   5. New page loads — bar enters from bottom, sweeps up to reveal
══════════════════════════════════════════════════ */

const bar     = document.getElementById('hover-bar');
const barText = document.getElementById('hover-bar-text');
let transitioning = false;

/* ── build split text ── */
function showBar(label) {
  barText.innerHTML =
    `<span class="txt-top"><span>${label}</span></span>` +
    `<span class="txt-bot"><span>${label}</span></span>`;
  bar.classList.add('active');
}

function hideBar() {
  if (transitioning) return;
  bar.classList.remove('active');
}

/* ── full page transition on click ── */
function goToPage(href, label) {
  if (transitioning) return;
  transitioning = true;

  /* step 1 — show bar */
  showBar(label);

  /* step 2 — expand fullscreen top+bottom */
  setTimeout(() => {
    bar.classList.add('fullscreen');
  }, 50);

  /* step 3 — text turns white */
  setTimeout(() => {
    bar.classList.add('text-white');
  }, 700);

  /* step 4 — after 2s sweep bar upward (bottom to top) */
  setTimeout(() => {
    bar.classList.add('sweep-up');
  }, 2000);

  /* step 5 — navigate */
  setTimeout(() => {
    window.location.href = href;
  }, 2950);
}

/* ── attach to all nav links ── */
document.querySelectorAll('.nav-left a, .nav-right a').forEach(a => {
  a.addEventListener('mouseenter', () => { if (!transitioning) showBar(a.dataset.label); });
  a.addEventListener('mouseleave', hideBar);
  a.addEventListener('click', e => {
    e.preventDefault();
    goToPage(a.getAttribute('href'), a.dataset.label);
  });
});

/* ── attach to logo ── */
const logo = document.getElementById('nav-logo');
if (logo) {
  logo.addEventListener('mouseenter', () => { if (!transitioning) showBar(logo.dataset.label); });
  logo.addEventListener('mouseleave', hideBar);
  logo.addEventListener('click', e => {
    e.preventDefault();
    goToPage('index.html', 'Home');
  });
}

/* ══════════════════════════════════════════════════
   ENTRY ANIMATION — runs on every page load
   If coming from a transition, bar enters from bottom
   and sweeps upward to reveal the page
══════════════════════════════════════════════════ */
(function entryAnimation() {
  /* get label stored before navigation */
  const label = sessionStorage.getItem('nextLabel') || '';
  if (!label) return; /* first load — no entry animation */

  sessionStorage.removeItem('nextLabel');

  /* pre-fill text */
  barText.innerHTML =
    `<span class="txt-top"><span>${label}</span></span>` +
    `<span class="txt-bot"><span>${label}</span></span>`;

  /* start: bar at bottom of screen, fully black, text white */
  bar.classList.add('entry-start');

  /* small delay then slide bar up to reveal page */
  requestAnimationFrame(() => {
    setTimeout(() => {
      bar.classList.add('entry-reveal');
    }, 80);

    /* clean up after reveal */
    setTimeout(() => {
      bar.classList.remove('entry-start', 'entry-reveal', 'text-white', 'active');
      barText.innerHTML = '';
    }, 1300);
  });
})();

/* save label to sessionStorage just before navigate */
document.querySelectorAll('.nav-left a, .nav-right a').forEach(a => {
  a.addEventListener('click', () => {
    sessionStorage.setItem('nextLabel', a.dataset.label);
  });
});
if (logo) {
  logo.addEventListener('click', () => {
    sessionStorage.setItem('nextLabel', 'Home');
  });
}