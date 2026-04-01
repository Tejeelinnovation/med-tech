const CART_KEY = "medtech-cart";

gsap.registerPlugin(ScrollTrigger);
const userEmail = localStorage.getItem("userEmail");

// const products = {
//   "relief-oil": {
//     id: "relief-oil",
//     title: "Relief Oil",
//     image: "./product-1.png",
//     oldPrice: 999,
//     newPrice: 699,
//     short: "Quick absorbing formula for everyday body comfort and relaxation.",
//     description:
//       "Relief Oil is a fast-absorbing wellness formula designed for daily body care. It glides smoothly over the skin, feels lightweight, and helps create a relaxing comfort ritual after long work hours, gym sessions, or physically active days.",
//     sizes: ["50 ml", "100 ml", "200 ml"],
//     ingredients:
//       "Prepared with botanical extracts, soothing herbal oils, cooling actives, and skin-friendly carriers. The formula is designed to spread easily, absorb well, and give a premium, non-sticky feel with a comforting aromatic profile."
//   },
//   "herbal-spray": {
//     id: "herbal-spray",
//     title: "Herbal Spray",
//     image: "./product-2.png",
//     oldPrice: 799,
//     newPrice: 549,
//     short: "Refreshing herbal support designed for fast soothing action.",
//     description:
//       "Herbal Spray offers quick freshness and soothing support in an easy spray format. It is ideal for people who want fast application, lightweight coverage, and a cooling finish throughout the day.",
//     sizes: ["75 ml", "150 ml", "250 ml"],
//     ingredients:
//       "Prepared with herbal concentrates, cooling agents, aromatic oils, and balancing extracts that support a fresh and comfortable application experience."
//   },
//   "muscle-gel": {
//     id: "muscle-gel",
//     title: "Muscle Gel",
//     image: "./product-3.png",
//     oldPrice: 899,
//     newPrice: 649,
//     short: "Cooling recovery gel that helps relax tired and stressed muscles.",
//     description:
//       "Muscle Gel is a recovery-focused formula with a cooling touch and smooth finish. It is crafted for post-activity use and works well as part of a regular comfort and relaxation routine.",
//     sizes: ["50 g", "100 g", "200 g"],
//     ingredients:
//       "Prepared with cooling actives, targeted herbal extracts, hydrating agents, and skin-comfort ingredients for a smooth, premium feel."
//   },
//   "recovery-drops": {
//     id: "recovery-drops",
//     title: "Recovery Drops",
//     image: "./product-1.png",
//     oldPrice: 1099,
//     newPrice: 799,
//     short: "Gentle wellness drops made to support a calm and balanced routine.",
//     description:
//       "Recovery Drops are crafted for people who want a gentle and balanced wellness addition to their routine, with a premium look and clean experience.",
//     sizes: ["30 ml", "60 ml", "100 ml"],
//     ingredients:
//       "Prepared with selected herbal extracts, botanical oils, concentrated actives, and carefully balanced carriers."
//   },
//   "joint-ease-cream": {
//     id: "joint-ease-cream",
//     title: "Joint Ease Cream",
//     image: "./product-2.png",
//     oldPrice: 949,
//     newPrice: 679,
//     short: "Comfort cream made for smooth application and daily joint care.",
//     description:
//       "Joint Ease Cream is designed for smooth everyday application with a soft, comforting texture that feels nourishing and premium.",
//     sizes: ["50 g", "100 g", "150 g"],
//     ingredients:
//       "Prepared with herbal cream base, plant-derived soothing agents, cooling extracts, and hydrating compounds."
//   },
//   "calm-balm": {
//     id: "calm-balm",
//     title: "Calm Balm",
//     image: "./product-3.png",
//     oldPrice: 699,
//     newPrice: 499,
//     short: "Rich nourishing balm with a comforting feel for targeted use.",
//     description:
//       "Calm Balm is a rich targeted balm with a deeply nourishing texture for people who prefer a denser, comfort-focused formula.",
//     sizes: ["25 g", "50 g", "100 g"],
//     ingredients:
//       "Prepared with waxes, botanical butters, aromatic oils, and concentrated herbal extracts for a rich premium finish."
//   },
//   "deep-relief-roll-on": {
//     id: "deep-relief-roll-on",
//     title: "Deep Relief Roll On",
//     image: "./product-1.png",
//     oldPrice: 849,
//     newPrice: 599,
//     short: "Portable roll on care that fits perfectly into your daily routine.",
//     description:
//       "Deep Relief Roll On offers an easy on-the-go format with smooth roll-on delivery, ideal for compact everyday use.",
//     sizes: ["40 ml", "75 ml", "100 ml"],
//     ingredients:
//       "Prepared with quick-spread actives, herbal oils, cooling essences, and a smooth liquid carrier system."
//   },
//   "body-reset-spray": {
//     id: "body-reset-spray",
//     title: "Body Reset Spray",
//     image: "./product-2.png",
//     oldPrice: 759,
//     newPrice: 529,
//     short: "Lightweight body spray created for cooling comfort and freshness.",
//     description:
//       "Body Reset Spray is a refreshing body-care product designed for a cooling, light, and easy-to-use experience throughout active days.",
//     sizes: ["80 ml", "150 ml", "200 ml"],
//     ingredients:
//       "Prepared with aromatic oils, cooling botanicals, light herbal extracts, and refreshing active ingredients."
//   },
//   "active-recovery-cream": {
//     id: "active-recovery-cream",
//     title: "Active Recovery Cream",
//     image: "./product-3.png",
//     oldPrice: 1199,
//     newPrice: 899,
//     short: "Premium comfort cream for post activity recovery and support.",
//     description:
//       "Active Recovery Cream is a premium comfort cream built for post-activity use, with a soft luxurious texture and strong premium positioning.",
//     sizes: ["50 g", "100 g", "200 g"],
//     ingredients:
//       "Prepared with active herbal compounds, recovery-focused extracts, rich cream base ingredients, and smooth hydrating carriers."
//   }
// };

