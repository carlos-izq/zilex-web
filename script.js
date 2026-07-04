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

/* ---- Cursor glow ---- */
const glow = document.querySelector('.cursor-glow');
let gx = 0, gy = 0, cx = 0, cy = 0;
const fine = window.matchMedia('(pointer: fine)').matches;
if (fine) {
  window.addEventListener('mousemove', (e) => {
    gx = e.clientX; gy = e.clientY;
    glow.style.opacity = '0.6';
  });
  const animateGlow = () => {
    cx += (gx - cx) * 0.12;
    cy += (gy - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();
  document.addEventListener('mouseleave', () => (glow.style.opacity = '0'));
}

/* ---- Hero parallax on floating images ---- */
const floats = document.querySelectorAll('.float');
let heroActive = true;
const heroSection = document.querySelector('.hero');
const heroObs = new IntersectionObserver(([e]) => (heroActive = e.isIntersecting));
heroObs.observe(heroSection);

if (fine) {
  window.addEventListener('mousemove', (e) => {
    if (!heroActive) return;
    const mx = (e.clientX / window.innerWidth - 0.5);
    const my = (e.clientY / window.innerHeight - 0.5);
    floats.forEach((f) => {
      const sp = parseFloat(f.dataset.speed || 0.1);
      f.style.transform = `translate(${mx * sp * 120}px, ${my * sp * 120}px)`;
    });
  });
}

/* ---- Subtle scroll parallax for floats ---- */
window.addEventListener('scroll', () => {
  if (!heroActive) return;
  const y = window.scrollY;
  floats.forEach((f) => {
    const sp = parseFloat(f.dataset.speed || 0.1);
    f.style.marginTop = `${y * sp * 0.4}px`;
  });
}, { passive: true });

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
