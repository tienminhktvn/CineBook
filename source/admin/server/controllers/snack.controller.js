const SnackRepository = require("../repositories/snack.repository");
const { logger } = require("../config/logger");

const SnackController = {
  /**
   * @swagger
   * /snacks:
   *   get:
   *     summary: Get all snacks
   *     description: Retrieve a list of all snacks available for purchase
   *     tags: [Snacks]
   *     responses:
   *       200:
   *         description: Successfully retrieved all snacks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Snack'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllSnacks: async (_, res) => {
    try {
      const snacks = await SnackRepository.findAll();
      return res.status(200).json({
        success: true,
        data: snacks,
      });
    } catch (error) {
      logger.error("Snack error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /snacks/{id}:
   *   get:
   *     summary: Get snack by ID
   *     description: Retrieve a single snack by its ID
   *     tags: [Snacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Snack ID
   *     responses:
   *       200:
   *         description: Successfully retrieved the snack
   *       404:
   *         description: Snack not found
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getSnackById: async (req, res) => {
    try {
      const { id } = req.params;
      const snack = await SnackRepository.findById(id);

      if (!snack) {
        return res.status(404).json({
          success: false,
          message: "Snack not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: snack,
      });
    } catch (error) {
      logger.error("Snack error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not get snack by id",
      });
    }
  },

  /**
   * @swagger
   * /snacks:
   *   post:
   *     summary: Create a new snack
   *     description: Create a new snack item
   *     tags: [Snacks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - unit_price
   *             properties:
   *               name:
   *                 type: string
   *               unit_price:
   *                 type: number
   *               image_url:
   *                 type: string
   *     responses:
   *       201:
   *         description: Snack created successfully
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createSnack: async (req, res) => {
    try {
      const { name, unit_price, image_url } = req.body;

      // Validate required fields
      if (!name || unit_price === undefined) {
        return res.status(400).json({
          success: false,
          message: "Name and unit_price are required",
        });
      }

      // Validate price is positive
      if (unit_price < 0) {
        return res.status(400).json({
          success: false,
          message: "Unit price must be positive",
        });
      }

      const newSnack = await SnackRepository.create({
        name,
        unit_price,
        image_url,
      });

      logger.info(`Snack created: ${newSnack.id} - ${name}`);

      return res.status(201).json({
        success: true,
        data: newSnack,
      });
    } catch (error) {
      logger.error("Snack error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not create snack",
      });
    }
  },

  /**
   * @swagger
   * /snacks/{id}:
   *   put:
   *     summary: Update a snack
   *     description: Update an existing snack's details
   *     tags: [Snacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Snack ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               unit_price:
   *                 type: number
   *               image_url:
   *                 type: string
   *     responses:
   *       200:
   *         description: Snack updated successfully
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         description: Snack not found
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateSnack: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, unit_price, image_url } = req.body;

      // Check if snack exists
      const existingSnack = await SnackRepository.findById(id);
      if (!existingSnack) {
        return res.status(404).json({
          success: false,
          message: "Snack not found",
        });
      }

      // Validate price if provided
      if (unit_price !== undefined && unit_price < 0) {
        return res.status(400).json({
          success: false,
          message: "Unit price must be positive",
        });
      }

      const snackData = { name, unit_price, image_url };
      // Remove undefined values
      Object.keys(snackData).forEach(
        (key) => snackData[key] === undefined && delete snackData[key]
      );

      const updatedSnack = await SnackRepository.update(id, snackData);

      logger.info(`Snack updated: ${id}`);

      return res.status(200).json({
        success: true,
        data: updatedSnack,
      });
    } catch (error) {
      logger.error("Snack error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not update snack",
      });
    }
  },

  /**
   * @swagger
   * /snacks/{id}:
   *   delete:
   *     summary: Delete a snack
   *     description: Delete a snack by its ID
   *     tags: [Snacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Snack ID
   *     responses:
   *       200:
   *         description: Snack deleted successfully
   *       404:
   *         description: Snack not found
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteSnack: async (req, res) => {
    try {
      const { id } = req.params;

      const snack = await SnackRepository.findById(id);
      if (!snack) {
        return res.status(404).json({
          success: false,
          message: "Snack not found",
        });
      }

      await SnackRepository.delete(id);

      logger.info(`Snack deleted: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Snack deleted successfully",
      });
    } catch (error) {
      logger.error("Snack error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not delete snack",
      });
    }
  },
};

module.exports = SnackController;
