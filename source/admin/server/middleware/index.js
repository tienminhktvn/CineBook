const authenticateToken = require("./authenticate");
const isAdmin = require("./isAdmin");
const isAdminOrStaff = require("./isAdminOrStaff");

module.exports = {
  authenticateToken,
  isAdmin,
  isAdminOrStaff,
};
