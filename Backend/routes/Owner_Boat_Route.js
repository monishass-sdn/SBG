var express = require('express');
var router = express.Router();

const AddGetOwnercontroller = require('../controller/Owner_Boat_Controller')
router.post('/postOwners',AddGetOwnercontroller.postOwners)

module.exports = router;