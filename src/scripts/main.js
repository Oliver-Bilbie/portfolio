import { getClientSize, getContentHeight, fadeInWelcomeText } from "./dom.js";
import { onResize, onScroll } from "./events.js";
import { generateStars } from "./utils.js";
import { WelcomeState } from "./welcomeState.js";

window.addEventListener("load", () => {
  const perspective = 800;
  const rotateX = 45;

  let clientSize = getClientSize();
  let contentHeight = getContentHeight();
  onResize(clientSize, contentHeight);

  contentHeight = getContentHeight();
  onResize(clientSize, contentHeight);

  const stars = generateStars(clientSize.width, contentHeight);

  const welcomeState = new WelcomeState();
  fadeInWelcomeText(welcomeState);

  document
    .getElementById("scroll-container")
    .addEventListener("scroll", (event) => {
      onScroll(
        event.target.scrollTop,
        rotateX,
        perspective,
        clientSize,
        contentHeight,
        stars,
        welcomeState,
      );
    });

  window.addEventListener("resize", () => {
    clientSize = getClientSize();
    contentHeight = getContentHeight();
    onResize(clientSize, contentHeight);
  });
});
