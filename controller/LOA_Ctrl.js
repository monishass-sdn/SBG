const LOA_model= require('../models/LOAmodel')

const mongoose = require("mongoose")
const moment  = require('moment');


const LOA_Create= (req, res, next)=>
{
    
             let Add_Loa = new LOA_model({             
                Boat_Id:req.body.Boat_Id,
                Booking_ID:req.body.Booking_ID,
               
                LOA:req.body.LOA,
                IsActive:req.body. IsActive,
                Updated_time:moment(Date.now())

        });
         
        Add_Loa.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: ' Added Successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
};
module.exports ={LOA_Create}