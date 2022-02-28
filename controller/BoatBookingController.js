//AuthorName:CHITRA V
//File:Boat Booking Controller.js
//Module:Manage Boat Booking
//Created Date:05.05.2021
//Purpose:To Manage Boat Booking 

/***************************************************Import Packages and ViewModels Section******************************** */
const BookingModel = require('../models/AdminBookingModel')
const Boats=require('../models/AddBoatModel')
const mongoose = require("mongoose")
const moment  = require('moment');
/***************************************************Import Methods and Functions******************************** */
 //Function for Show Boat Bookings  using From Date and To Date Filter
const FromandToDateFilter = (req, res, next) => { 
    const FromDate = req.body.From_Date;
    const ToDate = req.body.To_Date;
    mongoose.model('Tb_AdminBooking').aggregate(
    [
    {
    "$lookup":{
    "from":"tb_ownerbookings",
    "localField": "Boat_Id",
    "foreignField": "Boat_Id",
    "as": "ownerDetails"
    }
   },
    {
        "$lookup": {
            "from": "tb_boatmasters",
            "localField": "Boat_Id",
            "foreignField": "_id",
            "as": "BoatDetails"
        }
    },
    {
        "$match":{
          "$and":[
            {"$gte": FromDate, "$lt": ToDate},
            {"IsActive":true}
          ]
       }
      } ,
    
    
    {
    $project:{"BoatDetails.Location_Name":1,
    "BoatDetails.Boattype_Name":1,
    "BoatDetails.Location_Id":1,
    "BoatDetails.Boattype_id":1,
    "BoatDetails.Boat_Name": 1,
    "BoatDetails.Boat_Facility":1,
    "BoatDetails.Boat_Description":1,
    "BoatDetails. Owners_Allowed": 1,
    "BoatDetails.Launch_Date": 1,
    "BoatDetails.PreLaunch_Date":1,
    "BoatDetails.Boat_Image": 1,
    "BoatDetails.Boat_HandBook":1,
    "BoatDetails.Boat_Status":1,
    "BoatDetails.Total_Days":1,
    "BoatDetails.Summer_WeekDays":1,
    "BoatDetails. Summer_WeekEndDays":1,
    "BoatDetails.Winter_WeekDays":1,
    "BoatDetails.Winter_WeekEndDays":1,
    
          
    }
    }
    ]
    ).exec(function(err, response){
    if (err)
    {
        res.json({
            status:false,
            message: 'AN ERROR OCCURED'
        })
    }
    else
    {
        res.json({
            status:true,
            response
        })

    }
     })
}
//Function for GetBoat Booking Details
module.exports = {FromandToDateFilter}
 
    