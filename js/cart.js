const CART_KEY = "stylehubCart";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cartItems) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  updateCartCount();
};

const updateCartCount = () => {
  const totalItems = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-link span").forEach((badge) => {
    badge.textContent = totalItems;
  });
};

const addToCart = (productId, quantity = 1, size = "M") => {
  const product = window.StyleHubProducts?.getProductById(productId);
  if (!product) return;

  const cartItems = readCart();
  const existingItem = cartItems.find((item) => item.id === productId && item.size === size);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ id: productId, quantity, size });
  }

  saveCart(cartItems);
  showToast(`${product.name} added to cart`);
  renderCartPage();
};

const updateCartItem = (productId, size, quantity) => {
  const nextCart = readCart()
    .map((item) => item.id === productId && item.size === size ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);

  saveCart(nextCart);
  renderCartPage();
};

const removeCartItem = (productId, size) => {
  saveCart(readCart().filter((item) => !(item.id === productId && item.size === size)));
  renderCartPage();
};

const getCartRows = () => {
  return readCart()
    .map((item) => {
      const product = window.StyleHubProducts?.getProductById(item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);
};

const renderCartPage = () => {
  const cartContainer = document.querySelector("#cart-items");
  const summary = document.querySelector("#order-summary");
  if (!cartContainer || !summary || !window.StyleHubProducts) return;

  const cartRows = getCartRows();
  const subtotal = cartRows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 6.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  if (cartRows.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add a few StyleHub pieces and they will appear here.</p>
        <a class="btn-primary" href="shop.html">Shop Now</a>
      </div>
    `;
  } else {
    cartContainer.innerHTML = cartRows.map(({ product, quantity, size }) => `
      <article class="cart-item" data-cart-id="${product.id}" data-cart-size="${size}">
        <img src="${product.image}" alt="${product.alt}">
        <div>
          <h2>${product.name}</h2>
          <p>Size ${size}</p>
          <div class="quantity-control">
            <button type="button" data-cart-change="-1">-</button>
            <span>${quantity}</span>
            <button type="button" data-cart-change="1">+</button>
          </div>
        </div>
        <div class="cart-price">
          <strong>${window.StyleHubProducts.formatMoney(product.price * quantity)}</strong>
          <button type="button" data-remove-cart>Remove</button>
        </div>
      </article>
    `).join("");
  }

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <div><span>Subtotal</span><strong>${window.StyleHubProducts.formatMoney(subtotal)}</strong></div>
    <div><span>Shipping</span><strong>${shipping === 0 ? "Free" : window.StyleHubProducts.formatMoney(shipping)}</strong></div>
    <div><span>Tax</span><strong>${window.StyleHubProducts.formatMoney(tax)}</strong></div>
    <div class="total"><span>Total</span><strong>${window.StyleHubProducts.formatMoney(total)}</strong></div>
    <button class="btn-primary wide-btn" type="button" ${cartRows.length === 0 ? "disabled" : ""}>Checkout</button>
    <a class="continue-link" href="shop.html">Continue Shopping</a>
  `;
};

const showToast = (message) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
};

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.dataset.addToCart);
    }

    const detailButton = event.target.closest("[data-add-detail-cart]");
    if (detailButton) {
      const quantity = Number(document.querySelector("[data-quantity-value]")?.textContent || 1);
      const size = document.querySelector(".size-options .selected")?.dataset.size || "M";
      addToCart(detailButton.dataset.addDetailCart, quantity, size);
    }

    const quantityButton = event.target.closest("[data-cart-change]");
    if (quantityButton) {
      const item = quantityButton.closest(".cart-item");
      const currentQuantity = Number(item.querySelector(".quantity-control span").textContent);
      updateCartItem(item.dataset.cartId, item.dataset.cartSize, currentQuantity + Number(quantityButton.dataset.cartChange));
    }

    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
      const item = removeButton.closest(".cart-item");
      removeCartItem(item.dataset.cartId, item.dataset.cartSize);
    }

    const productQuantityButton = event.target.closest("[data-quantity-change]");
    if (productQuantityButton) {
      const value = document.querySelector("[data-quantity-value]");
      const nextValue = Math.max(1, Number(value.textContent) + Number(productQuantityButton.dataset.quantityChange));
      value.textContent = nextValue;
    }

    const sizeButton = event.target.closest("[data-size]");
    if (sizeButton) {
      sizeButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("selected"));
      sizeButton.classList.add("selected");
    }
  });
});

window.StyleHubCart = {
  addToCart,
  readCart,
  saveCart,
  updateCartCount
};
