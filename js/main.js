// DOM Elements
const menuToggle = document.querySelector(".header__menu-toggle");
const navbar = document.querySelector(".header__nav");
const closeButton = document.querySelector(".header__menu-close");
const overlay = document.querySelector(".header__overlay");
const slides = Array.from(document.querySelectorAll(".hero__img-container"));
const titleEl = document.querySelector(".hero__title");
const descEl = document.querySelector(".hero__description");
const prevBtn = document.querySelector(".hero__nav-btn--prev");
const nextBtn = document.querySelector(".hero__nav-btn--next");
const statusEl = document.getElementById("hero-status");
const contentEl = document.querySelector(".hero__content");

// Navbar functionality
const focusableElements = navbar.querySelectorAll(
  'a[href], button, [tabindex]:not([tabindex="-1"])'
);
const firstFocusableElement = focusableElements[0];
const lastFocusableElement = focusableElements[focusableElements.length - 1];

const openNavbar = () => {
  navbar.classList.add("is-open");
  navbar.setAttribute("aria-expanded", "true");
  navbar.setAttribute("aria-hidden", "false");
  overlay.classList.add("is-active");
  firstFocusableElement.focus();
};

const closeNavbar = () => {
  navbar.classList.remove("is-open");
  navbar.setAttribute("aria-expanded", "false");
  navbar.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-active");
  menuToggle.focus();
};

const handleClickOutside = (event) => {
  if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
    closeNavbar();
  }
};

const handleKeydown = (event) => {
  if (event.key === "Escape" && navbar.classList.contains("is-open")) {
    closeNavbar();
  }

  if (event.key === "Tab" && navbar.classList.contains("is-open")) {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }
};

// Gallery functionality
const announce = (index) => {
  if (!statusEl) return;
  const { title = "" } = slides[index].dataset;
  statusEl.textContent = `Slide ${index + 1} of ${slides.length}: ${title}`;
};

const setSlideA11y = (activeIndex) => {
  slides.forEach((slide, i) => {
    slide.setAttribute("aria-hidden", i === activeIndex ? "false" : "true");
  });
};

// Use DOM state if a slide is already active; fallback to 0
let currentSlide = slides.findIndex((s) =>
  s.classList.contains("hero__img-container--active")
);
if (currentSlide < 0) currentSlide = 0;

const updateGallery = (index) => {
  const { title = "", description = "" } = slides[index].dataset;
  titleEl.textContent = title;
  descEl.textContent = description;
  announce(index);
};

const showSlide = (index) => {
  const newIndex = (index + slides.length) % slides.length; // wrap

  slides[currentSlide].classList.remove("hero__img-container--active");
  slides[newIndex].classList.add("hero__img-container--active");

  // Fade out text, swap content, fade in
  const apply = () => {
    currentSlide = newIndex;
    setSlideA11y(currentSlide);
    updateGallery(currentSlide);
    // fade-in on next frame
    requestAnimationFrame(() => contentEl?.classList.remove("is-fading"));
  };

  if (contentEl) {
    contentEl.classList.add("is-fading");
    contentEl.addEventListener(
      "transitionend",
      function onEnd(e) {
        if (e.target !== contentEl) return;
        contentEl.removeEventListener("transitionend", onEnd);
        apply();
      },
      { once: true }
    );
  } else {
    apply();
  }
};

setSlideA11y(currentSlide);
updateGallery(currentSlide);

// Event listeners
menuToggle.addEventListener("click", openNavbar);
closeButton.addEventListener("click", closeNavbar);
document.addEventListener("click", handleClickOutside);
document.addEventListener("keydown", handleKeydown);

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});
