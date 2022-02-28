var express = require('express');
var router = express.Router();

const ownershipReport_Controller = require('../controller/ownershipReportController')

router.get('/GetownershipReport',ownershipReport_Controller.GetownershipReport)

module.exports = router;