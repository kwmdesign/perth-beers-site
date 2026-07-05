/* ==========================================================================
   Perth Beers — "The Pour" design interactions
   Scroll pour, hero, ticker, beer filters, trail route drawing, map pin
   tooltips, cursor dot, mobile menu.
   Content is server-rendered by Eleventy — this file touches behaviour only.
   Loaded at the end of <body>.
   ========================================================================== */

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobilePanel = document.getElementById('mobilePanel');
if (menuBtn && mobilePanel) {
  menuBtn.addEventListener('click', () => {
    const open = mobilePanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobilePanel.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

/* ---------- region filters ---------- */
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = document.querySelector('.filters .on');
    if (current) current.classList.remove('on');
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('.beer').forEach(c => {
      c.classList.toggle('hide', !(f === 'all' || c.dataset.r === f));
    });
  });
});

/* ---------- ticker: duplicate for seamless loop ---------- */
const tick = document.getElementById('tick');
if (tick) tick.innerHTML += tick.innerHTML;

/* ---------- the pour (scroll progress) ---------- */
const liquid = document.getElementById('liquid');
const pct = document.getElementById('pct');
function pour() {
  if (!liquid) return;
  const h = document.documentElement;
  const p = Math.min(1, h.scrollTop / (h.scrollHeight - h.clientHeight));
  liquid.style.height = (p * 100) + '%';
  pct.textContent = Math.round(p * 100) + '%';
  liquid.classList.toggle('has-foam', p > 0.03);
}
addEventListener('scroll', pour, { passive: true });
pour();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .18 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- trail: draw route + light stops ---------- */
const route = document.getElementById('route');
const stops = [...document.querySelectorAll('.stop')];
const pins = [...document.querySelectorAll('.pin')];
if (route && stops.length) {
  const len = route.getTotalLength();
  route.style.setProperty('--len', len);

  const stopIO = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const n = +e.target.dataset.stop;
      e.target.classList.add('lit');
      if (pins[n - 1]) pins[n - 1].classList.add('lit');
      if (!prefersReduced) {
        const lit = stops.filter(s => s.classList.contains('lit')).length;
        route.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
        route.style.strokeDashoffset = len * (1 - lit / stops.length);
      } else {
        route.style.strokeDashoffset = 0;
      }
    });
  }, { threshold: .6 });
  stops.forEach(s => stopIO.observe(s));
}

/* ---------- map pin tooltips ---------- */
const mapEl = document.querySelector('.trail-map');
const tip = document.getElementById('mapTip');
if (mapEl && tip && pins.length) {
  const tipNum = document.getElementById('tipNum');
  const tipName = document.getElementById('tipName');
  const tipPlace = document.getElementById('tipPlace');
  pins.forEach(pin => {
    const show = () => {
      tipNum.textContent = 'Stop ' + pin.dataset.pin;
      tipName.textContent = pin.dataset.name;
      tipPlace.textContent = pin.dataset.place;
      const pr = pin.getBoundingClientRect(), mr = mapEl.getBoundingClientRect();
      tip.style.left = (pr.left - mr.left + pr.width / 2) + 'px';
      tip.style.top = (pr.top - mr.top) + 'px';
      tip.classList.add('show');
      const stop = stops[+pin.dataset.pin - 1];
      if (stop) stop.classList.add('lit');
    };
    const hide = () => tip.classList.remove('show');
    pin.addEventListener('mouseenter', show);
    pin.addEventListener('mouseleave', hide);
    pin.addEventListener('focus', show);
    pin.addEventListener('blur', hide);
    pin.setAttribute('tabindex', '0');
    pin.setAttribute('role', 'button');
    pin.setAttribute('aria-label', 'Stop ' + pin.dataset.pin + ': ' + pin.dataset.name);
  });
}

/* ---------- cursor dot (desktop, motion-permitting) ---------- */
const dot = document.getElementById('dot');
if (dot && matchMedia('(hover:hover)').matches && !prefersReduced) {
  addEventListener('mousemove', e => {
    dot.classList.add('on');
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  }, { passive: true });
  document.addEventListener('mouseover', e => {
    dot.classList.toggle('big', !!e.target.closest('[data-hover],a,button'));
  });
}
