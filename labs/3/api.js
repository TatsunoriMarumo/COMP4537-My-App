const http = require("http");
const url = require("url");
const fs = require("fs");
const dt = require("../../modules/utils")
const messageData = require("../../lang/en/en.json")


const getDate = ((req, res) => {
    const q = url.parse(req.url, true)
    const name = q.query.name || "Guest"
    const message = messageData.message;
    const serverTime = dt.myDateTime();
    const formattedMessage = message.replace("%1", name) + ` ${serverTime}`

    res.writeHead(200, {"Content-type": "text/html"})
    res.end(`<p style="color: blue; font-size: 18px;">${formattedMessage}</p>`)
})

const writeFile = ((req, res) => {
    const file = "file.txt"
    const q = url.parse(req.url, true)
    const text = q.query.name
    fs.appendFile(file, text + "\n", (err) => {
        if (err) {
            res.writeHead(500, { "Content-type": "text/plain" });
            res.end("Error occurs while writing to file.")
            return
        }
    }) 
    res.writeHead(200, { "Content-type": "text/plain" })
    res.end("Text successfully appended to file.")
})

module.exports = { 
    getDate,
    writeFile,
 };

