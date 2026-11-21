/* Olea Spa & Skin Retreat concept: small interactions. No dependencies.
   "Design your day", the online booking and the day concierge are scripted demos, not a live AI
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
    const day = [['10:00 am', 'Arrival', 'Tea, a robe, and a reading of your skin and your mood']];
    day.push(['10:30 am', ...rituals[0]]);
    const cap = t => t[0].toUpperCase() + t.slice(1);
    day.push(['12:00 pm', 'The thermal suite', thermal.length ? `${cap(list(thermal))}, at your own pace` : 'Sauna, steam and red light, at your own pace']);
    day.push(['1:00 pm', 'Lunch in the garden room', 'Light, seasonal, unhurried']);
    const times = ['2:30 pm', '4:00 pm'];
    rituals.slice(1).forEach((r, i) => day.push([times[i], ...r]));
    const hasMeditation = rituals.some(r => r[0] === 'Guided meditation');
    if (a.extras.includes('meditate') && !hasMeditation) day.push([rituals.length > 2 ? '5:00 pm' : '4:00 pm', 'Guided meditation', 'To close the day, in the stillness room']);
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
    $('[data-fbook]', finder).addEventListener('click', () => reserveDesigned(planned));
    show(0);
  }

  // ----- Online booking (scripted) -----
  // Shows how a guest reserves a day. Dates are real (the next 12 days); which
  // dates and times are free is made up. Nothing is sent, saved or charged.
  const booking = $('[data-booking]');
  let reserveDesigned = () => {};
  if (booking) {
    const DAYS = {
      still: { name: 'The Still Day', price: 480 },
      awake: { name: 'The Awake Day', price: 480 },
      thermal: { name: 'Thermal suite and meditation rooms', price: 90 }
    };
    const TIMES = { day: ['9:00 am', '10:00 am', '11:00 am', '1:00 pm'], thermal: ['9:00 am', '11:00 am', '1:00 pm', '3:00 pm', '5:00 pm'] };
    const FULL = [3, 8]; // which of the next 12 days show as fully booked
    const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const part = (d, o) => new Intl.DateTimeFormat('en-US', o).format(d);
    const state = { day: null, guests: 1, date: null, dateIndex: null, time: null };
    const panes = $$('.bk', booking);
    const bar = $$('.booking__steps li', booking);
    const nexts = $$('[data-bk-next]', booking);
    const options = $('[data-options]', booking);
    const datesBox = $('[data-dates]', booking);
    const timesBox = $('[data-times]', booking);
    const form = $('form', booking);
    const error = $('[data-bk-error]', booking);
    let step = 0;

    const guestsText = () => (state.guests === 2 ? 'for two' : 'just you');
    const total = () => '$' + DAYS[state.day].price * state.guests;
    const chosen = () => {
      const bits = [DAYS[state.day].name, guestsText()];
      if (step > 1 && state.date) bits.push(longDate.format(state.date), 'arriving ' + state.time);
      return 'Reserving: ' + bits.join(' · ');
    };
    const show = (i, focus = true) => {
      step = i;
      panes.forEach((p, n) => p.classList.toggle('is-active', n === i));
      bar.forEach((li, n) => { li.classList.toggle('is-on', n === i); li.classList.toggle('is-done', n < i); });
      if (state.day) $$('[data-chosen]', booking).forEach(el => { el.textContent = chosen(); });
      if (focus) $('h3', panes[i]).focus({ preventScroll: true }); // never moves the page
    };

    // Step 1: which day, and for how many
    const pickDay = key => {
      state.day = key;
      $$('.bk-option', options).forEach(o => o.setAttribute('aria-pressed', String(o.dataset.day === key)));
      nexts[0].disabled = false;
      state.time = null; // arrival times differ between a full day and the thermal suite
      renderTimes();
    };
    options.addEventListener('click', e => { const o = e.target.closest('.bk-option'); if (o) pickDay(o.dataset.day); });
    $$('[data-guests]', booking).forEach(c => c.addEventListener('click', () => {
      state.guests = +c.dataset.guests;
      $$('[data-guests]', booking).forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    }));

    // Step 2: date and arrival time
    const now = new Date();
    for (let i = 1; i <= 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const full = FULL.includes(i);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'bk-date'; b.disabled = full;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', longDate.format(d) + (full ? ', fully booked' : ''));
      const wd = document.createElement('small'); wd.textContent = part(d, { weekday: 'short' });
      const num = document.createElement('b'); num.textContent = d.getDate();
      const mo = document.createElement('span'); mo.textContent = full ? 'Full' : part(d, { month: 'short' });
      b.append(wd, num, mo);
      b.addEventListener('click', () => {
        state.date = d; state.dateIndex = i; state.time = null;
        $$('.bk-date', datesBox).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        renderTimes();
      });
      datesBox.append(b);
    }
    function renderTimes() {
      timesBox.replaceChildren();
      nexts[1].disabled = !(state.date && state.time);
      if (!state.day) return;
      if (!state.date) {
        const hint = document.createElement('p');
        hint.className = 'bk-hint'; hint.textContent = 'Choose a date to see arrival times.';
        timesBox.append(hint);
        return;
      }
      TIMES[state.day === 'thermal' ? 'thermal' : 'day'].forEach((t, n) => {
        const taken = (state.dateIndex + n) % 4 === 2;
        const c = document.createElement('button');
        c.type = 'button'; c.className = 'chip'; c.textContent = t; c.disabled = taken;
        c.setAttribute('aria-pressed', String(state.time === t));
        if (taken) c.setAttribute('aria-label', t + ', taken');
        c.addEventListener('click', () => { state.time = t; renderTimes(); });
        timesBox.append(c);
      });
    }

    nexts.forEach((n, i) => n.addEventListener('click', () => show(i + 1)));
    $$('[data-bk-back]', booking).forEach(b => b.addEventListener('click', () => show(step - 1)));

    // Step 3: details, then the confirmation
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        error.textContent = 'Please add your name and an email address, like name@example.com.';
        error.hidden = false;
        (name ? form.elements.email : form.elements.name).focus({ preventScroll: true });
        return;
      }
      error.hidden = true;
      const when = longDate.format(state.date);
      $('[data-done-title]', booking).textContent = `Your day is reserved, ${name.split(/\s+/)[0]}.`;
      const rows = [['Day', DAYS[state.day].name], ['Guests', state.guests === 2 ? 'Two' : 'One'], ['Date', when], ['Arrival', state.time], ['Total', total() + ' (sample price)']];
      $('[data-receipt]', booking).replaceChildren(...rows.flatMap(([k, v]) => {
        const dt = document.createElement('dt'); dt.textContent = k;
        const dd = document.createElement('dd'); dd.textContent = v;
        return [dt, dd];
      }));
      $('[data-done-note]', booking).textContent = `On a live site, your confirmation would now be on its way to ${email}, with directions, parking and what to bring.`;
      startConcierge(`${DAYS[state.day].name} is reserved for ${when}, arriving at ${state.time}. Anything you would like to know before you come?`);
      show(3);
    });
    $('[data-bk-restart]', booking).addEventListener('click', () => {
      Object.assign(state, { day: null, guests: 1, date: null, dateIndex: null, time: null });
      $$('.bk-option, .bk-date', booking).forEach(x => x.setAttribute('aria-pressed', 'false'));
      $$('[data-guests]', booking).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.guests === '1')));
      form.reset(); nexts[0].disabled = true; renderTimes(); startConcierge(null); show(0);
    });

    // "Reserve this day" in Design your day: carry the designed day into the booking
    reserveDesigned = plan => {
      if (!plan) return;
      const skip = ['Arrival', 'The thermal suite', 'Lunch in the garden room', 'A note to take home'];
      DAYS.custom = { name: plan.title, price: 480 };
      let o = $('[data-day="custom"]', options);
      if (!o) {
        o = document.createElement('button');
        o.type = 'button'; o.className = 'bk-option'; o.dataset.day = 'custom';
        o.append(document.createElement('strong'), document.createElement('span'), document.createElement('em'));
        options.prepend(o);
      }
      o.children[0].textContent = plan.title + ', as you designed it';
      o.children[1].textContent = plan.day.map(r => r[1]).filter(n => !skip.includes(n)).join(', ') + ', with the thermal suite and lunch';
      o.children[2].textContent = '$480 · Five hours';
      pickDay('custom');
      show(1, false); // the link itself scrolls to the booking; keep focus on it
    };
    renderTimes();
    show(0, false);
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
    startConcierge = greeting => {
      clearTimeout(timer);
      body.replaceChildren();
      say(greeting || 'Hello. I can help you prepare for your day at Olea. What would you like to know?', 'msg--bot');
      offer(['wear', 'alone', 'pace', 'bring']);
    };
    startConcierge(null);
  }
})();
