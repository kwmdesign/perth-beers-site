/* ==========================================================================
   Perth Beers — site interactions
   Mobile menu, sticky nav shadow, stat counters, hero SVG reduced-motion
   handling, beer listing slider, Brewery Trail tabs, Swan Valley trail map
   pin tooltips, newsletter form.
   Loaded at the end of <body>, so the DOM is already in place.
   ========================================================================== */

lucide.createIcons();

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    lucide.createIcons();
  }
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    lucide.createIcons();
  }
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // ---------- Sticky nav shadow on scroll ----------
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow-md', window.scrollY > 12);
  }, { passive: true });

  // ---------- Stat counters ----------
  const counters = document.querySelectorAll('.stat-counter');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-counter').forEach(animateCounter);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  const statsRow = document.getElementById('statsRow');
  if (statsRow) statsObserver.observe(statsRow);

  // ---------- Reduced motion: pause SVG SMIL animations ----------
  if (prefersReduced) {
    const heroSvg = document.getElementById('heroSvg');
    if (heroSvg && heroSvg.pauseAnimations) heroSvg.pauseAnimations();
  }

  // ---------- Beer listing slider ----------
  const beersTrack = document.getElementById('beersTrack');
  const beersPrev = document.getElementById('beersPrev');
  const beersNext = document.getElementById('beersNext');
  if (beersTrack && beersPrev && beersNext) {
    const cardStep = () => {
      const card = beersTrack.querySelector('.beer-card');
      const gap = parseFloat(getComputedStyle(beersTrack).gap) || 20;
      return card ? card.offsetWidth + gap : 300;
    };
    const updateArrows = () => {
      const max = beersTrack.scrollWidth - beersTrack.clientWidth - 2;
      beersPrev.disabled = beersTrack.scrollLeft <= 2;
      beersNext.disabled = beersTrack.scrollLeft >= max;
    };
    beersPrev.addEventListener('click', () => {
      beersTrack.scrollBy({ left: -cardStep(), behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    beersNext.addEventListener('click', () => {
      beersTrack.scrollBy({ left: cardStep(), behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    beersTrack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  // ---------- Brewery Trail tabs ----------
  const trailData = {
    fremantle: {
      label: 'Fremantle',
      blurb: "The cradle of Australian craft beer. Cobblestone laneways, converted warehouses and a working port set the scene for WA's original brewing revolution.",
      names: 'Little Creatures · Otherside Brewing · The Monk'
    },
    swanvalley: {
      label: 'Swan Valley',
      blurb: "Twenty-five minutes from the CBD, vineyards give way to mash tuns. WA's oldest wine region quietly became its brewing heartland too.",
      names: "Feral Brewing · Mash Brewing · Elmar's in the Valley"
    },
    innercity: {
      label: 'Inner City',
      blurb: 'Laneway bars and warehouse taprooms tucked inside the CBD grid, pouring late into the night, most nights of the week.',
      names: 'Nowhereman Brewing · Northbridge Brewing Co · Blasta Brewing'
    }
  };

  const trailTabs = document.querySelectorAll('#trail [role="tab"]');
  const trailPanel = document.getElementById('trailPanel');

  function renderTrail(region) {
    const data = trailData[region];
    trailPanel.style.opacity = 0;
    setTimeout(() => {
      trailPanel.innerHTML =
        '<p class="font-display font-bold text-roast mb-2">' + data.label + '</p>' +
        '<p class="font-body text-roast/65 text-sm mb-3">' + data.blurb + '</p>' +
        '<p class="font-text text-[11px] uppercase tracking-wide text-amber-600">' + data.names + '</p>';
      trailPanel.style.opacity = 1;
    }, prefersReduced ? 0 : 150);
  }

  trailTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      trailTabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      trailPanel.setAttribute('aria-labelledby', tab.id);
      renderTrail(tab.dataset.region);
    });
  });
  renderTrail('fremantle');

  // ---------- Swan Valley trail map pins + tooltip ----------
  const swanValleyTrail = {
    1: { name: 'Homestead Brewery', place: 'Caversham · Mandoon Estate', bestFor: 'Best for: breakfast & a refined vibe' },
    2: { name: 'Mash Brewing', place: 'Henley Brook', bestFor: 'Best for: award-winning IPAs & a pub lunch' },
    3: { name: 'Funk Brewshed', place: 'Henley Brook', bestFor: 'Best for: wild ferments, cider & non-beer drinkers' },
    4: { name: 'Txoko Brewing', place: 'Baskerville', bestFor: 'Best for: rustic charm & wood-fired pizzas' },
    5: { name: 'Baskerville Tavern', place: 'Baskerville · home of Slumdog Brewing', bestFor: "Best for: the final icon — Feral's Biggie Juice & Hop Hog, still on tap" }
  };

  const tooltip = document.getElementById('mapTooltip');
  const tooltipTitle = document.getElementById('mapTooltipTitle');
  const tooltipBlurb = document.getElementById('mapTooltipBlurb');
  const tooltipNames = document.getElementById('mapTooltipNames');
  let activePin = null;

  function showTooltip(pin) {
    const data = swanValleyTrail[pin.dataset.stop];
    tooltipTitle.textContent = data.name;
    tooltipBlurb.textContent = data.place;
    tooltipNames.textContent = data.bestFor;
    tooltip.style.top = pin.style.top;
    tooltip.style.left = pin.style.left;
    const leftPct = parseFloat(pin.style.left);
    tooltip.style.transform = leftPct > 55 ? 'translate(-100%, -120%)' : 'translate(0%, -120%)';
    tooltip.classList.remove('hidden');
    activePin = pin;
  }
  function hideTooltip() {
    tooltip.classList.add('hidden');
    activePin = null;
  }

  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('mouseenter', () => showTooltip(pin));
    pin.addEventListener('focus', () => showTooltip(pin));
    pin.addEventListener('mouseleave', hideTooltip);
    pin.addEventListener('blur', hideTooltip);
    pin.addEventListener('click', (e) => {
      e.preventDefault();
      activePin === pin ? hideTooltip() : showTooltip(pin);
    });
  });
  document.addEventListener('click', (e) => {
    if (activePin && !e.target.closest('.map-pin')) hideTooltip();
  });

  // ---------- Subscribe form (front-end only — wire to your email provider) ----------
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeMsg = document.getElementById('subscribeMsg');
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('subscribeEmail');
    if (input.checkValidity()) {
      subscribeMsg.textContent = "Thanks — check your inbox to confirm.";
      input.value = '';
    } else {
      subscribeMsg.textContent = 'Please enter a valid email address.';
      subscribeMsg.classList.add('text-amber-400');
    }
  });
