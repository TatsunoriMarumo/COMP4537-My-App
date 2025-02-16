const url = require("url");
const messageData = require("./lang/en/en.json");
const { connection } = require("./db");

const handleGet = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const sqlQuery = (parsedUrl.query.query || "").trim();

    if (!sqlQuery) {
      handleError(res, 400, messageData.errorMissingQuery);
      return;
    }

    if (!sqlQuery.toLowerCase().startsWith("select")) {
      handleError(res, 403, messageData.onlySelectAllowed);
      return;
    }

    const [results, fields] = await connection.promise().query(sqlQuery);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results }));
  } catch (err) {
    handleError(res, 500, `${messageData.internalServerError}: ${err.message}`);
  }
};

const handlePost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      if (!body) {
        handleError(res, 400, messageData.errorMissingQuery);
        return;
      }

      const data = JSON.parse(body);
      const query = data.query.trim();

      if (!query.toLowerCase().startsWith("insert")) {
        handleError(res, 403, messageData.onlyInsertAllowed);
        return;
      }

      const [results, fields] = await connection.promise().query(query);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ results }));
    } catch (err) {
      handleError(
        res,
        500,
        `${messageData.internalServerError}: ${err.message}`
      );
    }
  });
};

const handleDatabaseRequest = (req, res) => {
  switch (req.method) {
    case "GET":
      handleGet(req, res);
      break;
    case "POST":
      handlePost(req, res);
      break;
    default:
      handleError(res, 405, messageData.methodNotAllowed);
      break;
  }
};

const handleError = (res, errorCode, errorMessage) => {
  res.writeHead(errorCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "error", message: errorMessage }));
};

module.exports = {
  handleDatabaseRequest,
};
