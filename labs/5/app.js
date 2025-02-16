const url = require("url");
const { connection } = require("./db");
const messageData = require("./lang/en/en.json");

const handleGet = (req, res) => {
  const { query } = url.parse(req.url, true);
  const sqlQuery = (query.query || "").trim();

  if (!sqlQuery) {
    handleError(res, 400, messageData.errorMissingQuery);
    return;
  }

  if (!sqlQuery.toLowerCase().startsWith("select")) {
    handleError(res, 403, messageData.onlySelectAllowed);
    return;
  }

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      handleError(
        res,
        500,
        `${messageData.internalServerError}: ${err.message}`
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results }));
  });
};

const handlePost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (!body) {
      handleError(res, 400, messageData.errorMissingQuery);
      return;
    }

    const data = JSON.parse(body)

    const query = data.query.trim();

    if (!query.toLowerCase().startsWith("insert")) {
      handleError(res, 403, messageData.onlyInsertAllowed);
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        handleError(
          res,
          500,
          `${messageData.internalServerError}: ${err.message}`
        );
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ results }));
    });
  });
};

const handleDatabaseRequest = (req, res) => {
  switch (req.method) {
    case "GET":
      handleGet(req, res);
      return;
    case "POST":
      handlePost(req, res);
      return;
    default:
      handleError(res, 405, messageData.methodNotAllowed);
      return;
  }
};

const handleError = (res, errorCode, errorMessage) => {
  res.writeHead(errorCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "error", message: errorMessage }));
};

module.exports = {
  handleDatabaseRequest,
};
