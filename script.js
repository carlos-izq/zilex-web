/* ================= ZILEX — interactions ================= */

/* ---- Nav scroll state ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // stagger siblings a touch
      const delay = el.dataset.delay || (i % 6) * 60;
      setTimeout(() => el.classList.add('in'), delay);
      io.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach((el) => io.observe(el));

/* ---- Service hover background image (inject as CSS var) ---- */
document.querySelectorAll('.service[data-img]').forEach((s) => {
  s.style.setProperty('--bg-img', `url("${s.dataset.img}")`);
});

/* ---- Band móvil: auto-scroll continuo, se pausa al tocar/deslizar con el dedo ---- */
(() => {
  const rows = document.querySelectorAll('.band__mobile-only');
  const mq = window.matchMedia('(max-width: 720px)');
  const controllers = [];

  rows.forEach((row) => {
    const direction = row.classList.contains('band__row--down') ? -1 : 1;
    const speed = 0.5;
    let rafId = null;
    let paused = false;
    let resumeTimer = null;
    // posición propia en punto flotante: row.scrollLeft redondea a entero,
    // y restar 0.5 desde un entero se redondea de vuelta al mismo valor (bucle atascado)
    let pos = direction < 0 ? row.scrollWidth / 2 : 0;

    const tick = () => {
      if (!paused) {
        const half = row.scrollWidth / 2;
        pos += speed * direction;
        if (direction > 0 && pos >= half) pos -= half;
        if (direction < 0 && pos <= 0) pos += half;
        row.scrollLeft = pos;
      }
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (rafId) return;
      row.scrollLeft = pos;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };
    const pauseForInteraction = () => {
      paused = true;
      clearTimeout(resumeTimer);
    };
    const resumeAfterDelay = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pos = row.scrollLeft; // continua desde donde el usuario dejó el scroll manual
        paused = false;
      }, 2200);
    };

    row.addEventListener('touchstart', pauseForInteraction, { passive: true });
    row.addEventListener('touchend', resumeAfterDelay, { passive: true });
    row.addEventListener('pointerdown', pauseForInteraction);
    row.addEventListener('pointerup', resumeAfterDelay);

    controllers.push({ start, stop });
  });

  const sync = () => controllers.forEach((c) => (mq.matches ? c.start() : c.stop()));
  mq.addEventListener('change', sync);
  sync();
})();

/* ---- Smooth anchor offset for fixed nav ---- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
