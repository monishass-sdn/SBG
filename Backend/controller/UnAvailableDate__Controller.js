const UnAvailableDays__Model= require('../models/UnAvailable_Days_Model')

const mongoose = require("mongoose")
const moment  = require('moment');


//Function for Adding Cancellation TimeLimit
const CreateUnAvailable__Days= (req, res, next)=>
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
             let Add_UnAvailableDays = new  UnAvailableDays__Model({  
                Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id) ,            
                Boat_Name:req.body.Boat_Name,
        UnAvailableDates:req.body.UnAvailableDates,
        
        IsActive:req.body.IsActive,
        Status:Module_status,
        Current_Time:moment(Date.now()),
        Update_Time:moment(Date.now())

        });
         
        Add_UnAvailableDays.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: ' Details Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};
     

//  Function for Edit 
const EditUnAvailable__Days = (req, res, next) => {
    const Boatidid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
     UnAvailableDays__Model.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Boatidid)}, 
    {  
        
        Boat_Name:req.body.Boat_Name,
        UnAvailableDates:req.body.UnAvailableDates,
        
        IsActive:req.body.IsActive,
        Status:Module_status,
        Current_Time:moment(Date.now()),
        Update_Time:moment(Date.now())
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
                message: ' Details Updated Successfully'
               })
        }
    });  
};
 //
 
    
 //Function for Delete 
 const DeleteUnAvailable__Days = (req, res, next) => {
    const Boatidid = req.body._id
    
     UnAvailableDays__Model.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Boatidid)}, 
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
                message: ' Details Deleted Successfully'
               })
        }
    });  
}

// // //Listing
const GetUnAvailable__Days = (req, res, next) => {  
    
    UnAvailableDays__Model.find({Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id)}).select({Boat_Name:1,UnAvailableDates:1})
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

module.exports = {CreateUnAvailable__Days, EditUnAvailable__Days,DeleteUnAvailable__Days,GetUnAvailable__Days}