
var express = require('express');
var router = express.Router();

const schedulecontroller = require('../controller/ScheduleController')
router.post('/AddSchedule',schedulecontroller.AddSchedule)
router.post('/EditSchedule',schedulecontroller.EditSchedule)
router.post('/DeleteSchedule',schedulecontroller.DeleteSchedule)
router.get('/ViewAllSchedule',schedulecontroller.ViewAllSchedule)
router.post('/GetBoatNames',schedulecontroller.GetBoatNames)
router.get('/ViewCancelledBooking',schedulecontroller.ViewCancelledBooking)
router.get('/ViewCancelledBookingNew',schedulecontroller.ViewCancelledBookingNew)
router.get('/ViewBookingDetailsWithBoatAndOwner',schedulecontroller.ViewBookingDetailsWithBoatAndOwner)
router.post('/GetAllPendingDaysOfOwner',schedulecontroller.GetAllPendingDaysOfOwner)
router.post('/StandByBooking_AcceptReject',schedulecontroller.StandByBooking_AcceptReject)
router.post('/ViewBookingDetailsFilterByDates',schedulecontroller.ViewBookingDetailsFilterByDates)
router.post('/ApproveCancellation',schedulecontroller.ApproveCancellation)
router.post('/ApproveCancellationNew',schedulecontroller.ApproveCancellationNew)
router.post('/ViewCancelledBookingById',schedulecontroller.ViewCancelledBookingById)
router.post('/ViewBookingById',schedulecontroller.ViewBookingById)
router.post('/DeleteScheduleForOwner',schedulecontroller.DeleteScheduleForOwner)
router.post('/AddScheduleStandByBooking',schedulecontroller.AddScheduleStandByBooking)
router.get('/ViewAllScheduleActiveAndNonActive',schedulecontroller.ViewAllScheduleActiveAndNonActive);
router.get('/GetAllMaintenanceSchedule',schedulecontroller.GetAllMaintenanceSchedule);
router.get('/GetAllCleaningScheduleReport',schedulecontroller.GetAllCleaningScheduleReport)
router.post('/IsLOAIncluded',schedulecontroller.IsLOAIncluded)
module.exports = router;