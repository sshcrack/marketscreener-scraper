import { getMarketTable } from "./tables";
import inquier from "inquirer"
import cheerio from "cheerio"
import fs from "fs"
import fetch from "node-fetch"
import ora from "ora"
import beautify from "json-beautify"

async function start() {
  const { url } = await inquier.prompt([
    {
      type: "input",
      name: "url",
      message: "Input the url to scrape (Example: https://www.marketscreener.com/quote/stock/TESLA-INC-6344549/financials/)"
    }
  ])

  const spinner = ora("Scraping...").start()
  fetch(url).then(async resp => {
    if (resp.status !== 200)
      return console.log("Invalid Response status")
    return resp.text()
  }).then(text => {
    if (!text) return;
  
    const $ = cheerio.load(text)
    const selector = "table.tabElemNoBor:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1)"
    const tbody = $(selector)
  
    const out = getMarketTable($, tbody)
  
    //@ts-ignore
    fs.writeFileSync("out.json", beautify(out, null, 2, 10))
    spinner.succeed("Wrote output to out.json")
  })
}

start()