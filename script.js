$(document).ready(function () {
  renderProjects();
});

function renderProjects() {
  const container = document.getElementById("portfolio-grid");
  if (!container) return;

  if (typeof portfolioProjects === "undefined") {
    console.error("Portfolio data (projects.js) not found!");
    container.innerHTML =
      '<div class="col-12 text-center text-danger">Data project tidak dapat dimuat. Pastikan projects.js sudah di-upload.</div>';
    return;
  }

  container.innerHTML = portfolioProjects
    .map((project, index) => {
      let animation = "fade-up";
      if (index % 3 === 0) animation = "fade-up-right";
      if (index % 3 === 2) animation = "fade-up-left";

      return `
      <div class="col-lg-4 mb-4">
        <div class="item portfolio-item" data-aos="${animation}" data-aos-duration="2000"
          data-title="${project.title}"
          data-description="${project.description}"
          data-tags="${project.tags.join(",")}"
          data-links='${JSON.stringify(project.links)}'
          data-image="${project.image}"
          onclick="openPortfolioModal(this)">
          <img src="${project.image}" class="img-fluid" alt="${project.title}">
          <div class="item-overlay">
            <h5>${project.title}</h5>
            <p>${project.description.split(".")[0]}.</p>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  if (typeof AOS !== "undefined") {
    AOS.init();
    AOS.refresh();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("U85vb-TLi4QCplmwy");

  const form = document.getElementById("contact-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm("service_i0zo3zo", "template_m8ajqzd", this).then(
      function () {
        alert("Message sent successfully!");
        form.reset();
      },
      function (error) {
        alert("Failed to send message: " + JSON.stringify(error));
      }
    );
  });
});

function openPortfolioModal(element) {
  const title = element.getAttribute("data-title");
  const description = element.getAttribute("data-description");
  const tags = element.getAttribute("data-tags");
  const linksData = element.getAttribute("data-links");
  const image = element.getAttribute("data-image");

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-description").textContent = description;
  document.getElementById("modal-image").src = image;

  // Handle tags
  const tagsContainer = document.getElementById("modal-tags");
  tagsContainer.innerHTML = "";
  if (tags) {
    tags.split(",").forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "badge";
      tagElement.textContent = tag.trim();
      tagsContainer.appendChild(tagElement);
    });
  }

  // Handle multiple links
  const linksContainer = document.getElementById("modal-links-container");
  linksContainer.innerHTML = "";
  if (linksData) {
    const links = JSON.parse(linksData);
    links.forEach((link) => {
      const btn = document.createElement("a");
      btn.href = link.url;
      btn.target = "_blank";
      btn.className = "btn-github-modern mb-2 mr-2";

      // Use GitHub icon for "View Project", globe for others
      const iconClass = link.label.toLowerCase().includes("project")
        ? "fab fa-github"
        : "fas fa-globe";

      btn.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${link.label}</span>
      `;
      linksContainer.appendChild(btn);
    });
  }

  $("#portfoliomodal").modal("show");
}

document.querySelectorAll(".scroll-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
