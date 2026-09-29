const fs = require("fs");
const { JSDOM } = require("jsdom");

const dom = new JSDOM(fs.readFileSync("dom.html", "utf-8"));

const { jQueryFactory } = require("jquery/factory");

const $ = jQueryFactory(dom.window);

const assignments = $(".assignment-list .ig-row");
const extractedAssignments = [];

for (let assignment of assignments) {
  let title = $(assignment).find(".ig-title").text().trim();
  let dueDate =
    $(assignment)
      .find(".assignment-date-due")
      .text()
      .trim()
      .replace(/\n/g, " ") || "Undated";
  let status = $(assignment).find(".default-dates").text() || "No Status";
  let score = $(assignment).find(".score-display").text().trim();
  let assignmentLink = $(assignment).find(".ig-title").attr("href");

  extractedAssignments.push({
    title: title,
    // category: assignmentCategory,
    dueDate: dueDate,
    status: status,
    score: score,
    link: assignmentLink || "-",
  });
}

console.log(extractedAssignments);
