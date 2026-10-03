const { chromium } = require("playwright");
const fs = require("fs"); //file system

async function scrapingData() {
  //asynchronous functions

  const browser = await chromium.launch({ headless: false }); // promises
  const page = await browser.newPage();
  await page.goto("https://alueducation.instructure.com/courses");

  await page.waitForURL("**/courses**", { timeout: 0 }); // ** => wild-cards || any character or text
  console.log("Canvas has been accessed");

  await page.getByRole("link", { name: "Frontend Web Development" }).click();
  console.log("Frontend Web Development course has been clicked");

  await page.getByRole("link", { name: "Assignments" }).click();
  console.log("Assignments tab has been clicked");

  await page.waitForSelector(".assignment-list");

  const assignments = await page.locator(".assignment-list .ig-row").all();

  const scrappedAssignments = [];

  await page.waitForTimeout(3000);

  for (const assignment of assignments) {
    const assignmentTitle = await assignment.locator(".ig-title").innerText();

    const status =
      (await assignment.locator(".default-dates").count()) > 0
        ? await assignment.locator(".default-dates").innerText()
        : "No status";

    const dueDate =
      (await assignment.locator(".assignment-date-due").count()) > 0
        ? await assignment.locator(".assignment-date-due").innerText()
        : "No due date";

    const marks =
      (await assignment.locator(".score-display").count()) > 0
        ? await assignment.locator(".score-display").innerText()
        : "No marks";

    scrappedAssignments.push({
      assignmentTitle,
      status,
      dueDate,
      marks,
    });
  }

  console.log(scrappedAssignments);
  fs.writeFileSync(
    "assignments.json",
    JSON.stringify(scrappedAssignments, null, 2),
  );
  console.log("All assignments have been scraped...");
  await page.waitForTimeout(1000);
  await browser.close();
}

scrapingData();
