const scrollWrapper = document.querySelector(".scroll-wrapper");
const crawl = document.querySelector(".crawl");
const starWars = document.querySelector(".star-wars");
const background = document.querySelector(".background");
const overlay = document.querySelector(".overlay");
const starContainer = document.querySelector(".star-container");

const stars = [];

const perspective = 800;
const rotateX = 45;

let scrollStep = 60;
if (navigator.userAgent.includes("Firefox")) {
  // Firefox needs to scroll slower than other browsers for equivalent behavior
  scrollStep = 100;
}

let clientWidth = document.body.clientWidth;
let clientHeight = document.body.clientHeight;
formatIFrames();
let contentHeight = getContentHeight();

addStars();

let scrollOffset = 0;
let touchStartY = 0;
let touchLastY = 0;
let welcomeTextVisible = false;

const fadeIn = (element, duration) => {
  element.style.transition = `opacity ${duration}s`;
  element.style.opacity = 1;
};

const fadeOut = (element, duration) => {
  element.style.transition = `opacity ${duration}s`;
  element.style.opacity = 0;
};

fadeInWelcomeText();

document.addEventListener("wheel", (event) => {
  handleScroll(event.deltaY, scrollStep);
});

if ("ontouchstart" in window) {
  document.addEventListener("touchstart", (event) => {
    touchStartY = touchLastY = event.touches[0].clientY;
  });

  document.addEventListener("touchmove", (event) => {
    const touchCurrentY = event.touches[0].clientY;
    const deltaY = touchLastY - touchCurrentY;
    touchLastY = touchCurrentY;
    if (Math.abs(deltaY) > 1) {
      handleScroll(deltaY, scrollStep / 2);
    }
  });

  document.addEventListener("touchend", () => {
    touchStartY = 0;
    touchLastY = 0;
  });
}

window.addEventListener("resize", () => {
  // When the window is resized we re-evaluate the content height since this will change.
  // If the position that has been scrolled to is now out-of-bounds, we bring it back in.

  clientWidth = document.body.clientWidth;
  formatIFrames();
  contentHeight = getContentHeight();
  handleScroll(0, scrollStep);
  starContainer.style.height = `${contentHeight}px`;
});

function getContentHeight() {
  // Find the natural height of the content (if it were allowed to overflow)
  // by creating an invisible clone.

  const clone = starWars.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "fit-content";
  clone.style.overflow = "visible";

  document.body.appendChild(clone);
  const naturalHeight = clone.offsetHeight;
  document.body.removeChild(clone);

  return naturalHeight;
}

function handleScroll(deltaY, sensitivity) {
  // Since the page does not naturally scroll, we handle mousewheel events programatically

  if (deltaY > 0) {
    scrollOffset = Math.min(scrollOffset + sensitivity, contentHeight);
  } else {
    scrollOffset = Math.max(scrollOffset - sensitivity, 0);
  }

  // Distance in px for the content to travel down the page
  const translateY = -scrollOffset;
  // Distance in px for the content to travel 'into the page'
  const translateZ = -(scrollOffset / perspective) * (clientWidth / 200);
  // Position of the top of the content in vh
  const top = 100 - 100 * (scrollOffset / contentHeight);
  crawl.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${translateY}px)`;
  crawl.style.top = `${top}vh`;

  const backgroundOffset = -(scrollOffset / contentHeight) * 4292;
  background.style.backgroundPositionY = `${backgroundOffset}px`;
  starContainer.style.top = `${backgroundOffset}px`;

  const viewportStart = backgroundOffset;
  const viewportEnd = backgroundOffset + clientHeight;

  // Find the range of stars to display using binary search
  const firstVisibleIndex = binarySearch(stars, viewportStart, "start");
  const lastVisibleIndex = binarySearch(stars, viewportEnd, "end");

  // Remove all currently displayed stars
  starContainer.innerHTML = "";

  // Append only the visible stars
  for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
    if (!stars[i].element.parentNode) {
      starContainer.appendChild(stars[i].element);
    }
  }

  const overlayStrength = Math.min(scrollOffset, 2000) / 2000;
  const overlayR = 47 * overlayStrength;
  const overlayG = 25 * overlayStrength;
  const overlayB = 95 * overlayStrength;
  const overlayA = 1 - 0.2 * overlayStrength;
  overlay.style.backgroundColor = `rgba(${overlayR}, ${overlayG}, ${overlayB}, ${overlayA})`;

  if (scrollOffset > 0 && welcomeTextVisible) {
    fadeOutWelcomeText();
  } else if (scrollOffset == 0 && !welcomeTextVisible) {
    fadeInWelcomeText();
  }
}

function formatIFrames() {
  // Set the sizes for iframes

  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    iframe.style.width = `${clientWidth}px`;
    if (clientWidth > clientHeight) {
      // Desktop aspect ratio
      iframe.style.height = `${clientWidth * (9 / 16)}px`;
    } else {
      // Mobile aspect ratio
      iframe.style.height = `${clientWidth * (14 / 9)}px`;
    }
  });
}

function fadeInWelcomeText() {
  if (!welcomeTextVisible) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    const fadeIn3s = document.querySelector(".fade-in-3s");

    fadeIn(fadeIn0s, 3);

    setTimeout(() => {
      if (welcomeTextVisible) {
        fadeIn(fadeIn3s, 3);
      }
    }, 3000);

    welcomeTextVisible = true;
  }
}

function fadeOutWelcomeText() {
  if (welcomeTextVisible) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    const fadeIn3s = document.querySelector(".fade-in-3s");

    fadeOut(fadeIn0s, 1);
    fadeOut(fadeIn3s, 1);

    welcomeTextVisible = false;
  }
}

function addStars() {
  starContainer.style.height = `${contentHeight}px`;

  const starCount = 0.00001 * (clientWidth * contentHeight);

  // Create stars and store them in a sorted array by their `y` coordinate
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() * (8 - 4) + 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    const x = Math.random() * 100;
    const y = Math.random() * contentHeight;
    star.style.left = `${x}%`;
    star.style.top = `${y}px`;
    star.style.animationDelay =`${Math.random() * 5}s`;

    stars.push({ element: star, y });
  }

  // Sort the stars by their `y` coordinate
  stars.sort((a, b) => a.y - b.y);
}

function binarySearch(stars, target, mode) {
  // Binary search to find the index of the first or last visible star
  let low = 0;
  let high = stars.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (mode === "start") {
      // Find the first star with `y` >= target
      if (stars[mid].y >= target) {
        result = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else if (mode === "end") {
      // Find the last star with `y` <= target
      if (stars[mid].y <= target) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return result === -1 ? (mode === "start" ? 0 : stars.length - 1) : result;
}
