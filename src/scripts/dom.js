export function getScrollStep() {
  if (navigator.userAgent.includes("Firefox")) {
    return 100;
  } else {
    return 60;
  }
}

export function getClientSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

export function getContentHeight() {
  // Find the natural height of the content (if it were allowed to overflow)
  // by creating an invisible clone.

  const clone = document.querySelector(".star-wars").cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "fit-content";
  clone.style.overflow = "visible";
  clone.querySelector(".crawl").style.position = "relative";

  document.body.appendChild(clone);
  const contentHeight = clone.offsetHeight;
  document.body.removeChild(clone);

  return contentHeight;
}

export function setElementHeights(contentHeight) {
  document.querySelector(".star-body").style.height = `${contentHeight}px`;
  document.querySelector(".twinklers").style.height = `${contentHeight}px`;
}

export function setIFrameSizes(clientSize) {
  document.querySelectorAll("iframe").forEach((iframe) => {
    iframe.style.width = `${clientSize.width}px`;

    if (clientSize.width > clientSize.height) {
      // Desktop aspect ratio
      iframe.style.height = `${clientSize.width * (9 / 16)}px`;
    } else {
      // Mobile aspect ratio
      iframe.style.height = `${clientSize.width * (14 / 9)}px`;
    }
  });
}

function fadeElement(element, fadeIn, timeSeconds) {
  element.style.transition = `opacity ${timeSeconds}s`;
  element.style.opacity = fadeIn ? 1 : 0;
}

export function fadeInWelcomeText(getVisibility, setVisibility) {
  if (!getVisibility()) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    fadeElement(fadeIn0s, true, 3);

    const fadeIn3s = document.querySelector(".fade-in-3s");
    setTimeout(() => {
      if (getVisibility()) {
        fadeElement(fadeIn3s, true, 3);
      }
    }, 3000);

    setVisibility(true);
  }
}

export function fadeOutWelcomeText(getVisibility, setVisibility) {
  if (getVisibility()) {
    const fadeIn0s = document.querySelector(".fade-in-0s");
    fadeElement(fadeIn0s, false, 1);

    const fadeIn3s = document.querySelector(".fade-in-3s");
    fadeElement(fadeIn3s, false, 1);

    setVisibility(false);
  }
}
