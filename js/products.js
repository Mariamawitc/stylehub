const products = [
  {
    id: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Hoodies",
    gender: "Men",
    price: 49.99,
    image: "assets/images/cat-hoodie2.png",
    alt: "Oversized black hoodie",
    tag: "NEW",
    description: "A soft heavyweight hoodie with a relaxed oversized fit, kangaroo pocket, and everyday streetwear shape.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    id: "cotton-white-tee",
    name: "Cotton White Tee",
    category: "T-shirts",
    gender: "Men",
    price: 24.99,
    image: "assets/images/cat-t-shirt.png",
    alt: "Cotton white tee",
    description: "A clean cotton tee made for layering or wearing on its own.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    id: "denim-jacket",
    name: "Denim Jacket",
    category: "Jackets",
    gender: "Women",
    price: 69.99,
    image: "assets/images/cat-denim.png",
    alt: "Denim jacket",
    tag: "NEW",
    description: "A structured denim jacket with a casual everyday fit.",
    sizes: ["S", "M", "L"],
    featured: true
  },
  {
    id: "cargo-pants",
    name: "Cargo Pants",
    category: "Pants",
    gender: "Men",
    price: 29.99,
    image: "assets/images/cat-cargo.png",
    alt: "Cargo pants",
    description: "Relaxed cargo pants with useful pockets and an easy straight-leg fit.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    id: "nike-dunk-shoes",
    name: "Shoes",
    category: "Shoes",
    gender: "Accessories",
    price: 89.99,
    image: "assets/images/cat-shoes.jpg",
    alt: "Nike dunk shoes",
    description: "Street-ready sneakers that pair well with denim, cargos, and hoodies.",
    sizes: ["7", "8", "9", "10"],
    featured: true
  },
  {
    id: "classic-cap",
    name: "Classic Cap",
    category: "Accessories",
    gender: "Accessories",
    price: 19.99,
    image: "assets/images/cat-accessories.png",
    alt: "Black cap",
    description: "A simple everyday cap with an adjustable back strap.",
    sizes: ["One Size"]
  },
  {
    id: "relaxed-shirt",
    name: "Relaxed Shirt",
    category: "T-shirts",
    gender: "Men",
    price: 34.99,
    image: "assets/images/cat-men.png",
    alt: "Men collection shirt",
    description: "A relaxed shirt with clean lines and a comfortable drape.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "soft-coat",
    name: "Soft Coat",
    category: "Jackets",
    gender: "Women",
    price: 79.99,
    image: "assets/images/cat-women.png",
    alt: "Women collection coat",
    description: "A soft statement coat designed for easy seasonal styling.",
    sizes: ["S", "M", "L"]
  }
];

const formatMoney = (value) => `$${Number(value).toFixed(2)}`;

const getProductById = (id) => products.find((product) => product.id === id) || products[0];

const productCardTemplate = (product) => `
  <article class="product-card" data-product-id="${product.id}" data-category="${product.category}" data-price="${product.price}">
    ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
    <button class="wishlist" type="button" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">♡</button>
    <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="${product.image}" alt="${product.alt}">
    </a>
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>${formatMoney(product.price)}</p>
      <button class="add-cart-btn" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
    </div>
  </article>
`;

const renderProductGrid = (container, list) => {
  if (!container) return;
  container.innerHTML = list.map(productCardTemplate).join("");
  window.StyleHubWishlist?.syncWishlistButtons();
};

const getCheckedValues = (selector) => [...document.querySelectorAll(`${selector}:checked`)].map((input) => input.value || input.parentElement.textContent.trim());

const filterAndSortProducts = () => {
  const shopGrid = document.querySelector("#shop-products");
  if (!shopGrid) return;

  const categoryFilters = getCheckedValues(".filter-group input[type='checkbox']");
  const priceFilter = document.querySelector(".filter-group input[type='radio']:checked")?.parentElement.textContent.trim() || "";
  const sortValue = document.querySelector("#sort-products")?.value || "";

  let visibleProducts = products.filter((product) => {
    const matchesCategory = categoryFilters.length === 0 || categoryFilters.some((filter) => {
      return product.category === filter || product.gender === filter;
    });

    const matchesPrice =
      !priceFilter ||
      (priceFilter.includes("Under") && product.price < 30) ||
      (priceFilter.includes("$30") && product.price >= 30 && product.price <= 70) ||
      (priceFilter.includes("Over") && product.price > 70);

    return matchesCategory && matchesPrice;
  });

  if (sortValue.includes("low")) {
    visibleProducts.sort((a, b) => a.price - b.price);
  }

  if (sortValue.includes("high")) {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  renderProductGrid(shopGrid, visibleProducts);

  const count = document.querySelector("#results-count");
  if (count) {
    count.textContent = `Showing ${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;
  }
};

const renderProductDetail = () => {
  const detail = document.querySelector("#product-detail");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id"));

  detail.innerHTML = `
    <div class="product-gallery">
      <img class="main-product-image" src="${product.image}" alt="${product.alt}">
      <div class="thumb-row">
        <img src="${product.image}" alt="${product.name}">
        <img src="assets/images/cat-hoodie.png" alt="Alternate product view">
        <img src="assets/images/cat-men.png" alt="Styled product look">
      </div>
    </div>
    <div class="product-panel">
      <p class="eyebrow">${product.tag || "StyleHub Pick"}</p>
      <h1>${product.name}</h1>
      <p class="product-price">${formatMoney(product.price)}</p>
      <p class="product-description">${product.description}</p>
      <div class="option-group">
        <h2>Size</h2>
        <div class="size-options">
          ${product.sizes.map((size, index) => `<button class="${index === 0 ? "selected" : ""}" type="button" data-size="${size}">${size}</button>`).join("")}
        </div>
      </div>
      <div class="option-group">
        <h2>Quantity</h2>
        <div class="quantity-control product-quantity">
          <button type="button" data-quantity-change="-1">-</button>
          <span data-quantity-value>1</span>
          <button type="button" data-quantity-change="1">+</button>
        </div>
      </div>
      <button class="wishlist detail-wishlist" type="button" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">♡</button>
      <button class="btn-primary wide-btn" type="button" data-add-detail-cart="${product.id}">Add to Cart</button>
    </div>
  `;

  renderProductGrid(document.querySelector("#related-products"), products.filter((item) => item.id !== product.id).slice(0, 3));
  window.StyleHubWishlist?.syncWishlistButtons();
};

document.addEventListener("DOMContentLoaded", () => {
  renderProductGrid(document.querySelector("#new-arrivals"), products.filter((product) => product.featured));
  renderProductGrid(document.querySelector("#shop-products"), products);
  renderProductDetail();

  document.querySelectorAll(".filter-group input, #sort-products").forEach((control) => {
    control.addEventListener("change", filterAndSortProducts);
  });
});

window.StyleHubProducts = {
  all: products,
  formatMoney,
  getProductById,
  renderProductGrid
};
