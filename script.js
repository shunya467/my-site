gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.35,
  smoothWheel: true,
  wheelMultiplier: 0.85,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const wrapCharacters = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const fragment = document.createDocumentFragment();

    [...node.textContent].forEach((character) => {
      const span = document.createElement("span");
      span.className = "char";
      span.innerHTML = character === " " ? "&nbsp;" : character;
      fragment.appendChild(span);
    });

    node.replaceWith(fragment);
    return;
  }

  [...node.childNodes].forEach(wrapCharacters);
};

const splitText = (selector) => {
  document.querySelectorAll(selector).forEach((element) => {
    wrapCharacters(element);
  });
};

splitText(".split-text");
splitText(".reveal-copy");

gsap.from(".hero .char", {
  yPercent: 120,
  opacity: 0,
  rotate: 6,
  scaleX: 0.72,
  scaleY: 1.28,
  duration: 0.9,
  ease: "back.out(1.7)",
  stagger: 0.018,
  delay: 0.15,
});

gsap.to(".hero .char", {
  scaleX: 1.025,
  scaleY: 0.975,
  yPercent: -1.8,
  duration: 1.8,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  stagger: 0.035,
});

gsap.from(".fashion-portrait", {
  xPercent: 18,
  yPercent: 5,
  opacity: 0,
  rotate: -8,
  filter: "blur(16px)",
  duration: 1.35,
  ease: "power3.out",
  delay: 0.35,
});

gsap.utils.toArray(".panel:not(.hero)").forEach((panel, panelIndex) => {
  const fromLeft = panelIndex % 2 === 0;

  gsap.from(panel.querySelectorAll(".section-index, .reveal-copy, .work-item, .about-large, .about-small, .about-serif, .contact-link"), {
    xPercent: fromLeft ? -18 : 18,
    opacity: 0,
    filter: "blur(14px)",
    scaleX: 0.94,
    scaleY: 1.06,
    duration: 1.15,
    ease: "elastic.out(1, 0.72)",
    stagger: 0.12,
    scrollTrigger: {
      trigger: panel,
      start: "top 72%",
      end: "top 34%",
      toggleActions: "play none none reverse",
    },
  });
});

document.querySelectorAll(".section-index, .work-item span, .about-large, .about-serif, .contact-link").forEach((element) => {
  element.classList.add("jelly-text");
});

gsap.to(".reveal-copy .char", {
  color: "#f7f7f0",
  stagger: 0.04,
  ease: "none",
  scrollTrigger: {
    trigger: ".vision",
    start: "top 65%",
    end: "bottom 35%",
    scrub: true,
  },
});

document.querySelectorAll(".parallax").forEach((element) => {
  gsap.to(element, {
    y: Number(element.dataset.speed || 0),
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

ScrollTrigger.create({
  trigger: ".contact",
  start: "top 55%",
  end: "bottom 45%",
  onEnter: () => document.body.classList.add("is-inverted"),
  onEnterBack: () => document.body.classList.add("is-inverted"),
  onLeave: () => document.body.classList.remove("is-inverted"),
  onLeaveBack: () => document.body.classList.remove("is-inverted"),
});

const preview = document.querySelector(".hover-preview");
const previewImage = preview.querySelector("img");
const cursor = document.querySelector(".cursor");
const canUseCustomCursor = window.matchMedia("(pointer: fine)").matches && cursor;

if (canUseCustomCursor) {
  document.documentElement.classList.add("has-custom-cursor");
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (canUseCustomCursor) {
    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      opacity: 1,
      duration: 0.32,
      ease: "power3.out",
    });
  }

  gsap.to(preview, { x: mouseX + 170, y: mouseY + 12, duration: 0.45, ease: "power3.out" });
});

document.querySelectorAll("a, img, .magnetic").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    if (!canUseCustomCursor) return;
    const isImageTarget = element.matches("img, .fashion-portrait, .work-item");

    cursor.classList.toggle("is-image-hover", isImageTarget);

    gsap.to(cursor, {
      scale: isImageTarget ? 3.35 : 2.35,
      opacity: isImageTarget ? 0.82 : 0.9,
      duration: 0.32,
      ease: "power3.out",
    });
  });

  element.addEventListener("mouseleave", () => {
    if (!canUseCustomCursor) return;

    cursor.classList.remove("is-image-hover");

    gsap.to(cursor, {
      scale: 1,
      opacity: 1,
      duration: 0.28,
      ease: "power3.inOut",
    });
  });
});

document.querySelectorAll(".work-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    previewImage.src = item.dataset.image;
    gsap.to(preview, { opacity: 1, scale: 1, rotate: 0, duration: 0.36, ease: "power3.out" });
  });

  item.addEventListener("mouseleave", () => {
    gsap.to(preview, { opacity: 0, scale: 0.86, rotate: -3, duration: 0.28, ease: "power3.inOut" });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target);
  });
});
