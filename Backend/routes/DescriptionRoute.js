var express = require('express');
var router = express.Router();

const Description_____Controller = require('../controller/Description_Controller')
router.post('/CreateDescription',Description_____Controller.CreateDescription)
router.post('/EditDescription',Description_____Controller.EditDescription)
router.post('/DeleteDescription',Description_____Controller.DeleteDescription)


module.exports = router;