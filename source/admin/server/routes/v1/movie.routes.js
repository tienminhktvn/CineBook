const express = require("express");
const router = express.Router();
const MovieController = require("../../controllers/movie.controller");

router.get("/", MovieController.getAllMovies);
router.get("/:id", MovieController.getMovieById);
router.post("/", MovieController.createMovie);

module.exports = router;
