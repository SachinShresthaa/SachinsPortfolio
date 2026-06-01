/* ══════════════════════════════════════════════════
   PAGE TRANSITION
   1. Click nav → bar splits open from center
   2. Bar expands to cover FULL screen (over nav too)
   3. Text white, screen fully black
   4. PAGE STARTS LOADING NOW (iframe preload)
   5. After 2s bar sweeps bottom→top
   6. New page already loaded, appears instantly
══════════════════════════════════════════════════ */

const bar     = document.getElementById('hover-bar');
const barText = document.getElementById('hover-bar-text');
let transitioning = false;

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

function goToPage(href, label) {
  if (transitioning) return;
  transitioning = true;

  /* store label for entry animation on next page */
  sessionStorage.setItem('nextLabel', label);

  /* step 1 — show hover bar */
  showBar(label);

  /* step 2 — go fullscreen: covers EVERYTHING including nav */
  requestAnimationFrame(() => {
    bar.classList.add('fullscreen');
  });

  /* step 3 — text turns white once fully black */
  setTimeout(() => {
    bar.classList.add('text-white');
  }, 800);

  /* step 4 — START LOADING next page now while screen is black */
  setTimeout(() => {
    window.location.href = href;
  }, 900);  /* navigate early — entry animation on next page handles the reveal */
}

/* attach hover + click to all nav links */
document.querySelectorAll('.nav-left a, .nav-right a').forEach(a => {
  a.addEventListener('mouseenter', () => { if (!transitioning) showBar(a.dataset.label); });
  a.addEventListener('mouseleave', hideBar);
  a.addEventListener('click', e => {
    e.preventDefault();
    goToPage(a.getAttribute('href'), a.dataset.label);
  });
});

/* logo */
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
   ENTRY ANIMATION
   New page loads with bar covering full screen (black)
   Bar then sweeps from bottom UP to reveal the page
══════════════════════════════════════════════════ */
(function entryAnimation() {
  const label = sessionStorage.getItem('nextLabel');
  if (!label) return;
  sessionStorage.removeItem('nextLabel');

  /* fill text */
  barText.innerHTML =
    `<span class="txt-top"><span>${label}</span></span>` +
    `<span class="txt-bot"><span>${label}</span></span>`;

  /* instantly cover screen — no transition */
  bar.classList.add('entry-cover');

  /* force reflow so instant state is painted */
  bar.offsetHeight;

  /* then sweep upward to reveal */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.classList.add('entry-sweep');
    });
  });

  /* clean up after sweep finishes */
  setTimeout(() => {
    bar.classList.remove('entry-cover', 'entry-sweep', 'text-white', 'active', 'fullscreen');
    barText.innerHTML = '';
  }, 1400);
})();