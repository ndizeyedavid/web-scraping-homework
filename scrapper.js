const { chromium } = require("playwright");
const fs = require("fs");

const CANVAS_URL = "https://alueducation.instructure.com/courses";

function determineCategory(assignmentTitle) {
  const assignmentRegex = {
    intranet: /intranet/,
    quiz: /quiz/,
    resources: /(Read|Forum|Resources)/,
    attendance: /Attendance/,
    other: /(.*)/,
  };

  switch (true) {
    case assignmentRegex.intranet.test(assignmentTitle):
      return "Intranet";
    case assignmentRegex.quiz.test(assignmentTitle):
      return "Quiz";
    case assignmentRegex.resources.test(assignmentTitle):
      return "Resources";
    case assignmentRegex.attendance.test(assignmentTitle):
      return "Attendance";
    default:
      return "Regular";
  }
}
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

  await page.waitForTimeout(2000);

  for (const row of assignmentRows) {
    try {
      const title = await row.locator(".ig-title").innerText();

      const assignmentCategory = determineCategory(title);

      const dueDateElement = row.locator(".assignment-date-due");
      const dueDate =
        (await dueDateElement.count()) > 0
          ? await dueDateElement.innerText()
          : "Undated";

      const statusElement = row.locator(".default-dates");
      const status =
        (await statusElement.count()) > 0
          ? await statusElement.innerText()
          : "-";

      const score = await row.locator(".score-display").innerText();

      const detailsLink = await row.locator(".ig-title").getAttribute("href");

      scrapedAssignments.push({
        title: title.trim(),
        category: assignmentCategory,
        dueDate: dueDate.trim().replace(/\n/g, " "),
        status: status.trim(),
        score: score.trim(),
        details: detailsLink || "-",
      });
    } catch (error) {
      console.log("Error: A row failed to be parsed", error?.message);
      continue;
    }
  }

  console.log("\nScrapping complete. Here are the results:");
  console.table(scrapedAssignments);

  const jsonFileName = "canvas_assignments.json";
  const screenshotFileName = "canvas_assignments.png";

  const jsonString = JSON.stringify(scrapedAssignments, null, 2);
  fs.writeFileSync(jsonFileName, jsonString);
  console.log(`\nScrapped Assignment JSON file saved as: ./${jsonFileName}`);

  await page.screenshot({ path: screenshotFileName });
  console.log(`\nScreenshot saved as: ./${screenshotFileName}`);

  await page.waitForTimeout(3000);
  await browser.close();
}

ALUCanvasScrape();
