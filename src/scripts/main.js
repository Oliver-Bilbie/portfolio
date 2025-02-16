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
  let contentHeight = getContentHeight();
  onResize(clientSize, contentHeight, []);

  const stars = generateStars(clientSize.width, contentHeight);

  contentHeight = getContentHeight();
  onResize(clientSize, contentHeight, stars);

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
        stars,
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
      onResize(clientSize, contentHeight, stars);
    },
    { passive: true },
  );

  // Handle goto button clicks
  for (let i = 2; i <= 7; i++) {
    document
      .getElementById(`goto-section-${i}`)
      .addEventListener("click", () => {
        const targetPosition = getSectionPosition(i) + clientSize.height;
        document
          .getElementById("scroll-container")
          .scrollTo({ top: targetPosition, behavior: "smooth" });
      });
  }
});
