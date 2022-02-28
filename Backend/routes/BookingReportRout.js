var express = require('express');
var router = express.Router();

const BookingReport_rout = require('../controller/BookingReportController')
router.get('/GetBookingReport',BookingReport_rout .GetBookingReport)

module.exports = router;