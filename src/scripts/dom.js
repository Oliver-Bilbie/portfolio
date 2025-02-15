export function getClientSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

export function getContentHeight() {
  // Find the natural height of the content (if it were allowed to overflow)
  // by creating an invisible clone.

  const clone = document.getElementById("content-container").cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "fit-content";
  clone.style.overflow = "visible";
  clone.querySelector("#crawl").style.position = "relative";

  document.body.appendChild(clone);
  const contentHeight = clone.offsetHeight;
  document.body.removeChild(clone);

  return contentHeight;
}

export function setElementHeights(contentHeight, clientHeight) {
  let elementHeight = contentHeight + clientHeight;
  document.getElementById("scroll-body").style.height = `${elementHeight}px`;
  document.getElementById("star-container").style.height = `${elementHeight}px`;
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
