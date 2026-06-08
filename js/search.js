const createSearchOverlay = () => {
  if (document.querySelector(".search-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div class="search-header">
        <h2 id="search-title">Search StyleHub</h2>
        <button type="button" data-close-search aria-label="Close search">×</button>
      </div>
      <input type="search" id="site-search-input" placeholder="Search hoodies, jeans, shoes...">
      <div class="search-results" id="search-results"></div>
    </div>
  `;
  document.body.appendChild(overlay);
};

const renderSearchResults = (query = "") => {
  const results = document.querySelector("#search-results");
  if (!results || !window.StyleHubProducts) return;

  const normalizedQuery = query.trim().toLowerCase();
  const matches = window.StyleHubProducts.all.filter((product) => {
    return !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.gender.toLowerCase().includes(normalizedQuery);
  });

  results.innerHTML = matches.length
    ? matches.map((product) => `
      <a class="search-result" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.alt}">
        <span>${product.name}</span>
        <strong>${window.StyleHubProducts.formatMoney(product.price)}</strong>
      </a>
    `).join("")
    : `<p class="no-results">No products found.</p>`;
};

const openSearch = () => {
  createSearchOverlay();
  const overlay = document.querySelector(".search-overlay");
  overlay.classList.add("open");
  renderSearchResults();
  document.querySelector("#site-search-input").focus();
};

const closeSearch = () => {
  document.querySelector(".search-overlay")?.classList.remove("open");
};

const searchProducts = (query) => {
  return (window.StyleHubProducts?.all || []).filter((product) => {
    const value = query.toLowerCase();
    return product.name.toLowerCase().includes(value) || product.category.toLowerCase().includes(value);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[aria-label='Search']").forEach((button) => {
    button.addEventListener("click", openSearch);
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("#site-search-input")) {
      renderSearchResults(event.target.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-search]") || event.target.classList.contains("search-overlay")) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSearch();
  });
});

window.searchProducts = searchProducts;
