//AuthorName:CHITRA V
//File:Admin Booking Controller.js
//Module:Manage AdminBooking
//Created Date:21.04.2021
//Purpose:To Manage Admin Booking 

/***************************************************Import Packages and ViewModels Section******************************** */
const BookingModel = require('../models/AdminBookingModel')
const Boats=require('../models/AddBoatModel')
const mongoose = require("mongoose")
const moment  = require('moment');
/***************************************************Import Methods and Functions******************************** */
// Function for Add AdminBooking
const AddAdminBooking= (req, res, next)=>
{
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
             let Add_Booking = new BookingModel({                  
                Boat_Name: req.body.Boat_Name,
                Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),
                Boattype_id:mongoose.Types.ObjectId(req.body.Boattype_id),
                Boattype_Name:req.body.Boattype_Name,
                From_Date: req.body.From_Date,
                To_Date: req.body.To_Date,
                Comments:req.body.Comments,
                Block:req.body.Block,
                IsActive:req.body.IsActive,
                Status:Module_status,
                Current_Time:moment(Date.now()),
                Updated_time: moment(Date.now())

        });
         
        Add_Booking.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'Booking Details Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};
 
const GetBoatNames = (req, res, next) => { 
    const searchletter=req.body.alphabet
    let re = new RegExp(searchletter,'i') 
    console.log(searchletter)
    Boats.find({IsActive:true,"Boat_Name":re}).select({_id:1,Boat_Name:1,Boattype_Name:1})
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
//View
const ViewAllBookings= (req, res, next) => {  
    BookingModel.find({IsActive:true})
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
// Function for Edit AdminBooking
const EditAdminBooking = (req, res, next) => {
    const bookingid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
    BookingModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(bookingid)}, 
    { 
        
        Boat_Name: req.body.Boat_Name,
        Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),
        Boattype_id:mongoose.Types.ObjectId(req.body.Boattype_id),
        Boattype_Name:req.body.Boattype_Name,
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
                message: 'Booking Details Updated Successfully'
               })
        }
    });  
};
//Function for Delete AdminBooking 
const DeleteAdminBooking = (req, res, next) => {
    const bookingid = req.body._id
    BookingModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(bookingid)}, 
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
module.exports = {AddAdminBooking,EditAdminBooking,DeleteAdminBooking,ViewAllBookings,GetBoatNames}
 
    