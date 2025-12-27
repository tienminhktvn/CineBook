const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/booking.controller");

router.get("/", BookingController.getAllBookings);
router.get("/users", BookingController.getUsersForBooking);
router.get("/snacks", BookingController.getSnacksForBooking);
router.get("/revenue/total", BookingController.getTotalRevenue);
router.get("/:id", BookingController.getBookingById);
router.post("/", BookingController.createBooking);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);

module.exports = router;
