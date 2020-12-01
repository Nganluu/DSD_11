const express = require("express");
const router = express.Router();
const monitoredZoneController = require("./monitoredZone.controller");
const {auth} = require("../../middleware/index");

router.get("/area/:_id", monitoredZoneController.getZonebyArea);
router.get("/", monitoredZoneController.getAllZone);
router.get("/:_id", monitoredZoneController.getZonebyId);
router.post("/area", monitoredZoneController.createZone);
router.delete("/:_id", monitoredZoneController.deleteZone)
router.put("/:_id", monitoredZoneController.updateZone);
router.get('/statisticFrequency/:freq',  monitoredZoneController.statisticFrequency);
router.get('/statisticLevel/:level',  monitoredZoneController.statisticLevel);

module.exports = router