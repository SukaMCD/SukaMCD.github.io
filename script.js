$(document).ready(function () {
  renderProjects();
  renderBlogs();
  initTypingEffect();
  initMobileCarousels();

  // Glassmorphism Navbar Logic
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Cursor Glow Logic
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  $(document).on("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    // Glow follows
    glow.style.left = posX + "px";
    glow.style.top = posY + "px";
  });

  // Handle Hover States (Removed custom cursor class toggle as it's now handled by CSS cursor: url)

  // Initialize ClickSpark after DOM is ready
  new ClickSpark({
    sparkColor: "white", // White for visibility
    sparkSize: 12,
    sparkRadius: 40, // Increased radius for better visibility
    sparkCount: 10,
    duration: 500,
  });
});

function initTypingEffect() {
  const textElement = document.getElementById("typing-text");
  const words = ["Software Engineer Student", "Web Developer", "Programmer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      typeSpeed = 50;
    } else {
      charIndex++;
      typeSpeed = 150;
    }

    textElement.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    // Add cursor
    textElement.innerHTML += '<span class="typing-cursor"></span>';

    setTimeout(type, typeSpeed);
  }

  if (textElement) type();
}

function initMobileCarousels() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 991, // Disable on desktop
        settings: "unslick",
      },
    ],
  };

  // Tech Stack Carousel
  const $techRow = $("#services .row");
  if ($(window).width() < 992) {
    if (!$techRow.hasClass("slick-initialized")) {
      $techRow.slick(settings);
    }
  }

  // Portfolio Carousel (Wait for projects to render)
  setTimeout(() => {
    const $portRow = $("#portfolio-grid");
    if ($(window).width() < 992) {
      if (!$portRow.hasClass("slick-initialized")) {
        $portRow.slick(settings);
      }
    }
  }, 100);

  // Re-check on resize
  $(window).on("resize", function () {
    if ($(window).width() < 992) {
      if (!$techRow.hasClass("slick-initialized")) $techRow.slick(settings);
      const $portRow = $("#portfolio-grid");
      if (!$portRow.hasClass("slick-initialized")) $portRow.slick(settings);
    }
  });
}

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
      if (index % 3 === 0) animation = "fade-right";
      if (index % 3 === 2) animation = "fade-left";

      // Use the first tag as the category badge
      const category =
        project.tags && project.tags.length > 0 ? project.tags[0] : "Project";

      return `
      <div class="col-lg-4 mb-4">
        <div class="blog-card" data-aos="${animation}" data-aos-duration="1000"
          data-title="${project.title}"
          data-description="${project.description}"
          data-tags="${project.tags.join(",")}"
          data-links='${JSON.stringify(project.links)}'
          data-image="${project.image}"
          onclick="openPortfolioModal(this)">
          <div class="blog-img-container">
            <img src="${project.image}" class="img-fluid" alt="${
        project.title
      }">
            <span class="blog-category">${project.category}</span>
          </div>
          <div class="blog-content">
            <div class="blog-date"><i class="far fa-calendar-alt mr-2"></i>${
              project.date
            }</div>
            <h5 class="blog-title">${project.title}</h5>
            <p class="blog-desc">${project.description}</p>
            <a href="javascript:void(0)" class="blog-read-more">
              View Project Details <i class="fas fa-arrow-right ml-1"></i>
            </a>
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

function renderBlogs() {
  const container = document.getElementById("blogs-grid");
  if (!container || typeof blogPosts === "undefined") return;

  container.innerHTML = blogPosts
    .map((post, index) => {
      let animation = "fade-up";
      if (index % 3 === 0) animation = "fade-right";
      if (index % 3 === 2) animation = "fade-left";

      return `
      <div class="col-lg-4 mb-4">
        <div class="blog-card" data-aos="${animation}" data-aos-duration="1000">
          <div class="blog-img-container">
            <img src="${post.image}" class="img-fluid" alt="${post.title}">
            <span class="blog-category">${post.category}</span>
          </div>
          <div class="blog-content">
            <div class="blog-date"><i class="far fa-calendar-alt mr-2"></i>${post.date}</div>
            <h5 class="blog-title">${post.title}</h5>
            <p class="blog-desc">${post.description}</p>
            <a href="${post.link}" class="blog-read-more">
              Read More <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
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

/**
 * ClickSpark - Vanilla JS Version
 * Ported from the React-bits component provided in click spark.txt
 */
class ClickSpark {
  constructor(options = {}) {
    this.sparkColor = options.sparkColor || "white";
    this.sparkSize = options.sparkSize || 10;
    this.sparkRadius = options.sparkRadius || 15;
    this.sparkCount = options.sparkCount || 8;
    this.duration = options.duration || 400;
    this.easing = options.easing || "ease-out";
    this.extraScale = options.extraScale || 1.0;

    this.sparks = [];
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    this.canvas.id = "click-spark-canvas";
    document.body.appendChild(this.canvas);

    this.handleResize();
    window.addEventListener("resize", () => this.handleResize());

    document.addEventListener("mousedown", (e) => this.handleClick(e));

    const animate = (timestamp) => {
      this.draw(timestamp);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  easeFunc(t) {
    switch (this.easing) {
      case "linear":
        return t;
      case "ease-in":
        return t * t;
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t * (2 - t);
    }
  }

  handleClick(e) {
    const now = performance.now();
    const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
      x: e.clientX,
      y: e.clientY,
      angle: (2 * Math.PI * i) / this.sparkCount,
      startTime: now,
    }));
    this.sparks.push(...newSparks);
  }

  draw(timestamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sparks = this.sparks.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= this.duration) return false;

      const progress = elapsed / this.duration;
      const eased = this.easeFunc(progress);

      const distance = eased * this.sparkRadius * this.extraScale;
      const lineLength = this.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      this.ctx.strokeStyle = this.sparkColor;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      return true;
    });
  }
}

// ClickSpark class definition ends here
