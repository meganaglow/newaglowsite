/* Sauge Aesthetic Clinic concept: small interactions. No dependencies.
   The treatment finder and visit assistant are scripted demos, not a live AI
   and not medical advice (see CLAUDE.md "AI demos"). */
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
  const reveals = $$('.approach__copy, .approach__img, .course, .finder__intro, .prep__copy, .visit__grid');
  reveals.forEach(el => el.classList.add('reveal'));
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // ----- Treatment finder (scripted) -----
  const TREATMENTS = {
    lines: { name: 'Wrinkle relaxer', why: 'For expression lines on the forehead and around the eyes', injectable: true },
    volume: { name: 'Cheek and jaw contour or lip balancing', why: 'Dermal filler, placed conservatively', injectable: true },
    texture: { name: 'Microneedling or skin booster', why: 'For texture and fine lines over a short course', injectable: false },
    dull: { name: 'Medical-grade peel', why: 'Resurfacing matched to your skin type', injectable: false },
    unsure: { name: 'Skin analysis', why: 'Close-up imaging and a written plan, so you can decide without pressure', injectable: false }
  };
  const LABELS = { lines: 'fine lines', volume: 'volume and shape', texture: 'skin texture', dull: 'dull skin', unsure: 'where to start' };

  let concerns = [];
  const finder = $('[data-finder]');
  if (finder) {
    const steps = $$('.fq', finder);
    const result = $('[data-fresult]', finder);
    const back = $('[data-fback]', finder);
    const next = $('[data-next]', finder);
    const answers = {};
    let step = 0;
    const show = i => {
      step = i;
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
      result.hidden = i < steps.length;
      back.hidden = i === 0 || i >= steps.length;
    };
    const advance = () => setTimeout(() => {
      if (step + 1 < steps.length) {
        show(step + 1);
        $('.chip', steps[step]).focus({ preventScroll: true });
      } else {
        render();
        show(steps.length);
        result.focus({ preventScroll: true });
      }
    }, reduced ? 0 : 280);

    // Step 1: multi-select
    $$('[data-multi]', finder).forEach(chip => chip.addEventListener('click', () => {
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(on));
      concerns = $$('[data-multi][aria-pressed="true"]', finder).map(c => c.dataset.multi);
      next.disabled = concerns.length === 0;
    }));
    next.addEventListener('click', advance);

    // Steps 2 and 3: single choice, then advance
    $$('[data-one]', finder).forEach(chip => chip.addEventListener('click', () => {
      $$(`[data-one="${chip.dataset.one}"]`, finder).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      answers[chip.dataset.one] = chip.value;
      advance();
    }));

    const render = () => {
      const keys = concerns.includes('unsure') && concerns.length > 1 ? concerns.filter(c => c !== 'unsure') : concerns;
      const list = $('[data-flist]', finder);
      list.replaceChildren(...[{ name: 'Consultation', why: 'Complimentary, 30 minutes. Where every plan starts' }, ...keys.map(k => TREATMENTS[k])].map(t => {
        const li = document.createElement('li');
        const b = document.createElement('strong'); b.textContent = t.name;
        const s = document.createElement('span'); s.textContent = t.why;
        li.append(b, s);
        return li;
      }));
      const anyInjectable = keys.some(k => TREATMENTS[k].injectable);
      let note;
      if (answers.timing === 'soon' && anyInjectable) note = 'With an event in under two weeks, your clinician may suggest a skin treatment now and injectables after the event, so nothing is still settling on the day.';
      else if (answers.timing === 'soon') note = 'Two weeks is enough time for a gentle skin treatment. Your clinician will check timing at the consultation.';
      else if (answers.before === 'no' && anyInjectable) note = 'First time? The consultation covers how injectables work, what they feel like and what the two weeks after look like, before anything is booked.';
      else note = 'Your clinician will build a plan around your goals, and you can take it home to think it over.';
      $('[data-fnote]', finder).textContent = note;
    };

    back.addEventListener('click', () => show(Math.max(0, step - 1)));
    $('[data-frestart]', finder).addEventListener('click', () => {
      $$('.chip', finder).forEach(c => c.setAttribute('aria-pressed', 'false'));
      concerns = []; next.disabled = true; show(0); $('.chip', steps[0]).focus();
    });
    $('[data-fbook]', finder).addEventListener('click', () => startAssistant(concerns));
    show(0);
  }

  // ----- Visit assistant (scripted) -----
  // Replies stay with logistics; anything clinical is handed to a clinician.
  const NODES = {
    before: { ask: 'What should I do before my appointment?', say: 'Once you book, your clinician sends personal prep steps based on your health history. In general: arrive with a clean face, and let us know about any medicines or supplements you take.', next: ['makeup', 'bring', 'long'] },
    makeup: { ask: 'Can I wear makeup?', say: 'Please come without makeup on the area being treated if you can. If not, there is cleanser in every treatment room.', next: ['bring', 'downtime'] },
    long: { ask: 'How long will it take?', say: 'A consultation takes about 30 minutes. Most injectable appointments take 30 to 45 minutes, including time to talk the plan through.', next: ['downtime', 'bring'] },
    bring: { ask: 'What should I bring?', say: 'A photo ID, a list of any medicines and supplements, and your questions. That is all.', next: ['downtime', 'makeup'] },
    downtime: { ask: 'Will there be downtime?', say: 'It depends on the treatment, so your clinician will talk you through it before anything happens. Written aftercare is sent to your phone afterwards.', next: ['other'] },
    other: { ask: 'I have a medical question', say: 'That is one for your clinician. On a live site I would pass your question to them and they would reply before your visit.', next: [] }
  };

  const box = $('[data-assistant]');
  let startAssistant = () => {};
  if (box) {
    const body = $('.assistant__body', box);
    const suggest = $('.assistant__suggest', box);
    let timer;
    const say = (text, cls) => {
      const m = document.createElement('div');
      m.className = 'msg ' + cls;
      m.textContent = text;
      body.append(m);
      body.scrollTop = body.scrollHeight;
    };
    const offer = keys => {
      suggest.replaceChildren();
      const list = keys.length ? keys : ['restart'];
      list.forEach(k => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suggest';
        btn.textContent = k === 'restart' ? 'Start over' : NODES[k].ask;
        btn.addEventListener('click', () => (k === 'restart' ? startAssistant([]) : go(k)));
        suggest.append(btn);
      });
    };
    const go = k => {
      const n = NODES[k];
      say(n.ask, 'msg--me');
      suggest.replaceChildren();
      const typing = document.createElement('div');
      typing.className = 'msg msg--bot msg--typing';
      typing.setAttribute('aria-label', 'Typing');
      typing.innerHTML = '<i></i><i></i><i></i>';
      body.append(typing);
      body.scrollTop = body.scrollHeight;
      clearTimeout(timer);
      timer = setTimeout(() => { typing.remove(); say(n.say, 'msg--bot'); offer(n.next); }, reduced ? 0 : 1000);
    };
    startAssistant = picked => {
      clearTimeout(timer);
      body.replaceChildren();
      if (picked && picked.length) {
        const topics = picked.map(k => LABELS[k]);
        const list = topics.length > 1 ? topics.slice(0, -1).join(', ') + ' and ' + topics.at(-1) : topics[0];
        say(`Hello. You are booking a consultation about ${list}. The next openings are Tuesday at 10:00 and Thursday at 3:30. Once it is confirmed I will send your prep steps. Anything you would like to know first?`, 'msg--bot');
      } else {
        say('Hello. I can help you get ready for your visit. What would you like to know?', 'msg--bot');
      }
      offer(['before', 'makeup', 'long', 'bring']);
    };
    startAssistant([]);
  }
})();
