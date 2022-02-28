var express = require('express');
var router = express.Router();

const OwnershipPendingDays___controller = require('../controller/OwnershipPendingDaysCtrl')

router.get('/GetOwnershipPendingDays',OwnershipPendingDays___controller .GetOwnershipPendingDays)



module.exports = router;