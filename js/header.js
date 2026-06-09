/* ══════════════════════════════════════
   SHARED HEADER — injected on every page
   Just add <script src="js/header.js"></script>
   before </body> and it builds the nav
══════════════════════════════════════ */

(function injectHeader() {

  /* ── Cursor elements ── */
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="cursor-dot"></div>
    <div id="cursor-ring"></div>
  `);

  /* ── Hover bar ── */
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="hover-bar">
      <div class="bar-top"></div>
      <div class="bar-bot"></div>
    </div>
    <span id="hover-bar-text"></span>
  `);

  /* ── Nav ── */
  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="navbar">
      <span class="nav-left" id="nav-left">
        <a href="skills.html"     data-label="Skills"     aria-label="Skills">Skills</a>
        <span class="dot" aria-hidden="true"></span>
        <a href="experience.html" data-label="Experience" aria-label="Experience">Experience</a>
      </span>
      <span class="dot nav-mid-dot" aria-hidden="true"></span>
      <div class="nav-logo" id="nav-logo" data-label="Home" role="button" aria-label="Go to home">
        <img src="assets/logo.png" alt="Sachin Shrestha logo" />
      </div>
      <span class="dot nav-mid-dot" aria-hidden="true"></span>
      <span class="nav-right" id="nav-right">
        <a href="projects.html" data-label="Projects" aria-label="Projects">Projects</a>
        <span class="dot" aria-hidden="true"></span>
        <a href="contact.html"  data-label="Contact"  aria-label="Contact">Contact</a>
      </span>
    </nav>
  `);

  /* ── Mark active nav link ── */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === current) {
      a.classList.add('nav-active');
    }
  });

  /* ── Scroll: blur nav on scroll ── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('scrolled', window.scrollY > 20);
  });

})();