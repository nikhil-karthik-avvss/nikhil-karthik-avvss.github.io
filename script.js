/* ── HELPERS ── */
var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function countUp(el, to, duration) {
  if (isNaN(to)) return;
  if (REDUCED_MOTION) { el.textContent = to; return; }
  duration = duration || 1200;
  var t0 = performance.now();
  (function frame(now) {
    var p = Math.min((now - t0) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}

/* ── THEME TOGGLE ── */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.classList.add('theme-transitioning');
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    setTimeout(function () { document.body.classList.remove('theme-transitioning'); }, 300);
  });
})();

/* ── NAVBAR BORDER ON SCROLL ── */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  function update() { navbar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── MOBILE MENU ── */
(function () {
  var toggleBtn = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!toggleBtn || !mobileMenu) return;
  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    toggleBtn.textContent = open ? 'Close' : 'Menu';
  }
  toggleBtn.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });
  mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
  });
})();

/* ── SCROLL REVEAL ── */
// Elements are only hidden after layout settles (double rAF), and anything
// already on screen is shown immediately, so content never gets stuck hidden.
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      revealObs.unobserve(entry.target);
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

function observeReveal(el) {
  var r = el.getBoundingClientRect();
  if (r.top < window.innerHeight - 20 && r.bottom > 0) el.classList.add('visible');
  else revealObs.observe(el);
}

function initReveal() {
  if (REDUCED_MOTION) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('js-ready');
      document.querySelectorAll('.reveal').forEach(observeReveal);
    });
  });
}

if (document.readyState === 'complete') initReveal();
else window.addEventListener('load', initReveal);

/* ── ACTIVE NAV LINK ── */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.remove('nav-active'); });
      var link = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
      if (link) link.classList.add('nav-active');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(function (s) { obs.observe(s); });
})();

/* ── DEGREE PROGRESS BAR ── */
(function () {
  document.querySelectorAll('.progress-fill[data-width]').forEach(function (bar) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          bar.style.width = bar.dataset.width + '%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(bar);
  });
})();

/* ── GITHUB REPOS ── */
var FALLBACK_REPOS = [
  { name: 'plagcheck',             language: 'Python',     description: 'CLI tool comparing PDF assignments across text, code (AST), visuals (perceptual hashing), and structure. Fully offline.' },
  { name: 'legal-assistant',       language: 'Python',     description: 'Police station management with Mistral LLM chatbot, Django API, Next.js frontend, and Neo4j graph database.' },
  { name: 'qr-guard',              language: 'Python',     description: 'Malicious QR code detection using heuristic rules and an ML classifier to label URLs safe, suspicious, or malicious.' },
  { name: 'silent-loop-detector',  language: 'Python',     description: 'Network loop detection via TTL variation and packet timing, with a real-time Flask dashboard.' },
  { name: 'unet-change-detection', language: 'Python',     description: 'U-Net segmentation on the Inria aerial dataset for pixel-level change detection with CLAHE preprocessing.' },
  { name: 'lost-and-found',        language: 'JavaScript', description: 'Full-stack Lost & Found platform with Vue.js, Spring Boot, and MongoDB.' }
];
var GH_PROFILE = 'https://github.com/nikhil-karthik-avvss';

function renderRepos(repos) {
  var container = document.getElementById('repo-container');
  var loading = document.getElementById('repo-loading');
  if (!container) return;
  if (!repos.length) { if (loading) loading.textContent = 'No repositories found.'; return; }
  if (loading) loading.hidden = true;
  container.hidden = false;

  repos.forEach(function (repo) {
    var meta = [repo.language || 'Code'];
    if (repo.stargazers_count) meta.push('★ ' + repo.stargazers_count);
    if (repo.updated_at) {
      meta.push(new Date(repo.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
    }
    var a = document.createElement('a');
    a.className = 'repo reveal';
    a.href = repo.html_url || GH_PROFILE;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML =
      '<span class="repo-name">' + esc(repo.name) + '</span>' +
      '<span class="repo-desc">' + esc(repo.description || '') + '</span>' +
      '<span class="repo-meta">' + esc(meta.join(' · ')) + '</span>';
    container.appendChild(a);
    if (document.body.classList.contains('js-ready')) observeReveal(a);
  });
}

function loadRepos() {
  var countEl = document.getElementById('gh-repos');
  Promise.all([
    fetch('https://api.github.com/users/nikhil-karthik-avvss'),
    fetch('https://api.github.com/users/nikhil-karthik-avvss/repos?sort=updated&per_page=20')
  ]).then(function (res) {
    if (!res[0].ok || !res[1].ok) throw new Error('HTTP error');
    return Promise.all([res[0].json(), res[1].json()]);
  }).then(function (data) {
    var user = data[0], repos = data[1];
    if (!Array.isArray(repos)) throw new Error('API error');
    if (countEl && user.public_repos) countUp(countEl, user.public_repos);
    var filtered = repos.filter(function (r) { return !r.fork && r.name !== 'nikhil-karthik-avvss'; }).slice(0, 6);
    renderRepos(filtered.length ? filtered : FALLBACK_REPOS);
  }).catch(function (e) {
    console.warn('GitHub API unavailable, using fallback:', e.message);
    renderRepos(FALLBACK_REPOS);
    if (countEl && countEl.textContent === '—') countEl.textContent = '10+';
  });
}
loadRepos();

/* ── CERTIFICATE LIGHTBOX ── */
(function () {
  var lightbox = document.getElementById('cert-lightbox');
  var lbImg = document.getElementById('clb-img');
  var closeBtn = document.getElementById('clb-close');
  if (!lightbox || !lbImg || !closeBtn) return;
  var lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || 'Certificate';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 300);
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
  }

  document.querySelectorAll('.cert-thumb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      open(btn.dataset.cert, img && img.alt);
    });
  });
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();

