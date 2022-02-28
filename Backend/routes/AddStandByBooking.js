var express = require('express');
var router = express.Router();

const StandByBookingcontroller = require('../controller/AddStandByBookingController')
router.post('/AddStandByBooking',StandByBookingcontroller.AddStandByBookings)
router.get('/ViewStandByBooking',StandByBookingcontroller.ViewStandByBooking)

module.exports = router;