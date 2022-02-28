const AvailableReport=require('../models/ScheduleModel')

// const GetAvailableReport= (req, res, next) => { 
//     const fromDate=req.body.from_Date;
// const toDate=req.body.To_Date;
// const fromDate1=req.body.from_Date1;
//     const toDate1=req.body.To_Date1;
//     AvailableReport.find({ $and:[{ start: { '$gte': new Date(fromDate),'$lte':new Date(toDate)}},{ end: { '$gte': new Date(fromDate1),'$lte':new Date(toDate1)}},{IsActive:true}]})
//     .select({Boat_Name:1,start:1,end:1})
    
        
    
     
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
// module.exports ={GetAvailableReport}




const GetAvailableReport1 = (req, res, next) => { 

    // mongoose.model('Tb_Schedule').aggregate(
        const fromDate=req.body.from_Date;
const toDate=req.body.To_Date;

        AvailableReport.aggregate(
    [
    {
    "$lookup":{
    "from":"tb_addowners",
    "localField": "User_Id",
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
            "$match": { $and:[{ start: { '$gte': new Date(fromDate)}},{ end: { '$lte':new Date(toDate)}},{IsActive:true}]
            }
        }, 
    
    
    {
    $project:{
        start:1,end:1,
    
    "BoatDetails.Boat_Name":1,
    "OwnerDetails.First_Name": 1,
    "OwnerDetails.Last_Name": 1,
          
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

module.exports ={GetAvailableReport1}