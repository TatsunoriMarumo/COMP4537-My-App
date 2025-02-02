const http = require("http");
const url = require("url");
const fs = require("fs").promises;
const dt = require("../../modules/utils");
const messageData = require("../../lang/en/en.json");
const path = require("path");

const getDate = (req, res) => {
  const { query } = url.parse(req.url, true);
  const name = query.name || "Guest";
  const message = messageData.message;
  const serverTime = dt.myDateTime();
  const formattedMessage = message.replace("%1", name) + ` ${serverTime}`;

  res.writeHead(200, { "Content-type": "text/html" });
  res.end(`<p style="color: blue; font-size: 18px;">${formattedMessage}</p>`);
};

const writeFile = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const text = query.text;
  if (!text) {
    res.writeHead(400, { "content-type": "text/plain" });
    res.end("Missing 'text' parameter");
    return;
  }
  const success = await FileHandler.appendFile("file.txt", text);
  res.writeHead(success ? 200 : 500, { "content-type": "text/plain" });
  res.end(
    success ? "Text successfully appended to file." : "Error writing to file."
  );
};


const readFile = async (req, res) => {
    const { pathname } = url.parse(req.url, true)
    const filename = path.basename(pathname)
    const data = await FileHandler.readFile(filename)
    res.writeHead(data ? 200 : 404, { "content-type": "text/plain" });
    res.end(
        data ? data : "404 File Not Found."
    )
}

class FileHandler {
  static async appendFile(filename, text) {
    try {
      await fs.appendFile(filename, text + "\n");
      return true;
    } catch (err) {
      console.error("Error writing to file:", err);
      return false;
    }
  }

  static async readFile(filename) {
    try {
      return await fs.readFile(filename, "utf8");
    } catch (err) {
      console.log("Error reading file:", err);
      return null;
    }
  }
}

module.exports = {
  getDate,
  writeFile,
  readFile,
};
