const http = require("http");
const url = require("url");
const { getDate, writeFile } = require("./labs/3/api")

const PORT = process.env.PORT || 8888

http.createServer((req, res) => {
    const q = url.parse(req.url, true)
    const pathname = q.pathname

    if (pathname === "/COMP4537/labs/3/getDate") {
        getDate(req, res)
        return
    }

    if (pathname === "/COMP4537/labs/3/writeFile") {
        writeFile(req, res)
        return
    }
}).listen(PORT)
