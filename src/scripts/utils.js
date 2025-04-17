export function debounce(func, timeout = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function generateStars(clientSize) {
  const starCount = Math.floor((clientSize.width * clientSize.height) / 50000);

  let stars = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() * (8 - 4) + 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    const x = Math.random() * 100;
    const y = Math.random() * 200;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    stars.appendChild(star);
  }

  document.getElementById("star-container").appendChild(stars);
}
