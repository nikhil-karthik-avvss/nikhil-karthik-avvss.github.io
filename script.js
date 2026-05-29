/* ── ANIMATED COUNTER UTILITY ── */
function countUp(el, to, duration) {
  to = (to !== undefined) ? to : parseInt(el.dataset.count, 10);
  duration = duration || 1800;
  if (isNaN(to)) return;
  el.classList.add('counting');
  var t0 = performance.now();
  (function frame(now) {
    var p = Math.min((now - t0) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * to);
    if (p < 1) { requestAnimationFrame(frame); }
    else { el.textContent = to; el.classList.remove('counting'); }
  })(t0);
}


/* ── CARD RADIAL GLOW ON MOUSE ── */
document.querySelectorAll(".p-card, .sk-card, .exp-card, .r-card, .ach-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty("--mx", x + "%");
    card.style.setProperty("--my", y + "%");
  });
});

/* ── SCROLL PROGRESS BAR ── */
(function() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", function() {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + "%";
  }, { passive: true });
})();

/* ── THEME TOGGLE ── */
(function() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }

  btn.addEventListener("click", function() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";

    // Brief transition class for smooth color shift
    document.body.classList.add("theme-transitioning");
    applyTheme(next);
    setTimeout(function() {
      document.body.classList.remove("theme-transitioning");
    }, 300);
  });
})();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

/* ── MOBILE MENU ── */
const toggleBtn  = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));
}

/* ── SCROLL REVEAL ── */
// Strategy: don't hide elements at all until we're SURE the observer is ready
// and the layout has settled. On GitHub Pages, a 50ms delay isn't always enough.
// We use requestAnimationFrame + a double rAF (two paint cycles) to guarantee
// layout is complete before we measure getBoundingClientRect().

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Unobserve immediately so it never re-hides
      revealObs.unobserve(entry.target);
      setTimeout(() => entry.target.classList.add("visible"), i * 75);
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

function initReveal() {
  // Double rAF: first frame updates layout, second frame we can safely measure
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // NOW add js-ready — elements go opacity:0 only after layout is settled
      document.body.classList.add("js-ready");

      document.querySelectorAll(".reveal").forEach(el => {
        const r = el.getBoundingClientRect();
        // Already fully or partially in viewport → show immediately, no animation
        if (r.top < window.innerHeight - 20 && r.bottom > 0) {
          el.classList.add("visible");
        } else {
          revealObs.observe(el);
        }
      });
    });
  });
}

// Run after DOM + all resources are loaded for maximum safety on GitHub Pages
if (document.readyState === "complete") {
  initReveal();
} else {
  window.addEventListener("load", initReveal);
}

/* ── GITHUB REPOS ── */
const FALLBACK_REPOS = [
  { name: "plagcheck",            language: "Python",     description: "CLI tool comparing PDF assignments across text, code (AST), visuals (perceptual hashing), and structure. Three-stage extraction pipeline. Fully offline.",                     url: "https://github.com/nikhil-karthik-avvss" },
  { name: "legal-assistant",      language: "Python",     description: "Police station management with Mistral LLM chatbot, Django API, Next.js frontend, and Neo4j graph database.",                                                              url: "https://github.com/nikhil-karthik-avvss" },
  { name: "qr-guard",             language: "Python",     description: "Malicious QR code detection using heuristic rules and ML classifier to label URLs safe, suspicious, or malicious.",                                                        url: "https://github.com/nikhil-karthik-avvss" },
  { name: "silent-loop-detector", language: "Python",     description: "Network loop detection via TTL variation and packet timing, with a real-time Flask dashboard.",                                                                             url: "https://github.com/nikhil-karthik-avvss" },
  { name: "unet-change-detection",language: "Python",     description: "U-Net segmentation on Inria aerial dataset for pixel-level change detection with CLAHE preprocessing.",                                                                    url: "https://github.com/nikhil-karthik-avvss" },
  { name: "lost-and-found",       language: "JavaScript", description: "Full-stack Lost & Found platform with Vue.js, Spring Boot, and MongoDB.",                                                                                                   url: "https://github.com/nikhil-karthik-avvss" },
];

