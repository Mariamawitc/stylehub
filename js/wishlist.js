const WISHLIST_KEY = "stylehubWishlist";

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

const saveWishlist = (wishlistItems) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  syncWishlistButtons();
  renderWishlistPage();
};

const isWishlisted = (productId) => readWishlist().includes(productId);

const renderWishlistPage = () => {
  const wishlistGrid = document.querySelector("#wishlist-products");
  if (!wishlistGrid || !window.StyleHubProducts) return;

  const wishlistItems = readWishlist()
    .map((id) => window.StyleHubProducts.getProductById(id))
    .filter(Boolean);

  const wishlistCount = document.querySelector("#wishlist-count");
  if (wishlistCount) {
    wishlistCount.textContent = `${wishlistItems.length} saved item${wishlistItems.length === 1 ? "" : "s"}`;
  }

  if (wishlistItems.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="empty-cart wishlist-empty">
        <h2>Your wishlist is empty</h2>
        <p>Tap the heart on products you love and they will appear here.</p>
        <a class="btn-primary" href="shop.html">Browse Products</a>
      </div>
    `;
    return;
  }

  window.StyleHubProducts.renderProductGrid(wishlistGrid, wishlistItems);
  syncWishlistButtons();
};

const toggleWishlist = (productId) => {
  const product = window.StyleHubProducts?.getProductById(productId);
  if (!product) return;

  const wishlistItems = readWishlist();
  const alreadySaved = wishlistItems.includes(productId);
  const nextWishlist = alreadySaved
    ? wishlistItems.filter((id) => id !== productId)
    : [...wishlistItems, productId];

  saveWishlist(nextWishlist);

  if (typeof showToast === "function") {
    showToast(alreadySaved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
  }
};

const syncWishlistButtons = () => {
  const wishlistItems = readWishlist();

  document.querySelectorAll("[data-wishlist]").forEach((button) => {
    const saved = wishlistItems.includes(button.dataset.wishlist);
    button.classList.toggle("is-active", saved);
    button.textContent = saved ? "\u2665" : "\u2661";
    button.setAttribute("aria-pressed", String(saved));

    const product = window.StyleHubProducts?.getProductById(button.dataset.wishlist);
    if (product) {
      button.setAttribute("aria-label", `${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  syncWishlistButtons();
  renderWishlistPage();

  document.addEventListener("click", (event) => {
    const wishlistButton = event.target.closest("[data-wishlist]");
    if (!wishlistButton) return;

    event.preventDefault();
    toggleWishlist(wishlistButton.dataset.wishlist);
  });
});

window.StyleHubWishlist = {
  isWishlisted,
  renderWishlistPage,
  readWishlist,
  saveWishlist,
  syncWishlistButtons,
  toggleWishlist
};
