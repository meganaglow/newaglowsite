/* Olea Spa & Skin Retreat concept: small interactions. No dependencies.
   "Design your day" and the day concierge are scripted demos, not a live AI
   (see CLAUDE.md "AI demos"). Health questions are always handed to a therapist. */
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

  // ----- Design your day (scripted) -----
  // Rituals by mood and focus. "both" takes the awake ritual in the morning
  // and the still ritual in the afternoon.
  const RITUALS = {
    still: {
      body: ['Warm-stone massage', 'Heated basalt and slow, deep pressure'],
      skin: ['The bespoke facial', 'Composed from a close reading of your skin'],
      mind: ['Guided meditation', 'In the stillness room, lights low']
    },
    awake: {
      body: ['Mineral salt scrub', 'Buffed in, rinsed under warm rain'],
      skin: ['Lifting facial', 'Massage that brings colour back to the skin'],
      mind: ['Breathwork', 'In the meditation rooms, windows open']
    }
  };
  const EXTRAS = { sauna: 'cedar sauna', steam: 'eucalyptus steam', light: 'red-light therapy' };
  const TITLES = { still: 'Your Still Day', awake: 'Your Awake Day', both: 'A day of both' };
  const list = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' and ' + arr.at(-1) : arr[0];

  const buildDay = a => {
    const focus = ['body', 'skin', 'mind'].filter(f => a.focus.includes(f)); // body before skin
    let rituals;
    if (a.mood === 'both') {
      const second = focus[1] || (focus[0] === 'mind' ? 'body' : 'mind');
      rituals = [RITUALS.awake[focus[0]], RITUALS.still[second]];
      if (focus[2]) rituals.push(RITUALS.still[focus[2]]);
    } else {
      rituals = focus.map(f => RITUALS[a.mood][f]);
    }
    const thermal = a.extras.filter(x => EXTRAS[x]).map(x => EXTRAS[x]);
    const day = [['10:00', 'Arrival', 'Tea, a robe, and a reading of your skin and your mood']];
    day.push(['10:30', ...rituals[0]]);
    const cap = t => t[0].toUpperCase() + t.slice(1);
    day.push(['12:00', 'The thermal suite', thermal.length ? `${cap(list(thermal))}, at your own pace` : 'Sauna, steam and red light, at your own pace']);
    day.push(['13:00', 'Lunch in the garden room', 'Light, seasonal, unhurried']);
    const times = ['14:30', '16:00'];
    rituals.slice(1).forEach((r, i) => day.push([times[i], ...r]));
    const hasMeditation = rituals.some(r => r[0] === 'Guided meditation');
    if (a.extras.includes('meditate') && !hasMeditation) day.push([rituals.length > 2 ? '17:00' : '16:00', 'Guided meditation', 'To close the day, in the stillness room']);
    day.push(['Before you go', 'A note to take home', 'Everything we used, so the day comes home with you']);
    return { title: TITLES[a.mood], day };
  };

  let planned = null;
  const finder = $('[data-finder]');
  if (finder) {
    const steps = $$('.fq', finder);
    const result = $('[data-fresult]', finder);
    const back = $('[data-fback]', finder);
    const answers = { mood: null, focus: [], extras: [] };
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

    steps.forEach(s => {
      const name = s.dataset.name;
      const next = $('[data-next]', s);
      if (next && name === 'extras') next.disabled = false; // optional step
      $$('.chip', s).forEach(chip => {
        chip.setAttribute('aria-pressed', 'false');
        chip.addEventListener('click', () => {
          if (s.dataset.type === 'one') {
            $$('.chip', s).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
            answers[name] = chip.value;
            advance();
          } else {
            chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
            answers[name] = $$('.chip[aria-pressed="true"]', s).map(c => c.value);
            if (name !== 'extras') next.disabled = answers[name].length === 0;
          }
        });
      });
      if (next) next.addEventListener('click', advance);
    });

    const render = () => {
      planned = buildDay(answers);
      $('[data-ftitle]', finder).textContent = planned.title;
      $('[data-flist]', finder).replaceChildren(...planned.day.map(([t, name, note]) => {
        const li = document.createElement('li');
        const time = document.createElement('span'); time.className = 'fresult__time'; time.textContent = t;
        const b = document.createElement('strong'); b.textContent = name;
        const s = document.createElement('span'); s.textContent = note;
        const text = document.createElement('div'); text.append(b, s);
        li.append(time, text);
        return li;
      }));
    };

    back.addEventListener('click', () => show(Math.max(0, step - 1)));
    $('[data-frestart]', finder).addEventListener('click', () => {
      $$('.chip', finder).forEach(c => c.setAttribute('aria-pressed', 'false'));
      Object.assign(answers, { mood: null, focus: [], extras: [] });
      $$('[data-next]', finder).forEach(n => { n.disabled = n.closest('.fq').dataset.name !== 'extras'; });
      planned = null; show(0); $('.chip', steps[0]).focus();
    });
    $('[data-fbook]', finder).addEventListener('click', () => startConcierge(planned));
    show(0);
  }

  // ----- Day concierge (scripted) -----
  // Replies stay with the experience and logistics; health goes to a therapist.
  const NODES = {
    arrive: { ask: 'When should I arrive?', say: 'Thirty minutes before your first ritual. Time for tea, a robe and a slow walk through the thermal suite before anything begins.', next: ['bring', 'thermal'] },
    bring: { ask: 'What should I bring?', say: 'Only swimwear for the thermal suite. Robes, slippers and everything for the changing rooms are waiting for you.', next: ['wear', 'thermal'] },
    wear: { ask: 'Will I be comfortable in swimwear?', say: 'You are in a soft robe almost all day. Changing rooms are private, and treatments take place with you covered by warm linen. Only the thermal suite calls for swimwear.', next: ['alone', 'pace'] },
    alone: { ask: 'Is it all right to come alone?', say: 'Many guests do, and the day is designed for it. If you would like company, we can reserve a day for two with rituals side by side.', next: ['pace', 'first'] },
    pace: { ask: 'Will the day feel rushed?', say: 'Never. Each ritual has time either side of it, nothing in the thermal suite is timed, and the day ends when you are ready.', next: ['first', 'health'] },
    first: { ask: 'I have never been to a spa', say: 'Then we will walk you through everything when you arrive. Your host shows you around, explains each ritual before it begins, and is never far away.', next: ['thermal', 'health'] },
    thermal: { ask: 'How does the thermal suite work?', say: 'Move between the cedar sauna, eucalyptus steam and red light as you like, with rest and cool water in between. Your host suggests an order when you arrive.', next: ['meditate', 'arrive'] },
    change: { ask: 'Can my day change on the morning?', say: 'It often does. Your skin reading on arrival may change a ritual or two, and the day is rearranged around you.', next: ['meditate', 'arrive'] },
    meditate: { ask: 'Do I need meditation experience?', say: 'None at all. Sessions are guided, short and quiet. You are also welcome simply to lie in the stillness room.', next: ['change', 'health'] },
    health: { ask: 'I have a health question', say: 'That one belongs with our therapists. On a live site I would pass it to them, and they would reply before your visit.', next: [] }
  };

  const box = $('[data-assistant]');
  let startConcierge = () => {};
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
      (keys.length ? keys : ['restart']).forEach(k => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suggest';
        btn.textContent = k === 'restart' ? 'Start over' : NODES[k].ask;
        btn.addEventListener('click', () => (k === 'restart' ? startConcierge(null) : go(k)));
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
    startConcierge = plan => {
      clearTimeout(timer);
      body.replaceChildren();
      if (plan) {
        say(`${plan.title} is held for Saturday, arriving at 10:00. I will send your arrival notes once it is confirmed. Anything you would like to know first?`, 'msg--bot');
      } else {
        say('Hello. I can help you prepare for your day at Olea. What would you like to know?', 'msg--bot');
      }
      offer(['wear', 'alone', 'pace', 'bring']);
    };
    startConcierge(null);
  }
})();
