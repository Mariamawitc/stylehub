const header = document.querySelector(".site-header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".header-actions").forEach((actions) => {
    if (actions.querySelector(".wishlist-link")) return;

    const cartLink = actions.querySelector(".cart-link");
    const wishlistLink = document.createElement("a");
    wishlistLink.className = "icon-btn wishlist-link";
    wishlistLink.href = "wishlist.html";
    wishlistLink.setAttribute("aria-label", "Wishlist");
    wishlistLink.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>
      </svg>
    `;

    if (window.location.pathname.endsWith("wishlist.html")) {
      wishlistLink.classList.add("active");
    }

    actions.insertBefore(wishlistLink, cartLink);
  });

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.querySelector("input[type='email']");
      if (!email.value.trim()) return;

      localStorage.setItem("stylehubNewsletterEmail", email.value.trim());
      email.value = "";

      if (typeof showToast === "function") {
        showToast("Thanks for subscribing");
      }
    });
  });

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();

      if (typeof showToast === "function") {
        showToast("Message sent");
      }
    });
  });
});
