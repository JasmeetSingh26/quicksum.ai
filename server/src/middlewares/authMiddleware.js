const { verifyToken } = require("../utils/tokenUtils");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    console.log("token not found");
    return res.status(401).json({ message: "Authentication required" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    console.log("token not valid");
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.userId = decoded.id;
  next();
};

module.exports = authMiddleware;
