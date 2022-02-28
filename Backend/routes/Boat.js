var express = require('express');
var router = express.Router();

const boatcontroller = require('../controller/BoatController')
router.post('/AddBoatType',boatcontroller.AddBoatType)//Add Boat Type
router.post('/EditBoatType',boatcontroller.EditBoatType)//Edit Boat Type
router.post('/DeleteBoatType',boatcontroller.DeleteBoatType)//Delete Boat Type
router.get('/GetallBoatTypeDetails',boatcontroller.GetallBoatTypeDetails)//List Boat Type
router.get('/GetLocation',boatcontroller.GetLocation)//Fill Location
router.get('/GetBoatType',boatcontroller.GetBoatType)//Fill Boat Type
router.post('/AddNewBoat', boatcontroller.AddNewBoat)//Add Boat
router.post('/EditBoat', boatcontroller.EditBoat)//Edit Boat
router.post('/DeleteBoat', boatcontroller.DeleteBoat)//Delete Boat
router.get('/GetallBoatDetails', boatcontroller.GetallBoatDetails)//List Boats
router.post('/GetBoatDetailsById', boatcontroller.GetBoatDetailsById)//Show Single Boat
router.post('/FileUploadSingle',boatcontroller.upload1.single("file"),boatcontroller.FileUploadSingle) //File Upload Single Image
router.post('/FileUploadmany',boatcontroller.upload.array("files"),boatcontroller.FileUploadmany)//File Upload Multiple Image
router.post('/AddSeason', boatcontroller.AddSeason)//Add Season
router.post('/LaunchFilter', boatcontroller.LaunchFilter)//Search By Launch and Pre Launch Dates
router.get('/GetBoatDetailsByLocation', boatcontroller.GetBoatDetailsByLocation)//List Boats Based on location
router.post('/PostBoatDetailsByLocation', boatcontroller.PostBoatDetailsByLocation)//List Boats Based on Selecting location
router.post('/GetAllArchieveBoatDetails', boatcontroller.GetAllArchieveBoatDetails)//List All Archive Boats
router.post('/GetArchieveBoatDetailsInLocation', boatcontroller.GetArchieveBoatDetailsInLocation)//List Archive Boats Based on location
router.post('/GetBoatDetailsByBoatId', boatcontroller.GetBoatDetailsByBoatId)//get Boat Details From Boat Collection 5/24
router.post('/Add_Location',boatcontroller.Add_Location)//jibin 23-06-21
router.post('/EditLocation',boatcontroller.EditLocation)//jibin 23-06-21
router.post('/DeleteLocation',boatcontroller.DeleteLocation)//jibin23-06-21
router.get('/GetTotal_PendingAllocatedDays',boatcontroller.GetTotal_PendingAllocatedDays)//jibin
router.get('/GetAllBoatsDatesOverview',boatcontroller.GetAllBoatsDatesOverview);
router.get('/GetAllBoatUsageOverview',boatcontroller.GetAllBoatUsageOverview);
router.post('/GetAllBoatsDatesOverviewByDate',boatcontroller.GetAllBoatsDatesOverviewByDate);

module.exports = router






