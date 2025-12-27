const express = require("express");
const router = express.Router();
const HallController = require("../../controllers/hall.controller");

router.get("/", HallController.getAllHalls);
router.get("/:id", HallController.getHallById);
router.post("/", HallController.createHall);
router.post("/with-seats", HallController.createHallWithSeats);
router.put("/:id", HallController.updateHall);
router.delete("/:id", HallController.deleteHall);

module.exports = router;
