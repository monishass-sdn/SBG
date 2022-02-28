//AuthorName:CHITRA V
//File:Owner Booking Controller.js
//Module:Manage OwnerBooking
//Created Date:21.04.2021
//Purpose:Manage Owner Booking 

/***************************************************Import Packages and ViewModels Section******************************** */
const OwnerBookingModel = require('../models/OwnerBookingModel')
const Boats = require('../models/AddBoatModel')
const Owners= require('../models/AddOwnerModel')
const mongoose = require("mongoose")
const moment  = require('moment');
/***************************************************Import Methods and Functions******************************* */
// Function for Add AdminBooking
const AddOwnerBooking= (req, res, next)=>
{
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
             let Add_OwnerBooking = new OwnerBookingModel({     
                Owner_Name:req.body.Owner_Name,            
                Boat_Name: req.body.Boat_Name,
                Boattype_Name:req.body.Boattype_Name,
                Owner_Id: mongoose.Types.ObjectId(req.body.Owner_Id),
                Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),
                Boattype_id:mongoose.Types.ObjectId(req.body.Boattype_id),
                From_Date: req.body.From_Date,
                To_Date: req.body.To_Date,
                Comments:req.body.Comments,
                Block:req.body.Block,
                IsActive:req.body.IsActive,
                Status:Module_status,
                Current_Time:moment(Date.now()),
                Updated_time: moment(Date.now())

        });
         
        Add_OwnerBooking.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'Owner Booking Details Added Successfully',
                    data:Add_OwnerBooking
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};
//Populate Owner
const FillOwners = (req, res, next) => {  
    Owners.find({}).select({_id:1,First_Name:1})
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}
//Populate Boats
const FillBoats = (req, res, next) => {  
    Boats.find({}).select({_id:1,Boat_Name:1})
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}
//View
const ViewAllOwnerBookings= (req, res, next) => {  
    OwnerBookingModel.find({IsActive:true})
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: "No Data"
            })
        })
}
// Function for Edit OwnerBooking
const EditOwnerBooking = (req, res, next) => {
    const ownr_bookingid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
    OwnerBookingModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(ownr_bookingid)}, 
    { 
        
        Owner_Name:req.body.Owner_Name,            
        Boat_Name: req.body.Boat_Name,
        Boattype_Name:req.body.Boattype_Name,
        Owner_Id: mongoose.Types.ObjectId(req.body.Owner_Id),
        Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),
        Boattype_id:mongoose.Types.ObjectId(req.body.Boattype_id),
        From_Date: req.body.From_Date,
        To_Date: req.body.To_Date,
        Comments:req.body.Comments,
        Block:req.body.Block,
        IsActive:req.body.IsActive,
        Status:Module_status,
        Current_Time:req.body.Current_Time,
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
                message: 'Owner Booking Details Updated Successfully'
               })
        }
    });  
};
//Function for Delete OwnerBooking 
const DeleteOwnerBooking = (req, res, next) => {
    const bookingid = req.body._id
    OwnerBookingModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(bookingid)}, 
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
// Get Textbox Value
const GetBoatTypes = (req, res, next) => {  
    const boat_id = req.body._id
    Boats.find({IsActive:true,"_id":boat_id}).select({Boattype_id:1,Boattype_Name:1})
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

module.exports = {AddOwnerBooking,FillOwners,FillBoats,EditOwnerBooking,DeleteOwnerBooking,ViewAllOwnerBookings,GetBoatTypes}
 
    