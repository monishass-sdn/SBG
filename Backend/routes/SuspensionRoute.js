var express = require('express');
var router = express.Router();

const Suspension__controller = require('../controller/SuspensionController')

router.post('/suspensionRecord',Suspension__controller .suspensionRecord)



module.exports = router;