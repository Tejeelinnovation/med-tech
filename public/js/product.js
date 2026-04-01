gsap.registerPlugin(ScrollTrigger);

const CART_KEY = "medtech-cart";

const products = {
  "relief-oil": {
    id: "relief-oil",
    title: "Relief Oil",
    image: "./product-1.png",
    oldPrice: 999,
    newPrice: 699,
    short: "Quick absorbing formula for everyday body comfort and relaxation.",
    description:
      "Relief Oil is a fast-absorbing wellness formula designed for daily body care. It glides smoothly over the skin, feels lightweight, and helps create a relaxing comfort ritual after long work hours, gym sessions, or physically active days.",
    sizes: ["50 ml", "100 ml", "200 ml"],
    ingredients:
      "Prepared with botanical extracts, soothing herbal oils, cooling actives, and skin-friendly carriers. The formula is designed to spread easily, absorb well, and give a premium, non-sticky feel with a comforting aromatic profile.",
  },
  "herbal-spray": {
    id: "herbal-spray",
    title: "Herbal Spray",
    image: "./product-2.png",
    oldPrice: 799,
    newPrice: 549,
    short: "Refreshing herbal support designed for fast soothing action.",
    description:
      "Herbal Spray offers quick freshness and soothing support in an easy spray format. It is ideal for people who want fast application, lightweight coverage, and a cooling finish throughout the day.",
    sizes: ["75 ml", "150 ml", "250 ml"],
    ingredients:
      "Prepared with herbal concentrates, cooling agents, aromatic oils, and balancing extracts that support a fresh and comfortable application experience.",
  },
  "muscle-gel": {
    id: "muscle-gel",
    title: "Muscle Gel",
    image: "./product-3.png",
    oldPrice: 899,
    newPrice: 649,
    short: "Cooling recovery gel that helps relax tired and stressed muscles.",
    description:
      "Muscle Gel is a recovery-focused formula with a cooling touch and smooth finish. It is crafted for post-activity use and works well as part of a regular comfort and relaxation routine.",
    sizes: ["50 g", "100 g", "200 g"],
    ingredients:
      "Prepared with cooling actives, targeted herbal extracts, hydrating agents, and skin-comfort ingredients for a smooth, premium feel.",
  },
  "recovery-drops": {
    id: "recovery-drops",
    title: "Recovery Drops",
    image: "./product-1.png",
    oldPrice: 1099,
    newPrice: 799,
    short: "Gentle wellness drops made to support a calm and balanced routine.",
    description:
      "Recovery Drops are crafted for people who want a gentle and balanced wellness addition to their routine, with a premium look and clean experience.",
    sizes: ["30 ml", "60 ml", "100 ml"],
    ingredients:
      "Prepared with selected herbal extracts, botanical oils, concentrated actives, and carefully balanced carriers.",
  },
  "joint-ease-cream": {
    id: "joint-ease-cream",
    title: "Joint Ease Cream",
    image: "./product-2.png",
    oldPrice: 949,
    newPrice: 679,
    short: "Comfort cream made for smooth application and daily joint care.",
    description:
      "Joint Ease Cream is designed for smooth everyday application with a soft, comforting texture that feels nourishing and premium.",
    sizes: ["50 g", "100 g", "150 g"],
    ingredients:
      "Prepared with herbal cream base, plant-derived soothing agents, cooling extracts, and hydrating compounds.",
  },
  "calm-balm": {
    id: "calm-balm",
    title: "Calm Balm",
    image: "./product-3.png",
    oldPrice: 699,
    newPrice: 499,
    short: "Rich nourishing balm with a comforting feel for targeted use.",
    description:
      "Calm Balm is a rich targeted balm with a deeply nourishing texture for people who prefer a denser, comfort-focused formula.",
    sizes: ["25 g", "50 g", "100 g"],
    ingredients:
      "Prepared with waxes, botanical butters, aromatic oils, and concentrated herbal extracts for a rich premium finish.",
  },
  "deep-relief-roll-on": {
    id: "deep-relief-roll-on",
    title: "Deep Relief Roll On",
    image: "./product-1.png",
    oldPrice: 849,
    newPrice: 599,
    short: "Portable roll on care that fits perfectly into your daily routine.",
    description:
      "Deep Relief Roll On offers an easy on-the-go format with smooth roll-on delivery, ideal for compact everyday use.",
    sizes: ["40 ml", "75 ml", "100 ml"],
    ingredients:
      "Prepared with quick-spread actives, herbal oils, cooling essences, and a smooth liquid carrier system.",
  },
  "body-reset-spray": {
    id: "body-reset-spray",
    title: "Body Reset Spray",
    image: "./product-2.png",
    oldPrice: 759,
    newPrice: 529,
    short: "Lightweight body spray created for cooling comfort and freshness.",
    description:
      "Body Reset Spray is a refreshing body-care product designed for a cooling, light, and easy-to-use experience throughout active days.",
    sizes: ["80 ml", "150 ml", "200 ml"],
    ingredients:
      "Prepared with aromatic oils, cooling botanicals, light herbal extracts, and refreshing active ingredients.",
  },
  "active-recovery-cream": {
    id: "active-recovery-cream",
    title: "Active Recovery Cream",
    image: "./product-3.png",
    oldPrice: 1199,
    newPrice: 899,
    short: "Premium comfort cream for post activity recovery and support.",
    description:
      "Active Recovery Cream is a premium comfort cream built for post-activity use, with a soft luxurious texture and strong premium positioning.",
    sizes: ["50 g", "100 g", "200 g"],
    ingredients:
      "Prepared with active herbal compounds, recovery-focused extracts, rich cream base ingredients, and smooth hydrating carriers.",
  },
};

