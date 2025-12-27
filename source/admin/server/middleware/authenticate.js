const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Differentiate between expired and invalid tokens
      const message =
        err.name === "TokenExpiredError"
          ? "Token has expired"
          : "Token is invalid";

      return res.status(403).json({
        success: false,
        message,
      });
    }

    req.user = decoded; // Attach decoded user payload to the request object
    next();
  });
};

module.exports = authenticateToken;
