const BookingRepository = require("../repositories/booking.repository");
const ShowtimeRepository = require("../repositories/showtime.repository");
const UserRepository = require("../repositories/user.repository");
const SnackRepository = require("../repositories/snack.repository");
const { logger } = require("../config/logger");

const BookingController = {
  /**
   * @swagger
   * /bookings:
   *   get:
   *     summary: Get all bookings
   *     description: Retrieve a list of all bookings
   *     tags: [Bookings]
   *     responses:
   *       200:
   *         description: Successfully retrieved all bookings
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookingListResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getAllBookings: async (_, res) => {
    try {
      const bookings = await BookingRepository.findAllWithSnacks();
      return res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      logger.error("Booking error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /bookings/users:
   *   get:
   *     summary: Get users for booking selection
   *     description: Get a simplified list of users for booking dropdown (staff accessible)
   *     tags: [Bookings]
   *     responses:
   *       200:
   *         description: Successfully retrieved users
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getUsersForBooking: async (_, res) => {
    try {
      const users = await UserRepository.findAll();
      // Return only necessary fields for dropdown
      const simplifiedUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
      }));
      return res.status(200).json({
        success: true,
        data: simplifiedUsers,
      });
    } catch (error) {
      logger.error("Get users for booking error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /bookings/snacks:
   *   get:
   *     summary: Get snacks for booking selection
   *     description: Get list of available snacks for booking form
   *     tags: [Bookings]
   *     responses:
   *       200:
   *         description: Successfully retrieved snacks
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getSnacksForBooking: async (_, res) => {
    try {
      const snacks = await SnackRepository.findAll();
      return res.status(200).json({
        success: true,
        data: snacks,
      });
    } catch (error) {
      logger.error("Get snacks for booking error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  /**
   * @swagger
   * /bookings/{id}:
   *   get:
   *     summary: Get booking by ID
   *     description: Retrieve a single booking by its unique identifier (UUID)
   *     tags: [Bookings]
   *     parameters:
   *       - $ref: '#/components/parameters/BookingId'
   *     responses:
   *       200:
   *         description: Successfully retrieved the booking
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookingResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Booking Id is required" });
      }

      const booking = await BookingRepository.findById(id);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }

      return res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      logger.error("Booking error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not get booking by id" });
    }
  },

  /**
   * @swagger
   * /bookings:
   *   post:
   *     summary: Create a new booking
   *     description: Create a new booking in the system
   *     tags: [Bookings]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BookingInput'
   *     responses:
   *       201:
   *         description: Booking created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookingResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  createBooking: async (req, res) => {
    try {
      const {
        user_id,
        showtime_id,
        ticket_count,
        snacks,
        status,
        qr_code_hash,
      } = req.body;

      // Validate required fields
      if (!user_id || !showtime_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and showtime_id are required",
        });
      }

      // Validate ticket count
      const ticketQty = ticket_count || 1;
      if (ticketQty < 1 || ticketQty > 10) {
        return res.status(400).json({
          success: false,
          message: "Ticket count must be between 1 and 10",
        });
      }

      // Validate user exists
      const user = await UserRepository.findById(user_id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      // Validate showtime exists
      const showtime = await ShowtimeRepository.findById(showtime_id);
      if (!showtime) {
        return res.status(400).json({
          success: false,
          message: "Showtime not found",
        });
      }

      // Validate showtime hasn't passed
      const now = new Date();
      const showtimeStart = new Date(showtime.start_time);
      if (showtimeStart < now) {
        return res.status(400).json({
          success: false,
          message: "Cannot book a showtime that has already started or passed",
        });
      }

      // Validate status if provided
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }

      // Calculate total amount
      let totalAmount = parseFloat(showtime.base_price) * ticketQty;

      // Prepare snacks data and validate
      let snacksData = [];
      if (snacks && snacks.length > 0) {
        for (const snackItem of snacks) {
          const snack = await SnackRepository.findById(snackItem.snack_id);
          if (!snack) {
            return res.status(400).json({
              success: false,
              message: `Snack with id ${snackItem.snack_id} not found`,
            });
          }
          const quantity = snackItem.quantity || 1;
          if (quantity < 1) {
            return res.status(400).json({
              success: false,
              message: "Snack quantity must be at least 1",
            });
          }
          totalAmount += parseFloat(snack.unit_price) * quantity;
          snacksData.push({
            snack_id: snack.id,
            quantity,
            price_at_booking: snack.unit_price,
          });
        }
      }

      const newBooking = await BookingRepository.createWithSnacks(
        {
          user_id,
          showtime_id,
          total_amount: totalAmount,
          status: status || "pending",
          qr_code_hash,
          booking_date: new Date(),
        },
        snacksData
      );

      logger.info(
        `Booking created: ${newBooking.id} for showtime ${showtime_id} with ${ticketQty} tickets`
      );

      return res.status(201).json({
        success: true,
        data: { ...newBooking, ticket_count: ticketQty, snacks: snacksData },
      });
    } catch (error) {
      logger.error("Booking error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not create booking" });
    }
  },

  /**
   * @swagger
   * /bookings/{id}:
   *   put:
   *     summary: Update an existing booking
   *     description: Update booking details by providing the booking ID and new data
   *     tags: [Bookings]
   *     parameters:
   *       - $ref: '#/components/parameters/BookingId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BookingUpdateInput'
   *     responses:
   *       200:
   *         description: Booking updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookingResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  updateBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { total_amount, status, qr_code_hash } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Booking Id is required" });
      }

      // Check if booking exists
      const existingBooking = await BookingRepository.findById(id);
      if (!existingBooking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Validate can't modify completed bookings
      if (existingBooking.status === "completed" && status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "Cannot modify a completed booking",
        });
      }

      // Validate status transition
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }

      // Validate can't revert cancelled bookings
      if (existingBooking.status === "cancelled" && status !== "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cannot modify a cancelled booking",
        });
      }

      // Validate total_amount is non-negative
      if (total_amount !== undefined && total_amount < 0) {
        return res.status(400).json({
          success: false,
          message: "Total amount cannot be negative",
        });
      }

      const bookingData = { total_amount, status, qr_code_hash };
      // Remove undefined values
      Object.keys(bookingData).forEach(
        (key) => bookingData[key] === undefined && delete bookingData[key]
      );

      const updatedBooking = await BookingRepository.update(id, bookingData);

      logger.info(
        `Booking updated: ${id} - status: ${status || existingBooking.status}`
      );

      return res.status(200).json({
        success: true,
        data: updatedBooking,
      });
    } catch (error) {
      logger.error("Booking error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not update booking" });
    }
  },

  /**
   * @swagger
   * /bookings/{id}:
   *   delete:
   *     summary: Delete a booking
   *     description: Remove a booking from the database by its ID
   *     tags: [Bookings]
   *     parameters:
   *       - $ref: '#/components/parameters/BookingId'
   *     responses:
   *       200:
   *         description: Booking deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookingResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Booking Id is required" });
      }

      const deletedBooking = await BookingRepository.delete(id);
      if (deletedBooking && deletedBooking.length > 0) {
        return res.status(200).json({
          success: true,
          data: deletedBooking[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }
    } catch (error) {
      logger.error("Booking error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Could not delete booking" });
    }
  },

  /**
   * @swagger
   * /bookings/revenue/total:
   *   get:
   *     summary: Get total revenue
   *     description: Get the total revenue from all confirmed bookings
   *     tags: [Bookings]
   *     responses:
   *       200:
   *         description: Successfully retrieved total revenue
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RevenueResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  getTotalRevenue: async (_, res) => {
    try {
      const totalRevenue = await BookingRepository.getTotalRevenue();
      return res.status(200).json({
        success: true,
        data: {
          total_revenue: totalRevenue,
        },
      });
    } catch (error) {
      logger.error("Booking error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not get total revenue",
      });
    }
  },
};

module.exports = BookingController;
