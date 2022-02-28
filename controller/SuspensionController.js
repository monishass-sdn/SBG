const suspensionRecordModel= require('../models/OwnershipDuration')

const mongoose = require("mongoose")
const moment  = require('moment');

     
const suspensionRecord = (req, res, next) => {
    const _Id = req.body._id//mode 
  
    const actions=req.body.Is_Cancellation;
    if(actions==false)
 {
    console.log("offffffffffffffffffffff")
    suspensionRecordModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(_Id )}, 
        {           
            //OwnerBooking_Days.findOne({Boat_Id:Boat_id,Owner_Id:Owner_id}).then(result=>

       //suspensionRecordModel.findoneAndUpdate({Boat_Id:Boat_Id,Owner_Id:Owner_Id}, 
    
      
        
       Is_Cancellation:actions
       
     
    },
      
        function(err, data) {
        if(err){
            res.json({
       

                status:false,
                message: 'error'
               })
               
        }
        else{
            res.json({
       

                status:true,
                message: ' Activated successfully'
               })
               
        }
    });

      


}     
else
{
 console.log("hiiiiiiiiiiiiiiiiii")

    suspensionRecordModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(_Id )}, 
    { 
      
        
       Is_Cancellation:true
       
     
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
                message: 'suspended successfully'
               })
        }
    });
}  }
module.exports ={suspensionRecord}




// const StandByBooking_AcceptReject = (req, res, next) => {
//     const bookingid = req.body._id
//     const actions=req.body.action_todo;
//     if(actions=="Accept")
// {
//     AddStandByBooking.findById({_id:mongoose.Types.ObjectId(bookingid)}).then(response=>
//         {           
//             var obj=Object();
//             obj.body=response;
//        jsonObject =obj;
//        AddSchedule(jsonObject);

//        AddStandByBooking.findByIdAndUpdate({_id:mongoose.Types.ObjectId(bookingid)}, 
//     { 
      
//         BookingStatus :"Accepted",
//         IsActive:false,
//         Updated_time: moment(Date.now())
     
//     },
      
//         function(err, data) {
//         if(err){
            
//         }
//         else{
           
//         }
//     });

//        res.json({
       

//         status:true,
//         message: ' Booking Accepted Successfully'
//        })
//         })


// }     
// else
// {
 

//     AddStandByBooking.findByIdAndUpdate({_id:mongoose.Types.ObjectId(bookingid)}, 
//     { 
      
//         BookingStatus:"Rejected",
//         IsActive:false,
//         Updated_time: moment(Date.now())
     
//     },
      
//         function(err, data) {
//         if(err){
//             res.json({ 
//                 status:false,
//                 message: 'AN ERROR OCCURED'
//             })
//         }
//         else{
//             res.json({

//                 status:true,
//                 message: 'Booking Rejected'
//                })
//         }
//     });
// }  }