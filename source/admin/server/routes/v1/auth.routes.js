const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const { authenticateToken, isAdmin } = require("../../middleware");

// Public routes
router.post("/login", AuthController.login);

// Protected routes
router.post("/register", authenticateToken, isAdmin, AuthController.register);
router.post("/logout", authenticateToken, AuthController.logout);
router.get("/me", authenticateToken, AuthController.me);

module.exports = router;
