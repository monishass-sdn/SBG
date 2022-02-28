var express = require('express');
var router = express.Router();

const logincontroller = require('../controller/LoginController')
router.post('/show', logincontroller.show)
router.post('/Store', logincontroller.Store)
router.post('/Login', logincontroller.Login)
router.post('/ResetPassword', logincontroller.ResetPassword)
router.post('/ChangePassword', logincontroller.ChangePassword)
router.post('/ChangeAdminPassword', logincontroller.ChangeAdminPassword)
module.exports = router