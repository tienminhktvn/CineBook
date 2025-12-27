const { Role } = require("../models/enum");

const isAdminOrStaff = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === Role.ADMIN || req.user.role === Role.STAFF)
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin or Staff access required",
    });
  }
};

module.exports = isAdminOrStaff;
