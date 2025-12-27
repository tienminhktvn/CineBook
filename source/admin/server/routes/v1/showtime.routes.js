const express = require("express");
const router = express.Router();
const ShowtimeController = require("../../controllers/showtime.controller");

router.get("/", ShowtimeController.getAllShowtimes);
router.get("/:id", ShowtimeController.getShowtimeById);
router.post("/", ShowtimeController.createShowtime);
router.post("/check-overlap", ShowtimeController.checkOverlap);
router.put("/:id", ShowtimeController.updateShowtime);
router.delete("/:id", ShowtimeController.deleteShowtime);

module.exports = router;
