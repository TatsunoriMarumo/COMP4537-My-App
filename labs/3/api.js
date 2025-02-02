const http = require("http");
const url = require("url")
const dt = require("../../modules/utils")
const messageData = require("../../lang/en/en.json")


const lab3 = ((req, res) => {
    const q = url.parse(req.url, true)
    const name = q.query.name || "Guest"
    const message = messageData.message;
    const serverTime = dt.myDateTime();
    const formattedMessage = message.replace("%1", name) + ` ${serverTime}`



    res.writeHead(200, {"Content-type": "text/html"})
    res.end(`<p style="color: blue; font-size: 18px;">${formattedMessage}</p>`)
})

module.exports = { lab3 };
