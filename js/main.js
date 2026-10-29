/* ==========================================================
   Portfolio — renders every section from /content/*.json
   (those files are what Pages CMS edits).
   ========================================================== */

const CONTENT = {
  profile: 'content/profile.json',
  projects: 'content/projects.json',
  skills: 'content/skills.json',
  awards: 'content/awards.json',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

// Small stroke icons (inherit colour from CSS)
const svg = d => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONS = {
  cap: svg('<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
  trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
  medal: svg('<circle cx="12" cy="15" r="5"/><path d="m8 3 3 7M16 3l-3 7M12 13v4"/>'),
  people: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 2.2 5 5"/>'),
  seminar: svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  learn: svg('<path d="M4 19V5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12"/>'),
  build: svg('<path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12"/>'),
  cert: svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h10M7 12h6"/><circle cx="16.5" cy="17.5" r="2.5"/><path d="m15.5 19.7-.5 2.3 1.5-.8 1.5.8-.5-2.3"/>'),
  network: svg('<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>'),
  data: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  school: svg('<path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-5h4v5"/>'),
  ai: svg('<rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M9 12v1M15 12v1M9.5 16h5M2 12h3M19 12h3"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  github: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'),
  facebook: svg('<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3Z"/>'),
};

let DATA = {};

/* ---------- Boot ---------- */
(async function init() {
  try {
    const entries = await Promise.all(
      Object.entries(CONTENT).map(async ([key, url]) => {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${url} → ${res.status}`);
        const json = await res.json();
        return [key, Array.isArray(json.items) ? json.items : json]; // list files are { "items": [...] }
      })
    );
    DATA = Object.fromEntries(entries);
  } catch (err) {
    console.error('Could not load content:', err);
    document.body.insertAdjacentHTML('afterbegin',
      `<p style="position:fixed;z-index:99;inset:auto 16px 16px;padding:12px 16px;border-radius:10px;background:#3a1717;color:#fff;font:14px system-ui">
        Couldn't load the content files. Open this site through a local server (see README), not by double-clicking index.html.</p>`);
    return;
  }

  bindText();
  renderHero();
  renderGallery();
  renderSkills();
  renderAbout();
  renderAwards();
  renderContact();
  setupChat();
  setupChrome();
})();

/* ---------- Simple text bindings: data-bind="key" / data-bind-src="key" ---------- */
function bindText() {
  const scope = { ...DATA.profile, skills: DATA.skills };
  $$('[data-bind]').forEach(el => {
    const v = get(scope, el.dataset.bind);
    if (v != null) el.textContent = v;
  });
  $$('[data-bind-src]').forEach(el => { el.src = get(scope, el.dataset.bindSrc) || ''; });
  const p = DATA.profile;
  $('[data-bind="initials"]').textContent = (p.first_name[0] + p.last_name[0]).toUpperCase();
  $$('[data-paths]').forEach(ul => { ul.innerHTML = (p.paths || []).map(x => `<li>${esc(x)}</li>`).join(''); });
  document.title = `${p.full_name} · Portfolio`;
  $('#year').textContent = new Date().getFullYear();
}

/* ---------- 1. Hero: running outlined name ---------- */
function renderHero() {
  const name = `${DATA.profile.first_name} ${DATA.profile.last_name}`;
  // Two identical halves so translateX(-50% → 0) loops seamlessly
  $('.marquee-track').innerHTML = Array(4).fill(`<span>${esc(name)}</span>`).join('');
}

/* ---------- 2. Work gallery: swipeable camera-roll ---------- */
function renderGallery() {
  const projects = DATA.projects;
  const stage = $('#rollStage'), dots = $('#rollDots'), info = $('#projectInfo'), roll = $('.roll');
  let active = 0;

  stage.innerHTML = projects.map((p, i) => `
    <figure class="roll-card" data-i="${i}">
      <img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" draggable="false" loading="lazy">
      <figcaption class="badge">${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</figcaption>
    </figure>`).join('');
  dots.innerHTML = projects.map((p, i) => `<button aria-label="Show ${esc(p.title)}"></button>`).join('');
  const cards = $$('.roll-card', stage);

  function layout(drag = 0) {
    cards.forEach((card, i) => {
      const d = i - active + drag;
      const ad = Math.abs(d);
      card.style.transform =
        `translate(-50%, -50%) translateX(${d * 62}%) scale(${Math.max(.55, 1 - ad * .2)}) rotateY(${d * -10}deg)`;
      card.style.opacity = ad > 2.5 ? 0 : 1 - ad * .28;
      card.style.zIndex = 10 - Math.round(ad);
      card.style.filter = `brightness(${1 - Math.min(ad, 1) * .45})`;
    });
  }

  function go(i) {
    active = Math.max(0, Math.min(projects.length - 1, i));
    layout();
    $$('button', dots).forEach((b, j) => b.classList.toggle('active', j === active));
    const p = projects[active];
    info.innerHTML = `
      <h3>${esc(p.title)}</h3>
      <p class="tagline">${esc(p.tagline || '')}</p>
      <p>${esc(p.description)}</p>
      <ul class="tags">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      ${p.link ? `<a class="link" href="${esc(p.link)}" target="_blank" rel="noopener">View project &#8594;</a>` : ''}`;
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
  }

  $('.roll-arrow.prev').onclick = () => go(active - 1);
  $('.roll-arrow.next').onclick = () => go(active + 1);
  $$('button', dots).forEach((b, i) => (b.onclick = () => go(i)));
  roll.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });

  // Swipe / drag
  let startX = null, dx = 0;
  stage.addEventListener('pointerdown', e => {
    startX = e.clientX; dx = 0;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (startX === null) return;
    dx = e.clientX - startX;
    if (Math.abs(dx) > 4) roll.classList.add('dragging');
    layout(dx / cards[0].offsetWidth);
  });
  const end = e => {
    if (startX === null) return;
    roll.classList.remove('dragging');
    const w = cards[0].offsetWidth;
    if (Math.abs(dx) > 40) go(active - (Math.round(dx / w) || Math.sign(dx)));
    else {
      // treat as a tap: tapping a side card brings it to centre
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList?.contains('roll-card'));
      hit ? go(+hit.dataset.i) : layout();
    }
    startX = null;
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  go(0);
}

/* ---------- 3. Skills ---------- */
function renderSkills() {
  const s = DATA.skills;
  $('#logoGrid').innerHTML = s.languages.map(l => `
    <li><img src="${esc(l.icon)}" alt="" loading="lazy"><span>${esc(l.name)}</span></li>`).join('');
  $('#skillCards').innerHTML = s.cards.map(c => `
    <article class="skill-card reveal">
      <div class="top"><span class="num">${esc(c.number)}</span><span class="label">${esc(c.label)}</span></div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.description)}</p>
      <ul class="tags">${(c.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </article>`).join('');
}

/* ---------- 4. About ---------- */
function renderAbout() {
  countUp($('#statCerts'), certificates().length);
  countUp($('#statProjects'), DATA.projects.length);
  $('#currentlyList').innerHTML = (DATA.profile.currently || []).map(c => `
    <li><span class="ico">${ICONS[c.icon] || ICONS.build}</span>
      <div><strong>${esc(c.label)}</strong><span>${esc(c.detail)}</span></div></li>`).join('');
}

function countUp(el, target) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 900);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  io.observe(el);
}

/* ---------- 5. Awards: tabs → collage + linked list ---------- */
const certificates = () => DATA.awards.filter(a => a.certificate);

function renderAwards() {
  const tabs = $$('.award-tabs [role="tab"]');
  const show = cat => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.cat === cat)));
    renderAwardPanel(DATA.awards.filter(a => (a.category || 'achievements') === cat));
    const panel = $('#awardsPanel');
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  };
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.cat)));
  show('achievements');
}

