import {
  getClientSize,
  fadeInWelcomeText,
  getElementPositions,
} from "./dom.js";
import { onResize, onScroll } from "./events.js";
import { generateStars } from "./utils.js";
import { WelcomeState } from "./welcomeState.js";

window.addEventListener("load", () => {
  const rotateX = 45;

  let clientSize = getClientSize();
  generateStars(clientSize);

  let elementPositions = getElementPositions();
  onResize(clientSize, elementPositions.height);

  document.body.style.visibility = "visible";

  const welcomeState = new WelcomeState();
  fadeInWelcomeText(welcomeState);

  const loadedIframes = [];

  // Handle scrolling
  document.getElementById("scroll-container").addEventListener(
    "scroll",
    (event) => {
      onScroll(
        event.target.scrollTop,
        rotateX,
        clientSize,
        elementPositions.height,
        welcomeState,
      );
      handleIframeVisibility(event.target.scrollTop);
    },
    { passive: true },
  );

  // Handle resizes
  window.addEventListener(
    "resize",
    () => {
      clientSize = getClientSize();
      elementPositions = getElementPositions();
      onResize(clientSize, elementPositions.height);
      handleIframeVisibility(
        document.getElementById("scroll-container").scrollTop,
      );
    },
    { passive: true },
  );

  // Handle goto button clicks
  for (let i = 1; i <= 8; i++) {
    document.querySelectorAll(`.goto-section-${i}`).forEach((element) => {
      element.addEventListener("click", () => {
        const targetPosition =
          elementPositions[`section-${i}`] + clientSize.height;
        document
          .getElementById("scroll-container")
          .scrollTo({ top: targetPosition, behavior: "smooth" });
      });
    });
  }

  function handleIframeVisibility(scrollTop) {
    for (let i = 1; i <= 5; i++) {
      const iframe = document.querySelector(`#lazy-iframe-${i}`);
      if (!iframe) continue;

      const isVisible =
        scrollTop >
          elementPositions[`iframe-${i}`].top - 2 * clientSize.height &&
        scrollTop <
          elementPositions[`iframe-${i}`].bottom + 3 * clientSize.height;

      const isLoaded = loadedIframes[i] === true;

      if (isVisible && !isLoaded) {
        iframe.src = iframe.dataset.src;
        iframe.style.opacity = 1;
        loadedIframes[i] = true;
      } else if (!isVisible && isLoaded) {
        iframe.src = "";
        iframe.style.opacity = 0;
        loadedIframes[i] = false;
      }
    }
  }
});
