import {
  getClientSize,
  getContentHeight,
  setIFrameSizes,
  fadeInWelcomeText,
} from "./dom.js";
import { onResize, onScroll } from "./events.js";
import { generateStars } from "./utils.js";

const perspective = 800;
const rotateX = 45;

let welcomeTextVisible = false;

const getWelcomeVisibility = () => {
  return welcomeTextVisible;
};
const setWelcomeVisibility = (isVisibile) => {
  welcomeTextVisible = isVisibile;
};

let clientSize = getClientSize();
let contentHeight = getContentHeight();

setIFrameSizes(clientSize);
fadeInWelcomeText(getWelcomeVisibility, setWelcomeVisibility);

document.querySelector(".star-body").style.height = `${contentHeight}px`;
document.querySelector(".twinklers").style.height = `${contentHeight}px`;

const stars = generateStars(clientSize.width, contentHeight);

window.addEventListener("resize", () => {
  clientSize = getClientSize();
  contentHeight = getContentHeight();
  onResize(clientSize, contentHeight);
});

document
  .querySelector(".star-container")
  .addEventListener("scroll", (event) => {
    onScroll(
      event.target.scrollTop,
      rotateX,
      perspective,
      clientSize,
      contentHeight,
      stars,
      getWelcomeVisibility,
      setWelcomeVisibility,
    );
  });
