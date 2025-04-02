
function adminMiddleware(req, res, next) {
    const isAdmin = req.headers["admin-token"] === "secret-admin"; // or hardcoded true
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  }
  module.exports = adminMiddleware;
  
  