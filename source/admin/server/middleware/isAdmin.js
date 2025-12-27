const { Role } = require("../models/enum");

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === Role.ADMIN) {
    next(); // User is an admin, proceed to the route handler
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
};

module.exports = isAdmin;
