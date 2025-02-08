const url = require("url");
const messageData = require("./lang/en/en.json");
const { error } = require("console");

class Dictionary {
  constructor() {
    this.dictionary = {};
    this.numberOfRequests = 0;
    this.lastUpdated = new Date().toString();
  }

  isWordInDictionary(word) {
    return this.dictionary.hasOwnProperty(word);
  }

  searchWord(req, res) {
    try {
      const { query } = url.parse(req.url, true);
      const word = this.formatWord(query.word);
      if (!word) {
        this.handleBadRequest(res);
        return;
      }
      const definition = this.isWordInDictionary(word)
        ? this.dictionary[word]
        : undefined;

      this.numberOfRequests += 1;

      const response = {
        status: "success",
        data: {
          word: word,
          definition: definition,
          numberOfRequests: this.numberOfRequests,
          lastUpdated: this.lastUpdated,
        },
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: messageData.internalServerError }));
    }
  }

  storeWord(req, res) {
    let body = "";
    req.on("data", (chunk) => {
      if (chunk) {
        body += chunk;
      }
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const word = this.formatWord(data.word);

        if (!word || typeof data.definition !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "error",
              message: messageData.invalidInput,
            })
          );
          return;
        }

        const definition = data.definition.trim();

        if (this.isWordInDictionary(word)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "error",
              message: messageData.wordAlreadyExists.replace("%1", word),
            })
          );
          return;
        }

        this.dictionary[word] = definition;
        this.numberOfRequests += 1;
        this.lastUpdated = new Date().toString();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: "success",
            message: messageData.wordStoredSuccessfully.replace("%1", word),
          })
        );
      } catch (error) {
        res.writeHead(400);
        res.end(
          JSON.stringify({ status: "error", message: messageData.invalidJson })
        );
      }
    });
  }

  formatWord(word) {
    if (word && typeof word === "string") {
      return word.trim().toLowerCase();
    }
  }

  handleBadRequest(res) {
    res.writeHead(400, {
      "Content-Type": "text/html",
    });
    res.end(JSON.stringify({ error: messageData.errorMissingWord }));
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
