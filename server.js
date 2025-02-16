const http = require("http");
const url = require("url");
const { getDate, writeFile, readFile } = require("./labs/3/api");
const { handleRequest } = require("./labs/4/app");
const { handleDatabaseRequest } = require("./labs/5/app");
const messageData = require("./lang/en/en.json");

const PORT = process.env.PORT || 8888;

const BASE_URL = "/COMP4537/labs";
const LAB3_URL = `${BASE_URL}/3`;
const LAB4_URL = `${BASE_URL}/4`;
const LAB5_URL = `${BASE_URL}/5`;

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200, {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const { pathname } = url.parse(req.url, true);

    switch (true) {
      case pathname.startsWith(`${LAB3_URL}/getDate`):
        return getDate(req, res);

      case pathname.startsWith(`${LAB3_URL}/writeFile`):
        return writeFile(req, res);

      case pathname.startsWith(`${LAB3_URL}/readFile`):
        return readFile(req, res);

      case pathname.startsWith(`${LAB4_URL}/api/definitions`):
        return handleRequest(req, res);

      case pathname.startsWith(`${LAB5_URL}/api/v1/sql`):
        return handleDatabaseRequest(req, res);

      default:
        res.writeHead(404, { "content-type": "text/plain" });
        res.end(messageData.errorPageNotFound);
    }
  })
  .listen(PORT);
