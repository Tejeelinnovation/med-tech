gsap.registerPlugin(ScrollTrigger);

const CART_KEY = "medtech-cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.id === product.id && item.size === product.size,
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

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
        start: "top 88%",
      },
    },
  );
});

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
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.45,
      ease: "power3.out",
    });
  });
});

document.querySelectorAll(".cart-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      oldPrice: Number(button.dataset.oldPrice),
      image: button.dataset.image,
      size: button.dataset.size,
    });

    const original = button.textContent;
    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = original;
    }, 1000);
  });
});

updateCartCount();

function toggleMenu() {
  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navItems = document.getElementById("nav-items");

  if (hamburger && navItems) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navItems.classList.toggle("open");
    });

    navItems.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navItems.classList.remove("open");
      });
    });
  }
}

toggleMenu();