function formatPrice(value) {
  return `₹${value}`;
}

async function updateCartCount() {
  try {
    const res = await fetch("http://localhost:3000/api/cart?email=test@gmail.com");
    const cart = await res.json();

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;

  } catch (err) {
    console.error("Cart count error:", err);
  }
}
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
      email: userEmail,
      item: product
    })
  });

  updateCartCount();
}

const params = new URLSearchParams(window.location.search);


const id = params.get("id");

let product = null;


async function loadProduct() {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    product = await res.json();

    console.log(product);

    if (!product || product.message) {
      document.body.innerHTML = "<h2>Product not found</h2>";
      return;
    }

    // UI update
    document.getElementById("product-title").textContent = product.name;
    const badge = document.getElementById("discount-badge");

    if (product.discount > 0) {
      badge.textContent = `${product.discount}% OFF`;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-image").alt = product.name;

    document.getElementById("product-description").textContent = product.description;
    const newPrice = Math.round(
      product.price - (product.price * (product.discount || 0) / 100)
    );

    document.getElementById("new-price").textContent = `₹${newPrice}`;

    if (product.discount > 0) {
      document.getElementById("old-price").textContent = `₹${product.price}`;
    } else {
      document.getElementById("old-price").textContent = "";
    }

    document.getElementById("ingredients-text").textContent =
      product.description || "Premium herbal formulation";

    const sizeOptions = document.getElementById("size-options");
    sizeOptions.innerHTML = "";

    const sizes = ["50 ml", "100 ml", "150ml"];
    let selectedSize = sizes[0];

    sizes.forEach((size, index) => {
      const button = document.createElement("button");
      button.className = "size-pill" + (index === 0 ? " active" : "");
      button.textContent = size;

      button.addEventListener("click", () => {
        document.querySelectorAll(".size-pill").forEach((pill) => pill.classList.remove("active"));
        button.classList.add("active");
        selectedSize = size;
      });

      sizeOptions.appendChild(button);
    });

    // Add to cart
    document.getElementById("add-to-cart-btn").onclick = function () {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.image,
        size: selectedSize
      });

      const original = this.textContent;
      this.textContent = "Added ✓";
      setTimeout(() => {
        this.textContent = original;
      }, 1000);
    };

    // Buy now
    document.getElementById("buy-now-btn").onclick = () => {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.image,
        size: selectedSize
      });

      window.location.href = "./checkout.html";
    };

  } catch (err) {
    console.error("Error:", err);
  }
}


async function renderSuggestedProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products");
    const allProducts = await res.json();

    const suggestedGrid = document.getElementById("suggested-grid");
    if (!suggestedGrid) return;

    // current product remove
    const others = allProducts
      .filter((item) => item._id !== product._id)
      .slice(0, 3);

    suggestedGrid.innerHTML = others.map((item) => `
      <article class="suggested-card tilt-card">
      
        <a href="./product.html?id=${item._id}" class="suggested-link">
        
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${(item.description || "").substring(0, 60)}...</p>
          <div class="suggested-price">
            <span class="new-price">₹${item.price}</span>
          </div>
        </a>

        <button
          class="suggested-btn"
          data-id="${item._id}"
          data-name="${item.name}"
          data-price="${item.price}"
          data-discount="${item.discount || 0}"
          data-image="${item.image}"
          data-size="100 ml"
        >
          Add to Cart
        </button>
      </article>
    `).join("");
    document.querySelectorAll(".suggested-btn").forEach((button) => {
      button.addEventListener("click", () => {
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
    });

  } catch (err) {
    console.error("Suggested error:", err);
  }

}

gsap.from(".product-visual", {
  y: 50,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out"
});

gsap.from(".product-info > *", {
  y: 24,
  opacity: 0,
  duration: 0.75,
  stagger: 0.08,
  delay: 0.12,
  ease: "power3.out"
});

gsap.utils.toArray(".review-card, .suggested-card, .story-step, .card-block, .ingredient-panel").forEach((item, index) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 88%"
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    delay: index * 0.03,
    ease: "power3.out"
  });
});

function initTiltEffect() {
  document.querySelectorAll(".tilt-card, .visual-card").forEach((card) => {
    const maxRotate = 10;

    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * maxRotate * 2;
      const rotateX = -((y / rect.height) - 0.5) * maxRotate * 2;

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
        ease: "power3.out"
      });
    });
  });
}

loadProduct().then(() => {
  renderSuggestedProducts();
  initTiltEffect();
});

updateCartCount();



