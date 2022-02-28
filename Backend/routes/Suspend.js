var express = require('express');
var router = express.Router();

const suspendcontroller = require('../controller/SuspendBoatController');
router.post('/SuspendBoat',suspendcontroller.Suspend);
router.post('/PartialDaysCount',suspendcontroller.PartialCancellationDays);
router.post('/SetBoatStatus',suspendcontroller.SetBoatStatus);
module.exports = router;