/* The Ivory Hour concept: small interactions. No dependencies.
   The date check and estimate are a scripted demo, not a live AI or a real calendar
   (see CLAUDE.md "AI demos"). Figures are samples. Nothing is sent or saved. */
(() => {
  document.documentElement.classList.remove('no-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Images not uploaded yet: show the labelled placeholder instead of a broken image.
  $$('.frame img').forEach(img => {
    const miss = () => img.closest('.frame').classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0) miss();
    else img.addEventListener('error', miss);
  });

  // Scroll reveal
  const reveals = $$('.services__list li, .band__line, .date__intro');
  reveals.forEach(el => el.classList.add('reveal'));
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Slow parallax: each collage print drifts at its own rate as the page scrolls (desktop only)
  const prints = $$('[data-collage] .frame');
  if (prints.length && !reduced && matchMedia('(min-width: 960px)').matches) {
    let ticking = false;
    const move = () => {
      const y = Math.min(scrollY, 900);
      prints.forEach(p => p.style.setProperty('--shift', (y * parseFloat(p.dataset.speed)).toFixed(1) + 'px'));
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  }

  // ----- Date check + rough estimate (scripted) -----
  const planner = $('[data-planner]');
  if (!planner) return;
  const panes = $$('.pl', planner);
  const bar = $$('.planner__steps li', planner);
  const nexts = $$('[data-next]', planner);
  const input = $('#pl-date', planner);
  const status = $('[data-status]', planner);
  const alts = $('[data-alts]', planner);
  const held = $('[data-held]', planner);
  const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const state = { date: null, guests: null, setting: null, service: null };
  let step = 0;

  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  input.min = iso(tomorrow);

  // Made-up availability: the 5th, 10th, 15th... of each month show as taken.
  const taken = d => d.getDate() % 5 === 0;

  const show = (i, focus = true) => {
    step = i;
    panes.forEach((p, n) => p.classList.toggle('is-active', n === i));
    bar.forEach((li, n) => { li.classList.toggle('is-on', n === i); li.classList.toggle('is-done', n < i); });
    if (focus) $('h3', panes[i]).focus({ preventScroll: true }); // never moves the page
  };

  const check = () => {
    alts.hidden = true; alts.replaceChildren();
    status.className = 'pl-status';
    state.date = null; nexts[0].disabled = true;
    if (!input.value) { status.textContent = 'Pick a date to check it.'; return; }
    const [y, m, d] = input.value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date < new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())) { status.textContent = 'Please choose a date in the future.'; return; }
    if (taken(date)) {
      status.classList.add('is-taken');
      status.textContent = `${longDate.format(date)} is already taken. These nearby dates are open:`;
      [-1, 1].forEach(off => {
        const alt = new Date(y, m - 1, d + off);
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'chip'; b.textContent = shortDate.format(alt);
        b.addEventListener('click', () => { input.value = iso(alt); check(); nexts[0].focus({ preventScroll: true }); });
        alts.append(b);
      });
      alts.hidden = false;
      return;
    }
    state.date = date;
    status.classList.add('is-open');
    status.textContent = `✓ ${longDate.format(date)} is open.`;
    nexts[0].disabled = false;
  };
  input.addEventListener('change', check);
  input.addEventListener('input', check);

  $$('[data-group]', planner).forEach(group => {
    $$('.chip', group).forEach(chip => chip.addEventListener('click', () => {
      $$('.chip', group).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      state[group.dataset.group] = chip.value;
      nexts[1].disabled = !(state.guests && state.setting && state.service);
    }));
  });

  // Sample fee ranges by service, scaled by guest count and setting. Not real prices.
  const BASE = { 'Full planning & design': [9000, 12000], 'Design & coordination': [5500, 7500], 'Month-of coordination': [2800, 3600] };
  const GUESTS = { 'Under 50': 1, '50 to 100': 1.1, '100 to 150': 1.25, 'Over 150': 1.4 };
  const SETTING = { Garden: 1, Vineyard: 1.05, Coast: 1.05, City: 1 };
  const money = n => '$' + (Math.round(n / 100) * 100).toLocaleString('en-US');

  const render = () => {
    const k = GUESTS[state.guests] * SETTING[state.setting];
    const [lo, hi] = BASE[state.service].map(v => v * k);
    $('[data-r-title]', planner).textContent = `${shortDate.format(state.date)} is open.`;
    const rows = [['Date', longDate.format(state.date)], ['Guests', state.guests], ['Setting', state.setting], ['Service', state.service], ['Our fee, roughly', `${money(lo)} to ${money(hi)}`, 'Sample figures. Planning and design only; venue, food and flowers are separate.']];
    $('[data-r-facts]', planner).replaceChildren(...rows.flatMap(([key, val, note]) => {
      const dt = document.createElement('dt'); dt.textContent = key;
      const dd = document.createElement('dd'); dd.textContent = val;
      if (note) { const s = document.createElement('small'); s.textContent = note; dd.append(s); }
      return [dt, dd];
    }));
    held.hidden = true;
  };

  nexts[0].addEventListener('click', () => show(1));
  nexts[1].addEventListener('click', () => { render(); show(2); });
  $('[data-back]', planner).addEventListener('click', () => show(0));
  $('[data-hold]', planner).addEventListener('click', () => { held.hidden = false; });
  $('[data-restart]', planner).addEventListener('click', () => {
    Object.assign(state, { date: null, guests: null, setting: null, service: null });
    input.value = ''; check();
    $$('.chip', planner).forEach(c => c.setAttribute('aria-pressed', 'false'));
    nexts[1].disabled = true; held.hidden = true; show(0);
  });
  show(0, false);
})();
