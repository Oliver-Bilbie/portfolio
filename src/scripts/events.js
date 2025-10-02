import {
  setScrollHeight,
  fadeInWelcomeText,
  fadeOutWelcomeText,
} from "./dom.js";
import { handleIframeVisibility } from "./lazyIframes.js";
import { debounce, throttle } from "./utils.js";

export const onResize = throttle(_onResize, 100);
export const onScrollDepthAdjust = debounce(scrollContent, 10);

function _onResize(clientSize, elementPositions) {
  let scrollTop = document.getElementById("scroll-container").scrollTop;
  setScrollHeight(clientSize.height, elementPositions.height);
  scrollBackground(scrollTop, elementPositions.height, clientSize);
  handleIframeVisibility(scrollTop, clientSize, elementPositions);
}

function scrollContent(scrollOffset, rotateX) {
  const crawl = document.getElementById("crawl");
  let translateZ = rotateX > 30 ? 0 : 800 * Math.cos((rotateX / 60) * Math.PI);
  crawl.style.transform = `rotateX(${rotateX}deg) translate3d(0, ${-scrollOffset}px, ${-translateZ}px)`;
}

function scrollBackground(scrollOffset, contentHeight, clientSize) {
  const starsOffset = -(scrollOffset / contentHeight) * clientSize.height;
  const backgroundOffset = starsOffset / 2;

  document.getElementById("background").style.backgroundPositionY =
    `${backgroundOffset}px`;
  document.getElementById("star-container").style.top = `${starsOffset}px`;
}

function handleWelcomeMsg(scrollOffset, welcomeState) {
  if (!welcomeState.isVisible && scrollOffset > 2000) {
    return false;
  }

  const overlayStrength = Math.min(scrollOffset, 2000) / 2000;
  const overlayR = 47 * overlayStrength;
  const overlayG = 25 * overlayStrength;
  const overlayB = 95 * overlayStrength;
  const overlayA = 1 - 0.2 * overlayStrength;

  document.getElementById("overlay").style.backgroundColor =
    `rgba(${overlayR}, ${overlayG}, ${overlayB}, ${overlayA})`;

  if (scrollOffset > 0) {
    fadeOutWelcomeText(welcomeState);
    return false;
  } else if (scrollOffset == 0) {
    fadeInWelcomeText(welcomeState);
    return true;
  }
}

export function onScroll(
  scrollOffset,
  rotateX,
  clientSize,
  elementPositions,
  welcomeState,
) {
  scrollContent(scrollOffset, rotateX);
  scrollBackground(scrollOffset, elementPositions.height, clientSize);
  handleWelcomeMsg(scrollOffset, welcomeState);
  handleIframeVisibility(scrollOffset, clientSize, elementPositions);
}
