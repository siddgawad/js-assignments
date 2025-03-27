const express = require("express");
const app = express();
const PORT = 3000;

let numberOfRequestsForUser = {};

setInterval(() => {
  numberOfRequestsForUser = {};
}, 1000);

app.use((req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(400).json({ message: "Did not find user id in header" });
  }

  if (!numberOfRequestsForUser[userId]) {
    numberOfRequestsForUser[userId] = 1;
  } else {
    numberOfRequestsForUser[userId]++;
  }

  console.log(userId, numberOfRequestsForUser[userId]);

  if (numberOfRequestsForUser[userId] > 5) {
    return res.status(429).json({ error: "Too many requests" });
  }

  next();
});

app.get("/user", (req, res) => {
  return res.status(200).json({ name: "sid the g" });
});

app.post("/user", (req, res) => {
  return res.status(200).json({ message: "created dummy user" });
});

app.listen(PORT, () => {
  console.log(`Rate limiter running on http://localhost:${PORT}`);
});
