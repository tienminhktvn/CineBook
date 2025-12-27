const BookingRepository = require("../repositories/booking.repository");
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
      const bookings = await BookingRepository.findAll();
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
      const { user_id, showtime_id, total_amount, status, qr_code_hash } =
        req.body;

      if (!user_id || !showtime_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and showtime_id are required",
        });
      }

      const newBooking = await BookingRepository.create({
        user_id,
        showtime_id,
        total_amount: total_amount || 0,
        status: status || "pending",
        qr_code_hash,
        booking_date: new Date(),
      });

      return res.status(201).json({
        success: true,
        data: newBooking,
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

      const bookingData = { total_amount, status, qr_code_hash };
      // Remove undefined values
      Object.keys(bookingData).forEach(
        (key) => bookingData[key] === undefined && delete bookingData[key]
      );

      const updatedBooking = await BookingRepository.update(id, bookingData);

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
