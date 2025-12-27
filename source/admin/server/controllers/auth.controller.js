const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository");
const RoleRepository = require("../repositories/role.repository");
const { Role, UserStatus } = require("../models/enum");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "24h"; // 24 hours
const TOKEN_EXPIRY_SECONDS = 86400;

const AuthController = {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Admin login
   *     description: Authenticate an admin user and receive a JWT token
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginInput'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Account not active or not admin
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      // Find user with role
      const user = await UserRepository.findByUsernameWithRole(username);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Check if user is admin (this is admin panel)
      if (user.role !== Role.ADMIN) {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      // Check if account is active
      if (user.status !== UserStatus.ACTIVE) {
        return res.status(403).json({
          success: false,
          message: `Account is ${user.status}. Please contact support.`,
        });
      }

      // Generate JWT token
      const tokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: TOKEN_EXPIRY_SECONDS,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  },

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register new admin user
   *     description: Register a new admin user (requires existing admin authentication)
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterInput'
   *     responses:
   *       201:
   *         description: Registration successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegisterResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       409:
   *         description: Username or email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  register: async (req, res) => {
    try {
      const { username, password, email, full_name, phone_number } = req.body;

      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).json({
          success: false,
          message: "Username, password, and email are required",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Check if user already exists
      const existingUser = await UserRepository.existsByUsernameOrEmail(
        username,
        email
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username or email already exists",
        });
      }

      // Get admin role ID
      const adminRole = await RoleRepository.findByName(Role.ADMIN);

      if (!adminRole) {
        return res.status(500).json({
          success: false,
          message: "Admin role not found in database",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const newUser = await UserRepository.create({
        username,
        password_hash: passwordHash,
        email,
        full_name,
        phone_number,
        role_id: adminRole.id,
        status: UserStatus.ACTIVE, // Admin accounts are active immediately
      });

      // Get user with role info
      const userWithRole = await UserRepository.findByIdWithRole(newUser.id);

      return res.status(201).json({
        success: true,
        data: {
          user: userWithRole,
          message: "Registration successful",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  },

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout
   *     description: Logout the current user (client should discard the token)
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LogoutResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  logout: async (req, res) => {
    try {
      // Since JWT is stateless, we just return success
      // The client should discard the token
      // For enhanced security, you could implement a token blacklist

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  },

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current user
   *     description: Get the currently authenticated user's information
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: User info retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  me: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await UserRepository.findByIdWithRole(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not get user information",
      });
    }
  },
};

module.exports = AuthController;
