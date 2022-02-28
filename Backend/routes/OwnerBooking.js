
var express = require('express');
var router = express.Router();

const ownerbookingcontroller = require('../controller/OwnerBookingController')
router.post('/AddOwnerBooking',ownerbookingcontroller.AddOwnerBooking)
router.post('/EditOwnerBooking',ownerbookingcontroller.EditOwnerBooking)
router.post('/DeleteOwnerBooking',ownerbookingcontroller.DeleteOwnerBooking)
router.get('/ViewAllOwnerBookings',ownerbookingcontroller.ViewAllOwnerBookings)
router.get('/FillBoats',ownerbookingcontroller.FillBoats)
router.get('/FillOwners',ownerbookingcontroller.FillOwners)
router.post('/GetBoatTypes',ownerbookingcontroller.GetBoatTypes)
module.exports = router;