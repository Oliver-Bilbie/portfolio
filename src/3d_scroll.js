const scrollWrapper = document.querySelector(".scroll-wrapper");
const crawl = document.querySelector(".crawl");
const starWars = document.querySelector(".star-wars");
const background = document.querySelector(".background");
const overlay = document.querySelector(".overlay");

const perspective = 800;
const rotateX = 45;

let scrollStep = 60;
if (navigator.userAgent.includes("Firefox")) {
  // Firefox needs to scroll slower than other browsers for equivalent behavior
  scrollStep = 20;
}

let clientWidth = document.body.clientWidth;
let clientHeight = document.body.clientHeight;
formatIFrames();
let contentHeight = getContentHeight();

let scrollOffset = 0;
let touchStartY = 0;
let touchLastY = 0;

document.addEventListener("wheel", (event) => {
  event.preventDefault();
  handleScroll(event.deltaY, scrollStep);
});

scrollWrapper.addEventListener("touchstart", (event) => {
  touchStartY = touchLastY = event.touches[0].clientY;
});

scrollWrapper.addEventListener("touchmove", (event) => {
  event.preventDefault();
  const touchCurrentY = event.touches[0].clientY;
  const deltaY = touchLastY - touchCurrentY;
  touchLastY = touchCurrentY;
  if (Math.abs(deltaY) > 1) {
    handleScroll(deltaY, scrollStep / 2);
  }
});

scrollWrapper.addEventListener("touchend", () => {
  touchStartY = 0;
  touchLastY = 0;
});

window.addEventListener("resize", () => {
  // When the window is resized we re-evaluate the content height since this will change.
  // If the position that has been scrolled to is now out-of-bounds, we bring it back in.

  console.log("Resizing...");
  clientWidth = document.body.clientWidth;
  formatIFrames();
  contentHeight = getContentHeight();
  handleScroll(0, scrollStep);
});

function getContentHeight() {
  // Find the natural height of the content (if it were allowed to overflow)
  // by creating an invisible clone.

  const clone = starWars.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "auto";
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

  const backgroundOffset = -scrollOffset / 400;

  background.style.backgroundPositionY = `${backgroundOffset}px`;

  const overlayStrength = Math.min(scrollOffset, 2000) / 2000;
  const overlayR = 25 * overlayStrength;
  const overlayG = 5 * overlayStrength;
  const overlayB = 65 * overlayStrength;
  const overlayA = 1 - 0.35 * overlayStrength;
  overlay.style.backgroundColor = `rgba(${overlayR}, ${overlayG}, ${overlayB}, ${overlayA})`;
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
