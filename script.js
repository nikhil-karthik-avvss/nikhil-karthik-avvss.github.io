/* ── PARTICLES ── */
particlesJS("particles-js", {
  particles: {
    number: { value: 55, density: { enable: true, value_area: 1000 } },
    color: { value: ["#00e5ff", "#0ea5e9", "#6366f1"] },
    shape: { type: "circle" },
    opacity: { value: 0.2, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05 } },
    size: { value: 2, random: true },
    line_linked: { enable: true, distance: 130, color: "#00e5ff", opacity: 0.08, width: 1 },
    move: { enable: true, speed: 0.8, random: true, out_mode: "out", attract: { enable: true, rotateX: 600, rotateY: 1200 } }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
    modes: { grab: { distance: 180, line_linked: { opacity: 0.3 } }, push: { particles_nb: 2 } }
  },
  retina_detect: true
});

/* ── CURSOR ── */
const cursorEl = document.getElementById("cursor");
if (cursorEl) {
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  document.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });

  function animateCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursorEl.style.left = cx + "px";
    cursorEl.style.top  = cy + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = "a, button, .p-card, .sk-card, .r-card, .c-item, .int-item";
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener("mouseenter", () => cursorEl.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursorEl.classList.remove("hovering"));
  });
}

/* ── CARD RADIAL GLOW ON MOUSE ── */
document.querySelectorAll(".p-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty("--mx", x + "%");
    card.style.setProperty("--my", y + "%");
  });
});

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
document.body.classList.add("js-ready");

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 75);
    }
  });
}, { threshold: 0.07, rootMargin: "0px 0px -40px 0px" });

function initReveal() {
  document.querySelectorAll(".reveal").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add("visible");
    } else {
      revealObs.observe(el);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(initReveal, 50));
} else {
  setTimeout(initReveal, 50);
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
    if (el && user.public_repos) el.textContent = user.public_repos;

    const filtered = repos.filter(r => !r.fork && r.name !== "nikhil-karthik-avvss").slice(0, 6);
    renderRepos(filtered.length > 0 ? filtered : FALLBACK_REPOS);
  } catch (e) {
    console.warn("GitHub API unavailable, using fallback:", e.message);
    renderRepos(FALLBACK_REPOS);
    const el = document.getElementById("gh-repos");
    if (el && el.textContent === "—") el.textContent = "10+";
  }
}

loadRepos();