/* ── COMMAND PALETTE (⌘K / Ctrl+K) ── */
(function () {
  var palette = document.getElementById('cmd-palette');
  var backdrop = document.getElementById('cmd-backdrop');
  var input = document.getElementById('cmd-input');
  var list = document.getElementById('cmd-list');
  var hintBtn = document.getElementById('cmd-hint-btn');
  if (!palette || !input || !list) return;

  var COMMANDS = [
    { label: 'About',        icon: '→', group: 'Sections', section: '#about' },
    { label: 'Education',    icon: '→', group: 'Sections', section: '#education' },
    { label: 'Experience',   icon: '→', group: 'Sections', section: '#experience' },
    { label: 'Research',     icon: '→', group: 'Sections', section: '#research' },
    { label: 'Achievements', icon: '→', group: 'Sections', section: '#achievements' },
    { label: 'Projects',     icon: '→', group: 'Sections', section: '#projects' },
    { label: 'Skills',       icon: '→', group: 'Sections', section: '#skills' },
    { label: 'GitHub',       icon: '→', group: 'Sections', section: '#github-section' },
    { label: 'Contact',      icon: '→', group: 'Sections', section: '#contact' },
    { label: 'GitHub profile', icon: '↗', group: 'Links', href: GH_PROFILE },
    { label: 'Send email',     icon: '@', group: 'Links', href: 'mailto:nikhilkarthik1avvss@gmail.com' },
    { label: 'LinkedIn',       icon: '↗', group: 'Links', href: 'https://www.linkedin.com/in/nikhil-karthik-avvss/' },
    { label: 'Toggle dark mode', icon: '◐', group: 'Actions', action: 'theme' }
  ];

  var activeIdx = -1;
  var filtered = COMMANDS.slice();
  var lastFocused = null;

  function openPalette() {
    lastFocused = document.activeElement;
    palette.classList.add('open');
    palette.removeAttribute('aria-hidden');
    input.value = '';
    renderList(COMMANDS);
    setTimeout(function () { input.focus(); }, 10);
  }
  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function execute(cmd) {
    closePalette();
    if (cmd.section) {
      var target = document.querySelector(cmd.section);
      if (target) target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    } else if (cmd.href) {
      window.open(cmd.href, cmd.href.indexOf('mailto') === 0 ? '_self' : '_blank', 'noopener');
    } else if (cmd.action === 'theme') {
      var btn = document.getElementById('theme-toggle');
      if (btn) btn.click();
    }
  }
  function setActive(idx) {
    var items = list.querySelectorAll('.cmd-item');
    items.forEach(function (el, i) {
      el.classList.toggle('cmd-active', i === idx);
      el.setAttribute('aria-selected', String(i === idx));
    });
    activeIdx = idx;
    if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }
  function renderList(cmds) {
    filtered = cmds;
    activeIdx = cmds.length ? 0 : -1;
    list.innerHTML = '';
    if (!cmds.length) { list.innerHTML = '<div class="cmd-empty">Nothing matches.</div>'; return; }
    var lastGroup = null;
    cmds.forEach(function (cmd, i) {
      if (lastGroup !== null && cmd.group !== lastGroup) {
        var sep = document.createElement('div');
        sep.className = 'cmd-sep';
        list.appendChild(sep);
      }
      lastGroup = cmd.group;
      var item = document.createElement('div');
      item.className = 'cmd-item' + (i === 0 ? ' cmd-active' : '');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(i === 0));
      item.innerHTML =
        '<span class="cmd-item-icon" aria-hidden="true">' + esc(cmd.icon) + '</span>' +
        '<span>' + esc(cmd.label) + '</span>' +
        '<span class="cmd-item-group">' + esc(cmd.group) + '</span>';
      item.addEventListener('click', function () { execute(cmd); });
      item.addEventListener('mouseenter', function () { setActive(i); });
      list.appendChild(item);
    });
  }

  input.addEventListener('input', function () {
    var q = input.value.toLowerCase().trim();
    renderList(!q ? COMMANDS : COMMANDS.filter(function (c) {
      return c.label.toLowerCase().indexOf(q) !== -1 || c.group.toLowerCase().indexOf(q) !== -1;
    }));
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) closePalette(); else openPalette();
      return;
    }
    if (!palette.classList.contains('open')) return;
    if (e.key === 'Escape') closePalette();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIdx + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIdx]) execute(filtered[activeIdx]); }
  });

  if (backdrop) backdrop.addEventListener('click', closePalette);
  if (hintBtn) hintBtn.addEventListener('click', openPalette);
})();
