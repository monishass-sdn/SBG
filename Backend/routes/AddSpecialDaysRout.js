var express = require('express');
var router = express.Router();

const AddSpecialcontroller = require('../controller/AddSpecialDaysController')
router.post('/Add_Special_Days_Booking',AddSpecialcontroller.Add_Special_Days_Booking)
router.post('/EditSpecialDays',AddSpecialcontroller.EditSpecialDays)
router.post('/DeleteSpecialDays',AddSpecialcontroller.DeleteSpecialDays)
router.get('/List_SpecialDays',AddSpecialcontroller.List_SpecialDays)

module.exports = router;