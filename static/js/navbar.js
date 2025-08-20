document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    // Remove any existing active class first
    link.classList.remove("active");
  });

  // Highlight normal links
  navLinks.forEach((link) => {
    // Skip dropdown toggles for now
    if (!link.classList.contains("dropdown-toggle")) {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    }
  });

  // Highlight dropdown toggles if one of its items is active
  const dropdowns = document.querySelectorAll(".nav-item.dropdown");
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const items = dropdown.querySelectorAll(".dropdown-item");
    items.forEach((item) => {
      if (new URL(item.href).pathname === currentPath) {
        toggle.classList.add("active");
      }
    });
  });
});
