const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Check for token in cookie first, then fall back to Authorization header
  let token = req.cookies?.access_token;

  // Fallback to Authorization header for backwards compatibility
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1]; // Get the token from "Bearer TOKEN"
  }

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
