/**
 * Showtime DTOs - Data Transfer Objects for Showtime endpoints
 */

const Showtime = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Unique identifier for the showtime",
      example: 1,
    },
    movie_id: {
      type: "integer",
      description: "ID of the movie being shown",
      example: 1,
    },
    hall_id: {
      type: "integer",
      description: "ID of the cinema hall",
      example: 1,
    },
    start_time: {
      type: "string",
      format: "date-time",
      description: "Start time of the show",
      example: "2024-12-28T19:00:00Z",
    },
    end_time: {
      type: "string",
      format: "date-time",
      description: "End time of the show",
      example: "2024-12-28T21:30:00Z",
    },
    base_price: {
      type: "number",
      format: "decimal",
      description: "Base ticket price for this showtime",
      example: 75000,
    },
  },
};

const ShowtimeInput = {
  type: "object",
  required: ["movie_id", "hall_id", "start_time", "end_time", "base_price"],
  properties: {
    movie_id: {
      type: "integer",
      description: "ID of the movie being shown",
      example: 1,
    },
    hall_id: {
      type: "integer",
      description: "ID of the cinema hall",
      example: 1,
    },
    start_time: {
      type: "string",
      format: "date-time",
      description: "Start time of the show",
      example: "2024-12-28T19:00:00Z",
    },
    end_time: {
      type: "string",
      format: "date-time",
      description: "End time of the show",
      example: "2024-12-28T21:30:00Z",
    },
    base_price: {
      type: "number",
      format: "decimal",
      description: "Base ticket price for this showtime",
      example: 75000,
    },
  },
};

const ShowtimeUpdateInput = {
  type: "object",
  properties: {
    movie_id: {
      type: "integer",
      description: "ID of the movie being shown",
      example: 1,
    },
    hall_id: {
      type: "integer",
      description: "ID of the cinema hall",
      example: 1,
    },
    start_time: {
      type: "string",
      format: "date-time",
      description: "Start time of the show",
      example: "2024-12-28T19:00:00Z",
    },
    end_time: {
      type: "string",
      format: "date-time",
      description: "End time of the show",
      example: "2024-12-28T21:30:00Z",
    },
    base_price: {
      type: "number",
      format: "decimal",
      description: "Base ticket price for this showtime",
      example: 75000,
    },
  },
};

const OverlapCheckInput = {
  type: "object",
  required: ["hall_id", "start_time", "end_time"],
  properties: {
    hall_id: {
      type: "integer",
      description: "ID of the cinema hall to check",
      example: 1,
    },
    start_time: {
      type: "string",
      format: "date-time",
      description: "Proposed start time",
      example: "2024-12-28T19:00:00Z",
    },
    end_time: {
      type: "string",
      format: "date-time",
      description: "Proposed end time",
      example: "2024-12-28T21:30:00Z",
    },
  },
};

const OverlapCheckResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "object",
      properties: {
        has_overlap: {
          type: "boolean",
          description: "True if there is a time conflict",
          example: false,
        },
        is_available: {
          type: "boolean",
          description: "True if the time slot is available",
          example: true,
        },
      },
    },
  },
};

module.exports = {
  Showtime,
  ShowtimeInput,
  ShowtimeUpdateInput,
  OverlapCheckInput,
  OverlapCheckResponse,
};
