const HallRepository = require("../repositories/hall.repository");

const HallController = {
  /**
   * @swagger
   * /halls:
   *   get:
   *     summary: Get all cinema halls
   *     description: Retrieve a list of all cinema halls
   *     tags: [Halls]
   *     responses:
   *       200:
   *         description: Successfully retrieved all halls
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallListResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllHalls: async (_, res) => {
    try {
      const halls = await HallRepository.findAll();
      return res.status(200).json({
        success: true,
        data: halls,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /halls/{id}:
   *   get:
   *     summary: Get hall by ID
   *     description: Retrieve a single cinema hall by its unique identifier
   *     tags: [Halls]
   *     parameters:
   *       - $ref: '#/components/parameters/HallId'
   *     responses:
   *       200:
   *         description: Successfully retrieved the hall
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getHallById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Hall Id is required" });
      }

      const hall = await HallRepository.findById(id);

      if (!hall) {
        return res
          .status(404)
          .json({ success: false, message: "Hall not found" });
      }

      return res.status(200).json({
        success: true,
        data: hall,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not get hall by id" });
    }
  },

  /**
   * @swagger
   * /halls:
   *   post:
   *     summary: Create a new cinema hall
   *     description: Add a new cinema hall to the database
   *     tags: [Halls]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/HallInput'
   *     responses:
   *       201:
   *         description: Hall created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createHall: async (req, res) => {
    try {
      const { name, total_seats, status } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Hall name is required" });
      }

      const newHall = await HallRepository.create({
        name,
        total_seats: total_seats || 0,
        status: status || "active",
      });

      return res.status(201).json({
        success: true,
        data: newHall,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not create hall" });
    }
  },

  /**
   * @swagger
   * /halls/with-seats:
   *   post:
   *     summary: Create a new cinema hall with seats
   *     description: Add a new cinema hall with automatically generated seats based on row and column count
   *     tags: [Halls]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/HallWithSeatsInput'
   *     responses:
   *       201:
   *         description: Hall with seats created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createHallWithSeats: async (req, res) => {
    try {
      const { name, status, row_count, col_count } = req.body;

      if (!name || !row_count || !col_count) {
        return res.status(400).json({
          success: false,
          message: "Hall name, row_count, and col_count are required",
        });
      }

      const hallData = {
        name,
        total_seats: row_count * col_count,
        status: status || "active",
      };

      const newHall = await HallRepository.createWithSeats(
        hallData,
        row_count,
        col_count
      );

      return res.status(201).json({
        success: true,
        data: newHall,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not create hall with seats" });
    }
  },

  /**
   * @swagger
   * /halls/{id}:
   *   put:
   *     summary: Update an existing hall
   *     description: Update hall details by providing the hall ID and new data
   *     tags: [Halls]
   *     parameters:
   *       - $ref: '#/components/parameters/HallId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/HallUpdateInput'
   *     responses:
   *       200:
   *         description: Hall updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateHall: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, total_seats, status } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Hall Id is required" });
      }

      const hallData = { name, total_seats, status };
      // Remove undefined values
      Object.keys(hallData).forEach(
        (key) => hallData[key] === undefined && delete hallData[key]
      );

      const updatedHall = await HallRepository.update(id, hallData);

      return res.status(200).json({
        success: true,
        data: updatedHall,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not update hall" });
    }
  },

  /**
   * @swagger
   * /halls/{id}:
   *   delete:
   *     summary: Delete a hall
   *     description: Remove a cinema hall from the database by its ID
   *     tags: [Halls]
   *     parameters:
   *       - $ref: '#/components/parameters/HallId'
   *     responses:
   *       200:
   *         description: Hall deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HallResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteHall: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Hall Id is required" });
      }

      const deletedHall = await HallRepository.delete(id);
      if (deletedHall && deletedHall.length > 0) {
        return res.status(200).json({
          success: true,
          data: deletedHall[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Hall not found",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Could not delete hall" });
    }
  },
};

module.exports = HallController;
