import { debounce } from "./utils.js";

const loadedIframes = [];
const unloadTimers = [];

export const handleIframeVisibility = debounce(_handleIframeVisibility);

function _handleIframeVisibility(scrollTop, clientSize, elementPositions) {
  for (let i = 1; i <= 6; i++) {
    const iframe = document.querySelector(`#lazy-iframe-${i}`);
    if (!iframe) continue;

    const isVisible =
      scrollTop > elementPositions[`iframe-${i}`].top - 2 * clientSize.height &&
      scrollTop <
        elementPositions[`iframe-${i}`].bottom + 3 * clientSize.height;

    if (isVisible) {
      if (unloadTimers[i]) {
        clearTimeout(unloadTimers[i]);
        unloadTimers[i] = null;
      }
      if (!loadedIframes[i]) {
        iframe.src = iframe.dataset.src;
        loadedIframes[i] = true;
      }
      iframe.classList.add("visible");
    } else if (loadedIframes[i]) {
      iframe.classList.remove("visible");
      unloadTimers[i] = setTimeout(() => {
        iframe.src = "";
        loadedIframes[i] = false;
        unloadTimers[i] = null;
      }, 750);
    }
  }
}
