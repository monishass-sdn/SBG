//Author Name:CHITRA V
//File:Booking Maintenance.js
//Module:Manage Booking Maintenance
//Created Date:21.04.2021
//Purpose:To Manage Booking Maintenance

/***************************************************Import Packages and ViewModels Section******************************** */
const MaintenanceModel = require('../models/BookingMaintenanceModel')
const Boats=require('../models/AddBoatModel')
const mongoose = require("mongoose")
const moment  = require('moment');
/***************************************************Import Methods and Functions******************************** */
// Function for Add Maintenance
const AddMaintenance= ( req, res, next)=>
{
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
             let Add_Maintenance = new MaintenanceModel({                  
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
         
        Add_Maintenance.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'Booking Add Maintenance Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
    };
   
// Function for Edit Maintenance
const EditMaintenance = (req, res, next) => {
    const mid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
     MaintenanceModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(mid)}, 
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
                message: 'Booking Maintenance Updated Successfully'
               })
        }
    });  
};
//Function for Delete Maintenance 
const DeleteMaintenance = (req, res, next) => {
    const mid = req.body._id
    MaintenanceModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(mid)}, 
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
                message: 'Booking Maintenance Deleted Successfully'
               })
        }
    });  
}
//View
const ViewAllMaintenance= (req, res, next) => {  
    MaintenanceModel.find({IsActive:true})
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
module.exports = {AddMaintenance,ViewAllMaintenance,EditMaintenance,DeleteMaintenance}
 
    