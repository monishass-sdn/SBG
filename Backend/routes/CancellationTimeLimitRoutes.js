var express = require('express');
var router = express.Router();

const Cancellation_TimeLimit_Specialcontroller = require('../controller/CancellationTimeLimitController')

router.post('/Cancellation_TimeLimit_Booking',Cancellation_TimeLimit_Specialcontroller.Cancellation_TimeLimit_Booking)
router.post('/EditCancellation_TimeLimit_Booking',Cancellation_TimeLimit_Specialcontroller.EditCancellation_TimeLimit_Booking)
 router.post('/DeleteCancellation_TimeLimitBooking',Cancellation_TimeLimit_Specialcontroller.DeleteCancellation_TimeLimitBooking)
 router.get('/GetCancellation_TimeLimitTypes',Cancellation_TimeLimit_Specialcontroller.GetCancellation_TimeLimitTypes)


module.exports = router;