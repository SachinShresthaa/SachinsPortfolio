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
      <ul class="nav-left" id="nav-left">
        <li><a href="skills.html"     data-label="Skills">Skills</a></li>
        <span class="dot"></span>
        <li><a href="experience.html" data-label="Experience">Experience</a></li>
      </ul>
      <div class="nav-logo" id="nav-logo" data-label="Home">
        <img src="assets/logo.png" alt="SS" />
      </div>
      <ul class="nav-right" id="nav-right">
        <li><a href="projects.html" data-label="Projects">Projects</a></li>
        <span class="dot"></span>
        <li><a href="contact.html"  data-label="Contact">Contact</a></li>
      </ul>
    </nav>
  `);

  /* ── Mark active nav link ── */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === current) {
      a.style.opacity = '1';
      a.style.fontWeight = '700';
    }
  });

  /* ── Scroll: blur nav on scroll ── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('scrolled', window.scrollY > 20);
  });

})();