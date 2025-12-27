const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineBook Admin API",
      version: "1.0.0",
      description:
        "API documentation for the CineBook Movie Booking Admin System",
      contact: {
        name: "CineBook Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Movies",
        description: "Movie management endpoints",
      },
    ],
    components: {
      schemas: {
        // ==================== Movie Schemas ====================
        Movie: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the movie",
              example: 1,
            },
            title: {
              type: "string",
              description: "Title of the movie",
              example: "Inception",
            },
            genre: {
              type: "string",
              description: "Genre of the movie",
              example: "Sci-Fi",
            },
            description: {
              type: "string",
              description: "Brief description of the movie",
              example:
                "A thief who steals corporate secrets through dream-sharing technology.",
            },
            duration_minutes: {
              type: "integer",
              description: "Duration of the movie in minutes",
              example: 148,
            },
            poster_url: {
              type: "string",
              description: "URL to the movie poster image",
              example: "https://example.com/posters/inception.jpg",
            },
            release_date: {
              type: "string",
              format: "date",
              description: "Release date of the movie",
              example: "2010-07-16",
            },
            createdAt: {
              type: "integer",
              description: "Timestamp when the movie was created",
              example: 1703664000000,
            },
          },
        },
        MovieInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "Title of the movie",
              example: "Inception",
            },
            genre: {
              type: "string",
              description: "Genre of the movie",
              example: "Sci-Fi",
            },
            description: {
              type: "string",
              description: "Brief description of the movie",
              example:
                "A thief who steals corporate secrets through dream-sharing technology.",
            },
            duration_minutes: {
              type: "integer",
              description: "Duration of the movie in minutes",
              example: 148,
            },
            poster_url: {
              type: "string",
              description: "URL to the movie poster image",
              example: "https://example.com/posters/inception.jpg",
            },
            release_date: {
              type: "string",
              format: "date",
              description: "Release date of the movie",
              example: "2010-07-16",
            },
          },
        },
        MovieUpdateInput: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "integer",
              description: "ID of the movie to update",
              example: 1,
            },
            title: {
              type: "string",
              description: "Title of the movie",
              example: "Inception",
            },
            genre: {
              type: "string",
              description: "Genre of the movie",
              example: "Sci-Fi",
            },
            description: {
              type: "string",
              description: "Brief description of the movie",
              example:
                "A thief who steals corporate secrets through dream-sharing technology.",
            },
            duration_minutes: {
              type: "integer",
              description: "Duration of the movie in minutes",
              example: 148,
            },
            poster_url: {
              type: "string",
              description: "URL to the movie poster image",
              example: "https://example.com/posters/inception.jpg",
            },
            release_date: {
              type: "string",
              format: "date",
              description: "Release date of the movie",
              example: "2010-07-16",
            },
          },
        },
        MovieDeleteInput: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "integer",
              description: "ID of the movie to delete",
              example: 1,
            },
          },
        },

        // ==================== Response Schemas ====================
        ApiResponse: {
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
        },
        MovieResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              $ref: "#/components/schemas/Movie",
            },
          },
        },
        MovieListResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Movie",
              },
            },
          },
        },
        ErrorResponse: {
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
        },
      },

      // ==================== Parameters ====================
      parameters: {
        MovieId: {
          name: "id",
          in: "path",
          required: true,
          description: "Unique identifier of the movie",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      },

      // ==================== Response Templates ====================
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        BadRequest: {
          description: "Bad request - Invalid input",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Invalid request parameters",
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Server Error",
              },
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../controllers/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
