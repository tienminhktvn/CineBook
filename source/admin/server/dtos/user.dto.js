const { Role, UserStatus } = require("../models/enum");

// Request Schemas

const CreateUserInput = {
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
    role: {
      type: "string",
      enum: Object.values(Role),
      description: "User role",
      example: Role.STAFF,
    },
    status: {
      type: "string",
      enum: Object.values(UserStatus),
      description: "Account status",
      example: UserStatus.ACTIVE,
    },
  },
};

const UpdateUserInput = {
  type: "object",
  properties: {
    username: {
      type: "string",
      description: "Unique username",
      example: "john_doe",
    },
    email: {
      type: "string",
      format: "email",
      description: "Email address",
      example: "john@example.com",
    },
    password: {
      type: "string",
      format: "password",
      description: "New password (leave empty to keep current)",
      example: "newpassword123",
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
    role: {
      type: "string",
      enum: Object.values(Role),
      description: "User role",
      example: Role.STAFF,
    },
    status: {
      type: "string",
      enum: Object.values(UserStatus),
      description: "Account status",
      example: UserStatus.ACTIVE,
    },
  },
};

module.exports = {
  CreateUserInput,
  UpdateUserInput,
};
