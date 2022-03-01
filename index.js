const fs = require('fs')
const http = require('http')
const path = require('path')
const server = http.createServer((req, res) => {

  if ( req.url === "/" ) {
    res.end(fs.readFileSync("./app/index.html"))
  }

  if ( req.url === "/upload") {
    const fileName = req.headers["file-name"]
    req.on("data", chunk => {
      fs.appendFileSync(`./storage/${fileName}`, chunk)
      console.log("received chunk")
    })
    res.end("uploaded!")
  }

  if ( req.url === "/storage" ) {
    let fileArray = fs.readdirSync("./storage")

    res.end(JSON.stringify(fileArray))
  }
  
  if ( req.url === "/download" ) {
    const fileName = req.headers["file-name"]
    const file = fs.readFileSync(`./storage/${fileName}`)
    const srcurl = path.join("http://localhost:8080", `/storage/${fileName}`)

    res.end(file)
  }

  if ( req.url === "/delfile" ) {
    const fileName = req.headers["file-name"]
    const file = fs.unlinkSync(`./storage/${fileName}`)

    res.end("Deleting complete!")
  }

  if ( req.url === "/changename" ) {
    const og = req.headers["file"]
    const name = req.headers["file-name"]

    fs.renameSync(`./storage/${og}`, `./storage/${name}`)
    res.end("Change complete!")
  }

})

server.listen(8080, () => console.log("Listening on port 8080"))