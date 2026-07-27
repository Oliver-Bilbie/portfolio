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

  try {
    return fn(clone, ...args);
  } finally {
    document.body.removeChild(clone);
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
    for (let i = 1; i <= 9; i++) {
      positions[`section-${i}`] = container.querySelector(
        `#section-${i}`,
      ).offsetTop;
    }

    // Find iframe positions
    for (let i = 1; i <= 6; i++) {
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(element, text, charDelayMs) {
  for (const char of text) {
    element.textContent += char;
    await sleep(charDelayMs);
  }
}

async function runWelcomeTypewriter(welcomeState) {
  const line1El = document.getElementById("welcome-line-1");
  const line2El = document.getElementById("welcome-line-2");
  const cursor = document.getElementById("welcome-cursor");
  const line2Parent = line2El.parentElement;

  await sleep(800);
  await typeText(line1El, "Hello World!", 70);
  await sleep(400);

  line2Parent.appendChild(cursor);
  await typeText(line2El, "Scroll down", 70);

  cursor.classList.add("blink");
  welcomeState.hasTyped = true;
}

export function fadeInWelcomeText(welcomeState) {
  if (!welcomeState.isVisible) {
    const welcomeText = document.getElementById("welcome-text");

    if (welcomeState.hasTyped) {
      fadeElement(welcomeText, true, 1);
    } else {
      welcomeText.style.opacity = 1;
      runWelcomeTypewriter(welcomeState);
    }

    welcomeState.isVisible = true;
  }
}

export function fadeOutWelcomeText(welcomeState) {
  if (welcomeState.isVisible) {
    const welcomeText = document.getElementById("welcome-text");
    fadeElement(welcomeText, false, 1);
    welcomeState.isVisible = false;
  }
}

export function readContactForm() {
  const email = document.getElementById("email-input").value;
  const message = document.getElementById("message-input").value;
  return { email: email, message: message };
}

export function handleContactLoading() {
  const form = document.getElementById("contact-form");

  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";

  const container = document.createElement("div");
  container.className = "loading-spinner-container";

  const img = document.createElement("img");
  img.src = "images/rocket.webp";
  img.alt = "Loading...";
  img.className = "loading-spinner-image";

  form.replaceChildren();
  container.appendChild(img);
  spinner.appendChild(container);
  form.appendChild(spinner);
}

export function handleContactResult(result) {
  const form = document.getElementById("contact-form");

  const container = document.createElement("div");
  container.className = "text-container";

  const txt = document.createElement("h2");
  txt.className = result.is_success ? "success-text" : "error-text";
  txt.textContent = result.message;

  form.replaceChildren();
  container.appendChild(txt);
  form.appendChild(container);
}
