const ownershipReport=require('../models/ManageOwnerModel')
const boatdetail=require('../models/AddBoatModel')
// const GetownershipReport= (req, res, next) => {  
//     ownershipReport.find().select({Summer_WeekDays:1,Summer_WeekEndDays:1,Winter_WeekDays:1,Winter_WeekEndDays:1})
//         .then(response => {
//             res.json({
//                 response
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: "No Data"
//             })
//         })
// }

const GetownershipReport= (req, res, next) => {  
    var   arr=[];
    var  boat_arr=[];
    var mysort = { _id: -1 };
    const boatid = req.body.Boat_Id
    //
    boatdetail.find({_id:boatid}).sort(mysort ).select({Winter_WeekEndDays:1,Winter_WeekDays:1,Summer_WeekEndDays:1,Summer_WeekDays:1,_id:0})
    .then(response => {
        totalWinter_WeekEndDays = 0;
        totalWinter_WeekDays=0;
        totalSummer_WeekEndDays=0;
        totalSummer_WeekDays=0;
            var i;
        for (i = 0; i < response.length; i++) {  //loop through the array
            totalWinter_WeekEndDays+= response[i].Winter_WeekEndDays;  
            totalWinter_WeekDays+= response[i].Winter_WeekDays;  
            totalSummer_WeekEndDays += response[i].Summer_WeekEndDays;  
            totalSummer_WeekDays+= response[i].Summer_WeekDays;  
        }
        boat_arr.push({'Winter_WeekEndDays':totalWinter_WeekEndDays},{'Winter_WeekDays':totalWinter_WeekDays},{'Summer_WeekEndDays':totalSummer_WeekEndDays},{'Summer_WeekDays':totalSummer_WeekDays})
    })
    //

    ownershipReport.find({Boat_Id:boatid}).sort(mysort ).select({Winter_WeekEndDays:1,Winter_WeekDays:1,Summer_WeekEndDays:1,Summer_WeekDays:1,_id:0})
        .then(response => {
            totalWinter_WeekEndDays = 0;
            totalWinter_WeekDays=0;
            totalSummer_WeekEndDays=0;
            totalSummer_WeekDays=0;
                var i;
            for (i = 0; i < response.length; i++) {  //loop through the array
                totalWinter_WeekEndDays+= response[i].Winter_WeekEndDays;  
                totalWinter_WeekDays+= response[i].Winter_WeekDays;  
                totalSummer_WeekEndDays += response[i].Summer_WeekEndDays;  
                totalSummer_WeekDays+= response[i].Summer_WeekDays;  
            }
            


        //   totalBoatDetails_Winter_WeekEndDays = 0;
        //     totalBoatDetails_Winter_WeekDays=0;
        //     totalBoatDetails_Summer_WeekEndDays=0;
        //     totalBoatDetails_Summer_WeekDays=0;  

        //     var j;
        //     for (j = 0; j < response.length; j++) {  //loop through the array
        //         totalWinter_WeekEndDays+= response[j].BoatDetails.Winter_WeekEndDays;  
        //         totalWinter_WeekDays+= response[j].BoatDetails.Winter_WeekDays;  
        //         totalSummer_WeekEndDays += response[j].BoatDetails.Summer_WeekEndDays;  
        //         totalSummer_WeekDays+= response[j].BoatDetails.Summer_WeekDays;  
        //     }
      
arr.push({'Winter_WeekEndDays':totalWinter_WeekEndDays},{'Winter_WeekDays':totalWinter_WeekDays},{'Summer_WeekEndDays':totalSummer_WeekEndDays},{'Summer_WeekDays':totalSummer_WeekDays})
ownershipReport.aggregate(
        [
        {
        "$lookup":{
        "from":"tb_addowners",
        "localField": "Owner_Id",
        "foreignField": "_id",
        "as": "OwnerDetails"
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
                        "$match":  {IsActive:true}
                        
                    }, 
            {
                    $project:{ Winter_WeekEndDays:1,Winter_WeekDays:1,Summer_WeekEndDays:1,Summer_WeekDays:1,total:1,
                        
                    
                    "BoatDetails.Boat_Name":1,
                    "OwnerDetails.First_Name": 1,
                    "OwnerDetails.Last_Name": 1,
                    "BoatDetails.Summer_WeekDays":1,
                    "BoatDetails.Summer_WeekEndDays":1,
                    "BoatDetails.Winter_WeekDays":1,
                    "BoatDetails.Winter_WeekEndDays":1,
                
                  
                    
                    
                
                    
                    }
                    
                    }
                ])
                .exec(function(err, response){
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
                                response,
                                'Response manageowner':arr,
                                'Response of boat': boat_arr
                            })
                    
                        }
                         })
                   
// res.json({
//                 'Response':arr
//             })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}






// const GetownershipReport = (req, res, next) => { 

//     // mongoose.model('Tb_Schedule').aggregate(
        
//         ownershipReport.aggregate(
//     [
//     {
//     "$lookup":{
//     "from":"tb_addowners",
//     "localField": "Owner_Id",
//     "foreignField": "_id",
//     "as": "OwnerDetails"
//     }
//    },
//     {
//         "$lookup": {
//             "from": "tb_boatmasters",
//             "localField": "Boat_Id",
//             "foreignField": "_id",
//             "as": "BoatDetails"
//         }
//     },
    
//         {
//             "$match": { $and:[{IsActive:true}]
//             }
//         }, 
       
        
        
    
    
//     {
//     $project:{ Winter_WeekEndDays:1,Winter_WeekDays:1,Summer_WeekEndDays:1,Summer_WeekDays:1,total:1,
        
    
//     "BoatDetails.Boat_Name":1,
//     "OwnerDetails.First_Name": 1,
//     "OwnerDetails.Last_Name": 1,
//     "BoatDetails.Summer_WeekDays":1,
//     "BoatDetails.Summer_WeekEndDays":1,
//     "BoatDetails.Winter_WeekDays":1,
//     "BoatDetails.Winter_WeekEndDays":1,

  
    
    

    
//     }
    
//     }
    
//     ]
    
//     )
//     .exec(function(err, response){
//     if (err)
//     {
//         res.json({
//             status:false,
//             message: 'AN ERROR OCCURED'
//         })
//     }
//     else
//     {
       

//         res.json({
//             status:true,
//             response
//         })

//     }
//      })
      

// }
module.exports ={GetownershipReport}