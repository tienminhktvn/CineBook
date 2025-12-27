const express = require("express");
const router = express.Router();
const SnackController = require("../../controllers/snack.controller");

router.get("/", SnackController.getAllSnacks);
router.get("/:id", SnackController.getSnackById);
router.post("/", SnackController.createSnack);
router.put("/:id", SnackController.updateSnack);
router.delete("/:id", SnackController.deleteSnack);

module.exports = router;
