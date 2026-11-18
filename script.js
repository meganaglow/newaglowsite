/* Aglow Studios — small interactions. No dependencies. */
(() => {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Starfields: scatter tiny twinkling stars inside [data-starfield="n"]
  $$('[data-starfield]').forEach(field => {
    const n = Math.min(+field.dataset.starfield || 8, 30);
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = (Math.random() * 96 + 2).toFixed(1) + '%';
      s.style.top = (Math.random() * 84 + 8).toFixed(1) + '%';
      s.style.setProperty('--sz', (4 + Math.random() * 7).toFixed(0) + 'px');
      s.style.setProperty('--dur', (3 + Math.random() * 4).toFixed(1) + 's');
      s.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
      field.append(s);
    }
  });

  // Footer year
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Navigation: solid background after scrolling
  const header = $('.site-header');
  if (header && !header.classList.contains('site-header--light')) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll reveal
  const reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Layered composition: layers shift slightly with the pointer (desktop only)
  const layers = $('.layers');
  if (layers && !reduced && matchMedia('(hover: hover) and (min-width: 900px)').matches) {
    const zone = layers.closest('section') || layers;
    zone.addEventListener('pointermove', e => {
      const r = zone.getBoundingClientRect();
      zone.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1) + 'px');
      zone.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 16).toFixed(1) + 'px');
    });
    zone.addEventListener('pointerleave', () => {
      zone.style.setProperty('--px', '0px');
      zone.style.setProperty('--py', '0px');
    });
  }

  // Hero: a short trail of stars follows the cursor (mouse only)
  const hero = $('.hero');
  if (hero && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let last = 0, lx = 0, ly = 0;
    hero.addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 70 || Math.hypot(e.clientX - lx, e.clientY - ly) < 28) return;
      last = now; lx = e.clientX; ly = e.clientY;
      const r = hero.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'sparkle sparkle--trail';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      s.style.setProperty('--sz', (8 + Math.random() * 9).toFixed(0) + 'px');
      s.style.setProperty('--rot', (Math.random() * 120 - 60).toFixed(0) + 'deg');
      hero.append(s);
      s.addEventListener('animationend', () => s.remove());
    });
  }

  // A small burst of stars from an element (used when the chat opens)
  const burst = el => {
    if (reduced) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.random() * .4;
      const d = 40 + Math.random() * 30;
      const s = document.createElement('span');
      s.className = 'sparkle sparkle--burst';
      s.style.left = (r.left + r.width * .2) + 'px';
      s.style.top = (r.top + r.height / 2) + 'px';
      s.style.setProperty('--sz', (7 + Math.random() * 7).toFixed(0) + 'px');
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
      document.body.append(s);
      s.addEventListener('animationend', () => s.remove());
    }
  };

  // ----- Scripted concierge demo -----
  // These are example conversations, not a live AI. A real assistant needs a
  // server-side function; see CLAUDE.md "AI demos".
  const SCRIPTS = {
    salon: {
      name: 'Salon concierge',
      hello: 'Hello! I can answer questions and help you book. What can I do for you?',
      qa: [
        ['Do you have Saturday openings?', 'Example reply: Saturday has openings at 10:30 and 2:00. Shall I hold one for you?'],
        ['How long does a color appointment take?', 'Example reply: Most color appointments take two to three hours. I can check with your stylist for a closer estimate.'],
        ['Can I reschedule my appointment?', 'Example reply: Of course. Tell me the name on the booking and I will show you the next available times.']
      ]
    },
    medspa: {
      name: 'Medspa concierge',
      hello: 'Welcome. I can explain treatments and book a consultation. How can I help?',
      qa: [
        ['Which treatment is right for me?', 'Example reply: I can ask three quick questions about your goals, then suggest which consultation to book. Ready?'],
        ['How do I prepare for my visit?', 'Example reply: I will send your preparation steps by text and a reminder the day before.'],
        ['Book a consultation', 'Example reply: Consultations are open Tuesday and Thursday afternoons. Which suits you?']
      ]
    },
    planner: {
      name: 'Planner concierge',
      hello: 'Hello! Tell me about your event and I will check availability.',
      qa: [
        ['Are you available next June?', 'Example reply: Two June weekends are still open. What date are you considering?'],
        ['What do your packages include?', 'Example reply: I can walk you through each package and send a summary to your inbox.'],
        ['Can I get a rough estimate?', 'Example reply: Yes. Share your guest count and venue type and I will prepare an estimate for the planner to confirm.']
      ]
    },
    nonprofit: {
      name: 'Nonprofit concierge',
      hello: 'Hello! I can help you give, volunteer or find services.',
      qa: [
        ['How can I volunteer?', 'Example reply: Tell me which days you are free and I will match you with open shifts.'],
        ['Where does my donation go?', 'Example reply: I can show how each giving level is used and send you the latest impact summary.'],
        ['Do I qualify for services?', 'Example reply: I can go through the eligibility questions with you now. It takes about two minutes.']
      ]
    }
  };

  function mountChat(root) {
    const body = $('.chat__body', root);
    const suggest = $('.chat__suggest', root);
    const who = $('.who', root);
    let timer;
    const say = (text, cls) => {
      const b = document.createElement('div');
      b.className = 'bubble ' + cls;
      b.textContent = text;
      body.append(b);
      body.scrollTop = body.scrollHeight;
      return b;
    };
    const load = key => {
      const s = SCRIPTS[key];
      if (!s) return;
      clearTimeout(timer);
      who.textContent = s.name;
      body.replaceChildren();
      suggest.replaceChildren();
      say(s.hello, 'bubble--bot');
      s.qa.forEach(([q, a]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suggest';
        btn.textContent = q;
        btn.addEventListener('click', () => {
          btn.hidden = true;
          say(q, 'bubble--me');
          const typing = document.createElement('div');
          typing.className = 'bubble bubble--bot bubble--typing';
          typing.setAttribute('aria-label', 'Typing');
          typing.innerHTML = '<i></i><i></i><i></i>';
          body.append(typing);
          body.scrollTop = body.scrollHeight;
          timer = setTimeout(() => {
            body.removeChild(typing);
            say(a, 'bubble--bot');
          }, reduced ? 0 : 900);
        });
        suggest.append(btn);
      });
    };
    load(root.dataset.script || 'salon');
    return load;
  }

  // Inline demo with industry tabs
  const demo = $('[data-demo]');
  if (demo) {
    const load = mountChat($('.chat', demo));
    const tabs = $$('.tab', demo);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      load(tab.dataset.script);
    }));
  }

  // Floating action button + floating chat
  const fab = $('.fab');
  const panel = $('.chat--floating');
  if (fab && panel) {
    mountChat(panel);
    const toggle = open => {
      panel.hidden = !open;
      if (open) burst(fab);
      fab.setAttribute('aria-expanded', String(open));
      if (open) $('.chat__close', panel).focus(); else fab.focus();
    };
    fab.addEventListener('click', () => toggle(panel.hidden));
    $('.chat__close', panel).addEventListener('click', () => toggle(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) toggle(false); });
  }
})();
