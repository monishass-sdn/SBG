const OwnershipDuration____Model= require('../models/OwnershipDuration')

const mongoose = require("mongoose")
const moment  = require('moment');

//Function for Adding
const OwnershipDuration___Booking= (req, res, next)=>
{
    
     
    
    
    
   if(req.body.Status=="Enable")
   {

       var  Module_status = 1;
   }
   else if (req.body.Status=="Disable")
   {
       var Module_status = 0;
    }
             let Add___Duration = new OwnershipDuration____Model({    
                 
                
        Owner_Id:mongoose.Types.ObjectId(req.body.Owner_Id),
        Owner_Name:req.body.Owner_Name,
        Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
        Boat_Name:req.body.Boat_Name,
        Boat_Type:req.body.Boat_Type,
        Owners_Allowed:req.body.Owners_Allowed,
        From_Date:req.body.From_Date,
        To_Date:req.body.To_Date,
        Block:req.body.Block,
         Duration_SDate:req.body.Duration_SDate,
         Duration_EDate:req.body.Duration_EDate,
         Is_Cancellation:req.body.Is_Cancellation,
         IsActive:req.body.IsActive,
        Status:Module_status,
        Current_Time:moment(Date.now())

        });
         
        Add___Duration.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'Owner Details Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};

// // //Listing
const GetOwnershipDurationTypes = (req, res, next) => {  
    
    OwnershipDuration____Model.find({IsActive:true}).select({Owner_Name:1,Boat_Name:1,From_Date:1,To_Date:1, Boat_Type:1})
         .then(response => {
             res.send({
                 response
             })
         })
         .catch(error => {
             res.json({
                 message: error
             })
         })
 }
    
// // 
module.exports ={GetOwnershipDurationTypes,OwnershipDuration___Booking}