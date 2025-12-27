const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const { authenticateToken, isAdmin } = require("../../middleware");

// Public routes
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

// Protected routes
router.post("/logout", authenticateToken, AuthController.logout);
router.get("/me", authenticateToken, AuthController.me);

module.exports = router;
