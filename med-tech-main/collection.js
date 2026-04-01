const userEmail = localStorage.getItem("userEmail");

async function updateCartCount() {
  try {
    const res = await fetch("http://localhost:3000/api/cart?email=test@gmail.com");
    const cart = await res.json();

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");

    if (badge) badge.textContent = count;
  } catch (err) {
    console.error(err);
  }
}
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();

    const container = document.querySelector(".collection-grid");

    container.innerHTML = "";

    products.forEach((product) => {
      container.innerHTML += `
  <article class="product-card" data-tilt data-product="${product._id}">
    <a class="card-link" href="./product.html?id=${product._id}">
      ${product.discount > 0 ? `
  <span class="product-badge">${product.discount}% OFF</span>
` : ""}
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
      </div>

      <div class="product-content">
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>

        <div class="product-price">
         ${product.discount > 0 ? `
  <span class="old-price">₹${product.price}</span>
  <span class="new-price">
    ₹${Math.round(product.price - (product.price * product.discount / 100))}
  </span>
` : `
  <span class="new-price">₹${product.price}</span>
`}
        </div>
      </div>

    </a>

    <div class="product-actions">
      <button
        class="cart-btn"
        data-id="${product._id}"
        data-name="${product.name}"
        data-price="${product.price}"
        data-discount="${product.discount || 0}"
        data-image="${product.image}"
      >
        Add to Cart
      </button>

      <a class="buy-now-btn" href="./product.html?id=${product._id}">
        Buy Now
      </a>
    </div>
  </article>
`;;
    });

  } catch (err) {
    console.error("Products load error:", err);
  }
}

loadProducts();
async function addToCart(product) {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    alert("Please login first");
    window.location.href = "auth/login.html";
    return;
  }

  await fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: userEmail,   // ✅ dynamic
      item: product
    })
  });

  updateCartCount();
}

function initCardAnimation() {
  gsap.utils.toArray(".product-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 70, scale: 0.94, rotateX: 8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: index * 0.04,
        scrollTrigger: {
          trigger: card,
          start: "top 88%"
        }
      }
    );
  });
}

function initTiltEffect() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const maxRotate = 10;

    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / (rect.width / 2)) * maxRotate;
      const rotateX = -(mouseY / (rect.height / 2)) * maxRotate;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformOrigin: "center",
        duration: 0.25,
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        ease: "power3.out"
      });
    });
  });
}

loadProducts().then(() => {
  initCardAnimation();
  initTiltEffect();
});
document.addEventListener("click", (e) => {
  const button = e.target.closest(".cart-btn");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  addToCart({
    _id: button.dataset.id,
    name: button.dataset.name,
    price: Number(button.dataset.price),
    discount: Number(button.dataset.discount || 0),
    image: button.dataset.image,
    size: button.dataset.size
  });

  const original = button.textContent;
  button.textContent = "Added ✓";

  setTimeout(() => {
    button.textContent = original;
  }, 1000);
});

updateCartCount();