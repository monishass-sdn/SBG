
var express = require('express');
var router = express.Router();

const ownercontroller = require('../controller/OwnerController')
router.post('/AddOwner',ownercontroller.AddOwner)
router.post('/EditOwner',ownercontroller.EditOwner)//added by chitra on 13.04.2021
router.post('/DeleteOwner',ownercontroller.DeleteOwner)//added by chitra on 13.04.2021
router.get('/ViewAllOwners',ownercontroller.ViewAllOwners)
router.post('/AddDuration',ownercontroller.AddDuration)
router.post('/EditDuration',ownercontroller.EditDuration)
router.post('/DeleteDuration',ownercontroller.DeleteDuration)
router.get('/GetOwners',ownercontroller.GetOwners)
router.get('/GetBoat',ownercontroller.GetBoats)
router.post('/AddShares',ownercontroller.AddShare_Allocation)
router.post('/GetBoatDetailsByIds',ownercontroller.GetBoatDetailsById)
router.post('/GetBoatDetailsByName',ownercontroller.GetBoatDetailsById)
router.post('/ManageOwner',ownercontroller.AddMangeOwner)
router.post('/UpdateManageOwnerById',ownercontroller.UpdateManageOwnerById)
router.post('/DeleteManageOwnersById',ownercontroller.DeleteManageOwnersById)
router.post('/DeleteOwnersById',ownercontroller.DeleteOwnersById)
router.post('/UpdateOwnerById',ownercontroller.UpdateOwnerById)
router.post('/FileUploadSingle',ownercontroller.upload1.single("file"),ownercontroller.FileUploadSingle) 
router.post('/GetSeasonDetailsById',ownercontroller.GetSeasonDetailsById)
router.post('/GetOwnerDetailsByBoatId',ownercontroller.GetOwnerDetailsByBoatId)
router.get('/GetAllOwnerDetails',ownercontroller.GetAllOwnerDetails)
router.get('/GetAllOwnerDetailsTableView',ownercontroller.GetAllOwnerDetailsTableView)//added by chitra on 03.04.2021
router.get('/GetOwnerDetailsOneByOne',ownercontroller.GetOwnerDetailsOneByOne)//added by chitra on 09.04.2021
router.post('/EnableDisableOwner',ownercontroller.EnableDisableOwner)//added by chitra on 19.04.2021
router.post('/OwnerLogin',ownercontroller.OwnerLogin)//added by chitra on 19.04.2021
router.post('/ForgotPasswordOwner',ownercontroller.ForgotPasswordOwner)//added by chitra on 19.04.2021
router.post('/ChangePassword', ownercontroller.ChangePassword)//added by chitra on 19.04.2021
router.post('/GetBoatDetailsByOwner', ownercontroller.GetBoatDetailsByOwner)//added by chitra on 17.05.2021
router.get('/GetAllOwnerssWithBoatDetails',ownercontroller.GetAllOwnerssWithBoatDetails)//added by jibin 5/21
router.post('/GetBoatNameByOwnerId', ownercontroller.GetBoatNameByOwnerId)//added by jibin 5/21
router.get('/ListAllDuration', ownercontroller.ListAllDuration)//added by jibin 5/21
router.get('/GetAllOwnerDetails_FromManageOwner', ownercontroller.GetAllOwnerDetails_FromManageOwner)//added by jibin 5/21
router.post('/GetTotalDaysAssigned', ownercontroller.GetTotalDaysAssigned)//added by jibin 6/8
router.post('/OwnershipTransfer', ownercontroller.OwnershipTransfer)//added by Raga 27/10/21
router.post('/ListOwnershipTransfer', ownercontroller.ListOwnershipTransfer)//added by Raga 27/10/21
router.post('/GetOwnerDurationdetailsbyOwnerId', ownercontroller.GetOwnerDurationdetailsbyOwnerId)//added by jibin 6/8
router.post('/GetOwnersbyBoatId', ownercontroller.GetOwnersbyBoatId)//added by jibin 6/8
router.post('/GetUnAssignedOwnerDetailsByBoatId', ownercontroller.GetUnAssignedOwnerDetailsByBoatId)//added by jibin 6/8
router.post('/GetBoatNameByOwnerId_Duration', ownercontroller.GetBoatNameByOwnerId_Duration)
router.post('/ChangeNewPassword', ownercontroller.ChangeNewPassword)
router.post('/OwnerProfileDetails', ownercontroller.OwnerProfileDetails)
router.post('/EnableAndDisableOwner',ownercontroller.EnableAndDisableOwner);
// router.get('/mass-change-owner-emails',ownercontroller.massChangeOwnerEmails)
router.get('/GetAllOwnerDetailsOverview',ownercontroller.GetAllOwnerDetailsOverview);
router.get('/GetAllOwnerUsageOverview',ownercontroller.GetAllOwnerUsageOverview);


module.exports = router;