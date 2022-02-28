const mongoose = require("mongoose")
 const Add_Special_Days= require('../models/AddSpecialDaysModel')
const moment  = require('moment');
const Add_Special_Days_Booking= (req, res, next)=>
{
    
    const S_start = new Date(req.body.Start_Date);
    const S_end = new Date(req.body.End_Date);
    if(S_start.getTime()< S_end.getTime())
    {
             let Add_Booking = new Add_Special_Days({                  
                Name:req.body.Name,
                Start_Date:req.body.Start_Date,     
                End_Date:req.body.End_Date,
                IsActive:true,
                Current_Time:moment(Date.now()),
                Updated_time: moment(Date.now())

        });
         
        Add_Booking.save()
            .then(response => {
                res.json({
                    
                    status:true,
                    message: 'The special day details have been successfully added'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
        }
        else
        {

            res.json({
                status:true,
                message: 'SpecialDay EndDate Must be  Greater than SpecialDay StartDate'
            })
        }
};
 
const EditSpecialDays = (req, res, next) => {
    const Specialday_id = req.body._id
    const S_start = new Date(req.body.Start_Date);
    const S_end = new Date(req.body.End_Date);
    if(S_start.getTime()< S_end.getTime())
    {
    Add_Special_Days.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Specialday_id)}, 
    { 
        
        Name:req.body.Name,
        Start_Date:req.body.Start_Date,     
        End_Date:req.body.End_Date,
        IsActive:true,
        Current_Time:moment(Date.now()),
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
                message: 'The special day details have been successfully Updated'
               })
        }
    });  
}
else
{
    res.json({
        status:true,
        message: 'SpecialDay EndDate Must be  Greater than SpecialDay StartDate'
    })

}
};

const DeleteSpecialDays = (req, res, next) => {
    const Specialday_id = req.body._id
    Add_Special_Days.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Specialday_id)}, 
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
                message: 'The special day details have been successfully Deleted'
               })
        }
    });  
}


const List_SpecialDays = (req, res, next) => {  
    var mysort = { _id: -1 };
    Add_Special_Days.find({IsActive:true}).select().sort(mysort)
        .then(response => {
            res.send({
                status:true,
                 response
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}

module.exports = {Add_Special_Days_Booking,EditSpecialDays,DeleteSpecialDays,List_SpecialDays}