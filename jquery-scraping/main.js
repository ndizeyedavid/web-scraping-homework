const fs = require("fs");
const { JSDOM } = require("jsdom");

const dom = new JSDOM(fs.readFileSync("dom.html", "utf-8"));

const { jQueryFactory } = require("jquery/factory");

const $ = jQueryFactory(dom.window);

const titles = $(".ig-title");

console.log(titles);
