export function getClientSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

function withVirtualContent(fn, ...args) {
  // Decorator function to create an invisible clone of the #content-container
  // DOM element and expose it to an inner function

  const clone = document.getElementById("content-container").cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "fit-content";
  clone.style.overflow = "visible";
  Object.assign(clone.style, {
    position: "absolute",
    visibility: "hidden",
    height: "fit-content",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: "-1",
  });
  clone.querySelector("#crawl").style.position = "relative";

  document.body.appendChild(clone);

  let result;
  try {
    result = fn(clone, ...args);
  } finally {
    document.body.removeChild(clone);
    return result;
  }
}

export function getElementPositions(clientSize) {
  // Find the scroll amount required to reach all required elements

  let _find_positions = (container) => {
    let positions = {};

    // We add some extra height based on the client size to allow the content
    // to scroll out of view at the bottom
    positions.height = container.offsetHeight + 3 * clientSize.height;

    // Find section positions
    for (let i = 1; i <= 8; i++) {
      positions[`section-${i}`] = container.querySelector(
        `#section-${i}`,
      ).offsetTop;
    }

    // Find iframe positions
    for (let i = 1; i <= 5; i++) {
      let element = container.querySelector(`#lazy-iframe-${i}`).parentElement;
      positions[`iframe-${i}`] = {
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight,
      };
    }

    return positions;
  };

  return withVirtualContent(_find_positions);
}

export function setScrollHeight(clientHeight, contentHeight) {
  const scrollHeight = contentHeight + 2 * clientHeight;
  document.getElementById("scroll-body").style.height = `${scrollHeight}px`;
}

function fadeElement(element, fadeIn, timeSeconds) {
  element.style.transition = `opacity ${timeSeconds}s`;
  element.style.opacity = fadeIn ? 1 : 0;
}

export function fadeInWelcomeText(welcomeState) {
  if (!welcomeState.isVisible) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    fadeElement(fadeIn0s, true, 3);

    const fadeIn3s = document.querySelector(".fade-in-3s");
    setTimeout(() => {
      if (welcomeState.isVisible) {
        fadeElement(fadeIn3s, true, 3);
      }
    }, 3000);

    welcomeState.isVisible = true;
  }
}

export function fadeOutWelcomeText(welcomeState) {
  if (welcomeState.isVisible) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    fadeElement(fadeIn0s, false, 1);

    const fadeIn3s = document.querySelector(".fade-in-3s");
    fadeElement(fadeIn3s, false, 1);

    welcomeState.isVisible = false;
  }
}
