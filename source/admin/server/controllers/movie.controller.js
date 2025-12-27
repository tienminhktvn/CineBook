const MovieRepository = require("../repositories/movie.repository");

const MovieController = {
  /**
   * @swagger
   * /movies:
   *   get:
   *     summary: Get all movies
   *     description: Retrieve a list of all movies in the database
   *     tags: [Movies]
   *     responses:
   *       200:
   *         description: Successfully retrieved all movies
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieListResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllMovies: async (_, res) => {
    try {
      const movies = await MovieRepository.findAll();
      return res.status(200).json({
        success: true,
        data: movies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /movies/{id}:
   *   get:
   *     summary: Get movie by ID
   *     description: Retrieve a single movie by its unique identifier
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/MovieId'
   *     responses:
   *       200:
   *         description: Successfully retrieved the movie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Movie Id is required" });
      }

      const movie = await MovieRepository.findById(id);

      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }

      return res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not get movie by id" });
    }
  },

  /**
   * @swagger
   * /movies:
   *   post:
   *     summary: Create a new movie
   *     description: Add a new movie to the database
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieInput'
   *     responses:
   *       201:
   *         description: Movie created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createMovie: async (req, res) => {
    try {
      const {
        title,
        genre,
        description,
        duration_minutes,
        poster_url,
        release_date,
      } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }

      const newMovie = await MovieRepository.create({
        title,
        genre,
        description,
        duration_minutes,
        poster_url,
        release_date,
      });

      return res.status(201).json({
        success: true,
        data: newMovie,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not create movie" });
    }
  },

  /**
   * @swagger
   * /movies:
   *   put:
   *     summary: Update an existing movie
   *     description: Update movie details by providing the movie ID and new data
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieUpdateInput'
   *     responses:
   *       200:
   *         description: Movie updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateMovie: async (req, res) => {
    try {
      const {
        id,
        title,
        genre,
        description,
        duration_minutes,
        poster_url,
        release_date,
      } = req.body;

      const movieData = {
        title,
        genre,
        description,
        duration_minutes,
        poster_url,
        release_date,
      };

      const updatedMovie = await MovieRepository.update({
        id,
        movieData,
      });

      return res.status(200).json({
        success: true,
        data: updatedMovie,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not update movie" });
    }
  },

  /**
   * @swagger
   * /movies:
   *   delete:
   *     summary: Delete a movie
   *     description: Remove a movie from the database by its ID
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieDeleteInput'
   *     responses:
   *       200:
   *         description: Movie deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Movie Id is required" });
      }

      const deletedMovie = await MovieRepository.delete(id);
      if (deletedMovie) {
        return res.status(200).json({
          success: true,
          data: deletedMovie,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Could not delete movie",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not delete movie" });
    }
  },
};

module.exports = MovieController;
