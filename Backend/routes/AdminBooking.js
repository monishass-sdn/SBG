
var express = require('express');
var router = express.Router();

const bookingcontroller = require('../controller/AdminBookingController')
router.post('/AddAdminBooking',bookingcontroller.AddAdminBooking)
router.post('/EditAdminBooking',bookingcontroller.EditAdminBooking)
router.post('/DeleteAdminBooking',bookingcontroller.DeleteAdminBooking)
router.get('/ViewAllBookings',bookingcontroller.ViewAllBookings)
router.post('/GetBoatNames',bookingcontroller.GetBoatNames)
module.exports = router;