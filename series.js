'use strict';
// CaseToPass landing: cold open, the week clock, the decision moment (BE3 from the frozen bank, read-only) and the cast loops.
(() => {
  // still = the system asks for reduced motion or the visitor paused it; both give the static page
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, calm = reduce.matches;
  const phone = matchMedia('(max-width: 760px)');
  // while still, any reveal that starts lands on its final frame at once
  const A = typeof anime === 'function' && !calm ? Object.assign(o => anime(calm ? { ...o, duration: 0, delay: 0 } : o), anime) : null;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  if (A) document.documentElement.classList.add('js-motion');

  /* ---------- header ---------- */
  const bar = $('#bar');
  const onScrollBar = () => bar.classList.toggle('is-solid', scrollY > 40);

  /* ---------- the week clock: Mon 09:00 → Fri 10:00 in working hours ---------- */
  const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
  const DAY = 600, TOTAL = 4 * DAY + 60;
  const week = $('#week'), fill = $('#weekFill'), time = $('#weekTime');
  let bonus = 0;
  const hero = $('#top');
  function clock() {
    // the floating clock steps aside where the page itself is the clock: the week board and the council
    const onStage = el => { const b = el && el.getBoundingClientRect(); return !!b && b.top < innerHeight * .5 && b.bottom > innerHeight * .5; };
    // and while a text field has focus, so the bar never sits on the field or the on-screen keyboard
    const typing = document.activeElement && document.activeElement.matches('textarea, input');
    // and over the cast row, whose cards are tap targets right where the bar sits
    const atBottom = el => { const b = el && el.getBoundingClientRect(); return !!b && b.top < innerHeight && b.bottom > innerHeight - 90; };
    week.classList.toggle('is-away', typing || atBottom($('#cast')) || scrollY < hero.offsetHeight * .55 || onStage($('#week-run')) || onStage($('.finale')));
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const m = Math.min(TOTAL, p * TOTAL + bonus);
    const d = Math.min(4, Math.floor(m / DAY));
    const within = Math.min(m - d * DAY, d === 4 ? 60 : DAY);
    const mins = 9 * 60 + Math.round(within);
    time.textContent = `${DAYS[d]} ${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    fill.style.width = `${((d + within / DAY) / 5) * 100}%`;
  }
  // story time only: the scene moves the week once, whatever the answer and however often it is replayed
  function tick(minutes) {
    bonus = minutes;
    clock();
    week.classList.remove('is-tick'); void week.offsetWidth; week.classList.add('is-tick');
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; onScrollBar(); clock(); }); }, { passive: true });
  addEventListener('resize', clock);
  addEventListener('focusin', clock);
  addEventListener('focusout', () => setTimeout(clock));
  onScrollBar(); clock();

  /* ---------- video helpers ---------- */
  function playWhenReady(video, src) {
    if (calm || !video) return;
    if (src && video.getAttribute('src') !== src) video.src = src;
    video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  /* ---------- cold open ---------- */
  const heroVideo = $('.hero-video');
  playWhenReady(heroVideo, phone.matches ? heroVideo.dataset.tall : heroVideo.dataset.wide);

  /* ---------- split-flap: each character turns over when it changes ---------- */
  function flipper(el) {
    let shown = '';
    return value => {
      if (value === shown) return;
      const cells = [...el.children];
      if (!cells.length || cells.length !== value.length) {
        el.innerHTML = [...value].map(c => `<span class="fc"><span>${c === ' ' ? '&nbsp;' : esc(c)}</span></span>`).join('');
      } else if (!calm) {
        [...value].forEach((c, i) => {
          if (shown[i] === c) return;
          const cell = cells[i];
          cell.firstChild.textContent = c;
          cell.classList.remove('is-flip'); void cell.offsetWidth; cell.classList.add('is-flip');
        });
      } else [...value].forEach((c, i) => { cells[i].firstChild.textContent = c; });
      shown = value;
    };
  }

  /* ---------- cold open: black shutters, the clock turns to 09:00, the week begins ---------- */
  if (A && !location.hash) {
    const card = document.createElement('div');
    card.className = 'titlecard';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<div class="lb lb-top"></div><div class="lb lb-bot"></div><div class="slate"><p>Northline Media · проект Trend Radar</p><span class="flip" id="slateClock"></span><p><em>Серия 01</em> · Пятница уже в календаре</p></div><p class="skiphint">Нажмите, чтобы пропустить</p>';
    document.body.append(card);
    const slateFlip = flipper($('#slateClock', card));
    slateFlip('ПН 08:58');
    const lines = $$('h1 .line > span');
    lines.forEach(l => { l.innerHTML = [...l.textContent].map(c => c === ' ' ? ' ' : `<span class="ch">${esc(c)}</span>`).join(''); });
    const chars = $$('h1 .ch');
    const said = $('.hero-sub .said');
    said.innerHTML = said.textContent.split(' ').map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    const words = $$('.hero-sub .w');
    const rest = ['.kicker', '.h1-pre', '.lede', '.hero-actions', '.fine'].map(sel => $(`.hero ${sel}`)).filter(Boolean);
    const media = $('.hero-media');
    A.set(chars, { translateY: '115%', rotate: 6 });
    A.set([...rest, $('.hero-sub .who'), ...words], { opacity: 0, translateY: 14 });
    A.set(media, { scale: 1.16 });
    const t1 = setTimeout(() => slateFlip('ПН 08:59'), 650);
    const t2 = setTimeout(() => slateFlip('ПН 09:00'), 1250);
    const tl = A.timeline({ easing: 'easeOutExpo' })
      .add({ targets: $$('.slate > *', card), opacity: [0, 1], translateY: [12, 0], duration: 700, delay: A.stagger(120) })
      .add({ targets: [...$$('.slate > *', card), $('.skiphint', card)], opacity: 0, duration: 400, delay: 1000, easing: 'easeInQuad' })
      .add({ targets: $('.lb-top', card), translateY: '-100%', duration: 1300, easing: 'easeInOutExpo' })
      .add({ targets: $('.lb-bot', card), translateY: '100%', duration: 1300, easing: 'easeInOutExpo' }, '-=1300')
      .add({ targets: media, scale: 1, duration: 2600, easing: 'easeOutCubic' }, '-=1300')
      .add({ targets: chars, translateY: ['115%', '0%'], rotate: [6, 0], duration: 1000, delay: A.stagger(28) }, '-=2300')
      .add({ targets: rest, opacity: [0, 1], translateY: [14, 0], duration: 800, delay: A.stagger(90) }, '-=900')
      .add({ targets: [$('.hero-sub .who'), ...words], opacity: [0, 1], translateY: [14, 0], duration: 500, delay: A.stagger(70) }, '-=900');
    tl.finished.then(() => card.remove());
    const skip = () => {
      clearTimeout(t1); clearTimeout(t2);
      tl.seek(tl.duration); card.remove();
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(e => removeEventListener(e, skip));
    };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(e => addEventListener(e, skip, { passive: true }));
    // Never leave the visitor behind the shutters.
    setTimeout(skip, 7000);
  }

  /* ---------- the week in one scroll: the board turns from Mon 09:00 to Fri 10:00 ---------- */
  const run = $('#week-run');
  if (run && A) {
    const dayFlip = flipper($('#wrDay')), timeFlip = flipper($('#wrTime'));
    const days = $$('.wr-day', run), shots = $$('.wr-shot', run), track = $('#wrTrack'), rule = $('#wrFill');
    const NAMES = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'], WORK = 540, END = 4 * WORK + 60;
    let lastDay = -1;
    function board() {
      const r = run.getBoundingClientRect();
      const span = run.offsetHeight - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      // the last stretch of scroll holds Friday 10:00, so the council is seen, not skipped
      const m = Math.min(END, (p / .86) * END);
      const d = Math.min(4, Math.floor(m / WORK));
      const within = d === 4 ? Math.min(60, m - 4 * WORK) : m - d * WORK;
      const mins = 9 * 60 + Math.floor(within / 15) * 15;
      dayFlip(NAMES[d]);
      timeFlip(`${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`);
      if (d !== lastDay) { days.forEach((el, i) => el.classList.toggle('is-on', i === d)); lastDay = d; }
      run.classList.toggle('is-council', d === 4);
      // two cases a day, the council on Friday: the same mapping the simulator uses
      const c = d === 4 ? 7.5 : d * 2 + (within / WORK) * 2;
      shots.forEach((sh, i) => { sh.classList.toggle('is-on', d < 4 && Math.floor(c) === i); sh.classList.toggle('is-done', i < Math.floor(c) || d === 4); });
      const step = shots[0].offsetWidth + 10;
      const maxShift = Math.max(0, track.scrollWidth - track.parentNode.clientWidth);
      track.style.transform = `translateX(${-Math.min(maxShift, Math.max(0, (c - .5) * step - track.parentNode.clientWidth / 2 + step / 2))}px)`;
      rule.style.width = `${Math.min(100, (m / END) * 100)}%`;
    }
    let rraf = 0;
    addEventListener('scroll', () => { if (!rraf) rraf = requestAnimationFrame(() => { rraf = 0; board(); }); }, { passive: true });
    addEventListener('resize', board);
    board();
  }

  /* ---------- how it works: the sticky frame follows the step in view ---------- */
  const frames = $$('.stage-frame');
  const steps = $$('.how-step');
  const noteText = $('.stage-note .note-text');
  const NOTE = 'Сначала я… потому что…';
  let typed = false;
  function typeNote() {
    if (typed || calm) return;
    typed = true;
    let i = 0;
    noteText.textContent = '';
    const caret = document.createElement('span'); caret.className = 'caret';
    const t = setInterval(() => {
      noteText.textContent = calm ? NOTE : NOTE.slice(0, ++i);
      if (calm) i = NOTE.length;
      noteText.append(caret);
      if (i >= NOTE.length) clearInterval(t);
    }, 70);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const n = Number(e.target.dataset.step);
        steps.forEach(s => s.classList.toggle('is-on', s === e.target));
        frames.forEach(f => f.classList.toggle('is-on', Number(f.dataset.frame) === n));
        if (n === 1) typeNote();
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  } else steps.forEach(s => s.classList.add('is-on'));

  /* ---------- the decision moment ---------- */
  const scene = $('#scene');
  const q = typeof CONTENT !== 'undefined' && CONTENT.lessons ? CONTENT.lessons.find(l => l.lessonId === 'DEMO') : null;
  const desk = $('#desk'), move = $('#move'), field = $('#firstMove'), commit = $('#commitMove');
  const choices = $('#choices'), verdict = $('#verdict');
  if (!q) {
    desk.innerHTML = '<p class="stem">Не удалось загрузить демо-сцену. Обновите страницу.</p><a class="btn" href="#pilot">Записаться в пилот <span aria-hidden="true">→</span></a>';
  } else {
    // The bank's «репетиция» is the run-through before Friday's demonstration; the landing calls it «прогон демо».
    // BE3 only uses «до репетиции», so the genitive comes first; the bank itself is untouched.
    // only the character's line is restaged for the landing story; graded fields stay verbatim from CONTENT
    const demo = v => String(v ?? '').replace(/репетиции/g, 'прогона демо').replace(/репетици[яюей]+/g, 'прогон демо').replace(/Репетици[яиюей]+/g, 'Прогон демо');
    $('#stem').textContent = q.stem;
    $('#sceneLine').textContent = demo(q.line);
    let first = '', order = [];
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const ready = () => field.value.trim().length >= 10;
    field.addEventListener('input', () => { commit.disabled = !ready(); });

    commit.addEventListener('click', () => {
      if (!ready()) return;
      first = field.value.trim();
      order = shuffle([0, 1, 2, 3]);
      move.hidden = true;
      choices.hidden = false;
      choices.classList.remove('is-frozen');
      clearTimeout(pending); pending = 0; decided = false;
      choices.innerHTML = `<div class="moved"><b>Ваш ход записан</b><p>${esc(first)}</p></div>
        <p class="ask" id="askChoice">Теперь выберите первый шаг из вариантов</p>
        ${order.map((i, p) => `<button type="button" class="choice" data-i="${i}"><span class="letter">${'ABCD'[p]}</span><span>${esc(q.options[i])}</span></button>`).join('')}`;
      const buttons = $$('.choice', choices);
      buttons.forEach(b => b.addEventListener('click', () => decide(Number(b.dataset.i), b)));
      if (A) A({ targets: [$('.moved', choices), $('.ask', choices), ...buttons], opacity: [0, 1], translateY: [16, 0], duration: 700, delay: A.stagger(80), easing: 'easeOutExpo' });
      $('#askChoice').setAttribute('tabindex', '-1');
      $('#askChoice').focus({ preventScroll: true });
    });

    // One decision per play: the first activation wins, whether by pointer, Enter or Space.
    let decided = false, pending = 0;
    function decide(i, button) {
      if (decided) return;
      decided = true;
      choices.classList.add('is-frozen');
      button.classList.add('is-picked');
      $$('.choice', choices).forEach(b => { b.disabled = true; if (b !== button) b.setAttribute('aria-hidden', 'true'); });
      button.setAttribute('aria-pressed', 'true');
      // The held breath: the other options sink, the clock moves, then the room answers.
      pending = setTimeout(() => {
        pending = 0;
        tick(140);
        scene.classList.add('is-reacting');
        const hit = i === q.key;
        verdict.innerHTML = `
          <p class="react"><small>Реакция на ваш выбор</small>${esc(q.reaction[i])}</p>
          <h3><span class="mark${hit ? '' : ' is-other'}" aria-hidden="true"></span>${hit ? 'Ваш выбор совпал с авторским разбором' : 'Авторский разбор выбирает другой ход'}</h3>
          <p>${esc(q.why[i])}</p>
          ${hit ? '' : `<p><b>Авторский разбор выбирает этот ход:</b> ${esc(q.options[q.key])}</p><p>${esc(q.why[q.key])}</p>`}
          <p class="fact"><b>Решающий факт</b>${esc(q.fact)}</p>
          <p class="rule">${esc(q.rule)}</p>
          <details class="all-why" open><summary>Почему так: разбор всех вариантов</summary>${order.map((k, p) => `<p><b>${'ABCD'[p]}. ${esc(q.options[k])}</b>${k === q.key ? ' <small>ход авторского разбора</small>' : ''}<br>${esc(q.why[k])}</p>`).join('')}</details>
          <p class="hint">В тренажёре за каждой сценой идёт та же тема в других условиях, и граница правила видна на обеих.</p>
          <div class="actions">
            <a class="btn" href="#pilot">Записаться в пилот <span aria-hidden="true">→</span></a>
            <button type="button" class="ghost" id="replay">Сыграть сцену заново</button>
          </div>
          <p class="hint">Авторский черновик: ответы и объяснения ещё должны проверить эксперты.</p>`;
        verdict.hidden = false;
        $('#replay').addEventListener('click', reset);
        if (A) A({ targets: [...verdict.children], opacity: [0, 1], translateY: [14, 0], duration: 800, delay: A.stagger(110, { start: 200 }), easing: 'easeOutExpo' });
        const h = $('h3', verdict); h.tabIndex = -1; h.focus({ preventScroll: true });
      }, calm ? 0 : 380);
    }

    function reset() {
      clearTimeout(pending); pending = 0; decided = false;
      scene.classList.remove('is-reacting');
      verdict.hidden = true; verdict.innerHTML = '';
      choices.hidden = true; choices.innerHTML = '';
      move.hidden = false;
      field.value = first; commit.disabled = !ready();
      field.focus();
    }
  }

  /* ---------- cast: each portrait comes alive on hover, focus or tap ---------- */
  const people = $$('.person');
  function live(person, on) {
    const v = $('video', person);
    if (calm || !v || !v.dataset.src) return;
    if (on) {
      if (!v.getAttribute('src')) v.src = v.dataset.src;
      const p = v.play(); if (p && p.catch) p.catch(() => {});
      person.classList.add('is-live');
    } else {
      v.pause();
      person.classList.remove('is-live');
    }
  }
  people.forEach(person => {
    const btn = $('.person-btn', person);
    btn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') live(person, true); });
    btn.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') live(person, false); });
    btn.addEventListener('focus', () => live(person, true));
    btn.addEventListener('blur', () => live(person, false));
    btn.addEventListener('click', () => live(person, !person.classList.contains('is-live')));
  });
  if (matchMedia('(pointer: coarse)').matches && 'IntersectionObserver' in window) {
    const row = $('.cast-row');
    const io = new IntersectionObserver(es => es.forEach(e => live(e.target, e.intersectionRatio > .85)), { root: row, threshold: [0, .85, 1] });
    people.forEach(p => io.observe(p));
  }

  /* ---------- finale loop plays only while on screen ---------- */
  const fv = $('.finale-media video');
  let finOn = false, heroOn = true;
  if (fv && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      finOn = e.isIntersecting;
      if (finOn) playWhenReady(fv, fv.dataset.src); else fv.pause();
    }, { rootMargin: '200px 0px' }).observe($('.finale'));
  }
  if (heroVideo && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (calm) return; if (heroOn) heroVideo.play().catch(() => {}); else heroVideo.pause(); }).observe($('.hero'));
  }

  /* ---------- one pause for all motion; sound and the week clock are not part of it ---------- */
  const motionBtn = $('#motionToggle');
  function still() {
    calm = reduce.matches || paused;
    document.documentElement.classList.toggle('is-still', calm);
    motionBtn.hidden = reduce.matches;
    $('.bm-text', motionBtn).textContent = paused ? 'Продолжить анимацию' : 'Остановить анимацию';
    motionBtn.setAttribute('aria-pressed', String(paused));
    if (calm) {
      $$('video').forEach(v => v.pause());
      people.forEach(p => p.classList.remove('is-live'));
      if (typeof anime === 'function') anime.running.slice().forEach(a => a.seek(a.duration));
    } else {
      if (heroOn) playWhenReady(heroVideo, phone.matches ? heroVideo.dataset.tall : heroVideo.dataset.wide);
      if (finOn) playWhenReady(fv, fv.dataset.src);
    }
  }
  motionBtn.addEventListener('click', () => { paused = !paused; still(); });
  reduce.addEventListener('change', still);
  still();

  /* ---------- section reveals ---------- */
  if (A && 'IntersectionObserver' in window) {
    // titles rise word by word out of a mask
    const titles = $$('.how-head h2, .cast-head h2, .eps-head h2, .film-head h2, .faq h2');
    titles.forEach(h => {
      [...h.childNodes].forEach(n => {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        const frag = document.createElement('span');
        frag.innerHTML = n.textContent.split(/(\s+)/).map(w => /^\s+$/.test(w) || !w ? w : `<span class="wm"><span>${esc(w)}</span></span>`).join('');
        n.replaceWith(...frag.childNodes);
      });
      A.set($$('.wm > span', h), { translateY: '105%' });
    });
    const heads = $$('.how-head p, .cast-head p, .eps-head p, .film-head p, .finale-copy .kicker, .finale-copy > p:not(.kicker), .finale .hero-actions, .ep, .pair, .pair-legend');
    heads.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (e.target.tagName === 'H2') {
        A({ targets: $$('.wm > span', e.target), translateY: ['105%', '0%'], duration: 1100, delay: A.stagger(70), easing: 'easeOutExpo' });
        return;
      }
      A({ targets: e.target, opacity: [0, 1], translateY: [28, 0], duration: 900, easing: 'easeOutExpo', delay: e.target.classList.contains('pair') ? [...e.target.parentNode.children].indexOf(e.target) * 70 : 0 });
    }), { rootMargin: '0px 0px -12% 0px' });
    [...titles, ...heads].forEach(el => io.observe(el));

    // the finale clock counts the last minutes to the council
    const fin = $('#finClock'), word = $('.fin-word');
    const finFlip = flipper(fin);
    finFlip('09:57');
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      ['09:58', '09:59', '10:00'].forEach((v, i) => setTimeout(() => finFlip(v), 500 + i * 520));
      setTimeout(() => word.classList.add('is-on'), 500 + 3 * 520 + 150);
    }, { threshold: .5 }).observe($('.finale'));
  }
})();
