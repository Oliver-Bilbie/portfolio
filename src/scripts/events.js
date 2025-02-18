import {
  setIFrameSizes,
  setScrollHeight,
  fadeInWelcomeText,
  fadeOutWelcomeText,
} from "./dom.js";

export function onResize(clientSize, contentHeight) {
  setIFrameSizes(clientSize);
  setScrollHeight(clientSize.height, contentHeight);
  scrollBackground(
    document.getElementById("scroll-container").scrollTop,
    contentHeight,
    clientSize,
  );
}

function scrollContent(scrollOffset, rotateX) {
  const crawl = document.getElementById("crawl");
  crawl.style.transform = `rotateX(${rotateX}deg) translateY(${-scrollOffset}px)`;
}

function scrollBackground(scrollOffset, contentHeight, clientSize) {
  const starsOffset = -(scrollOffset / contentHeight) * clientSize.height;
  const backgroundOffset = starsOffset / 2;

  document.getElementById("background").style.backgroundPositionY =
    `${backgroundOffset}px`;
  document.getElementById("star-container").style.top = `${starsOffset}px`;
}

function handleWelcomeMsg(scrollOffset, welcomeState) {
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
  contentHeight,
  welcomeState,
) {
  scrollContent(scrollOffset, rotateX);
  scrollBackground(scrollOffset, contentHeight, clientSize);
  handleWelcomeMsg(scrollOffset, welcomeState);
}
