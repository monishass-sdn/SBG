var express = require('express');
var router = express.Router();

const UnAvailableDate_____Controller = require('../controller/UnAvailableDate__Controller')
router.post('/CreateUnAvailable__Days',UnAvailableDate_____Controller.CreateUnAvailable__Days)
router.post('/EditUnAvailable__Days',UnAvailableDate_____Controller.EditUnAvailable__Days)
router.post('/DeleteUnAvailable__Days',UnAvailableDate_____Controller.DeleteUnAvailable__Days)
router.get('/GetUnAvailable__Days',UnAvailableDate_____Controller.GetUnAvailable__Days)

module.exports = router;