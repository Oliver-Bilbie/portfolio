import {
  setIFrameSizes,
  setStarContainerHeight,
  fadeInWelcomeText,
  fadeOutWelcomeText,
} from "./dom.js";
import { binarySearch } from "./utils.js";

export function onResize(
  rotateX,
  perspective,
  clientSize,
  contentHeight,
  stars,
  getWelcomeVisibility,
  setWelcomeVisibility,
  scrollOffset,
) {
  setIFrameSizes(clientSize);
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
  setStarContainerHeight(contentHeight);
}

export function calculateScrollOffset(
  deltaY,
  sensitivity,
  contentHeight,
  scrollOffset,
) {
  if (deltaY > 0) {
    return Math.min(scrollOffset + sensitivity, contentHeight);
  } else {
    return Math.max(scrollOffset - sensitivity, 0);
  }
}

function moveScrollContent(
  scrollOffset,
  rotateX,
  perspective,
  clientWidth,
  contentHeight,
) {
  const crawl = document.querySelector(".crawl");

  // Distance in px for the scrolling content to travel 'into the page'
  const translateZ = -(scrollOffset / perspective) * (clientWidth / 200);
  // Position of the top of the scrolling content in vh
  const top = 100 - 100 * (scrollOffset / contentHeight);

  crawl.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${-scrollOffset}px)`;
  crawl.style.top = `${top}vh`;
}

function moveBackground(scrollOffset, contentHeight, clientHeight, stars) {
  const backgroundOffset = -(scrollOffset / contentHeight) * 4292;

  document.querySelector(".background").style.backgroundPositionY =
    `${backgroundOffset}px`;
  document.querySelector(".star-container").style.top = `${backgroundOffset}px`;

  updateStars(stars, backgroundOffset, clientHeight);
}

function updateStars(stars, backgroundOffset, clientHeight) {
  const viewportStart = backgroundOffset;
  const viewportEnd = backgroundOffset + clientHeight;

  // Find the range of stars to display using binary search
  const firstVisibleIndex = binarySearch(stars, viewportStart, false);
  const lastVisibleIndex = binarySearch(stars, viewportEnd, true);

  const starContainer = document.querySelector(".star-container");

  stars.map((star, i) => {
    const shouldExist = i >= firstVisibleIndex && i <= lastVisibleIndex;
    const doesExist = star.element.parentNode;

    if (shouldExist && !doesExist) {
      starContainer.appendChild(star.element);
    } else if (!shouldExist && doesExist) {
      starContainer.removeChild(star.element);
    }
  });
}

function handleWelcomeMsg(
  scrollOffset,
  getWelcomeVisibility,
  setWelcomeVisibility,
) {
  const overlayStrength = Math.min(scrollOffset, 2000) / 2000;
  const overlayR = 47 * overlayStrength;
  const overlayG = 25 * overlayStrength;
  const overlayB = 95 * overlayStrength;
  const overlayA = 1 - 0.2 * overlayStrength;

  document.querySelector(".overlay").style.backgroundColor =
    `rgba(${overlayR}, ${overlayG}, ${overlayB}, ${overlayA})`;

  if (scrollOffset > 0) {
    fadeOutWelcomeText(getWelcomeVisibility, setWelcomeVisibility);
    return false;
  } else if (scrollOffset == 0) {
    fadeInWelcomeText(getWelcomeVisibility, setWelcomeVisibility);
    return true;
  }
}

export function onScroll(
  scrollOffset,
  rotateX,
  perspective,
  clientSize,
  contentHeight,
  stars,
  getWelcomeVisibility,
  setWelcomeVisibility,
) {
  moveScrollContent(
    scrollOffset,
    rotateX,
    perspective,
    clientSize.width,
    contentHeight,
  );
  moveBackground(scrollOffset, contentHeight, clientSize.height, stars);
  handleWelcomeMsg(scrollOffset, getWelcomeVisibility, setWelcomeVisibility);
}
