/**
 * Common response schemas used across all endpoints
 */

const ApiResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      description: "Indicates if the request was successful",
      example: true,
    },
    data: {
      description: "Response data payload",
    },
  },
};

const ErrorResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
    },
    message: {
      type: "string",
      description: "Error message describing what went wrong",
      example: "An error occurred",
    },
  },
};

/**
 * Helper function to create a single item response schema
 * @param {string} schemaRef - Reference to the item schema
 */
const createItemResponse = (schemaRef) => ({
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      $ref: schemaRef,
    },
  },
});

/**
 * Helper function to create a list response schema
 * @param {string} schemaRef - Reference to the item schema
 */
const createListResponse = (schemaRef) => ({
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "array",
      items: {
        $ref: schemaRef,
      },
    },
  },
});

module.exports = {
  ApiResponse,
  ErrorResponse,
  createItemResponse,
  createListResponse,
};
