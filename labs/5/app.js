const url = require("url");
const messageData = require("./lang/en/en.json");
const { connection, admin } = require("./db");

class DatabaseAPI {
  constructor(connection, admin) {
    this.connection = connection;
    this.admin = admin;
  }

  async initializeDatabase() {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS patients (
          patientid INT(11) PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          dateOfBirth DATETIME NOT NULL
        ) ENGINE=InnoDB
      `;
      await this.admin.promise().query(createTableQuery);
      console.log("Patients table initialized successfully");
    } catch (err) {
      console.error("Error initializing database:", err);
      process.exit(1);
    }
  }

  async handleGet(req, res) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const sqlQuery = (parsedUrl.query.query || "").trim();

      if (!sqlQuery) {
        this.handleError(res, 400, messageData.errorMissingQuery);
        return;
      }

      if (!sqlQuery.toLowerCase().startsWith("select")) {
        this.handleError(res, 403, messageData.onlySelectAllowed);
        return;
      }

      const [results, fields] = await this.connection.promise().query(sqlQuery);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ results }));
    } catch (err) {
      this.handleError(
        res,
        500,
        `${messageData.internalServerError}: ${err.message}`
      );
    }
  }

  async handlePost(req, res) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        if (!body) {
          this.handleError(res, 400, messageData.errorMissingQuery);
          return;
        }

        const data = JSON.parse(body);
        const query = data.query.trim();

        if (!query.toLowerCase().startsWith("insert")) {
          this.handleError(res, 403, messageData.onlyInsertAllowed);
          return;
        }

        const [results, fields] = await this.connection.promise().query(query);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ results }));
      } catch (err) {
        this.handleError(
          res,
          500,
          `${messageData.internalServerError}: ${err.message}`
        );
      }
    });
  }

  async handleRequest(req, res) {
    await this.initializeDatabase();

    switch (req.method) {
      case "GET":
        await this.handleGet(req, res);
        break;
      case "POST":
        await this.handlePost(req, res);
        break;
      default:
        this.handleError(res, 405, messageData.methodNotAllowed);
        break;
    }
  }

  handleError(res, errorCode, errorMessage) {
    res.writeHead(errorCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: errorMessage }));
  }
}

const databaseAPI = new DatabaseAPI(connection, admin);
module.exports = {
  handleDatabaseRequest: (req, res) => databaseAPI.handleRequest(req, res),
};
