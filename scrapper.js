const { chromium } = require("playwright");

const CANVAS_URL = "https://alueducation.instructure.com/courses";

async function ALUCanvasScrape() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("\nBrowser Open. Now going to Canvas URL...");
  console.log(`Navigating to: ${CANVAS_URL}`);

  await page.goto(CANVAS_URL);

  console.log("\nNow on Canvas, Awaiting for you to finish signing in....");
}

ALUCanvasScrape();
