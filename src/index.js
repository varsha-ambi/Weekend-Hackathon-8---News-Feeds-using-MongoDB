const express = require("express");
const { newsArticleModel } = require("./connector");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let defLimit = 10,
  defOffset = 0;
app.get("/newFeeds", (req, res) => {
  let limitReceived = req.query.limit;
  let offsetReceived = req.query.offset;
  let limit, offset;
  limit = parseInt(Number(limitReceived));
  offset = parseInt(Number(offsetReceived));
  if (!limitReceived) {
    limit = defLimit;
  }
  if (!offsetReceived) {
    offset = defOffset;
  }
  if (isNaN(offset)) {
    offset = defOffset;
  }
  if (isNaN(limit)) {
    limit = defLimit;
    if (!offsetReceived) {
      offset = defOffset;
    }
  }
  newsArticleModel
    .find()
    .then((result) => {
      let start = 0;
      start += offset;
      let resultArray = [];
      for (let startIndex = start; startIndex < start + limit; startIndex++) {
        resultArray.push(result[startIndex]);
      }
      res.json(resultArray);
    })
    .catch((_) => res.json([]));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
