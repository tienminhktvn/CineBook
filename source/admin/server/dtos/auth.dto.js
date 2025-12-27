/**
 * Auth DTOs - Data Transfer Objects for Authentication endpoints
 */

const { Role, UserStatus } = require("../models/enum");

// Request Schemas

const LoginInput = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {
      type: "string",
      description: "Username for login",
      example: "admin_user",
    },
    password: {
      type: "string",
      format: "password",
      description: "User password",
      example: "password123",
    },
  },
};

const RegisterInput = {
  type: "object",
  required: ["username", "password", "email"],
  properties: {
    username: {
      type: "string",
      description: "Unique username",
      example: "john_doe",
      minLength: 3,
      maxLength: 100,
    },
    password: {
      type: "string",
      format: "password",
      description: "User password (min 6 characters)",
      example: "password123",
      minLength: 6,
    },
    email: {
      type: "string",
      format: "email",
      description: "Unique email address",
      example: "john@example.com",
    },
    full_name: {
      type: "string",
      description: "User's full name",
      example: "John Doe",
    },
    phone_number: {
      type: "string",
      description: "User's phone number",
      example: "0909123456",
    },
  },
};

// Response Schemas

const User = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "User ID",
      example: 1,
    },
    username: {
      type: "string",
      description: "Username",
      example: "john_doe",
    },
    email: {
      type: "string",
      format: "email",
      description: "Email address",
      example: "john@example.com",
    },
    full_name: {
      type: "string",
      description: "User's full name",
      example: "John Doe",
    },
    phone_number: {
      type: "string",
      description: "Phone number",
      example: "0909123456",
    },
    role: {
      type: "string",
      enum: Object.values(Role),
      description: "User role",
      example: Role.ADMIN,
    },
    status: {
      type: "string",
      enum: Object.values(UserStatus),
      description: "Account status",
      example: UserStatus.ACTIVE,
    },
    created_at: {
      type: "string",
      format: "date-time",
      description: "Account creation timestamp",
    },
  },
};

const LoginResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "object",
      properties: {
        user: {
          $ref: "#/components/schemas/User",
        },
        access_token: {
          type: "string",
          description: "JWT access token",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
        token_type: {
          type: "string",
          example: "Bearer",
        },
        expires_in: {
          type: "integer",
          description: "Token expiration time in seconds",
          example: 86400,
        },
      },
    },
  },
};

const RegisterResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "object",
      properties: {
        user: {
          $ref: "#/components/schemas/User",
        },
        message: {
          type: "string",
          example: "Registration successful",
        },
      },
    },
  },
};

const LogoutResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    message: {
      type: "string",
      example: "Logged out successfully",
    },
  },
};

const RoleSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Role ID",
      example: 1,
    },
    name: {
      type: "string",
      enum: Object.values(Role),
      description: "Role name",
      example: Role.ADMIN,
    },
    description: {
      type: "string",
      description: "Role description",
      example: "System administrator",
    },
  },
};

module.exports = {
  LoginInput,
  RegisterInput,
  User,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  Role: RoleSchema,
};
