export function generateStars(clientSize) {
  let stars = [];

  const starCount = Math.floor(
    0.00004 * (clientSize.width * clientSize.height),
  );

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() * (8 - 4) + 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    const x = Math.random() * 100;
    const y = Math.random() * clientSize.height * 2;
    star.style.left = `${x}%`;
    star.style.top = `${y}px`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    stars.push({ element: star, y });
  }

  stars.sort((a, b) => a.y - b.y);

  return stars;
}

export function binarySearch(stars, target, reverse) {
  // Binary search to find the index of the first or last visible star
  let low = 0;
  let high = stars.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (reverse === false) {
      // Find the first star with `y` >= target
      if (stars[mid].y >= target) {
        result = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Find the last star with `y` <= target
      if (stars[mid].y <= target) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return result === -1 ? (reverse ? stars.length - 1 : 0) : result;
}
