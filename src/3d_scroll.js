const scrollWrapper = document.querySelector(".scroll-wrapper");
const crawl = document.querySelector(".crawl");
const starWars = document.querySelector(".star-wars");

const perspective = 800;
const rotateX = 45;
const scrollStep = 60;

let contentWidth = document.body.clientWidth;
let contentHeight = getContentHeight();
let scrollOffset = 0;

scrollWrapper.addEventListener("wheel", (event) => {
  event.preventDefault();
  handleScroll(event.deltaY);
});

window.addEventListener("resize", () => {
  // When the window is resized we re-evaluate the content height since this will change.
  // If the position that has been scrolled to is now out-of-bounds, we bring it back in.

  contentWidth = document.body.clientWidth;
  contentHeight = getContentHeight();
  handleScroll(0);
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

function handleScroll(deltaY) {
  // Since the page does not naturally scroll, we handle mousewheel events programatically

  if (deltaY > 0) {
    scrollOffset = Math.min(scrollOffset + scrollStep, contentHeight);
  } else {
    scrollOffset = Math.max(scrollOffset - scrollStep, 0);
  }

  // Distance in px for the content to travel down the page
  const translateY = -scrollOffset;

  // Distance in px for the content to travel 'into the page'
  const translateZ = -(scrollOffset / perspective) * (clientWidth / 200);

  // Position of the top of the content in vh
  const top = 100 - 100 * (scrollOffset / contentHeight);

  crawl.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${translateY}px)`;
  crawl.style.top = `${top}vh`;
}
