const http = require("http");
const url = require("url");
const path = require("url");
const { getDate, writeFile, readFile } = require("./labs/3/api");

const PORT = process.env.PORT || 8888;

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);

    switch (true) {
      case pathname.startsWith("/COMP4537/labs/3/getDate"):
        return getDate(req, res);

      case pathname.startsWith("/COMP4537/labs/3/writeFile"):
        return writeFile(req, res);

      case pathname.startsWith("/COMP/4537/labs/3/readText"):
        return readFile(req, res);

      default:
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("404 Not Found");
    }
  })
  .listen(PORT);