function renderAwardPanel(awards) {
  const photos = awards.flatMap((a, ai) => (a.images || []).map(src => ({ src, ai, title: a.title })));
  const collage = $('#collage'), list = $('#awardList');

  collage.innerHTML = photos.map(p => `
    <button data-ai="${p.ai}" aria-label="View photo: ${esc(p.title)}">
      <img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">
    </button>`).join('');
  list.innerHTML = awards.map((a, i) => `
    <li tabindex="0" data-ai="${i}">
      <span class="ico">${ICONS[a.icon] || ICONS.trophy}</span>
      <div><h3>${esc(a.title)}</h3><p>${esc(a.detail)}</p>
        ${a.date || a.certificate ? `<time>${a.certificate ? 'Certificate' : ''}${a.date && a.certificate ? ' · ' : ''}${esc(a.date || '')}</time>` : ''}</div>
    </li>`).join('');

  // Hovering an award highlights its photos (and vice-versa)
  const highlight = ai => {
    collage.classList.toggle('focus', ai != null);
    $$('button', collage).forEach(b => b.classList.toggle('on', b.dataset.ai == ai));
    $$('li', list).forEach(li => li.classList.toggle('on', li.dataset.ai == ai));
  };
  [...$$('li', list), ...$$('button', collage)].forEach(el => {
    el.addEventListener('mouseenter', () => highlight(el.dataset.ai));
    el.addEventListener('mouseleave', () => highlight(null));
    el.addEventListener('focus', () => highlight(el.dataset.ai));
    el.addEventListener('blur', () => highlight(null));
  });
  $$('button', collage).forEach((b, i) => b.addEventListener('click', () => openLightbox(photos[i].src, photos[i].title)));
  $$('li', list).forEach(li => {
    const open = () => { const p = photos.find(x => x.ai == li.dataset.ai); if (p) openLightbox(p.src, p.title); };
    li.addEventListener('click', open);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function openLightbox(src, caption) {
  const lb = $('#lightbox');
  $('img', lb).src = src; $('img', lb).alt = caption;
  $('p', lb).textContent = caption;
  lb.hidden = false;
}

/* ---------- 6. Contact ---------- */
function renderContact() {
  const p = DATA.profile;
  const pretty = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const items = [
    p.email && { label: 'Email', value: p.email, href: `mailto:${p.email}`, icon: 'mail' },
    p.github && { label: 'GitHub', value: pretty(p.github), href: p.github, icon: 'github' },
    p.linkedin && { label: 'LinkedIn', value: pretty(p.linkedin), href: p.linkedin, icon: 'linkedin' },
    p.facebook && { label: 'Facebook', value: pretty(p.facebook), href: p.facebook, icon: 'facebook' },
  ].filter(Boolean);
  $('#contactCards').innerHTML = items.map((it, i) => `
    <li><a href="${esc(it.href)}" ${it.icon === 'mail' ? '' : 'target="_blank" rel="noopener"'}>
      <span class="ico">${ICONS[it.icon]}</span>
      <span><small>${it.label}</small><strong>${esc(it.value)}</strong></span>
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
    </a></li>`).join('');
  if (p.resume) { const r = $('#resumeBtn'); r.href = p.resume; r.hidden = false; }
}

/* ---------- Chatbot (frontend only for now) ---------- */
function setupChat() {
  const chat = $('#chat'), log = $('#chatLog'), form = $('#chatForm'), input = $('#chatInput');
  const chips = ['Career path', 'Projects', 'Certificates', 'How do I get in touch?'];
  let greeted = false;

  $('#chatChips').innerHTML = chips.map(c => `<button type="button">${c}</button>`).join('');
  $$('#chatChips button').forEach(b => (b.onclick = () => send(b.textContent)));

  const add = (html, who) => {
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };

  const open = () => {
    chat.hidden = false; chat.classList.remove('closing');
    if (!greeted) {
      greeted = true;
      add(`Hi! 👋 I'm Carlvin's assistant. Ask me about Carlvin's path into data analytics and networking, projects or awards — or leave a message about work you'd like to do together.`, 'bot');
    }
    setTimeout(() => input.focus(), 50);
  };
  const close = () => {
    chat.classList.add('closing');
    chat.addEventListener('animationend', () => { chat.hidden = true; chat.classList.remove('closing'); }, { once: true });
  };

  $$('[data-open-chat]').forEach(b => b.addEventListener('click', open));
  $('#chatClose').onclick = close;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !chat.hidden) close(); });

  async function send(text) {
    text = text.trim();
    if (!text) return;
    add(esc(text), 'me');
    input.value = '';
    const typing = add('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    const reply = await askAssistant(text);
    typing.innerHTML = reply;
    log.scrollTop = log.scrollHeight;
  }
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
}

/**
 * Returns the bot's reply as HTML.
 * TODO: replace the body with a call to the Gemini proxy (Cloudflare Worker)
 * once the back-end step is ready. Everything else in the chat stays the same.
 */
async function askAssistant(text) {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
  const q = text.toLowerCase();
  const p = DATA.profile;
  const has = (...w) => w.some(x => q.includes(x));
  const mail = `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`;

  if (has('mushguard', 'mushroom')) return esc(DATA.projects.find(x => /mush/i.test(x.title))?.description || '');
  if (has('srms', 'scholarship record', 'eligib')) return esc(DATA.projects.find(x => /srms/i.test(x.title))?.description || '');
  if (has('contact', 'touch', 'email', 'reach', 'hire', 'work with', 'work together', 'available', 'message'))
    return `The fastest way is email: ${mail}\n\nYou can also tell me about your project here and I'll pass it on to Carlvin once my messaging is switched on.`;
  if (has('project', 'built', 'build', 'work', 'portfolio'))
    return `Carlvin has built:\n${DATA.projects.map(x => `• <b>${esc(x.title)}</b> — ${esc(x.tagline)}`).join('\n')}\n\nScroll up to the Work Gallery to see them.`;
  if (has('data', 'analy', 'coursera', 'google', 'network', 'cisco', 'path', 'career', 'goal'))
    return `Carlvin is on the path to <b>${(p.paths || []).map(esc).join('</b> and <b>')}</b>.\n\n• Currently taking Google Data Analytics on Coursera (scholarship program)\n• Completed Cisco Networking Academy's Networking Basics\n• ${esc(p.role)}`;
  if (has('student', 'school', 'study', 'studying', 'university', 'year'))
    return `Carlvin is a ${esc(p.role.replace(' · ', ' at '))} (Biliran Province State University).`;
  if (has('skill', 'language', 'stack', 'tech', 'python', 'django', 'java'))
    return `Main tools: ${DATA.skills.languages.map(l => esc(l.name)).join(', ')}.\n\nGrowing into: ${(p.paths || []).map(esc).join(' and ')}.`;
  if (has('award', 'achiev', 'recogni', 'dean', 'beyond'))
    return DATA.awards.filter(a => !a.certificate).map(a => `🏅 ${esc(a.title)}`).join('\n');
  if (has('certif', 'seminar', 'course'))
    return `Carlvin has ${certificates().length} certificates:\n${certificates().map(c => `• ${esc(c.title)}`).join('\n')}`;
  if (has('who', 'about', 'yourself', 'background'))
    return esc(p.bio);
  if (/\b(hi|hello|hey|good (morning|afternoon|evening))\b/.test(q))
    return `Hello! What would you like to know about ${esc(p.first_name)}?`;
  return `I'm still being connected to my AI brain, so I can only answer about projects, skills, awards and contact for now. For anything else, email ${mail}.`;
}

/* ---------- Top bar, active nav, reveal, lightbox ---------- */
function setupChrome() {
  const bar = $('.topbar');
  const onScroll = () => bar.classList.toggle('scrolled', scrollY > 20);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  const links = $$('.nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach(s => spy.observe(s));

  $$('.section .eyebrow, .section .h2, .section .lead, .about-card, .currently, .awards, .contact-grid, .logo-grid')
    .forEach(el => el.classList.add('reveal'));
  const rev = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => rev.observe(el));

  const lb = $('#lightbox');
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.icon-btn')) lb.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });
}
