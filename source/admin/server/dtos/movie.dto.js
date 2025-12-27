/**
 * Movie DTOs - Data Transfer Objects for Movie endpoints
 */

const Movie = {
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
    created_at: {
      type: "string",
      format: "date-time",
      description: "Timestamp when the movie was created",
    },
  },
};

const MovieInput = {
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
};

const MovieUpdateInput = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "integer",
      description: "ID of the movie to update",
      example: 1,
    },
    ...MovieInput.properties,
  },
};

const MovieDeleteInput = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "integer",
      description: "ID of the movie to delete",
      example: 1,
    },
  },
};

module.exports = {
  Movie,
  MovieInput,
  MovieUpdateInput,
  MovieDeleteInput,
};
