
var express = require('express');
var router = express.Router();

const DaysSettingscontroller = require('../controller/DaysSettingsController')
router.post('/AddNewShares',DaysSettingscontroller.AddNewShares)
router.post('/AddConsecutiveDays',DaysSettingscontroller.AddConsecutiveDays)
router.post('/AddNextBookings',DaysSettingscontroller.AddNextBookings)
router.post('/EditNewShares',DaysSettingscontroller.EditNewShares)
router.post('/EditConsecutiveDays',DaysSettingscontroller.EditConsecutiveDays)
router.post('/EditNextBookings',DaysSettingscontroller.EditNextBookings)
router.post('/DeleteShares',DaysSettingscontroller.DeleteShares)
router.post('/DeleteConsecutiveDays',DaysSettingscontroller.DeleteConsecutiveDays)
router.post('/DeleteNextBooking',DaysSettingscontroller.DeleteNextBooking)
router.get('/ViewAllShares',DaysSettingscontroller.ViewAllShares)
router.get('/ViewAllNextBookings',DaysSettingscontroller.ViewAllNextBookings)
router.get('/ViewAllConsecutiveDays',DaysSettingscontroller.ViewAllConsecutiveDays)
router.post('/GetConsecutiveDaysByBoatId',DaysSettingscontroller.GetConsecutiveDaysByBoatId)
router.post('/GetNextBookingDaysByBoatId',DaysSettingscontroller.GetNextBookingDaysByBoatId)
router.post('/AddUnavailabledaysForAll',DaysSettingscontroller.AddUnavailabledaysForAll)
router.post('/AddUnavailabledaysSingle',DaysSettingscontroller.AddUnavailabledaysSingle)
router.get('/GetAllUnAvailableDays',DaysSettingscontroller.GetAllUnAvailableDays)
router.get('/GetUnAvailabeDaysOfBoats',DaysSettingscontroller.GetUnAvailabeDaysOfBoats)
router.get('/ViewBookingdays_LaunchPreLuanch',DaysSettingscontroller.ViewBookingdays_LaunchPreLuanch)
router.post('/AddBookingForLaunch_PreLuanch',DaysSettingscontroller.AddBookingForLaunch_PreLuanch)
router.post('/EditBookingForLaunch_PreLuanch',DaysSettingscontroller.EditBookingForLaunch_PreLuanch)
router.post('/DeleteBookingForLaunch_PreLuanch',DaysSettingscontroller.DeleteBookingForLaunch_PreLuanch)
router.get('/ViewAllPreLaunchAndLaunchBookingDays',DaysSettingscontroller.ViewAllPreLaunchAndLaunchBookingDays)
router.post('/GetShareDetailsByBoatId',DaysSettingscontroller.GetShareDetailsByBoatId)
router.post('/DeleteUnAvailableDaySingle',DaysSettingscontroller.DeleteUnAvailableDaySingle)
router.post('/DeleteUnAvailableDayAll',DaysSettingscontroller.DeleteUnAvailableDayAll)
router.post('/EditUnavailabledaysForAll',DaysSettingscontroller.EditUnavailabledaysForAll)
router.post('/EditUnavailabledaysSingle',DaysSettingscontroller.EditUnavailabledaysSingle);
router.post("/AddUnavailabledaysMultiple",DaysSettingscontroller.AddUnavailabledaysMultiple);
module.exports = router;