import chalk from "chalk"
import express from "express"
import open from "open"
import ora from "ora"
import path from "path"

const app = express()
const url = "http://localhost:3000"
const publicPath = path.join(process.cwd(), "public")

const staticMiddleware = express.static(publicPath)
app.use(staticMiddleware)

app.listen(3000, async () => {
  console.log(chalk`
  {yellow.bold ⚡ Listening on port 3000.}

  📊 {blue Graph} {cyan.underline.italic generated.}

  `)

  const spinner = ora(`🌎 Opening browser...`).start()
  await open(url)
    .then(() => spinner.succeed(`🌎 Opened browser!`))
  .catch(() => spinner.fail(`🌎 Couldn't open browser. Try: ${url}`))
})