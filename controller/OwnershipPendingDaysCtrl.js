const OwnershipPendingDaysModel= require('../models/OwnershipDuration')

const mongoose = require("mongoose")
const moment  = require('moment');



//get count of BookedDays
const GetOwnershipPendingDays= (req, res, next) => {  
    var   arr=[];
    var mysort = { _id: -1 };
    const boat_id2 = req.body._id
    OwnershipPendingDaysModel.find({IsActive:true,"_id":boat_id2}).select({From_Date:1,To_Date:1,})
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
        module.exports ={GetOwnershipPendingDays}