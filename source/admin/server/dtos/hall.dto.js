/**
 * Hall DTOs - Data Transfer Objects for Cinema Hall endpoints
 */

const { HallStatus } = require("../models/enum");

const Hall = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Unique identifier for the hall",
      example: 1,
    },
    name: {
      type: "string",
      description: "Name of the cinema hall",
      example: "Hall 1 (IMAX)",
    },
    total_seats: {
      type: "integer",
      description: "Total number of seats in the hall",
      example: 100,
    },
    status: {
      type: "string",
      enum: Object.values(HallStatus),
      description: "Current status of the hall",
      example: HallStatus.ACTIVE,
    },
  },
};

const HallInput = {
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
      description: "Name of the cinema hall",
      example: "Hall 1 (IMAX)",
    },
    total_seats: {
      type: "integer",
      description: "Total number of seats in the hall",
      example: 100,
    },
    status: {
      type: "string",
      enum: Object.values(HallStatus),
      description: "Current status of the hall",
      example: HallStatus.ACTIVE,
    },
  },
};

const HallWithSeatsInput = {
  type: "object",
  required: ["name", "row_count", "col_count"],
  properties: {
    name: {
      type: "string",
      description: "Name of the cinema hall",
      example: "Hall 2 (Standard)",
    },
    status: {
      type: "string",
      enum: Object.values(HallStatus),
      description: "Current status of the hall",
      example: HallStatus.ACTIVE,
    },
    row_count: {
      type: "integer",
      description: "Number of seat rows (A, B, C...)",
      example: 10,
    },
    col_count: {
      type: "integer",
      description: "Number of seats per row",
      example: 12,
    },
  },
};

const HallUpdateInput = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name of the cinema hall",
      example: "Hall 1 (IMAX)",
    },
    total_seats: {
      type: "integer",
      description: "Total number of seats in the hall",
      example: 100,
    },
    status: {
      type: "string",
      enum: Object.values(HallStatus),
      description: "Current status of the hall",
      example: HallStatus.ACTIVE,
    },
  },
};

module.exports = {
  Hall,
  HallInput,
  HallWithSeatsInput,
  HallUpdateInput,
};
