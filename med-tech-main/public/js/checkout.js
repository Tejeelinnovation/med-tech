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

function renderCheckout() {
  const cart = getCart();
  const checkoutItems = document.getElementById("checkout-items");

  checkoutItems.innerHTML = cart.map((item) => `
    <div class="checkout-item">
      <span>${item.name} × ${item.quantity} <small>(${item.size})</small></span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? 99 : 0;
  const total = subtotal + delivery;

  document.getElementById("checkout-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkout-delivery").textContent = formatPrice(delivery);
  document.getElementById("checkout-total").textContent = formatPrice(total);
}

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Order placed successfully.");
  saveCart([]);
  window.location.href = "./collection.html";
});

renderCheckout();