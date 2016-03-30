#!/usr/bin/env node

var fs = require("fs");
var open = require("open");
var Mustache = require("mustache");
var GoogleSpreadsheet = require("google-spreadsheet");
var pick = require("lodash.pick");
var key = "0Ai2sCp3HpDyGdDRVZWJmaGItaU5BY0NDWEFfY3cyU1E";
var sheet = new GoogleSpreadsheet(key);
var output;
var context = {levels: []};
var outputFile = "./index.html";

levelTitles = [
  "What is JavaScript?",
  "I know that JavaScript is not Java",
  "console.log() all the things",
  "Callbacks don't scare me",
  "Go forth, young padawon, rely on your training and you will succeed!",
]

sheet.getRows(1, function(err, rows){
  if (err) throw err;
  rows = rows.map(function(row) {
    return pick(row, ['title', 'url', 'description', 'levelofdifficulty']);
  });

  // Break it up by level
  [1,2,3,4,5].forEach(function(level) {
    context.levels[level-1] = {
      title: "Level " + level + ": " + levelTitles[level-1],
      rows: rows.filter(function(row) { return Number(row.levelofdifficulty) === level})
    }
  })

  output = Mustache.render(fs.readFileSync("./template.html").toString(), context);
  fs.writeFileSync(outputFile, output);
  open(outputFile);
});
