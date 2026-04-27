gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cardContainer = document.querySelector(".card-container");
  const stickyHeader = document.querySelector(".sticky-header h1");

  const hero = document.querySelector(".hero");
  const heroBox = document.querySelector(".hero-box");
  const heroWord = document.querySelector(".hero .word");
  const heroCursor = document.querySelector(".hero .cursor");

  let isGapAnimationCompleted = false;
  let isFlipAnimationCompleted = false;

  /* TWEAK: Reduce this for less aggressive scale, increase for more pop */
  const CARD_MAX_SCALE = 1.35; 
  /* TWEAK: Minimum scale for background cards */
  const CARD_MIN_SCALE = 0.95; 

  let flowModeActive = false;
  let extraCards = [];
  let flowBase = null;

  /* TWEAK: Scroll trigger points for flow mode */
  const FLOW_START = 0.8;
  const FLOW_END = 1.0;
  const FLIP_TRIGGER = 0.5;

  // --- Smooth lerp utility for flow rendering ---
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

function createAccountButtonAnimation() {
  const accountBtn = document.querySelector(".account-btn");
  const intro = document.querySelector(".intro");

  if (!accountBtn || !intro) return;

  gsap.set(accountBtn, {
    y: -20,
    opacity: 0,
    filter: "blur(6px)",
  });

  const mm = gsap.matchMedia();

  mm.add("(max-width: 999px)", () => {
    // Mobile: intro hits viewport sooner, so trigger fires earlier
    ScrollTrigger.create({
      trigger: intro,
      start: "top -40%",
      end: "top 20%",
      scrub: 2.5,
      // markers: true,
      onUpdate: (self) => {
        const eased = gsap.parseEase("power2.out")(self.progress);
        gsap.to(accountBtn, {
          y: gsap.utils.interpolate(-20, 0, eased),
          opacity: eased,
          filter: `blur(${gsap.utils.interpolate(6, 0, eased)}px)`,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });
  });

  mm.add("(min-width: 1000px)", () => {
    // Desktop: original values
    ScrollTrigger.create({
      trigger: intro,
      start: "top -85%",
      end: "top 20%",
      scrub: 2.5,
      onUpdate: (self) => {
        const eased = gsap.parseEase("power2.out")(self.progress);
        gsap.to(accountBtn, {
          y: gsap.utils.interpolate(-20, 0, eased),
          opacity: eased,
          filter: `blur(${gsap.utils.interpolate(6, 0, eased)}px)`,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });
  });
}

  function createHeroAnimation() {
    if (!hero || !heroBox || !heroWord || !heroCursor) return;

    const heroWords = [
      "Hair Fall ?",
      "Thin Hair ?",
      "Weak Roots ?",
      "Brittle Hair ?",
      "Hair Fall ?",
    ];

    heroCursor.classList.add("blink");
    heroWord.textContent = heroWords[0];

    function getTypedText(word, progress) {
      const totalChars = word.length;

      if (progress <= 0.55) {
        const p = progress / 0.55;
        const count = Math.max(1, Math.floor(totalChars * p));
        return word.slice(0, count);
      }

      if (progress <= 0.8) {
        return word;
      }

      const p = (progress - 0.8) / 0.2;
      const count = Math.max(0, Math.ceil(totalChars * (1 - p)));
      return word.slice(0, count);
    }

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=160%",
      pin: true,
      scrub: 2.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const eased = gsap.parseEase("power3.inOut")(progress);

        const minHeight = 0;
        const maxHeight = window.innerHeight;
        const currentHeight = gsap.utils.interpolate(
          minHeight,
          maxHeight,
          eased,
        );

        gsap.set(heroBox, {
          height: `${currentHeight}px`,
        });

        const segment = 1 / heroWords.length;
        const currentWordIndex = Math.min(
          heroWords.length - 1,
          Math.floor(progress / segment),
        );

        const localProgress = gsap.utils.clamp(
          0,
          1,
          (progress - currentWordIndex * segment) / segment,
        );

        const activeWord = heroWords[currentWordIndex];
        const typedText = getTypedText(activeWord, localProgress);

        if (progress > 0.985) {
          heroWord.textContent = heroWords[heroWords.length - 1];
          heroCursor.classList.remove("blink");
          heroCursor.style.opacity = "1";
        } else {
          heroWord.textContent = typedText || " ";

          if (
            (localProgress >= 0.55 && localProgress <= 0.8) ||
            (progress > 0.96 && heroWord.textContent.trim().length > 0)
          ) {
            heroCursor.classList.add("blink");
          } else {
            heroCursor.classList.remove("blink");
            heroCursor.style.opacity = "1";
          }
        }
      },
    });
  }

  function createIntroAnimation() {
    const intro = document.querySelector(".intro");
    const img1 = document.querySelector(".img-1");
    const img2 = document.querySelector(".img-2");
    const img3 = document.querySelector(".img-3");

    if (!intro || !img1 || !img2 || !img3) return;

    gsap.set(img1, {
      scale: 2.2,
      x: -120,
      y: 120,
      rotation: -10,
      transformOrigin: "center center",
    });

    gsap.set(img2, {
      scale: 2.4,
      x: 140,
      y: 140,
      rotation: 12,
      transformOrigin: "center center",
    });

    gsap.set(img3, {
      scale: 2,
      x: 80,
      y: -120,
      rotation: 8,
      transformOrigin: "center center",
    });

    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: intro,
        start: "top 85%",
        end: "center center",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    introTl.to(img1, { scale: 1, x: 0, y: 0, rotation: 0, ease: "none" }, 0);
    introTl.to(img2, { scale: 1, x: 0, y: 0, rotation: 0, ease: "none" }, 0);
    introTl.to(img3, { scale: 1, x: 0, y: 0, rotation: 0, ease: "none" }, 0);
  }

  function createExtraCard(id, title, text) {
    const card = document.createElement("div");
    card.className = "card extra-card";
    card.id = id;

    card.innerHTML = `
      <div class="card-back">
        <span>${title}</span>
        <p>${text}</p>
      </div>
    `;

    return card;
  }

  async function createExtraCards() {
    if (extraCards.length) return;

    let data = [
      ["card-4", "image", "assets/images/cover-01.jpg", "assets/images/cover-01.jpg"],
      ["card-5", "text", "Aman Verma", "The products are amazing! My hair feels much stronger and the fall has reduced significantly within just 3 weeks."],
      ["card-6", "media", "assets/video/WhatsApp%20Video%202026-04-08%20at%2014.45.25.mp4", "assets/images/cover-03.jpg"],
      ["card-7", "text", "Sneha Rao", "I was skeptical about ayurvedic oils but this one really works. No more itchy scalp or dandruff."],
    ];

    try {
      // TWEAK: Update this URL to your actual production API endpoint if different
      const response = await fetch('http://localhost:3000/api/reviews'); 
      if (response.ok) {
        const apiReviews = await response.json();
        if (apiReviews && apiReviews.length > 0) {
          // Filter only active ones and map to the format we need
          data = apiReviews
            .filter(r => r.isActive !== false)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((r, index) => [
              `card-api-${index}`,
              r.mediaType || 'text',
              r.mediaType === 'none' ? r.name : r.mediaUrl,
              r.mediaType === 'none' ? r.comment : r.posterUrl
            ]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch reviews from API, using fallback data.", err);
    }

    extraCards = data.map(([id, type, titleOrUrl, textOrPoster]) => {
      const card = document.createElement("div");
      card.className = `card extra-card ${type === 'media' || type === 'image' ? 'media-card' : ''}`;
      card.id = id;

      if (type === 'media') {
        card.innerHTML = `
          <div class="card-back">
            <div class="media-container">
              <video 
                src="${titleOrUrl}" 
                poster="${textOrPoster}"
                autoplay 
                muted 
                loop 
                playsinline
                class="review-video">
              </video>
              <button class="mute-btn" aria-label="Toggle Mute">
                <svg class="unmute-icon" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM3 9v6h4l5 5V4L7 9H3z"/></svg>
                <svg class="mute-icon" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.41.32-.85.59-1.32.79v2.06c1.02-.23 1.97-.67 2.8-1.28l2.2 2.2 1.27-1.27L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              </button>
            </div>
          </div>
        `;
      } else if (type === 'image') {
        card.innerHTML = `
          <div class="card-back">
            <div class="media-container">
              <img src="${titleOrUrl}" alt="Review Image" class="review-image" />
            </div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="card-back">
            <span>${titleOrUrl}</span>
            <p>${textOrPoster}</p>
          </div>
        `;
      }
      return card;
    });
    extraCards.forEach((card) => cardContainer.appendChild(card));
    setupMuteButtons();
  }

  function setupMuteButtons() {
    const muteBtns = document.querySelectorAll(".mute-btn");
    muteBtns.forEach((btn) => {
      // Use onclick to avoid duplicate listeners if called multiple times
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const cardBack = btn.closest(".card-back");
        const video = cardBack.querySelector("video");
        if (video) {
          video.muted = !video.muted;
          btn.classList.toggle("unmuted", !video.muted);
        }
      };
    });
  }

  function removeExtraCards() {
    extraCards.forEach((card) => card.remove());
    extraCards = [];
  }

  async function enterFlowMode() {
    if (flowModeActive) return;

    await createExtraCards();

    const containerRect = cardContainer.getBoundingClientRect();
    const centerCard = document.querySelector("#card-2");
    const centerRect = centerCard.getBoundingClientRect();

    const baseLeft = centerRect.left - containerRect.left;
    const baseTop = centerRect.top - containerRect.top;
    const cardWidth = centerRect.width;
    const cardHeight = centerRect.height;

    flowBase = {
      left: baseLeft,
      top: baseTop,
      width: cardWidth,
      height: cardHeight,
    };

    ["#card-1", "#card-2", "#card-3"].forEach((selector) => {
      gsap.set(selector, {
        position: "absolute",
        left: baseLeft,
        top: baseTop,
        width: cardWidth,
        height: cardHeight,
        margin: 0,
        flex: "none",
        transformOrigin: "center center",
      });
    });

    extraCards.forEach((card) => {
      gsap.set(card, {
        left: baseLeft,
        top: baseTop,
        width: cardWidth,
        height: cardHeight,
        opacity: 0,
        x: 0,
        y: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
      });
    });

    flowModeActive = true;
  }

  function exitFlowMode() {
    if (!flowModeActive) return;

    const originals = ["#card-1", "#card-2", "#card-3"];

    originals.forEach((selector) => {
      gsap.set(selector, {
        clearProps:
          "position,left,top,width,height,margin,flex,xPercent,yPercent",
      });
    });

    gsap.set("#card-1", {
      x: 0,
      y: 30,
      scale: CARD_MAX_SCALE - 0.16,
      rotationY: 180,
      rotationZ: -15,
      opacity: 1,
    });

    gsap.set("#card-2", {
      x: 0,
      y: 0,
      scale: CARD_MAX_SCALE,
      rotationY: 180,
      rotationZ: 0,
      opacity: 1,
    });

    gsap.set("#card-3", {
      x: 0,
      y: 30,
      scale: CARD_MAX_SCALE - 0.16,
      rotationY: 180,
      rotationZ: 15,
      opacity: 1,
    });

    removeExtraCards();
    flowModeActive = false;
    flowBase = null;
  }

  function renderFlow(progress) {
    if (!flowModeActive || !flowBase) return;

    const originals = [
      document.querySelector("#card-1"),
      document.querySelector("#card-2"),
      document.querySelector("#card-3"),
    ];

    const allCards = [...originals, ...extraCards];

    const spacing = (flowBase.width * 0.74 + 34);
    const curve = 18;
    const rotateFactor = 9;
    const visibleRange = 2.6; // Increased for better crop transition at edges

    // Smoother eased progress for flow travel
    const easedProgress = gsap.parseEase("power2.inOut")(progress / 2) * 2;
    const travel = easedProgress * extraCards.length;

    allCards.forEach((card, i) => {
      const slot = i - 1 - travel;
      const absSlot = Math.abs(slot);
      
      const x = slot * spacing;
      // Simplified curve to avoid complex float fluctuations
      const y = (absSlot * absSlot * 0.5) * curve; 
      const rotationZ = slot * rotateFactor;

      const scale = Math.max(CARD_MIN_SCALE, CARD_MAX_SCALE - absSlot * 0.1);

      const opacitySmooth =
        absSlot <= visibleRange - 0.35
          ? 1
          : absSlot <= visibleRange
            ? gsap.utils.clamp(
                0,
                1,
                1 - (absSlot - (visibleRange - 0.35)) / 0.35,
              )
            : 0;

      // Use gsap.set with autoRound: false for high precision
      gsap.set(card, {
        x,
        y,
        scale,
        opacity: opacitySmooth,
        rotationY: card.classList.contains("extra-card") ? 0 : 180,
        rotationZ,
        zIndex: 100 - Math.round(absSlot * 10),
        force3D: true,
        z: 0.1,
        autoRound: false,
      });
    });
  }

  function setupMobileCardsInitialState() {
    gsap.set(stickyHeader, { y: 40, opacity: 0 });
    gsap.set(cardContainer, { width: "100%" });
    gsap.set(["#card-1", "#card-2", "#card-3"], {
      rotationY: 0,
      borderRadius: "20px",
      transformOrigin: "center center",
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set("#card-1", {
      x: -120,
      y: 8,
      scale: 0.9,
      rotationZ: -7,
      opacity: 1,
      zIndex: 1,
    });
    gsap.set("#card-2", {
      x: 0,
      y: 0,
      scale: 1.08,
      rotationZ: 0,
      opacity: 1,
      zIndex: 3,
    });
    gsap.set("#card-3", {
      x: 120,
      y: 8,
      scale: 0.9,
      rotationZ: 7,
      opacity: 1,
      zIndex: 2,
    });
  }

  function renderMobileCarousel(progress) {
    const originals = [
      document.querySelector("#card-1"),
      document.querySelector("#card-2"),
      document.querySelector("#card-3"),
    ];

    const positions = [
      { x: -120, y: 8, scale: 0.9, rotationZ: -7, zIndex: 1 },
      { x: 0, y: 0, scale: 1.08, rotationZ: 0, zIndex: 3 },
      { x: 120, y: 8, scale: 0.9, rotationZ: 7, zIndex: 2 },
      { x: 210, y: 18, scale: 0.82, rotationZ: 10, zIndex: 0 },
      { x: -210, y: 18, scale: 0.82, rotationZ: -10, zIndex: 0 },
    ];

    const cycleCount = originals.length;
    const travel = progress * cycleCount;

    originals.forEach((card, i) => {
      let slot = i - travel;

      while (slot < -1.5) slot += cycleCount;
      while (slot > cycleCount - 1.5) slot -= cycleCount;

      let state;

      if (slot <= -1) {
        state = positions[4];
      } else if (slot < 0) {
        const t = slot + 1;
        state = {
          x: gsap.utils.interpolate(positions[0].x, positions[1].x, t),
          y: gsap.utils.interpolate(positions[0].y, positions[1].y, t),
          scale: gsap.utils.interpolate(
            positions[0].scale,
            positions[1].scale,
            t,
          ),
          rotationZ: gsap.utils.interpolate(
            positions[0].rotationZ,
            positions[1].rotationZ,
            t,
          ),
          zIndex: 2,
        };
      } else if (slot < 1) {
        state = {
          x: gsap.utils.interpolate(positions[1].x, positions[2].x, slot),
          y: gsap.utils.interpolate(positions[1].y, positions[2].y, slot),
          scale: gsap.utils.interpolate(
            positions[1].scale,
            positions[2].scale,
            slot,
          ),
          rotationZ: gsap.utils.interpolate(
            positions[1].rotationZ,
            positions[2].rotationZ,
            slot,
          ),
          zIndex: 3,
        };
      } else if (slot < 2) {
        const t = slot - 1;
        state = {
          x: gsap.utils.interpolate(positions[2].x, positions[3].x, t),
          y: gsap.utils.interpolate(positions[2].y, positions[3].y, t),
          scale: gsap.utils.interpolate(
            positions[2].scale,
            positions[3].scale,
            t,
          ),
          rotationZ: gsap.utils.interpolate(
            positions[2].rotationZ,
            positions[3].rotationZ,
            t,
          ),
          zIndex: 1,
        };
      } else {
        state = positions[3];
      }

      gsap.set(card, {
        x: state.x,
        y: state.y,
        scale: state.scale,
        rotationY: 0,
        rotationZ: state.rotationZ,
        opacity: 1,
        zIndex: state.zIndex,
        force3D: true,
        z: 0.1,
        autoRound: false,
      });
    });
  }

  function createMobileStickyAnimation() {
    setupMobileCardsInitialState();

    ScrollTrigger.create({
      trigger: ".sticky",
      start: "top top",
      end: "+=220%",
      scrub: 1.6, // slightly smoother scrub
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(
          0,
          1,
          gsap.utils.mapRange(0.04, 0.18, 0, 1, progress),
        );

        gsap.set(stickyHeader, {
          y: gsap.utils.interpolate(40, 0, headerProgress),
          opacity: headerProgress,
        });

        renderMobileCarousel(progress);
      },
    });
  }

  function createDesktopStickyAnimation() {
    // Increased scrub for smoother feel, will-change hints handled via CSS
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky",
        start: "top top",
        /* TWEAK: Increase this value (e.g. * 6) to make the overall scroll duration longer/slower */
        end: `+=${window.innerHeight * 5}px`,
        /* TWEAK: Higher scrub value (e.g. 2.5 or 3) makes the animation "follow" the scroll more slowly/smoothly */
        scrub: 2.2, 
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1, 
      },
    });

    // Header fade-in — gentle overshoot removed
    tl.fromTo(
      stickyHeader,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: "power3.out", duration: 0.3 },
      0.08,
    );

    // Card container width shrink
    tl.fromTo(
      cardContainer,
      { width: "75%" },
      { width: "60%", ease: "power3.inOut", duration: 0.5 },
      0.08,
    );

    // Gap open — use a softer ease and slightly longer window
    tl.to(
      cardContainer,
      {
        gap: "20px",
        ease: "power3.inOut",
        duration: 0.45,
      },
      0.32,
    );

    tl.to(
      ["#card-1", "#card-2", "#card-3"],
      {
        borderRadius: "20px",
        ease: "power3.inOut",
        duration: 0.45,
      },
      0.32,
    );

    // Flip animation — longer duration + smoother ease
    tl.to(
      ["#card-1", "#card-2", "#card-3"],
      {
        rotationY: 180,
        stagger: 0.1, // slightly tighter stagger
        ease: "power3.inOut", // ← rounder curve vs power2
        duration: 0.6,
      },
      0.5,
    );

    tl.to(
      "#card-2",
      {
        scale: CARD_MAX_SCALE,
        ease: "power3.inOut",
        duration: 0.5,
      },
      0.5,
    );

    // Side-card settle — longer window, smoother ease
    tl.to(
      ["#card-1", "#card-3"],
      {
        y: 15, 
        /* TWEAK: Increase/decrease this value to control card scale intensity for side cards */
        scale: CARD_MAX_SCALE - 0.12, 
        rotationZ: (i) => [-10, 10][i],
        ease: "none", // Remove easing to prevent vibration during scrub
        duration: 0.6,
        force3D: true,
        z: 0.1,
        autoRound: false, // Prevent pixel rounding jitter
      },
      0.95,
    );

    // Flow Mode Trigger — separate ScrollTrigger with matching scrub
    ScrollTrigger.create({
      trigger: ".sticky",
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      scrub: 2, // ← must match tl scrub above for continuity
      onUpdate: async (self) => {
        const progress = self.progress;

        if (progress >= FLOW_START) {
          await enterFlowMode();

          const flowProgress = gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(FLOW_START, FLOW_END, 0, 2, progress),
          );

          renderFlow(flowProgress);
        } else if (flowModeActive) {
          // Smooth exit: fade extra cards out before removing
          exitFlowMode();
        }
      },
    });
  }

  function resetStickyState() {
    removeExtraCards();
    flowModeActive = false;
    flowBase = null;
    isGapAnimationCompleted = false;
    isFlipAnimationCompleted = false;

    document
      .querySelectorAll(
        ".card, .card-container, .sticky-header h1, .intro-image",
      )
      .forEach((el) => el.removeAttribute("style"));

    gsap.set(["#card-1", "#card-2", "#card-3"], {
      clearProps:
        "x,y,scale,rotationY,rotationZ,opacity,zIndex,xPercent,yPercent",
    });
  }

  function initAnimations() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    resetStickyState();

    createAccountButtonAnimation();
    createHeroAnimation();
    createIntroAnimation();
    setupMuteButtons(); // Initial call for HTML cards

    const mm = gsap.matchMedia();

    mm.add("(max-width: 999px)", () => {
      createMobileStickyAnimation();
      return () => resetStickyState();
    });

    mm.add("(min-width: 1000px)", () => {
      createDesktopStickyAnimation();
      return () => resetStickyState();
    });
  }

  function initVideoScroll() {
    const line1 = document.querySelector(".line-1");
    const canvas = document.getElementById("video-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const frameCount = 298;

    const currentFrame = (index) =>
      `./frames/frame_${String(index).padStart(3, "0")}.jpg`;

    const images = [];
    const imageSeq = { frame: 0 };
    let videoTrigger = null;

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawImageCover(ctx, img, canvasEl) {
      const cw = canvasEl.width;
      const ch = canvasEl.height;
      const iw = img.width;
      const ih = img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const x = (cw - nw) / 2;
      const y = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, nw, nh);
    }

    function updateFrameText() {
      if (!line1) return;

      const frame = Math.round(imageSeq.frame);
      const showStart = 250;
      const showEnd = frameCount - 1;

      if (frame < showStart) {
        gsap.set(line1, { opacity: 0, y: 30 });
      } else if (frame >= showStart && frame <= showEnd) {
        const introProgress = gsap.utils.clamp(0, 1, (frame - showStart) / 12);
        gsap.set(line1, {
          opacity: introProgress,
          y: gsap.utils.interpolate(30, 0, introProgress),
        });
      } else {
        gsap.set(line1, { opacity: 1, y: 0 });
      }
    }

    function render() {
      const img = images[Math.round(imageSeq.frame)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      drawImageCover(context, img, canvas);
      updateFrameText();
    }

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const onFirstFrameLoad = () => {
      setCanvasSize();
      render();

      if (videoTrigger) videoTrigger.kill();

      videoTrigger = gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: ".video-scroll",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    if (images[0].complete) {
      onFirstFrameLoad();
    } else {
      images[0].onload = onFirstFrameLoad;
    }

    window.addEventListener("resize", () => {
      setCanvasSize();
      render();
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener("load", () => {
    initAnimations();
    initVideoScroll();
    createCareKitAnimation();
    
    // Final check for heights after a brief delay to ensure DOM is settled
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });

  function createCareKitAnimation() {
    const section = document.querySelector(".care-kit");
    if (!section) return;

    const image = section.querySelector(".care-image");
    const content = section.querySelector(".care-content");
    const paragraphs = section.querySelectorAll(".care-description");
    const button = section.querySelector(".care-btn");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 40%",
        end: "bottom 80%",
        scrub: 1,
      },
    });

    tl.from(image, {
      x: -120,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    tl.from(
      content.querySelector("h2"),
      { x: 80, opacity: 0, duration: 0.6 },
      "-=0.3",
    );

    tl.from(
      content.querySelector("h3"),
      { x: 80, opacity: 0, duration: 0.6 },
      "-=0.4",
    );

    tl.from(
      paragraphs,
      { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 },
      "-=0.5",
    );

    tl.from(button, { scale: 0.9, opacity: 0, duration: 0.5 }, "-=0.3");
  }

  // Already handled in window.load
  // createCareKitAnimation();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
      ScrollTrigger.refresh();
    }, 250);
  });

  ScrollTrigger.refresh();
});
