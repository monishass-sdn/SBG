var express = require('express');
var router = express.Router();

const LOA__controller = require('../controller/LOA_Controller')

router.post('/LOA_Create',LOA__controller.LOA_Create)



module.exports = router;