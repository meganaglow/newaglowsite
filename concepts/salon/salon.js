/* Cuivre Hair Studio concept: small interactions. No dependencies.
   The quiz and concierge are scripted demos, not a live AI (see CLAUDE.md "AI demos"). */
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
  const reveals = $$('.statement > *, .lookbook__head, .menu__group, .match__intro, .book__copy, .visit__grid');
  reveals.forEach(el => el.classList.add('reveal'));
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Lookbook: previous / next buttons; vertical wheel scrolls sideways on desktop
  const track = $('.track');
  if (track) {
    $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
      track.scrollBy({ left: +btn.dataset.scroll * track.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
    }));
  }

  // ----- Stylist-match quiz (scripted) -----
  const STYLISTS = {
    noor: { name: 'Noor', role: 'Color specialist', why: 'Noor paints color by hand for a soft grow-out, so the change looks good for months, not weeks.' },
    theo: { name: 'Theo', role: 'Precision cutting', why: 'Theo cuts dry first to see how your hair actually falls, then refines. Sharp shapes that are easy to wear.' },
    iris: { name: 'Iris', role: 'Texture and curls', why: 'Iris shapes curls and waves one at a time, dry, so the cut works with your natural pattern.' }
  };
  const SERVICES = {
    cut: { polish: 'Signature cut', notice: 'Signature cut', transform: 'Precision bob' },
    color: { polish: 'Gloss', notice: 'Single process', transform: 'Lived-in color' },
    both: { polish: 'Signature cut and gloss', notice: 'Signature cut and single process', transform: 'Signature cut and lived-in color' }
  };
  const match = a => {
    let id;
    if (a.texture === 'curly') id = 'iris';
    else if (a.service === 'cut') id = 'theo';
    else if (a.service === 'color') id = 'noor';
    else if (a.service === 'both') id = a.change === 'polish' ? 'theo' : 'noor';
    else id = a.texture === 'straight' ? 'theo' : 'noor';
    let service = a.service === 'unsure' ? 'Free 20 minute consultation' : SERVICES[a.service][a.change];
    if (a.texture === 'curly' && a.service === 'cut') service = 'Curl cut';
    return { ...STYLISTS[id], service };
  };

  let bookWith = null;
  const quiz = $('[data-quiz]');
  if (quiz) {
    const steps = $$('.q', quiz);
    const result = $('[data-result]', quiz);
    const back = $('[data-back]', quiz);
    const bar = $('.progress', quiz);
    let step = 0;
    const show = i => {
      step = i;
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
      result.hidden = i < steps.length;
      back.hidden = i === 0 || i >= steps.length;
      bar.style.setProperty('--p', (Math.min(i, steps.length) / steps.length * 100) + '%');
      bar.parentElement.hidden = i >= steps.length;
    };
    let answers = {};
    const unpress = el => $$('.opts button', el).forEach(b => b.setAttribute('aria-pressed', 'false'));
    unpress(quiz);
    quiz.addEventListener('click', e => {
      const btn = e.target.closest('.opts button');
      if (!btn) return;
      answers[btn.dataset.name] = btn.value;
      unpress(btn.parentElement);
      btn.setAttribute('aria-pressed', 'true');
      const next = step + 1;
      setTimeout(() => {
        if (next < steps.length) {
          show(next);
          $('button', steps[next]).focus({ preventScroll: true });
        } else {
          const r = match(answers);
          bookWith = r;
          $('[data-r-initial]', quiz).textContent = r.name[0];
          $('[data-r-name]', quiz).textContent = r.name;
          $('[data-r-role]', quiz).textContent = r.role;
          $('[data-r-why]', quiz).textContent = r.why;
          $('[data-r-service]', quiz).textContent = r.service;
          $('[data-r-first]', quiz).textContent = r.name;
          show(steps.length);
          result.focus({ preventScroll: true });
        }
      }, reduced ? 0 : 260);
    });
    back.addEventListener('click', () => show(Math.max(0, step - 1)));
    $('[data-restart]', quiz).addEventListener('click', () => {
      answers = {}; unpress(quiz); bookWith = null; show(0); $('button', steps[0]).focus();
    });
    $('[data-r-book]', quiz).addEventListener('click', () => startConcierge(bookWith));
    show(0);
  }

  // ----- Booking concierge (scripted) -----
  // Each node: the concierge's reply and the follow-up suggestions it offers.
  const NODES = {
    start: {
      say: "Hi, I'm the Cuivre concierge. I can answer questions or find you a time.",
      next: ['saturday', 'length', 'curls', 'move']
    },
    saturday: { ask: 'Do you have anything Saturday?', say: 'Saturday has two openings: 10:30 with Theo and 2:00 with Noor. Shall I hold one?', next: ['hold1030', 'hold200', 'length'] },
    length: { ask: 'How long does color take?', say: 'Most color takes two to three hours. A gloss is about 45 minutes. I can ask your stylist for a closer estimate before you come in.', next: ['saturday', 'curls'] },
    curls: { ask: 'I have curly hair. Who should I see?', say: 'Iris cuts curls dry, one at a time. Her next opening is Thursday at 11:00. Want it?', next: ['holdthu', 'saturday'] },
    move: { ask: 'Can I move my appointment?', say: 'Of course. Tell me the name on the booking and I will show you the next open times with the same stylist.', next: ['saturday'] },
    hold1030: { ask: 'Hold Saturday 10:30', say: held('Saturday at 10:30 with Theo') },
    hold200: { ask: 'Hold Saturday 2:00', say: held('Saturday at 2:00 with Noor') },
    holdthu: { ask: 'Yes, Thursday 11:00', say: held('Thursday at 11:00 with Iris') },
    matchA: { ask: 'Friday at 1:00', say: '' },
    matchB: { ask: 'Saturday at 2:00', say: '' }
  };
  function held(slot) {
    return `Done. ${slot} is held for 10 minutes. On a live site I would now take your name and number, then text a confirmation and a reminder the day before.`;
  }

  const box = $('[data-concierge]');
  let startConcierge = () => {};
  if (box) {
    const body = $('.concierge__body', box);
    const suggest = $('.concierge__suggest', box);
    let timer;
    const say = (text, cls) => {
      const b = document.createElement('div');
      b.className = 'bubble ' + cls;
      b.textContent = text;
      body.append(b);
      body.scrollTop = body.scrollHeight;
    };
    const offer = keys => {
      suggest.replaceChildren();
      (keys || []).forEach(k => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suggest';
        btn.textContent = NODES[k].ask;
        btn.addEventListener('click', () => go(k));
        suggest.append(btn);
      });
      if (!keys || !keys.length) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suggest';
        btn.textContent = 'Start over';
        btn.addEventListener('click', () => startConcierge(null));
        suggest.append(btn);
      }
    };
    const go = k => {
      const n = NODES[k];
      say(n.ask, 'bubble--me');
      suggest.replaceChildren();
      const typing = document.createElement('div');
      typing.className = 'bubble bubble--bot bubble--typing';
      typing.setAttribute('aria-label', 'Typing');
      typing.innerHTML = '<i></i><i></i><i></i>';
      body.append(typing);
      body.scrollTop = body.scrollHeight;
      clearTimeout(timer);
      timer = setTimeout(() => {
        typing.remove();
        say(n.say, 'bubble--bot');
        offer(n.next);
      }, reduced ? 0 : 900);
    };
    startConcierge = r => {
      clearTimeout(timer);
      body.replaceChildren();
      if (r) {
        NODES.matchA.say = held(`Friday at 1:00 with ${r.name}`);
        NODES.matchB.say = held(`Saturday at 2:00 with ${r.name}`);
        say(`Hi! You matched with ${r.name} for ${r.service.toLowerCase()}. ${r.name}'s next openings are Friday at 1:00 and Saturday at 2:00. Which suits you?`, 'bubble--bot');
        offer(['matchA', 'matchB', 'length']);
      } else {
        say(NODES.start.say, 'bubble--bot');
        offer(NODES.start.next);
      }
    };
    startConcierge(null);
  }
})();
