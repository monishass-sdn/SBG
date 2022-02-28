const LOA_model= require('../models/LOAmodel')

const mongoose = require("mongoose")
const moment  = require('moment');


const LOA_Create= (req, res, next)=>
{
    
             let Add_Loa = new LOA_model({             
                Boat_id:req.body.Boat_id,
                Booking_id:req.body.Booking_id,
                Owner_id:req.body.Owner_id,
                loa:req.body.loa,
                IsActive:req.body.IsActive,
                Updated_Time:moment(Date.now())

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