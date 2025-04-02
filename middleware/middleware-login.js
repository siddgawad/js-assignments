
const users = require("../data/users");

function userMiddleware(req, res, next) {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.userId = user.id;
  next();
}

module.exports = userMiddleware;
