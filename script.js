particlesJS("particles-js", {

particles: {

number: { value: 80 },

size: { value: 3 },

color: { value: "#22d3ee" },

line_linked: {
enable: true,
distance: 150,
color: "#22d3ee",
opacity: 0.4
},

move: { enable: true, speed: 2 }

}

});


async function loadRepos(){

const response = await fetch("https://api.github.com/users/nikhil-karthik-avvss/repos");

const repos = await response.json();

const container = document.getElementById("repo-container");

repos.slice(0,6).forEach(repo => {

const card = document.createElement("div");

card.className = "project-card";

card.innerHTML = `

<h3>${repo.name}</h3>

<p>${repo.description ?? "GitHub project"}</p>

<a href="${repo.html_url}" target="_blank">View Repo</a>

`;

container.appendChild(card);

});

}

loadRepos();
