const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const iframes = [
  {
    id: 1,
    url: "https://ecc.oliver-bilbie.co.uk",
    name: "iframe-preview-1.webp",
  },
  {
    id: 2,
    url: "https://flights.oliver-bilbie.co.uk",
    name: "iframe-preview-2.webp",
  },
  {
    id: 3,
    url: "https://aoc.oliver-bilbie.co.uk",
    name: "iframe-preview-3.webp",
  },
  {
    id: 4,
    url: "https://words.oliver-bilbie.co.uk",
    name: "iframe-preview-4.webp",
  },
  {
    id: 5,
    url: "https://timer.oliver-bilbie.co.uk",
    name: "iframe-preview-5.webp",
  },
];

const OUTPUT_DIR = path.join(__dirname, "src/images/placeholders");

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  for (const iframe of iframes) {
    console.log(`Capturing ${iframe.name}...`);
    await page.setViewport({ width: 1600, height: 900 });

    await page.goto(iframe.url, { waitUntil: "networkidle2" });

    const outputPath = path.join(OUTPUT_DIR, iframe.name);
    await page.screenshot({ path: outputPath });

    console.log(`✅ Saved: ${outputPath}`);
  }

  await browser.close();
}

captureScreenshots()
  .then(() => console.log("🎉 All screenshots captured!"))
  .catch((err) => console.error("❌ Error:", err));
