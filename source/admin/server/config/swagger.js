const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
require("dotenv").config();

// Import DTOs
const {
  // Common
  ApiResponse,
  ErrorResponse,
  createItemResponse,
  createListResponse,
  // Movie
  Movie,
  MovieInput,
  MovieUpdateInput,
  MovieDeleteInput,
  // Hall
  Hall,
  HallInput,
  HallWithSeatsInput,
  HallUpdateInput,
  // Showtime
  Showtime,
  ShowtimeInput,
  ShowtimeUpdateInput,
  OverlapCheckInput,
  OverlapCheckResponse,
  // Booking
  Booking,
  BookingInput,
  BookingUpdateInput,
  RevenueResponse,
  // Auth
  LoginInput,
  RegisterInput,
  User,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  Role: RoleSchema,
} = require("../dtos");

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineBook Admin API",
      version: "1.0.0",
      description:
        "API documentation for the CineBook Movie Booking Admin System. All endpoints require admin authentication.",
      contact: {
        name: "CineBook Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Movies",
        description: "Movie management endpoints",
      },
      {
        name: "Halls",
        description: "Cinema hall management endpoints",
      },
      {
        name: "Showtimes",
        description: "Showtime scheduling endpoints",
      },
      {
        name: "Bookings",
        description: "Booking management endpoints",
      },
      {
        name: "Auth",
        description: "Authentication endpoints (login, register, logout)",
      },
    ],
    // ==================== Security ====================
    security: [
      {
        BearerAuth: [],
      },
    ],
    components: {
      // ==================== Security Schemes ====================
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token. Admin role required.",
        },
      },

      schemas: {
        // ==================== Common Schemas ====================
        ApiResponse,
        ErrorResponse,

        // ==================== Movie Schemas ====================
        Movie,
        MovieInput,
        MovieUpdateInput,
        MovieDeleteInput,
        MovieResponse: createItemResponse("#/components/schemas/Movie"),
        MovieListResponse: createListResponse("#/components/schemas/Movie"),

        // ==================== Hall Schemas ====================
        Hall,
        HallInput,
        HallWithSeatsInput,
        HallUpdateInput,
        HallResponse: createItemResponse("#/components/schemas/Hall"),
        HallListResponse: createListResponse("#/components/schemas/Hall"),

        // ==================== Showtime Schemas ====================
        Showtime,
        ShowtimeInput,
        ShowtimeUpdateInput,
        OverlapCheckInput,
        OverlapCheckResponse,
        ShowtimeResponse: createItemResponse("#/components/schemas/Showtime"),
        ShowtimeListResponse: createListResponse(
          "#/components/schemas/Showtime"
        ),

        // ==================== Booking Schemas ====================
        Booking,
        BookingInput,
        BookingUpdateInput,
        RevenueResponse,
        BookingResponse: createItemResponse("#/components/schemas/Booking"),
        BookingListResponse: createListResponse("#/components/schemas/Booking"),

        // ==================== Auth Schemas ====================
        User,
        Role: RoleSchema,
        LoginInput,
        LoginResponse,
        RegisterInput,
        RegisterResponse,
        LogoutResponse,
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
        HallId: {
          name: "id",
          in: "path",
          required: true,
          description: "Unique identifier of the cinema hall",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        ShowtimeId: {
          name: "id",
          in: "path",
          required: true,
          description: "Unique identifier of the showtime",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        BookingId: {
          name: "id",
          in: "path",
          required: true,
          description: "Unique identifier of the booking (UUID)",
          schema: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        },
      },

      // ==================== Response Templates ====================
      responses: {
        Unauthorized: {
          description: "Unauthorized - Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Access token is required",
              },
            },
          },
        },
        Forbidden: {
          description: "Forbidden - Admin access required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Admin access required",
              },
            },
          },
        },
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
