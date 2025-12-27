const ShowtimeRepository = require("../repositories/showtime.repository");
const { logger } = require("../config/logger");

const ShowtimeController = {
  /**
   * @swagger
   * /showtimes:
   *   get:
   *     summary: Get all showtimes
   *     description: Retrieve a list of all showtimes
   *     tags: [Showtimes]
   *     responses:
   *       200:
   *         description: Successfully retrieved all showtimes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShowtimeListResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllShowtimes: async (_, res) => {
    try {
      const showtimes = await ShowtimeRepository.findAll();
      return res.status(200).json({
        success: true,
        data: showtimes,
      });
    } catch (error) {
      logger.error("Showtime error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /showtimes/{id}:
   *   get:
   *     summary: Get showtime by ID
   *     description: Retrieve a single showtime by its unique identifier
   *     tags: [Showtimes]
   *     parameters:
   *       - $ref: '#/components/parameters/ShowtimeId'
   *     responses:
   *       200:
   *         description: Successfully retrieved the showtime
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShowtimeResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getShowtimeById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Showtime Id is required" });
      }

      const showtime = await ShowtimeRepository.findById(id);

      if (!showtime) {
        return res
          .status(404)
          .json({ success: false, message: "Showtime not found" });
      }

      return res.status(200).json({
        success: true,
        data: showtime,
      });
    } catch (error) {
      logger.error("Showtime error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not get showtime by id" });
    }
  },

  /**
   * @swagger
   * /showtimes:
   *   post:
   *     summary: Create a new showtime
   *     description: Add a new showtime to the database. Validates for time slot conflicts in the same hall.
   *     tags: [Showtimes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShowtimeInput'
   *     responses:
   *       201:
   *         description: Showtime created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShowtimeResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       409:
   *         description: Time slot conflict - overlapping showtime exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createShowtime: async (req, res) => {
    try {
      const { movie_id, hall_id, start_time, end_time, base_price } = req.body;

      if (!movie_id || !hall_id || !start_time || !end_time || !base_price) {
        return res.status(400).json({
          success: false,
          message:
            "movie_id, hall_id, start_time, end_time, and base_price are required",
        });
      }

      // Check for overlapping showtimes
      const hasOverlap = await ShowtimeRepository.checkOverlap(
        hall_id,
        start_time,
        end_time
      );

      if (hasOverlap) {
        return res.status(409).json({
          success: false,
          message:
            "Time slot conflict: Another showtime exists in this hall during this period",
        });
      }

      const newShowtime = await ShowtimeRepository.create({
        movie_id,
        hall_id,
        start_time,
        end_time,
        base_price,
      });

      return res.status(201).json({
        success: true,
        data: newShowtime,
      });
    } catch (error) {
      logger.error("Showtime error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not create showtime" });
    }
  },

  /**
   * @swagger
   * /showtimes/{id}:
   *   put:
   *     summary: Update an existing showtime
   *     description: Update showtime details by providing the showtime ID and new data
   *     tags: [Showtimes]
   *     parameters:
   *       - $ref: '#/components/parameters/ShowtimeId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShowtimeUpdateInput'
   *     responses:
   *       200:
   *         description: Showtime updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShowtimeResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateShowtime: async (req, res) => {
    try {
      const { id } = req.params;
      const { movie_id, hall_id, start_time, end_time, base_price } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Showtime Id is required" });
      }

      const showtimeData = {
        movie_id,
        hall_id,
        start_time,
        end_time,
        base_price,
      };
      // Remove undefined values
      Object.keys(showtimeData).forEach(
        (key) => showtimeData[key] === undefined && delete showtimeData[key]
      );

      const updatedShowtime = await ShowtimeRepository.update(id, showtimeData);

      return res.status(200).json({
        success: true,
        data: updatedShowtime,
      });
    } catch (error) {
      logger.error("Showtime error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not update showtime" });
    }
  },

  /**
   * @swagger
   * /showtimes/{id}:
   *   delete:
   *     summary: Delete a showtime
   *     description: Remove a showtime from the database by its ID
   *     tags: [Showtimes]
   *     parameters:
   *       - $ref: '#/components/parameters/ShowtimeId'
   *     responses:
   *       200:
   *         description: Showtime deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShowtimeResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteShowtime: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Showtime Id is required" });
      }

      const deletedShowtime = await ShowtimeRepository.delete(id);
      if (deletedShowtime && deletedShowtime.length > 0) {
        return res.status(200).json({
          success: true,
          data: deletedShowtime[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Showtime not found",
        });
      }
    } catch (error) {
      logger.error("Showtime error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not delete showtime" });
    }
  },

  /**
   * @swagger
   * /showtimes/check-overlap:
   *   post:
   *     summary: Check for showtime overlap
   *     description: Check if a time slot is available in a specific hall
   *     tags: [Showtimes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OverlapCheckInput'
   *     responses:
   *       200:
   *         description: Overlap check result
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OverlapCheckResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  checkOverlap: async (req, res) => {
    try {
      const { hall_id, start_time, end_time } = req.body;

      if (!hall_id || !start_time || !end_time) {
        return res.status(400).json({
          success: false,
          message: "hall_id, start_time, and end_time are required",
        });
      }

      const hasOverlap = await ShowtimeRepository.checkOverlap(
        hall_id,
        start_time,
        end_time
      );

      return res.status(200).json({
        success: true,
        data: {
          has_overlap: hasOverlap,
          is_available: !hasOverlap,
        },
      });
    } catch (error) {
      logger.error("Showtime error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not check overlap" });
    }
  },
};

module.exports = ShowtimeController;
