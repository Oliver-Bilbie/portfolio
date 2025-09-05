import { sendContactRequest } from "./api.js";
import {
  getClientSize,
  fadeInWelcomeText,
  getElementPositions,
  readContactForm,
  handleContactResult,
  handleContactLoading,
} from "./dom.js";
import { onResize, onScroll } from "./events.js";
import { generateStars } from "./utils.js";
import { WelcomeState } from "./welcomeState.js";

window.addEventListener("load", () => {
  const rotateX = 45;

  let clientSize = getClientSize();
  generateStars(clientSize);

  let elementPositions = getElementPositions(clientSize);
  onResize(clientSize, elementPositions);

  document.body.style.visibility = "visible";

  const welcomeState = new WelcomeState();
  fadeInWelcomeText(welcomeState);

  // Handle scrolling
  document.getElementById("scroll-container").addEventListener(
    "scroll",
    (event) => {
      onScroll(
        event.target.scrollTop,
        rotateX,
        clientSize,
        elementPositions,
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
      elementPositions = getElementPositions(clientSize);
      onResize(clientSize, elementPositions);
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

  // Handle contact form button
  document.getElementById("send-button").addEventListener("click", async () => {
    const form_data = readContactForm();
    handleContactLoading();
    const response = await sendContactRequest(
      form_data.email,
      form_data.message,
    );
    handleContactResult(response);
  });
});
