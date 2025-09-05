import { debounce } from "./utils.js";

const loadedIframes = [];

export const handleIframeVisibility = debounce(_handleIframeVisibility);

function _handleIframeVisibility(scrollTop, clientSize, elementPositions) {
  for (let i = 1; i <= 6; i++) {
    const iframe = document.querySelector(`#lazy-iframe-${i}`);
    if (!iframe) continue;

    const isVisible =
      scrollTop > elementPositions[`iframe-${i}`].top - 2 * clientSize.height &&
      scrollTop <
        elementPositions[`iframe-${i}`].bottom + 3 * clientSize.height;

    const isLoaded = loadedIframes[i] === true;

    if (isVisible && !isLoaded) {
      iframe.src = iframe.dataset.src;
      iframe.classList.add("visible");
      loadedIframes[i] = true;
    } else if (!isVisible && isLoaded) {
      iframe.classList.remove("visible");
      loadedIframes[i] = false;
      setTimeout(() => {
        iframe.src = "";
      }, 750);
    }
  }
}
