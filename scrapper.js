const { chromium } = require("playwright");

const CANVAS_URL = "https://alueducation.instructure.com/courses";

async function ALUCanvasScrape() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("\nBrowser Open. Now going to Canvas URL...");
  console.log(`Navigating to: ${CANVAS_URL}`);

  await page.goto(CANVAS_URL);

  console.log("\nNow on Canvas, Awaiting for you to finish signing in....");

  await page.waitForURL("**/courses**", { timeout: 0 });

  console.log("\nLogin was a success! We are now on your courses Page");
  console.log("Navigating now to the FWD course...");

  await page
    .getByRole("link", { name: "Frontend Web Development" })
    .first()
    .click();
  await page.getByRole("link", { name: "Assignments" }).click();
}

ALUCanvasScrape();
