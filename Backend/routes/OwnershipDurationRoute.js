var express = require('express');
var router = express.Router();

const OwnershipDuration_____controller = require('../controller/OwnershipDurationCtrl')
router.post('/OwnershipDuration___Booking',OwnershipDuration_____controller .OwnershipDuration___Booking)
router.get('/GetOwnershipDurationTypes',OwnershipDuration_____controller .GetOwnershipDurationTypes)



module.exports = router;