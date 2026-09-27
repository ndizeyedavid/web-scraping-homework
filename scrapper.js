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

  await page.waitForSelector(".assignment-list");

  const assignmentRows = await page.locator(".assignment-list .ig-row").all();
  const scrapedAssignments = [];

  console.log(
    `Detected ${assignmentRows.length} item(s). Extracting DOM elements now...`,
  );

  for (const row of assignmentRows) {
    try {
      const title = await row.locator(".ig-title").innerText();
      const dueDateElement = row.locator(".assignment-date-due");
      const dueDate =
        (await dueDateElement.count()) > 0
          ? await dueDateElement.innerText()
          : "No due date Present";
      const statusElement = row.locator(".submission-status-container");
      const status =
        (await statusElement.count()) > 0
          ? await statusElement.innerText()
          : "Not Submitted / Available";
      scrapedAssignments.push({
        title: title.trim(),
        dueDatee: dueDate.trim(),
        status: status.trim(),
      });
    } catch (error) {
      console.log("Error: A row failed to be parsed", error?.message);
      continue;
    }

    console.log("\nScrapping complete. Here are the results:");
    console.table(scrapedAssignments);
  }
}

ALUCanvasScrape();
