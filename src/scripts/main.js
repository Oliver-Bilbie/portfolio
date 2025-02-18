import {
  getClientSize,
  getContentHeight,
  fadeInWelcomeText,
  getSectionPosition,
} from "./dom.js";
import { onResize, onScroll } from "./events.js";
import { generateStars } from "./utils.js";
import { WelcomeState } from "./welcomeState.js";

window.addEventListener("load", () => {
  const perspective = 800;
  const rotateX = 45;

  let clientSize = getClientSize();
  generateStars(clientSize);

  let contentHeight = getContentHeight();
  onResize(clientSize, contentHeight);
  contentHeight = getContentHeight();
  onResize(clientSize, contentHeight);

  const welcomeState = new WelcomeState();
  fadeInWelcomeText(welcomeState);

  // Handle scrolling
  document.getElementById("scroll-container").addEventListener(
    "scroll",
    (event) => {
      onScroll(
        event.target.scrollTop,
        rotateX,
        perspective,
        clientSize,
        contentHeight,
        welcomeState,
      );
    },
    { passive: true },
  );

  // Handle resizes
  window.addEventListener(
    "resize",
    () => {
      clientSize = getClientSize();
      contentHeight = getContentHeight();
      onResize(clientSize, contentHeight);
    },
    { passive: true },
  );

  // Handle goto button clicks
  for (let i = 1; i <= 7; i++) {
    document.querySelectorAll(`.goto-section-${i}`).forEach((element) => {
      element.addEventListener("click", () => {
        const targetPosition = getSectionPosition(i) + clientSize.height;
        document
          .getElementById("scroll-container")
          .scrollTo({ top: targetPosition, behavior: "smooth" });
      });
    });
  }
});
