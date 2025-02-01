const http = require("http");
const url = require("url")
const dt = require("./modules/utils")
const message = require("./lang/en/en.json");

http.createServer((req, res) => {
    const q = url.parse(req.url, true)
    const username = q.query.name || "Guest"
    res.writeHead(200, {"Content-type": "text/html"})
    res.end(`${dt.myDateTime()}`)
}).listen(8888)

