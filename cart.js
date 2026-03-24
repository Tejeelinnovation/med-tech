const CART_KEY = "medtech-cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
  return `₹${value}`;
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cart-items");
  const emptyState = document.getElementById("empty-state");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cart.length) {
    cartItems.innerHTML = "";
    emptyState.style.display = "block";
    checkoutBtn.style.pointerEvents = "none";
    checkoutBtn.style.opacity = "0.5";
    updateSummary(cart);
    return;
  }

  emptyState.style.display = "none";

  cartItems.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>Size: ${item.size}</p>
        <p><span style="text-decoration:line-through;color:#8a8682;">${formatPrice(item.oldPrice)}</span> &nbsp; <strong>${formatPrice(item.price)}</strong></p>

        <div class="qty-controls">
          <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        </div>

        <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
      </div>
      <div class="cart-price">${formatPrice(item.price * item.quantity)}</div>
    </article>
  `).join("");

  updateSummary(cart);

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const index = Number(button.dataset.index);
      const updated = getCart();

      if (action === "increase") updated[index].quantity += 1;
      if (action === "decrease") updated[index].quantity -= 1;
      if (action === "remove" || updated[index]?.quantity <= 0) updated.splice(index, 1);

      saveCart(updated);
      renderCart();
    });
  });
}

function updateSummary(cart) {
  const items = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? 99 : 0;
  const total = subtotal + delivery;

  document.getElementById("summary-items").textContent = items;
  document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("summary-delivery").textContent = formatPrice(delivery);
  document.getElementById("summary-total").textContent = formatPrice(total);
}

renderCart();