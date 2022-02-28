const Schedule = require('../models/ScheduleModel');
const log1 = require('../models/LoginModel');
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
const cancelrues = async(data,req,res) => {
 var Roles=data.User_RoleType;
    var scheduleid = data._id;
    var curntuser = data.curntuser;
    if(Roles == 'Owner') {

        let tempObj = {
            status: true
        }
   

   let scheduleOwner = await Schedule.findById({ _id: mongoose.Types.ObjectId(scheduleid) }).catch((error) => console.log(error));

        if (scheduleOwner) {


            if (scheduleOwner.User_RoleType != Roles) {

                tempObj.status = false;

            }

            else {

                if ((scheduleOwner.User_Id !=curntuser)) {

                    if (scheduleOwner.Admin_Id != curntuser) {

                        let chekSuperadmin = await log1.findById({ _id: mongoose.Types.ObjectId(curntuser), 'UserType': 'superadmin' }).catch((error) => console.log(error));

                        if ((!chekSuperadmin) || chekSuperadmin == null) {

                            tempObj.status = false;

                        }

                    }
                }


            }

        }

        return tempObj;


    } else {

        let tempObj = {
            status: true
        }

        let scheduleCheck = await Schedule.findById({ _id: mongoose.Types.ObjectId(scheduleid) }).catch((error) => console.log(error));

        if (scheduleCheck) {

            if (scheduleCheck.User_RoleType != Roles) {

                tempObj.status = false;

               

            }
            else if(Roles == "Admin"){

                if(scheduleCheck.standByBookingId)
                tempObj.status = false;
            }

        }

        return tempObj;

    }


}

const cancelStandbyrules = async(Roles,User_Id,curentuser,BookingStatus) => {

   

    let tempObj = {
        status: true
    }

    if(Roles == "Owner"){ 

        if(User_Id != curentuser){

            let chekSuperadmin = await log1.findById({ _id: mongoose.Types.ObjectId(curentuser), 'UserType': 'superadmin' }).catch((error) => console.log(error));
             if ((!chekSuperadmin) || chekSuperadmin == null) {

                tempObj.status = false;

            }

          

        }

    }else{
        tempObj.status = false;

    }

    return tempObj;

}

module.exports = {cancelrues,cancelStandbyrules};