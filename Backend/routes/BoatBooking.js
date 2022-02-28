
var express = require('express');
var router = express.Router();

const boatbookingcontroller = require('../controller/BoatBookingController')
router.post('/FromandToDateFilter',boatbookingcontroller.FromandToDateFilter)
module.exports = router;