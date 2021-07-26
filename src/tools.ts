import { Cheerio, CheerioAPI, Element } from "cheerio"

export function cleanupString(str: string) {
  str = str.split("\t").join("")
  str = str.split("\n").join("")
  str = str.split("\r").join("")
  str = str.split("  ").join("")

  return str.trim()
}

export function getFirstTextOnly($: CheerioAPI, element: Cheerio<Element>) {
  let text = element.text()
  const nonTextChildren = element
    .children()
    .toArray()
  const textToRemove = nonTextChildren.map(node => {
    const childText = $(node).text()

    return childText
  })

  textToRemove.forEach(removal =>
    text = text.replace(removal, "")
  )

  return text
}