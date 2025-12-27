const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/user.repository");
const RoleRepository = require("../repositories/role.repository");
const { Role, UserStatus } = require("../models/enum");
const { logger } = require("../config/logger");

const SALT_ROUNDS = 10;

const UserController = {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve a list of all users (Admin only)
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserListResponse'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await UserRepository.findAllWithRoles();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      logger.error("Get all users error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
      });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Retrieve a single user by their ID (Admin only)
   *     tags: [Users]
   *     parameters:
   *       - $ref: '#/components/parameters/UserId'
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserRepository.findByIdWithRole(id);

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
      logger.error("Get user by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user",
      });
    }
  },

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     description: Create a new user with specified role (Admin only)
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       409:
   *         description: Username or email already exists
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createUser: async (req, res) => {
    try {
      const {
        username,
        password,
        email,
        full_name,
        phone_number,
        role,
        status,
      } = req.body;

      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).json({
          success: false,
          message: "Username, password, and email are required",
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

      // Get role ID
      const roleName = role || Role.CUSTOMER;
      const roleRecord = await RoleRepository.findByName(roleName);
      if (!roleRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified",
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
        role_id: roleRecord.id,
        status: status || UserStatus.ACTIVE,
      });

      // Get user with role info
      const userWithRole = await UserRepository.findByIdWithRole(newUser.id);

      return res.status(201).json({
        success: true,
        data: userWithRole,
      });
    } catch (error) {
      logger.error("Create user error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update a user
   *     description: Update an existing user (Admin only)
   *     tags: [Users]
   *     parameters:
   *       - $ref: '#/components/parameters/UserId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserInput'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        username,
        email,
        full_name,
        phone_number,
        role,
        status,
        password,
      } = req.body;

      // Check if user exists
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prepare update data
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (status) updateData.status = status;

      // Update password if provided
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      }

      // Update role if provided
      if (role) {
        const roleRecord = await RoleRepository.findByName(role);
        if (roleRecord) {
          updateData.role_id = roleRecord.id;
        }
      }

      await UserRepository.updateById(id, updateData);
      const updatedUser = await UserRepository.findByIdWithRole(id);

      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error("Update user error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Delete a user by ID (Admin only)
   *     tags: [Users]
   *     parameters:
   *       - $ref: '#/components/parameters/UserId'
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await UserRepository.deleteById(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      logger.error("Delete user error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  },
};

module.exports = UserController;
