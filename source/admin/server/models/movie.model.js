const db = require("../config/database");

const MovieModel = {
  // Get all movies
  findAll: () => db("movies").select("*"),

  // Get movie by ID
  findById: (id) => db("movies").select("*").where({ id }).first(),

  // Create a movie
  create: (movieData) =>
    db("movies")
      .insert({ ...movieData, createdAt: Date.now() })
      .returning("*"),

  // Update a movie
  updateById: (id, movieData) =>
    db("movies").where({ id }).update(movieData).returning("*"),

  // Delete a movie
  deleteById: (id) => db("movies").where({ id }).delete().returning("*"),
};

module.exports = MovieModel;
