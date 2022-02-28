const Description__Model= require('../models/desciptionModel')

const mongoose = require("mongoose")
const moment  = require('moment');


//Function for Adding Cancellation TimeLimit
const CreateDescription= (req, res, next)=>
{
   
    
   if(req.body.Status=="Enable")
   {

       var  Module_status = 1;
   }
   else if (req.body.Status=="Disable")
   {
       var Module_status = 0;
    }
             let Add_UnAvailableDays = new  Description__Model({  
                Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id) ,            
                Boattype_Name:req.body.Boattype_Name,
                Boat_Description:req.body.Boat_Description,
        
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
const EditDescription = (req, res, next) => {
    const Boatidid = req.body._id
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }
     Description__Model.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Boatidid)}, 
    {  
        
        Boattype_Name:req.body.Boattype_Name,
        Boat_Description:req.body.Boat_Description,
        
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
 const DeleteDescription = (req, res, next) => {
    const Boatidid = req.body._id
    
    Description__Model.findByIdAndUpdate({_id:mongoose.Types.ObjectId(Boatidid)}, 
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


module.exports = {CreateDescription, EditDescription,DeleteDescription}