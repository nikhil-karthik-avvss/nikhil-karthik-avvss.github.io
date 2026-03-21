/* ── PARTICLES ── */
particlesJS("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 900 } },
    color: { value: "#22d3ee" },
    shape: { type: "circle" },
    opacity: { value: 0.25, random: true },
    size: { value: 2, random: true },
    line_linked: {
      enable: true, distance: 140,
      color: "#22d3ee", opacity: 0.12, width: 1
    },
    move: { enable: true, speed: 1.2, random: true, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      grab: { distance: 160, line_linked: { opacity: 0.4 } },
      push: { particles_nb: 3 }
    }
  },
  retina_detect: true
});

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById("cursor");
if (cursor) {
  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
  });
  document.querySelectorAll("a, button, .project-card, .skill-group, .contact-item, .interest-item").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
      cursor.style.opacity = "0.6";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.opacity = "1";
    });
  });
}

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}, { passive: true });

/* ── MOBILE MENU ── */
const toggleBtn = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

/* ── SCROLL REVEAL ── */
// Add js-ready to <body> so CSS hides .reveal elements only when JS is active.
// This prevents the hosted version from leaving all cards invisible if the
// observer fires before layout is complete (common on GitHub Pages).
document.body.classList.add("js-ready");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 80);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

function initReveal() {
  document.querySelectorAll(".reveal").forEach(el => {
    // Elements already in the viewport on load become visible immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    } else {
      revealObserver.observe(el);
    }
  });
}

// Small delay ensures layout is fully calculated before we check positions
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(initReveal, 50));
} else {
  setTimeout(initReveal, 50);
}

/* ── GITHUB REPOS ── */

// Fallback static repos — shown when API is rate-limited or unavailable
const FALLBACK_REPOS = [
  { name: "legal-assistant",         language: "Python",     description: "Police station management system with Mistral LLM chatbot, Django API, Next.js frontend, and Neo4j graph database.", url: "https://github.com/nikhil-karthik-avvss" },
  { name: "qr-guard",                language: "Python",     description: "Malicious QR code detection using heuristic rules and a trained ML classifier to label URLs as safe, suspicious, or malicious.", url: "https://github.com/nikhil-karthik-avvss" },
  { name: "silent-loop-detector",    language: "Python",     description: "Network monitoring tool detecting routing loops via TTL variation and packet timing, with a real-time Flask dashboard.", url: "https://github.com/nikhil-karthik-avvss" },
  { name: "unet-change-detection",   language: "Python",     description: "U-Net segmentation model on the Inria aerial dataset for pixel-level change detection with CLAHE preprocessing.", url: "https://github.com/nikhil-karthik-avvss" },
  { name: "lost-and-found",          language: "JavaScript", description: "Full-stack Lost & Found platform built with Vue.js, Spring Boot, and MongoDB featuring auth and claim workflows.", url: "https://github.com/nikhil-karthik-avvss" },
  { name: "optimizer-benchmark",     language: "Python",     description: "Comparative evaluation of SGD, Adam, RMSProp, LBFGS and others on Rosenbrock, Rastrigin, Ackley benchmark functions.", url: "https://github.com/nikhil-karthik-avvss" },
];

function renderRepos(repos) {
  const container = document.getElementById("repo-container");
  const loading   = document.getElementById("repo-loading");
  if (!container) return;

  if (repos.length === 0) {
    if (loading) loading.textContent = "No public repositories found.";
    return;
  }

  if (loading) loading.style.display = "none";
  container.style.display = "grid";

  repos.forEach(repo => {
    const lang    = repo.language || "Code";
    const desc    = repo.description || "A GitHub project.";
    const stars   = repo.stargazers_count || 0;
    const updated = repo.updated_at
      ? new Date(repo.updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
      : null;
    const url     = repo.html_url || repo.url;

    const card = document.createElement("div");
    card.className = "project-card reveal";
    card.innerHTML = `
      <div class="project-top">
        <div class="project-status">${lang}</div>
        <div class="project-links">
          <a href="${url}" target="_blank" title="View on GitHub">⌥</a>
        </div>
      </div>
      <h3>${repo.name}</h3>
      <p>${desc}</p>
      <div class="project-tech">
        ${stars > 0 ? `<span>★ ${stars}</span>` : ""}
        ${updated ? `<span>Updated ${updated}</span>` : ""}
      </div>`;
    container.appendChild(card);
    revealObserver.observe(card);
  });
}

async function loadRepos() {
  const loading = document.getElementById("repo-loading");

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/nikhil-karthik-avvss"),
      fetch("https://api.github.com/users/nikhil-karthik-avvss/repos?sort=updated&per_page=20")
    ]);

    // GitHub returns 200 even on rate-limit — check the body
    if (!userRes.ok || !reposRes.ok) throw new Error("HTTP error");

    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Rate-limit response comes as an object with `message`, not an array
    if (!Array.isArray(repos) || repos.message) throw new Error(repos.message || "API error");

    // Update hero repo count
    const repoEl = document.getElementById("gh-repos");
    if (repoEl && user.public_repos) repoEl.textContent = user.public_repos;

    const filtered = repos
      .filter(r => !r.fork && r.name !== "nikhil-karthik-avvss")
      .slice(0, 6);

    renderRepos(filtered.length > 0 ? filtered : FALLBACK_REPOS);

  } catch (err) {
    console.warn("GitHub API unavailable, using fallback:", err.message);
    // Show fallback silently — section still looks complete
    renderRepos(FALLBACK_REPOS);
    // Update repo count with a reasonable static number
    const repoEl = document.getElementById("gh-repos");
    if (repoEl && repoEl.textContent === "—") repoEl.textContent = "10+";
  }
}

loadRepos();
