
var express = require('express');
var router = express.Router();

const maintenancecontroller = require('../controller/BookingMaintenanceController')
router.post('/AddMaintenance',maintenancecontroller.AddMaintenance)
router.post('/EditMaintenance',maintenancecontroller.EditMaintenance)
router.post('/DeleteMaintenance',maintenancecontroller.DeleteMaintenance)
router.get('/ViewAllMaintenance',maintenancecontroller.ViewAllMaintenance)
module.exports = router;