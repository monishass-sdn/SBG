const ownerboatModel= require('../models/OwnershipDuration')

const mongoose = require("mongoose")
const moment  = require('moment');

  

 const GetOwners= (req, res, next) => {  
    const boatid=mongoose.Types.ObjectId(req.body.Boat_Id);
    const Ownerid=mongoose.Types.ObjectId(req.body.Owner_Id);
    console.log(boatid,'hiiiiiiiiiiiiiiiiiiiiiiiii')
      mongoose.model('Tb_OwnershipDuration').aggregate(
          [
          {
          "$lookup":{
          "from":"tb_boatmasters",
          "localField": "Boat_Id",
          "foreignField": "_id",
          "as": "BoatDetails"
          }
         },
  
      {
         "$lookup":{
          "from":"tb_addowners",
          "localField": "Owner_Id",
          "foreignField": "_id",
          "as": "OwnerDetails"
          }
         },
         {
          "$match":{$and: [{Boat_Id:boatid},{Owner_Id:Ownerid}]}
      },
      
          {
          $project:{To_Date:1,

           
            "BoatDetails._id":1, 
            "BoatDetails.Location_Name":1,
            "BoatDetails.Boattype_Name":1,
            "BoatDetails.Location_Id":1,
            "BoatDetails.Boattype_id":1,
            "BoatDetails.Boat_Name": 1,
            "BoatDetails.Boat_Number": 1,
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
            if(err){
                res.json({ 
                    status:false,
                    message: 'AN ERROR OCCURED'
                })
            }
            else
            
              res.json({
                  status:true,
                  response
              })
          })
   }

   module.exports ={GetOwners}