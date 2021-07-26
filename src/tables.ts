import { Cheerio, CheerioAPI, Element } from "cheerio"
import { JSONObject } from "./interfaces"
import { cleanupString, getFirstTextOnly } from "./tools"

export function getMarketTable($: CheerioAPI, businessTable: Cheerio<Element>, skipElements = 2) {
  const tableChildren = businessTable.children("tr").toArray()
  const columnNames = $(tableChildren.shift())
    .children("td")
    .toArray()
    //Removing first element because first one is a placeholder
    .slice(1)
    .map(e => $(e).text())

  const res: JSONObject<JSONObject<string[]>> = {}
  tableChildren.map(node => {
    const element = $(node)

    //Duplicate Array
    const columnNamesLeft = columnNames.concat([])

    const childs = element
      .children("td")
      .toArray()

    const row = $(childs.shift())
    const rowName = getFirstTextOnly($, row)
    if (!rowName) return;

    const rowData: JSONObject<string[]> = {}


    let toAdd: string[] = []
    childs.map((n, i) => {
      const child = $(n)
      const shouldAdd = i % skipElements === (skipElements - 1)

      const text = child.text()
      const cleanedUp = cleanupString(text)
      toAdd.push(cleanedUp)

      if (shouldAdd) {
        const header = columnNamesLeft.shift()
        if(header)
          rowData[header] = toAdd

        toAdd = []
      }
    })

    if (toAdd.length !== 0) {
      const header = columnNamesLeft.shift()
      if(header)
        rowData[header] = toAdd
    }

    res[rowName] = rowData
  })

  return res
}

export function getSimpleTable($: CheerioAPI, tbody: Cheerio<Element>, skipHeaders = 0) {
  const trs = tbody
    .children("tr")
    .toArray()

  const headers = $(trs.shift())
    .children("td")
    .toArray()
    .slice(skipHeaders)
    .map(node => $(node).text())
    .map(text => cleanupString(text))

  const out: JSONObject<string>[] = []

  trs.map(node => {
    const el = $(node)
    const currRow: JSONObject<string> = {}

    el.children("td").each((i, tdNode) => {
      const el = $(tdNode)
      const text = el.text()
      const cleanedUp = cleanupString(text)

      currRow[headers[i]] = cleanedUp
    })

    out.push(currRow)
  })

  return out
}
