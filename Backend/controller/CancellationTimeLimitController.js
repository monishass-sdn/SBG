const Cancellation_TimeLimit= require('../models/CancellationModel')

const mongoose = require("mongoose")
const moment  = require('moment');

//Function for Adding Cancellation TimeLimit
const Cancellation_TimeLimit_Booking= (req, res, next)=>
{
   // Boat_Facility,Location_Id,Boattype_id,Launch_Date,PreLaunch_Date, Block
    
   if(req.body.Status=="Enable")
   {

       var  Module_status = 1;
   }
   else if (req.body.Status=="Disable")
   {
       var Module_status = 0;
    }
             let Add_Cancellation = new Cancellation_TimeLimit({                  
                Boat_Name:req.body.Boat_Name,
                Cancellation_Time_Limit:req.body.Cancellation_Time_Limit,
                IsActive:req.body.IsActive,
                Status:Module_status,
                Current_Time:moment(Date.now())

        });
         
        Add_Cancellation.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'Cancellation_TimeLimit Details Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};

//  Function for Edit 
const EditCancellation_TimeLimit_Booking = (req, res, next) => {
    const Cancellation_TimeLimitid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
     Cancellation_TimeLimit.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Cancellation_TimeLimitid)}, 
    { 
        
        Boat_Name:req.body.Boat_Name,
        Cancellation_Time_Limit:req.body.Cancellation_Time_Limit,
        IsActive:req.body.IsActive,
        Status:Module_status,
        Current_Time:req.body.Current_Time,
        
    },
      
        function(err, data) {
        if(err){
            res.json({ 
                status:false,
                message: 'AN ERROR OCCURED'
            })
        }
        else{
            res.json({

                status:true,
                message: 'Cancellation_TimeLimit Details Updated Successfully'
               })
        }
    });  
};
 
 //Function for Delete 
const DeleteCancellation_TimeLimitBooking = (req, res, next) => {
    const booking__Cancellation_TimeLimitid = req.body._id
    Cancellation_TimeLimit.findByIdAndUpdate({_id:mongoose.Types.ObjectId(booking__Cancellation_TimeLimitid)}, 
    { 
      
        IsActive:false,
        Updated_time: moment(Date.now())
     
    },
      
        function(err, data) {
        if(err){
            res.json({ 
                status:false,
                message: 'AN ERROR OCCURED'
            })
        }
        else{
            res.json({

                status:true,
                message: 'Booking Details Deleted Successfully'
               })
        }
    });  
}

// // //Listing
const GetCancellation_TimeLimitTypes = (req, res, next) => {  
    const boat_id1 = req.body._id
    Cancellation_TimeLimit.find({IsActive:true,"_id":boat_id1}).select({Boat_Name:1,Cancellation_Time_Limit:1})
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

module.exports = {Cancellation_TimeLimit_Booking,EditCancellation_TimeLimit_Booking, DeleteCancellation_TimeLimitBooking,GetCancellation_TimeLimitTypes}