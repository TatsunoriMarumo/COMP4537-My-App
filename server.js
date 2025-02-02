const http = require("http");
const url = require("url");
const { getDate, writeFile, readFile } = require("./labs/3/api");

const PORT = process.env.PORT || 8888;

const base_url = "/COMP4537/labs"
const lab3_url = `${base_url}/3`

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);

    switch (true) {
      case pathname.startsWith(`${lab3_url}/getDate`):
        return getDate(req, res);

      case pathname.startsWith(`${lab3_url}/writeFile`):
        return writeFile(req, res);

      case pathname.startsWith(`${lab3_url}/readFile`):
        return readFile(req, res);

      default:
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("404 Not Found");
    }
  })
  .listen(PORT);
