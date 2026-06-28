/* ── Shared cursor — used on every page ── */
if (window.matchMedia('(hover: none)').matches) { /* touch device — skip cursor */ }
else {
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
}, { passive: true });
document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0'; ring.style.opacity = '0';
}, { passive: true });
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1'; ring.style.opacity = '1';
}, { passive: true });
(function raf() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(raf);
})();
document.querySelectorAll('a, button, label, [role="button"], .sk-tab, .f-submit').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.width = '52px'; ring.style.height = '52px';
  }, { passive: true });
  el.addEventListener('mouseleave', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '34px'; ring.style.height = '34px';
  }, { passive: true });
});
}