function renderRepos(repos) {
  const container = document.getElementById("repo-container");
  const loading   = document.getElementById("repo-loading");
  if (!container) return;
  if (repos.length === 0) { if (loading) loading.textContent = "No repositories found."; return; }
  if (loading) loading.style.display = "none";
  container.style.display = "grid";

  repos.forEach(repo => {
    const lang    = repo.language || "Code";
    const desc    = repo.description || "A GitHub project.";
    const stars   = repo.stargazers_count || 0;
    const updated = repo.updated_at
      ? new Date(repo.updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
      : null;
    const url = repo.html_url || repo.url;

    const card = document.createElement("div");
    card.className = "p-card reveal";
    card.innerHTML = `
      <div class="p-top">
        <span class="p-tag">${lang}</span>
        <a href="${url}" target="_blank" class="p-link">↗</a>
      </div>
      <h3>${repo.name}</h3>
      <p>${desc}</p>
      <div class="p-tech">
        ${stars > 0 ? `<span>★ ${stars}</span>` : ""}
        ${updated ? `<span>Updated ${updated}</span>` : ""}
      </div>`;
    container.appendChild(card);

    // attach card glow
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - rect.top)  / rect.height * 100) + "%");
    });

    revealObs.observe(card);
  });
}

async function loadRepos() {
  try {
    const [uRes, rRes] = await Promise.all([
      fetch("https://api.github.com/users/nikhil-karthik-avvss"),
      fetch("https://api.github.com/users/nikhil-karthik-avvss/repos?sort=updated&per_page=20")
    ]);
    if (!uRes.ok || !rRes.ok) throw new Error("HTTP error");

    const user  = await uRes.json();
    const repos = await rRes.json();

    if (!Array.isArray(repos) || repos.message) throw new Error(repos.message || "API error");

    const el = document.getElementById("gh-repos");
    if (el && user.public_repos) countUp(el, user.public_repos);

    const filtered = repos.filter(r => !r.fork && r.name !== "nikhil-karthik-avvss").slice(0, 6);
    renderRepos(filtered.length > 0 ? filtered : FALLBACK_REPOS);
  } catch (e) {
    console.warn("GitHub API unavailable, using fallback:", e.message);
    renderRepos(FALLBACK_REPOS);
    const el = document.getElementById("gh-repos");
    if (el && el.textContent === "—") { el.textContent = "0"; countUp(el, 10); }
  }
}

loadRepos();

/* ── ACTIVE NAV HIGHLIGHTING ── */
(function() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const activeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("nav-active"));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add("nav-active");
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

  sections.forEach(s => activeObs.observe(s));
})();

/* ── EDUCATION PROGRESS BAR ── */
(function() {
  document.querySelectorAll(".edu-prog-fill[data-width]").forEach(function(bar) {
    const target = bar.dataset.width;
    const obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          bar.style.setProperty("--target-w", target + "%");
          bar.classList.add("animated");
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(bar);
  });
})();

/* ── CERT LIGHTBOX ── */
(function() {
  const lightbox = document.getElementById("cert-lightbox");
  const lbImg    = document.getElementById("clb-img");
  const closeBtn = document.getElementById("clb-close");
  if (!lightbox || !lbImg) return;

  function openLightbox(src) {
    lbImg.src = src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function() { lbImg.src = ""; }, 350);
  }

  document.querySelectorAll(".cert-thumb-wrap").forEach(function(btn) {
    btn.addEventListener("click", function() { openLightbox(btn.dataset.cert); });
  });
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
})();

/* ── MAGNETIC PRIMARY BUTTON ── */
(function() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const btn = document.querySelector(".btn-prime");
  if (!btn) return;
  btn.addEventListener("mousemove", function(e) {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });
  btn.addEventListener("mouseleave", function() {
    btn.style.transform = "";
  });
})();

/* ── TYPEWRITER HERO ROLE ── */
(function() {
  var el = document.getElementById('hero-typed');
  if (!el) return;
  var roles = [
    'Creative Problem Solver',
    'Full-Stack Developer',
    'AI Engineer',
    'Machine Learning Researcher',
    'Cybersecurity Enthusiast',
    'Computer Vision Explorer'
  ];
  var ri = 0, ci = 0, del = false;
  function tick() {
    var word = roles[ri];
    if (!del) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { del = true; setTimeout(tick, 1900); return; }
      setTimeout(tick, 72);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 1300);
})();

/* ── 3D CARD TILT ── */
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.p-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      var rx = (e.clientY - r.top  - r.height * 0.5) / r.height * -10;
      var ry = (e.clientX - r.left - r.width  * 0.5) / r.width  *  10;
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
      card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s';
      card.style.transform = '';
      setTimeout(function() { card.style.transition = ''; }, 620);
    });
  });
})();

/* ── NAV PILL INDICATOR ── */
(function() {
  var pill   = document.getElementById('nav-pill');
  var navEl  = document.getElementById('nav-links');
  if (!pill || !navEl) return;
  var links = navEl.querySelectorAll('a');
  function moveTo(link) {
    var nr = navEl.getBoundingClientRect();
    var lr = link.getBoundingClientRect();
    pill.style.left  = (lr.left - nr.left) + 'px';
    pill.style.width = lr.width + 'px';
    pill.classList.add('active');
  }
  links.forEach(function(a) {
    a.addEventListener('mouseenter', function() { moveTo(a); });
    a.addEventListener('mouseleave', function() { pill.classList.remove('active'); });
  });
})();

