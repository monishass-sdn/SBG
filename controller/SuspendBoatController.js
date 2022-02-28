const ManageOwner = require("../models/ManageOwnerModel");
const Duration = require("../models/OwnershipDuration");
const TotalNoCancellations=require('../models/NumberOfCancellation');
const Boats=require('../models/AddBoatModel')
const mongoose = require("mongoose");
const Suspend = async (req, res, next) => {console.log(req.body);

const condition = { Owner_Id: mongoose.Types.ObjectId(req.body.Owner_Id),Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),IsActive:true};
if(req.body.Block == "suspend"){
    var blockd = false;
    var msg = "Suspended Succesfully";
}
else{

    var blockd = true;
    var msg = "Active Succesfully";
    
}

const update = { Block: blockd};
let durationupdate = await Duration.findOneAndUpdate(condition,update).catch((error) => console.log(error));

ManageOwner.findOneAndUpdate(condition,update).then((updatedres)=>{
    res.json({
      Status: true,
      message: msg,
    });

  }).catch((error) => {
    res.json({
      Status: false,
      message: error,
    });
  });



}


const PartialCancellationDays = async (req, res, next) => {

const partial= { Owner_Id: mongoose.Types.ObjectId(req.body.Owner_Id),Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),Cancellationyear:parseInt(req.body.Cancellationyear)};
  let dayscount = await TotalNoCancellations.findOne(partial).catch((error) => console.log(error));
 
 if(!dayscount)
 return res.json({status:false,cancelcount:0});
else 
return res.json({status:true,cancelcount:dayscount.No_Cancellation});

}
const SetBoatStatus= async(req, res, next)=>{

  const condition = {_id:mongoose.Types.ObjectId(req.body.Boat_Id)};
  const update = {Boat_Status: req.body.Boat_Status};
  if(req.body.Boat_Status==1)
  var msg = "Enabled";
  else if(req.body.Boat_Status==0)
   var msg = "Disabled";
   else if(req.body.Boat_Status==2)
  var msg = "Archieved";
  let updateboat = await Boats.findOneAndUpdate(condition,update).catch((error) => console.log(error));
  res.json({
    status: true,
    message: "Boat is "+msg,
  });

}
module.exports = {Suspend,PartialCancellationDays,SetBoatStatus};