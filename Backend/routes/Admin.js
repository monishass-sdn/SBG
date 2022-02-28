const express = require('express');
const { CreateSubAdmin,GetAllSubAdmin,DeleteSubAdmin,EditSubAdmin } = require('../controller/AdminController');


const router = express.Router();

//Get methods

router.get("/GetAllSubAdmin",GetAllSubAdmin);

// Post methods

router.post("/CreateSubAdmin",CreateSubAdmin);
router.post("/DeleteSubAdmin",DeleteSubAdmin);
router.post("/EditSubAdmin",EditSubAdmin);




module.exports = router