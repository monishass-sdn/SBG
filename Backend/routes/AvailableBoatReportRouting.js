var express = require('express');
var router = express.Router();

const AvailableReport_rout = require('../controller/AvailableBoatReportController')
router.get('/GetAvailableReport1',AvailableReport_rout .GetAvailableReport1)

module.exports = router;