/* ── SCROLL-TRIGGERED COUNTERS ── */
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        countUp(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function(el) {
    obs.observe(el);
  });
})();

/* ── COMMAND PALETTE (⌘K / Ctrl+K) ── */
(function() {
  var palette  = document.getElementById('cmd-palette');
  var backdrop = document.getElementById('cmd-backdrop');
  var input    = document.getElementById('cmd-input');
  var list     = document.getElementById('cmd-list');
  var hintBtn  = document.getElementById('cmd-hint-btn');
  if (!palette || !input || !list) return;

  var COMMANDS = [
    { label: 'Go to About',           icon: '→', group: 'Navigate', section: '#about' },
    { label: 'Go to Education',       icon: '→', group: 'Navigate', section: '#education' },
    { label: 'Go to Experience',      icon: '→', group: 'Navigate', section: '#experience' },
    { label: 'Go to Research',        icon: '→', group: 'Navigate', section: '#research' },
    { label: 'Go to Achievements',    icon: '→', group: 'Navigate', section: '#achievements' },
    { label: 'Go to Projects',        icon: '→', group: 'Navigate', section: '#projects' },
    { label: 'Go to Skills',          icon: '→', group: 'Navigate', section: '#skills' },
    { label: 'Go to GitHub',          icon: '→', group: 'Navigate', section: '#github-section' },
    { label: 'Go to Contact',         icon: '→', group: 'Navigate', section: '#contact' },
    { label: 'Open GitHub Profile',   icon: '↗', group: 'Links',    href: 'https://github.com/nikhil-karthik-avvss' },
    { label: 'Send Email',            icon: '✉', group: 'Links',    href: 'mailto:nikhilkarthik1avvss@gmail.com' },
    { label: 'Open LinkedIn',         icon: '↗', group: 'Links',    href: 'https://www.linkedin.com/in/nikhil-karthik-avvss/' },
    { label: 'Toggle Dark / Light Mode', icon: '◐', group: 'Actions', action: 'theme' },
  ];

  var activeIdx = -1;
  var filtered  = COMMANDS.slice();

  function openPalette() {
    palette.classList.add('open');
    palette.removeAttribute('aria-hidden');
    input.value = '';
    renderList(COMMANDS);
    setTimeout(function() { input.focus(); }, 10);
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
  }

  function execute(cmd) {
    closePalette();
    if (cmd.section) {
      var target = document.querySelector(cmd.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.href) {
      window.open(cmd.href, cmd.href.startsWith('mailto') ? '_self' : '_blank');
    } else if (cmd.action === 'theme') {
      var btn = document.getElementById('theme-toggle');
      if (btn) btn.click();
    }
  }

  function setActive(idx) {
    var items = list.querySelectorAll('.cmd-item');
    items.forEach(function(el, i) {
      el.classList.toggle('cmd-active', i === idx);
    });
    activeIdx = idx;
    if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }

  function renderList(cmds) {
    filtered  = cmds;
    activeIdx = cmds.length > 0 ? 0 : -1;
    list.innerHTML = '';
    if (cmds.length === 0) {
      list.innerHTML = '<div class="cmd-empty">No commands matched.</div>';
      return;
    }
    var lastGroup = null;
    cmds.forEach(function(cmd, i) {
      if (cmd.group !== lastGroup) {
        if (lastGroup !== null) {
          var sep = document.createElement('div');
          sep.className = 'cmd-sep';
          list.appendChild(sep);
        }
        lastGroup = cmd.group;
      }
      var item = document.createElement('div');
      item.className = 'cmd-item' + (i === 0 ? ' cmd-active' : '');
      item.setAttribute('role', 'option');
      item.innerHTML =
        '<span class="cmd-item-icon">' + cmd.icon + '</span>' +
        '<span>' + cmd.label + '</span>' +
        '<span class="cmd-item-group">' + cmd.group + '</span>';
      (function(c, idx) {
        item.addEventListener('click', function() { execute(c); });
        item.addEventListener('mouseenter', function() { setActive(idx); });
      })(cmd, i);
      list.appendChild(item);
    });
  }

  input.addEventListener('input', function() {
    var q = input.value.toLowerCase().trim();
    if (!q) { renderList(COMMANDS); return; }
    renderList(COMMANDS.filter(function(c) {
      return c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q);
    }));
  });

  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
      return;
    }
    if (!palette.classList.contains('open')) return;
    if (e.key === 'Escape') { closePalette(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) execute(filtered[activeIdx]);
    }
  });

  if (backdrop) backdrop.addEventListener('click', closePalette);
  if (hintBtn)  hintBtn.addEventListener('click', openPalette);
})();
