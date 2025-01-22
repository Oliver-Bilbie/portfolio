import {
  getClientSize,
  getContentHeight,
  getScrollStep,
  setIFrameSizes,
  fadeInWelcomeText,
} from "./dom.js";
import { onResize, onScroll, calculateScrollOffset } from "./events.js";
import { generateStars } from "./utils.js";

const perspective = 800;
const rotateX = 45;

let scrollOffset = 0;
let touchStartY = 0;
let touchLastY = 0;
let welcomeTextVisible = false;

const getWelcomeVisibility = () => {
  return welcomeTextVisible;
};
const setWelcomeVisibility = (isVisibile) => {
  welcomeTextVisible = isVisibile;
};

const scrollStep = getScrollStep();
let clientSize = getClientSize();
let contentHeight = getContentHeight();

setIFrameSizes(clientSize);
fadeInWelcomeText(getWelcomeVisibility, setWelcomeVisibility);

document.querySelector(".star-container").style.height = `${contentHeight}px`;
const stars = generateStars(clientSize.width, contentHeight);

window.addEventListener("resize", () => {
  clientSize = getClientSize();
  contentHeight = getContentHeight();
  onResize(
    rotateX,
    perspective,
    clientSize,
    contentHeight,
    stars,
    getWelcomeVisibility,
    setWelcomeVisibility,
    scrollOffset,
  );
});

document.addEventListener("wheel", (event) => {
  // Since the page does not naturally scroll, we handle mousewheel events programatically
  scrollOffset = calculateScrollOffset(
    event.deltaY,
    scrollStep,
    contentHeight,
    scrollOffset,
  );
  onScroll(
    scrollOffset,
    rotateX,
    perspective,
    clientSize,
    contentHeight,
    stars,
    getWelcomeVisibility,
    setWelcomeVisibility,
  );
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
