const url = require("url");
const messageData = require("./lang/en/en.json");

class Dictionary {
  constructor() {
    this.dictionary = {};
    this.numberOfRequests = 0;
    this.lastUpdated = new Date().toString();
  }

  isValidFormat(str) {
    return typeof str === "string" && str.trim() !== "";
  }

  formatWord(word) {
    if (typeof word === "string") {
      return word.trim().toLowerCase();
    }
    return "";
  }

  isWordInDictionary(word) {
    return Object.prototype.hasOwnProperty.call(this.dictionary, word);
  }

  searchWord(req, res) {
    try {
      const { query } = url.parse(req.url, true);
      const word = query.word;

      if (!word || !this.isValidFormat(word)) {
        return this.handleBadRequest(res, messageData.errorMissingWord);
      }

      const formattedWord = this.formatWord(word);
      this.numberOfRequests += 1;

      if (this.isWordInDictionary(formattedWord)) {
        const definition = this.dictionary[formattedWord];
        const response = {
          status: "success",
          data: {
            word: formattedWord,
            definition: definition,
            numberOfRequests: this.numberOfRequests,
            totalEntries: Object.keys(this.dictionary).length,
            lastUpdated: this.lastUpdated,
          },
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } else {
        const response = {
          status: "error",
          message: messageData.wordNotFound
            .replace("%1", this.numberOfRequests)
            .replace("%2", formattedWord),
          numberOfRequests: this.numberOfRequests,
          totalEntries: Object.keys(this.dictionary).length,
        };
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      }
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: messageData.internalServerError }));
    }
  }

  storeWord(req, res) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const word = data.word;
        const definition = data.definition;

        if (
          !word ||
          !this.isValidFormat(word) ||
          !this.isValidFormat(definition)
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "error",
              message: messageData.invalidInput,
            })
          );
          return;
        }

        const formattedWord = this.formatWord(word);
        const formattedDefinition = definition.trim();

        if (this.isWordInDictionary(formattedWord)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "error",
              message: messageData.wordAlreadyExists.replace(
                "%1",
                formattedWord
              ),
              numberOfRequests: this.numberOfRequests,
              totalEntries: Object.keys(this.dictionary).length,
            })
          );
          return;
        }

        this.dictionary[formattedWord] = formattedDefinition;
        this.numberOfRequests += 1;
        this.lastUpdated = new Date().toString();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "success",
            message: messageData.wordStoredSuccessfully.replace(
              "%1",
              formattedWord
            ),
            numberOfRequests: this.numberOfRequests,
            totalEntries: Object.keys(this.dictionary).length,
            lastUpdated: this.lastUpdated,
          })
        );
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ status: "error", message: messageData.invalidJson })
        );
      }
    });
  }

  handleBadRequest(res, errorMessage) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: errorMessage }));
  }
}

const dictionary = new Dictionary();

const handleRequest = (req, res) => {
  if (req.method === "GET") {
    dictionary.searchWord(req, res);
  } else if (req.method === "POST") {
    dictionary.storeWord(req, res);
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "Method Not Allowed" }));
  }
};

module.exports = {
  handleRequest,
};
