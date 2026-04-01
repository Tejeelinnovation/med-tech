const userEmail = localStorage.getItem("userEmail");

const res = await fetch(
  `http://localhost:3000/api/cart?email=${userEmail}`
);

function formatPrice(value) {
  return `₹${value}`;
}

async function renderCart() {
  try {
    const res = await fetch("http://localhost:3000/api/cart?email=test@gmail.com");
    const cart = await res.json();

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
          <p><strong>${formatPrice(item.price)}</strong></p>

          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.productId}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.productId}">+</button>
          </div>

          <button class="remove-btn" data-action="remove" data-id="${item.productId}">Remove</button>
        </div>
        <div class="cart-price">${formatPrice(item.price * item.quantity)}</div>
      </article>
    `).join("");

    updateSummary(cart);

    // actions
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        const action = button.dataset.action;
        const productId = button.dataset.id;

        await fetch("http://localhost:3000/api/cart/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            productId,
            action
          })
        });

        renderCart(); // reload
      });
    });

  } catch (err) {
    console.error("Cart error:", err);
  }
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