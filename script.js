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
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 80);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── GITHUB REPOS ── */
async function loadRepos() {
  const container = document.getElementById("repo-container");
  const loading   = document.getElementById("repo-loading");
  if (!container) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/nikhil-karthik-avvss"),
      fetch("https://api.github.com/users/nikhil-karthik-avvss/repos?sort=updated&per_page=20")
    ]);

    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Update hero stats
    const repoEl = document.getElementById("gh-repos");
    if (repoEl && user.public_repos) repoEl.textContent = user.public_repos;

    // Filter & display repos
    const filtered = repos
      .filter(r => !r.fork && r.name !== "nikhil-karthik-avvss")
      .slice(0, 6);

    if (filtered.length === 0) {
      loading.textContent = "No public repositories found.";
      return;
    }

    loading.style.display = "none";
    container.style.display = "grid";

    filtered.forEach(repo => {
      const lang    = repo.language || "";
      const desc    = repo.description || "A GitHub project.";
      const stars   = repo.stargazers_count;
      const updated = new Date(repo.updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

      const card = document.createElement("div");
      card.className = "project-card reveal";
      card.innerHTML = `
        <div class="project-top">
          <div class="project-status">${lang || "Repo"}</div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" title="View on GitHub">⌥</a>
          </div>
        </div>
        <h3>${repo.name}</h3>
        <p>${desc}</p>
        <div class="project-tech">
          ${stars > 0 ? `<span>★ ${stars}</span>` : ""}
          <span>Updated ${updated}</span>
        </div>`;
      container.appendChild(card);

      // observe new cards for reveal
      revealObserver.observe(card);
    });

  } catch (err) {
    if (loading) loading.textContent = "Could not fetch repositories. Visit GitHub →";
  }
}

loadRepos();
