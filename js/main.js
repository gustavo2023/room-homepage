const menuToggle = document.querySelector(".header__menu-toggle");
const navbar = document.querySelector(".header__nav");
const closeButton = document.querySelector(".header__menu-close");
const overlay = document.querySelector(".header__overlay");

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

menuToggle.addEventListener("click", openNavbar);
closeButton.addEventListener("click", closeNavbar);
document.addEventListener("click", handleClickOutside);
document.addEventListener("keydown", handleKeydown);