function initReviewsMarquee() {
  const grid = document.querySelector(".reviews-grid");
  const marquee = document.querySelector(".reviews-marquee");

  if (!grid) return;

  // duplicate content
  grid.innerHTML += grid.innerHTML;

  gsap.to(grid, {
    x: "-50%",
    duration: 25,
    ease: "linear",
    repeat: -1,
  });

  marquee.addEventListener("mouseenter", () => gsap.globalTimeline.pause());
  marquee.addEventListener("mouseleave", () => gsap.globalTimeline.resume());
}

initReviewsMarquee();

function formatPrice(value) {
  return `₹${value}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
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

const params = new URLSearchParams(window.location.search);
const productKey = params.get("product") || "relief-oil";
const product = products[productKey] || products["relief-oil"];

document.getElementById("product-title").textContent = product.title;
document.getElementById("product-image").src = product.image;
document.getElementById("product-image").alt = product.title;
document.getElementById("old-price").textContent = formatPrice(
  product.oldPrice,
);
document.getElementById("new-price").textContent = formatPrice(
  product.newPrice,
);
document.getElementById("product-description").textContent =
  product.description;
document.getElementById("ingredients-text").textContent = product.ingredients;

const sizeOptions = document.getElementById("size-options");
let selectedSize = product.sizes[0];

product.sizes.forEach((size, index) => {
  const button = document.createElement("button");
  button.className = "size-pill" + (index === 0 ? " active" : "");
  button.textContent = size;

  button.addEventListener("click", () => {
    document
      .querySelectorAll(".size-pill")
      .forEach((pill) => pill.classList.remove("active"));
    button.classList.add("active");
    selectedSize = size;
  });

  sizeOptions.appendChild(button);
});

document
  .getElementById("add-to-cart-btn")
  .addEventListener("click", function () {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.newPrice,
      oldPrice: product.oldPrice,
      image: product.image,
      size: selectedSize,
    });

    const original = this.textContent;
    this.textContent = "Added ✓";
    setTimeout(() => {
      this.textContent = original;
    }, 1000);
  });

document.getElementById("buy-now-btn").addEventListener("click", () => {
  addToCart({
    id: product.id,
    name: product.title,
    price: product.newPrice,
    oldPrice: product.oldPrice,
    image: product.image,
    size: selectedSize,
  });

  window.location.href = "./checkout.html";
});

function renderSuggestedProducts() {
  const suggestedGrid = document.getElementById("suggested-grid");
  const others = Object.values(products)
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  suggestedGrid.innerHTML = others
    .map(
      (item) => `
    <article class="suggested-card tilt-card">
      <a href="./product.html?product=${item.id}" class="suggested-link">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.short}</p>
        <div class="suggested-price">
          <span class="old-price">${formatPrice(item.oldPrice)}</span>
          <span class="new-price">${formatPrice(item.newPrice)}</span>
        </div>
      </a>
      <button
        class="suggested-btn"
        data-id="${item.id}"
        data-name="${item.title}"
        data-price="${item.newPrice}"
        data-old-price="${item.oldPrice}"
        data-image="${item.image}"
        data-size="${item.sizes[0]}"
      >
        Add to Cart
      </button>
    </article>
  `,
    )
    .join("");

  document.querySelectorAll(".suggested-btn").forEach((button) => {
    button.addEventListener("click", () => {
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
}

gsap.from(".product-visual", {
  y: 50,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out",
});

gsap.from(".product-info > *", {
  y: 24,
  opacity: 0,
  duration: 0.75,
  stagger: 0.08,
  delay: 0.12,
  ease: "power3.out",
});

gsap.utils
  .toArray(".suggested-card, .story-step, .card-block, .ingredient-panel")
  .forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.03,
      ease: "power3.out",
    });
  });

document.querySelectorAll(".tilt-card, .visual-card").forEach((card) => {
  const maxRotate = 10;

  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 768) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * maxRotate * 2;
    const rotateX = -(y / rect.height - 0.5) * maxRotate * 2;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center",
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

renderSuggestedProducts();
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