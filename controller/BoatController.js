//AuthorName:Chitra.V
//File:Boatcontroller.js
//Module:Add Boat
//Created Date:09.03.2021
//Purpose:To Save the Details of adding a new Boat in the Database.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const _ = require('lodash')


const addseason = require("../models/SeasonModel"); //jibin
const boattypemodel = require("../models/BoatTypeModel");
const boatmodel = require("../models/AddBoatModel");
const boat = require("../models/BoatTypeModel");
const location = require("../models/BoatLocationModel");
const GetBoatDetails = require("../models/AddBoatModel"); //jibin
const PreLaunchAndLaunchBookingDays = require("../models/BookingDaysForLaunchPreLaunchModels");
const Schedule = require("../models/ScheduleModel");
const ManageOwner = require("../models/ManageOwnerModel");
const Duration = require("../models/OwnershipDuration");
const OwnerBookings = require("../models/OwnerBookingDates");
const moment = require("moment");
const { uuid } = require("uuidv4");
const shares = require('../models/AddNewShareModel');
const { checkIfSameDaysSelectedInTwoSeasons, getHoursFromTwoDate } = require("../util/dateHelper");
const {validateGetBoatDatesOverViewByDate} = require('../validations/boatValidations')
const transporter = require('../email/transporter');
const getEmailTemplate = require('../email/emailTemplate');

//jibin
// Function for Save BoatType
// Function for Save BoatType
const AddBoatType = (req, res, next) => {
  let boatType = _.capitalize(req.body.Boat_Type)
  console.log(boatType)
  // const regex = new RegExp(boattype)
  // console.log(regex)
  boattypemodel.find({ Boat_Type:boatType,IsActive:true}, (err, response) => {
    //  boatmodel.findOne({"Boat_Number" : {$regex :BoatNumber}}, (err, response)=>{
    console.log(response.length, "length");
    var Len = response.length;
   

    if (Len == 0) {
      let BoatType = new boattypemodel({
        Boat_Type: boatType,
        Type_Description: req.body.Type_Description,
        Block: req.body.Block,
        IsActive: req.body.IsActive,
        Current_Time: moment(Date.now()),
        Update_time: moment(Date.now()),
      });
      BoatType.save()
        .then((response) => {
          res.json({
            status: true,
            message: "New Boat Type Added Successfully.",
            data: BoatType,
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    } else {
      res.json({
        status: true,
        message: "Boat Type Already Exist",
      });
    }
  });
};

// Function for Edit BoatType
const EditBoatType = async(req, res, next) => {

  //Check if boat already exist 
  const type_id = req.body._id;
  let boatType = _.capitalize(req.body.Boat_Type)
  console.log(boatType)

 let existBoatType = await boattypemodel.findOne({Boat_Type:new RegExp(boatType, 'i'),IsActive:true}).catch((error)=> console.log(error));
 


 if(existBoatType && existBoatType._id != type_id){
   return res.json({
    status: false,
    message: "Boat Type Already Exist",
  });
 }

  
  boattypemodel.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(type_id) },
    {
      Boat_Type: boatType,
      Type_Description: req.body.Type_Description,
      Block: req.body.Block,
      IsActive: req.body.IsActive,
      Current_Time: moment(Date.now()),
      Update_time: moment(Date.now()),
    },

    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          message: "Boat Type Details Updated Successfully",
        });
      }
    }
  );
};
// Function for Delete BoatType

const DeleteBoatType = (req, res, next) => {
  const type_id = req.body._id;

  boattypemodel.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(type_id) },
    {
      IsActive: false,
      Update_Time: moment(Date.now()),
    },

    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          message: "Boat Type Deleted Successfully",
        });
      }
    }
  );
  // boattypemodel.findByIdAndDelete(type_id).then(response => {
  // res.json({
  // status:true,
  // message:"Boat Type Details Deleted Successfully"
  // })
  // })
  // .catch(error => {
  // res.json({
  // status:false,
  // message: 'AN ERROR OCCURED'
  // })
  // })
};

//  Function for Show All BoatTypeDetails
const GetallBoatTypeDetails = (req, res, next) => {
  var mysort = { _id: -1 };
  boattypemodel
    .find({ IsActive: true })
    .sort(mysort)
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        status: false,
        message: error,
      });
    });
};
//Function for Show All BoatDetails
const GetallBoatDetails = (req, res, next) => {
  var total = 0;
  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $lookup: {
          from: "tb_boattypes",
          localField: "Boattype_id",
          foreignField: "_id",
          as: "BoattypeDetails",
        },
      },
      {
        $match: { $and: [{ IsActive: true }] },
      },
      {
        $project: {
          "locationDetails.Boat_Location": 1,
          "BoattypeDetails.Boat_Type": 1,
          Boat_Name: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_originalimage: 1,
          Boat_originalhandBook: 1,
          Boat_HandBook: 1,
          Boat_original_Owner_Manual:1,
          Boat_Owner_Manual:1,
          Boat_Status: 1,
          Total_Days: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
          SummerSeason_SDate: 1,
          SummerSeason_EDate: 1,
          WinterSeason_SDate: 1,
          WinterSeason_EDate: 1,
          Location_Id: 1,
          Boattype_id: 1,
          Boat_Number: 1,
          IsActive: 1,
          BookedDaystotal: "0",
          AllocatedDaystotal: "0",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .exec(function (err, response) {
      console.log(response);
      res.json({
        status: true,
        response,
      });
    });
};
//Function for Show BoatDetails using id
const GetBoatDetailsById = (req, res, next) => {
  const boatid = mongoose.Types.ObjectId(req.body._id);

  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $lookup: {
          from: "tb_boattypes",
          localField: "Boattype_id",
          foreignField: "_id",
          as: "BoattypeDetails",
        },
      },
      {
        $match: {
          $and: [{ _id: boatid }, { IsActive: true }],
        },
      },
      {
        $project: {
          "locationDetails.Boat_Location": 1,
          "BoattypeDetails.Boat_Type": 1,
          Boat_Name: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_HandBook: 1,
          Boat_Status: 1,
          IsActive: 1,
        },
      },
    ])
    .exec(function (err, response) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          response,
        });
      }
    });
};
// Function for Save BoatDetails
const AddNewBoat = (req, res, next) => {


  //check If Same Dates Are Selected For SummerAndWinter

  let summerSeason = {
    startDate:req.body.SummerSeason_SDate,
    endDate: req.body.SummerSeason_EDate
  }

  let winterSeason = {
    startDate:req.body.WinterSeason_SDate,
    endDate:req.body.WinterSeason_EDate
  }

   let checkIfSameDatesAreSelectedForSummerAndWinter =checkIfSameDaysSelectedInTwoSeasons(summerSeason,winterSeason);

   if(!checkIfSameDatesAreSelectedForSummerAndWinter.status){

    return res.json({status:true,message:checkIfSameDatesAreSelectedForSummerAndWinter.error})

   }


   // check If Same Dates Are Selected For SummerAndWinter end

  if (req.body.Boat_Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Boat_Status == "Disable") {
    var Module_status = 0;
  } else if (req.body.Boat_Status == "Archive") {
    var Module_status = 2;
  }

  //summer
  const S_start = new Date(req.body.SummerSeason_SDate);
  var Start_Sfinal = moment(S_start);
  var BoatNumber = req.body.Boat_Number;
  var SummerS_Start = Start_Sfinal.startOf("day");

  const S_end = new Date(req.body.SummerSeason_EDate);
  var Start_Efinal = moment(S_end);
  var SummerE_End = Start_Efinal.startOf("day");
  //summer

  //for winter
  const W_start = new Date(req.body.WinterSeason_SDate);
  var Start_Wfinal = moment(W_start);
  var WinterS_Start = Start_Wfinal.startOf("day");

  const W_end = new Date(req.body.WinterSeason_EDate);
  var Start_WEfinal = moment(W_end);
  var WinterE_End = Start_WEfinal.startOf("day");

  //for winter

  const L_Date = new Date(req.body.Launch_Date);
  const P_Date = new Date(req.body.PreLaunch_Date);
  boatmodel.findOne({ Boat_Number: { $regex: BoatNumber },IsActive:true }, (err, response) => {
    if (!response) {
      ////////////////////////////
     if(P_Date.getTime() < L_Date.getTime())
      {
        if(S_start.getTime()< S_end.getTime())
        {
          if(W_start.getTime()< W_end.getTime())
        {
       
      console.log(req.body);
      let Add_Boat = new boatmodel({
        Boat_Name: req.body.Boat_Name,
        Boat_Facility: req.body.Boat_Facility,
        Boat_Description: req.body.Boat_Description,
        Boat_Number: req.body.Boat_Number,
        Location_Id: mongoose.Types.ObjectId(req.body.Location_Id),
        Boattype_id: mongoose.Types.ObjectId(req.body.Boattype_id),
        Location_Name: req.body.Location_Name,
        Boattype_Name: req.body.Boattype_Name,
        Owners_Allowed: req.body.Owners_Allowed,
        Launch_Date: req.body.Launch_Date,
        PreLaunch_Date: req.body.PreLaunch_Date,
        Boat_Image: req.body.Boat_Image,
        Boat_originalimage: req.body.Boat_originalimage,
        Boat_HandBook: req.body.Boat_HandBook,
        Boat_originalhandBook: req.body.Boat_originalhandBook,
        Boat_original_Owner_Manual: req.body.Boat_original_Owner_Manual,
        Boat_Owner_Manual: req.body.Boat_Owner_Manual,
        SummerSeason_SDate: req.body.SummerSeason_SDate,
        SummerSeason_EDate: req.body.SummerSeason_EDate,
        WinterSeason_SDate: req.body.WinterSeason_SDate,
        WinterSeason_EDate: req.body.WinterSeason_EDate,

        SummerS_SDate: SummerS_Start,
        SummerS_EDate: SummerE_End,
        WinterS_SDate: WinterS_Start,
        WinterS_EDate: WinterE_End,

        Block: req.body.Block,
        Boat_Status: Module_status,
        IsActive: req.body.IsActive,
        Current_Time: moment(Date.now()),
        Updated_time: moment(Date.now()),

        Owner_Manual:req.body.Owner_Manual
      });

      Add_Boat.save()
        .then((response) => {
          //add consecutive
          let addConsecutive = new PreLaunchAndLaunchBookingDays({
            Boat_Id: response._id,
            Booking_Days: 3,
          });

          addConsecutive.save();

          //add consecutive
          //email

          const emailState =  'Successfully Added.';
          const emailContent = `Dear Administrator The Boat ${req.body.Boat_Name} has been successfully created.`;
          const emailDetailName = 'Registration Details'
          const emailDetails = [
            { key: 'Boat Number', value:  req.body.Boat_Number},
            { key: 'Boat', value: req.body.Boat_Name },
          ];
          const emailNameAndLink = {
            name:'Login Link',
            link:`${process.env.CLIENT_URL}`
          }


          var mailOptionsAdmin = {
            from: "noreply.smartboatbooking@gmail.com",
            to: "admin@smartboating.com.au",
            subject: "Boat Added",
            html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
          };
          transporter.sendMail(mailOptionsAdmin, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              res.json({
                status: true,
                info: "Successfully send",
              });
            }
          });
          //email

          res.json({
            status: true,
            message: "Boat Details Added Successfully",
            data: Add_Boat,
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: "AN ERROR OCCURED",
          });
        });
      }
      else
      {
        res.json({
          status:false,
          message: 'Winter FromDate Must be  Greater than Winter StartDate'
      })
      }
    }
    else
    {
      res.json({
        status:false,
        message: 'Summer FromDate Must be  Greater than Summer FromDate'
    })
    }
      }
      else
      {
      res.json({
          status:false,
          message: 'Launch Date Must be  Greater than PreLaunch Date'
      })

  
      }

    } 
    else {
      res.json({
        status: false,
        message: "Boat Number Already Assigned",
      });
    }
  });

  // }
  // else
  // {
  //     res.json({
  //         status:false,
  //         message: 'Enter Proper Date Formats'
  //     })

  // }
};
//Function For FileUpload
const FileUploadSingle = (req, res, msg) => {
 
  //  res.send(req.file.filename);
  if(req.file == undefined){

    res.json({
      status: false,
      message: "Pdf type is only allowed",
    });

  }
  else{
     
    res.json({
      status: true,
      data: req.file,
      message: "Success,File Uploaded...!",
    });

  }
  
};
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname));
  },
});
const maxSize = 50 * 1024 * 1024;
const Fieldsize = 8 * 1024 * 1024; //jibin
var upload1 = multer({
  storage: storage,
  limits: { fileSize: maxSize, fieldSize: Fieldsize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /pdf/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    else{

      return cb(null, false);

    }

    
  },
});

//Function for  Update the BoatDetails
//Function for Update the BoatDetails
const EditBoat = async(req, res, next) => {


  //check If Same Dates Are Selected For SummerAndWinter

  let summerSeason = {
    startDate:req.body.SummerSeason_SDate,
    endDate: req.body.SummerSeason_EDate
  }

  let winterSeason = {
    startDate:req.body.WinterSeason_SDate,
    endDate:req.body.WinterSeason_EDate
  }

   let checkIfSameDatesAreSelectedForSummerAndWinter = checkIfSameDaysSelectedInTwoSeasons(summerSeason,winterSeason);

   if(!checkIfSameDatesAreSelectedForSummerAndWinter.status){

    return res.json({status:true,message:checkIfSameDatesAreSelectedForSummerAndWinter.error})

   }


   // check If Same Dates Are Selected For SummerAndWinter end
  

     //get all owner durations and set last anniversary to edited anniversary 

    let allDurations = await  Duration.find({Boat_Id:req.body.Boat_id}).catch((error)=> console.log(error))

    if(allDurations.length){

      let newLaunchDate = new Date(req.body.Launch_Date)

      let newLastYearAnniversary = newLaunchDate.setFullYear( newLaunchDate.getFullYear() + 1)

     await Duration.updateMany({Boat_Id:req.body.Boat_id},{lastResetedAnniversary:newLastYearAnniversary}).catch((error) => console.log(error))
    }


  const boat_id = req.body.Boat_id;
  if (req.body.Boat_Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Boat_Status == "Disable") {
    var Module_status = 0;
  } else if (req.body.Boat_Status == "Archive") {
    var Module_status = 2;
  }
  //jb

  var S_weekdays = 0;
  var S_Weekenddays = 0;
  var W_weekdays = 0;
  var W_Weekenddays = 0;
  const S_start = new Date(req.body.SummerSeason_SDate);

  //var S_start2=S_start.toLocaleString();
  var SummerS_Start = moment(S_start).format("DD-MM-YYYY");

  const S_end = new Date(req.body.SummerSeason_EDate);
  //SummerE_End=S_end.toDateString('mm/dd/yyyy');
  //var S_end2=S_end.toLocaleString();
  var SummerE_End = moment(S_end).format("DD-MM-YYYY");

  var dateDiff = Math.round((S_end - S_start) / (1000 * 60 * 60 * 24));
  console.log(dateDiff);
  var Summer_dateDiff = dateDiff + 1;
  const sundays = Math.floor((Summer_dateDiff + ((S_start.getDay() + 6) % 7)) / 7);
  const weekenddays = 2 * sundays + (S_end.getDay() == 6) - (S_start.getDay() == 0);
  console.log(weekenddays);
  const weekdays = Summer_dateDiff - weekenddays;
  console.log(weekdays);
  //for summer

  //for winter
  const W_start = new Date(req.body.WinterSeason_SDate);

  //var W_start2=W_start.toLocaleString();
  var WinterS_Start = moment(W_start).format("DD-MM-YYYY");
  //WinterS_Start=W_start.toDateString('mm/dd/yyyy');
  const W_end = new Date(req.body.WinterSeason_EDate);
  //var W_end2=W_end.toLocaleString();
  var WinterE_End = moment(W_end).format("DD-MM-YYYY");

  var W_dateDiff = Math.round((W_end - W_start) / (1000 * 60 * 60 * 24));
  var Winter_dateDiff = W_dateDiff + 1;
  const W_sundays = Math.floor((Winter_dateDiff + ((W_start.getDay() + 6) % 7)) / 7);
  const Winter_weekenddays = 2 * W_sundays + (W_end.getDay() == 6) - (W_start.getDay() == 0);
  console.log(Winter_weekenddays);
  const Winter_weekdays = Winter_dateDiff - Winter_weekenddays;
  console.log(Winter_weekdays);

  //for winter

  if (S_start !== null) {
    S_weekdays = weekdays;
    S_Weekenddays = weekenddays;
    console.log(S_weekdays);
    console.log(S_Weekenddays);
  }
  if (W_start !== null) {
    W_weekdays = Winter_weekdays;
    W_Weekenddays = Winter_weekenddays;
    console.log(W_weekdays);
    console.log(W_Weekenddays);
  }
  const Total_Days = S_weekdays + S_Weekenddays + W_weekdays + W_Weekenddays;
  const L_Date = new Date(req.body.Launch_Date);
  const P_Date = new Date(req.body.PreLaunch_Date);
  //jb
  console.log(req.body.Launch_Date);
  // if(P_Date.getTime() < L_Date.getTime()&& L_Date.getTime()<S_start.getTime()  && S_start.getTime()<S_end.getTime() && S_end.getTime()<W_start.getTime() && W_start.getTime()< W_end.getTime() )
  // {
    if(P_Date.getTime() < L_Date.getTime())
      {
      if(S_start.getTime()<S_end.getTime())
      {
        if(W_start.getTime()<W_end.getTime() )
      {
     
  boatmodel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(boat_id) },
    {
      Boat_Name: req.body.Boat_Name,
      Boat_Facility: req.body.Boat_Facility,
      Boat_Description: req.body.Boat_Description,
      Boat_Number: req.body.Boat_Number,
      Location_Id: req.body.Location_Id,
      Boattype_id: req.body.Boattype_id,
      Boat_Status: req.body.Boat_Status,
      Location_Name: req.body.Location_Name,
      Boattype_Name: req.body.Boattype_Name,
      Owners_Allowed: req.body.Owners_Allowed,
      Launch_Date: req.body.Launch_Date,
      PreLaunch_Date: req.body.PreLaunch_Date,
      Boat_Image: req.body.Boat_Image,
      Boat_originalhandBook: req.body.Boat_originalhandBook, //Added by chitra on 09.04.2021
      Boat_HandBook: req.body.Boat_HandBook,
      Boat_originalimage: req.body.Boat_originalimage, //Added by chitra on 09.04.2021
      Boat_original_Owner_Manual: req.body.Boat_original_Owner_Manual,
      Boat_Owner_Manual: req.body.Boat_Owner_Manual,
      SummerSeason_SDate: req.body.SummerSeason_SDate,
      SummerSeason_EDate: req.body.SummerSeason_EDate,
      WinterSeason_SDate: req.body.WinterSeason_SDate,
      WinterSeason_EDate: req.body.WinterSeason_EDate,
      SummerS_SDate: SummerS_Start,
      SummerS_EDate: SummerE_End,
      WinterS_SDate: WinterS_Start,
      WinterS_EDate: WinterE_End,
      Total_Days: Total_Days,
      Block: req.body.Block,
      IsActive: req.body.IsActive,
      Boat_Status: Module_status,
      Current_Time: req.body.Current_Time,
      Updated_time: moment(Date.now()),
    },

    function (err, data) {
      if (err) {
        res.json({
          message: "error",
        });
      } else {
        //email

        const emailState =  'Successfully Updated.';
        const emailContent = `Dear Administrator The Boat ${req.body.Boat_Name} has been successfully edited.`;
        const emailDetailName = 'Registration Details'
        const emailDetails = [
          { key: 'Boat number', value: req.body.Boat_Number },
          { key: 'Boat', value: req.body.Boat_Name },
        ];
        const emailNameAndLink = {
          name:'Login Link',
          link:`${process.env.CLIENT_URL}`
        }

       

        var mailOptionsAdmin = {
          from: "noreply.smartboatbooking@gmail.com",
          to: "admin@smartboating.com.au",
          subject: "Boat Details Edit",
          html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
        };
        transporter.sendMail(mailOptionsAdmin, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.json({
              status: true,
              info: "Successfully send",
            });
          }
        });
        //email

        res.json({
          status: true,
          message: "Boat Details Updated Successfully.",
        });
      }
    }
  );
      }
      else
      {
        res.json({
          status:false,
          message: 'Winter EndDate Must be  Greater than Winter StartDate'
      })
      }
      }
      else
      {
        res.json({
          status:false,
          message: 'Summer EndDate Must be  Greater than Summer StartDate'
      })
      }
  }
  else
  {
      res.json({
          status:false,
          message: 'Launch Date Must be  Greater than PreLaunch Date'
      })

  }

};
//Function for Delete the BoatDetails
const DeleteBoat = async(req, res, next) => {
  const boat_id = req.body._id;

  console.log(boat_id)

  

  

  Schedule.find({ Boat_Id: boat_id, IsActive: true }).then(async(Checkresult) => {
    console.log(Checkresult.length, "length");
    var _LengthCheck = Checkresult.length;
    if (_LengthCheck == 0) {

      //set addNewShares table isActive to false
  let sharesAllocation = await shares.findOne({Boat_Id:boat_id}).catch((error)=> console.log(error))
  if(sharesAllocation){
    sharesAllocation.IsActive = false 
   await sharesAllocation.save().catch((error)=> console.log(error))
  }
  //

  //Duration

  //set isActive to false other it will be displayed on owner duration
   
    let durationData = await Duration.find({Boat_Id:boat_id}).catch((error)=> console.log(error))

        console.log(durationData)

        if(durationData.length){
         await Duration.updateMany({Boat_Id:boat_id},{IsActive:false}).catch((error)=>console.log(error))
        }

  //


      boatmodel.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(boat_id) },
        {
          IsActive: false,
          Updated_time: moment(Date.now()),
        },

        function (err, data) {
          if (err) {
            res.json({
              message: "error",
            });
          } else {
            ManageOwner.updateMany(
              { Boat_Id: mongoose.Types.ObjectId(boat_id) },
              {
                IsActive: false,
                Update_time: moment(Date.now()),
              },
              { new: true },
              function (err, datas) {}
            );

            //email
            
            boatmodel.findById({ _id: mongoose.Types.ObjectId(boat_id) }).then((boatDetails) => {
              var BoatName = boatDetails.Boat_Name;

              const emailState =  'Successfully Updated.';
        const emailContent = `Dear Administrator The Boat ${req.body.Boat_Name} has been successfully Deleted.`;
        const emailDetailName = 'Registration Details'
        const emailDetails = [
          { key: 'Boat number', value: req.body.Boat_Number },
          { key: 'Boat', value: req.body.Boat_Name },
        ];
        const emailNameAndLink = {
          name:'Login Link',
          link:`${process.env.CLIENT_URL}`
        }


              var mailOptionsAdmin = {
                from: "noreply.smartboatbooking@gmail.com",
                to: "admin@smartboating.com.au",
                subject: "Boat Deleled",
                html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                  
               
              };
              transporter.sendMail(mailOptionsAdmin, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  res.json({
                    status: true,
                    info: "Successfully send",
                  });
                }
              });
            });
            //email
            res.json({
              status: true,
              message: "Boat Details Deleted Successfully",
            });
          }
        }
      );
    } else {
      res.json({
        status: false,
        message: "This Boat is Already Booked",
      });
    }
  });
};
const GetBoatType = (req, res, next) => {
 
  boat
    .find({ IsActive: true })
    .sort({Boat_Type:1})
    .select({ _id: 1, Boat_Type: 1 })
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};
const GetLocation = (req, res, next) => {
  location
    .find({ IsActive: true })
    .select({ _id: 1, Boat_Location: 1, Location_URL: 1 })
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        status: false,
        message: error,
      });
    });
};
//Function for Show BoatDetails using LocationId
const GetBoatDetailsByLocation = (req, res, next) => {
  const LocationId = mongoose.Types.ObjectId(req.body.Location_Id);
  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $lookup: {
          from: "tb_boattypes",
          localField: "Boattype_id",
          foreignField: "_id",
          as: "BoattypeDetails",
        },
      },
      {
        $match: { Location_Id: LocationId },
      },

      {
        $project: {
          "locationDetails.Boat_Location": 1,
          "BoattypeDetails.Boat_Type": 1,
          Boat_Name: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_HandBook: 1,
          Boat_Status: 1,
          Total_Days: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
        },
      },
    ])
    .exec(function (err, response) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          response,
        });
      }
    });
};
//Function for Show BoatDetails using LocationId
const PostBoatDetailsByLocation = (req, res, next) => {
  const LocationId = mongoose.Types.ObjectId(req.body.Location_Id);
  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $lookup: {
          from: "tb_boattypes",
          localField: "Boattype_id",
          foreignField: "_id",
          as: "BoattypeDetails",
        },
      },
      {
        $match: { Location_Id: LocationId,IsActive:true},
      },

      {
        $project: {
          "locationDetails.Boat_Location": 1,
          "BoattypeDetails.Boat_Type": 1,
          _id:1,
          Boat_Name: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_HandBook: 1,
          Boat_Status: 1,
          Total_Days: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
        },
      },
    ])
    .exec(function (err, response) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          response,
        });
      }
    });
};
// code for Add Season Jibin
const AddSeason = (req, res, next) => {
  var S_weekdays = 0;
  var S_Weekenddays = 0;
  var W_weekdays = 0;
  var W_Weekenddays = 0;
  const start = new Date(req.body.Season_SDate);
  console.log(start);
  const end = new Date(req.body.Season_EDate);
  var dateDiff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  console.log(dateDiff);
  //working weekenddays

  const sundays = Math.floor((dateDiff + ((start.getDay() + 6) % 7)) / 7);
  const weekenddays = 2 * sundays + (end.getDay() == 6) - (start.getDay() == 0);
  console.log(weekenddays);
  const weekdays = dateDiff - weekenddays;
  console.log(weekdays);
  //working weekenddays

  const seasontype = req.body.Season_Type;
  if (seasontype == "Summer") {
    S_weekdays = weekdays;
    S_Weekenddays = weekenddays;
    console.log(S_weekdays);
    console.log(S_Weekenddays);
  } else {
    W_weekdays = weekdays;
    W_Weekenddays = weekenddays;
  }

  let Add_Season = new addseason({
    Boat_Name: req.body.Boat_Name,
    Boat_Id: req.body.Boat_Id,
    Season_Type: req.body.Season_Type,
    Season_SDate: req.body.Season_SDate,
    Season_EDate: req.body.Season_EDate,
    Summer_WeekDays: S_weekdays,
    Summer_WeekEndDays: S_Weekenddays,
    Winter_WeekDays: W_weekdays,
    Winter_WeekEndDays: W_Weekenddays,
    Block: req.body.Block,
    IsActive: req.body.IsActive,
    Current_Time: req.body.Current_Time,
    Updated_time: req.body.Updated_time,
  });
  Add_Season.save()
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        status: false,
        message: "invalid",
      });
    });
};
// launch filter
const LaunchFilter = (req, res, next) => {
  var Date1 = req.body.Launch_Date1;
  // var Launch_Date1= moment(req.body.Launch_Date1).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.startTime = 2016-09-25 00:00:00
  var Date2 = req.body.Launch_Date2;

  var Datetype = req.body.DateType;
  console.log(Datetype);
  if (Datetype == "Launch_Date") {
    GetBoatDetails.find({ $or: [{ Launch_Date: { $gt: new Date(Date1), $lt: new Date(Date2) } }, { Launch_Date: { $gt: new Date(Date1), $lt: new Date(Date2) } }] }).then((response) => {
      if (GetBoatDetails) {
        try {
          res.json({
            response,
          });
        } catch (error) {
          res.json({
            status: false,
            message: "No boat Found",
          });
        }
      }
    });
  } else {
    console.log("hiiiiiiiii");
    GetBoatDetails.find({ $or: [{ PreLaunch_Date: { $gt: new Date(Date1), $lt: new Date(Date2) } }, { PreLaunch_Date: { $gt: new Date(Date1), $lt: new Date(Date2) } }] }).then((response) => {
      if (GetBoatDetails) {
        try {
          res.json({
            response,
          });
        } catch (error) {
          res.json({
            status: false,
            message: "No boat Found",
          });
        }
      }
    });
  }
};
//Function for Multiple File Uploading
const FileUploadmany = (req, res, next) => {
  const files = [];
  req.files.forEach((item) => {
    files.push(item.filename, item.originalname.split(/\s/).join(""));
  });
  if(files.length ==0 ){
    var filetypes = /jpeg|jpg|png/;
    res.json({
      status: false,
      data: files,
      message: "File upload only supports the " + "following filetypes - " + filetypes
    });

  }else{

    res.json({
      status: true,
      data: files,
      message: "Success,File Uploaded...!",
    });

  }
 

  //     const files=[];
  //     req.files.forEach(item=>{
  //     files.push(item.filename)
  //     })
  //  res.send(files);
};
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    console.log(file);
    //   callback(null, file.originalname)
    callback(null, uuid() + path.extname(file.originalname));
  },
});
const Multi_maxSize = 50 * 1024 * 1024; //jibin
const Multi_Fieldsize = 8 * 1024 * 1024; //jibin
var upload = multer({ 
  storage: storage, limits: { fileSize: Multi_maxSize, fieldSize: Multi_Fieldsize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }

    return cb(null, false);

    //cb("Error: File upload only supports the " + "following filetypes - " + filetypes);
  },
 });
//Function for Show Archive BoatDetails based on location
const GetArchieveBoatDetailsInLocation = (req, res, next) => {
  if (req.body.Boat_Status == "Archive") {
    var Module_status = 2;
  }

  const LocationId = mongoose.Types.ObjectId(req.body.Location_Id);
  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $match: {
          $and: [{ Location_Id: LocationId }, { Boat_Status: Module_status.toString() }, { IsActive: true }],
        },
      },
      {
        $project: {
          "locationDetails.Boat_Location": 1,
          Boat_Name: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_originalimage: 1,
          Boat_originalhandBook: 1,
          Boat_HandBook: 1,
          Boat_Status: 1,
          Total_Days: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
          SummerSeason_SDate: 1,
          SummerSeason_EDate: 1,
          WinterSeason_SDate: 1,
          WinterSeason_EDate: 1,
          Location_Id: 1,
          Boattype_id: 1,
          Boattype_Name: 1,
        },
      },
    ])
    .exec(function (err, response) {
      console.log(response);
      res.json({
        status: true,
        response,
      });
    });
};
//Function for Show All Archive BoatDetails
const GetAllArchieveBoatDetails = (req, res, next) => {
  if (req.body.Boat_Status == "Archive") {
    var Module_status = 2;
  }

  mongoose
    .model("Tb_BoatMaster")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatlocations",
          localField: "Location_Id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $match: {
          $and: [{ Boat_Status: Module_status.toString() }, { IsActive: true }],
        },
      },
      {
        $project: {
          "locationDetails.Boat_Location": 1,
          Boat_Name: 1,
          Boat_Number: 1,
          Boat_Facility: 1,
          Boat_Description: 1,
          Owners_Allowed: 1,
          Launch_Date: 1,
          PreLaunch_Date: 1,
          Boat_Image: 1,
          Boat_originalimage: 1,
          Boat_originalhandBook: 1,
          Boat_HandBook: 1,
          Boat_Status: 1,
          Total_Days: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
          SummerSeason_SDate: 1,
          SummerSeason_EDate: 1,
          WinterSeason_SDate: 1,
          WinterSeason_EDate: 1,
          Location_Id: 1,
          Boattype_id: 1,
          Boattype_Name: 1,
        },
      },
    ])
    .exec(function (err, response) {
      console.log(response);
      res.json({
        status: true,
        response,
      });
    });
};

//get Boat Details From Boat Collection

const GetBoatDetailsByBoatId = (req, res, next) => {
  boatid = req.body.boatid;

  boatmodel
    .findOne({ _id: mongoose.Types.ObjectId(boatid) })
    .then((response) => {
      var SummerS_Start = new Date(response.SummerSeason_SDate);
      var SummerS_EDate = new Date(response.SummerSeason_EDate);
      var WinterS_SDate = new Date(response.WinterSeason_SDate);
      var WinterS_EDate = new Date(response.WinterSeason_EDate);
      console.log(SummerS_Start, SummerS_EDate, WinterS_SDate, WinterS_EDate);
      var W_dateDiff = Math.round((WinterS_EDate - WinterS_SDate) / (1000 * 60 * 60 * 24));
      var Winter_dateDiff = W_dateDiff;
      var S_dateDiff = Math.round((SummerS_EDate - SummerS_Start) / (1000 * 60 * 60 * 24));
      var Summer_dateDiff = S_dateDiff;
      var AllocatedDays = [];
      AllocatedDays.push({ Summer_Days: Summer_dateDiff, Winter_Days: Winter_dateDiff });

      console.log(Winter_dateDiff, Summer_dateDiff);
      res.json({
        Status: true,
        Data: { response, AllocatedDays },
      });
    })
    .catch((error) => {
      res.json({
        Status: false,
      });
    });
};

// vinayak 6/23

const Add_Location = (req, res, next) => {
  var isurlCheck = isUrlValid(req.body.Location_URL);
  if (isurlCheck == true) {
    //location.findOne({ $or: [{ Boat_Location: req.body.Boat_Location }, { Location_URL: req.body.Location_URL }] }).then(async(user) => {
      location.findOne({Location_URL: req.body.Location_URL}).then(async(user) => {
      if (!user) {
        let Add_location1 = new location({
          Boat_Location: req.body.Boat_Location,
          Location_URL: req.body.Location_URL,
          IsActive: true,
          Block: true,
          Current_Time: moment(Date.now()),
          Updated_Time: moment(Date.now()),
        });

        Add_location1.save()
          .then((response) => {
            res.json({
              status: true,
              message: "The location has been successfully added",
            });
          })
          .catch((error) => {
            res.json({
              message: error,
            });
          });
      } else {

        //If already deleted but trying to add then do this

       
        if(!user.IsActive){
         
            user.Boat_Location = req.body.Boat_Location
            user.IsActive = true
           await user.save().catch((error)=> console.log(error))
         return  res.json({
            status: true,
            message: "The location has been successfully added.",
          });
        }

        res.json({
          status: true,
          message: "There is an Entry for this Location",
        });
      }
    });
  } else {
    res.json({
      status: true,
      message: "Invalid URL format",
    });
  }
};

function isUrlValid(userInput) {
  /*var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null) return false;
  else return true;*/
  if (userInput.indexOf("http://") == 0 || userInput.indexOf("https://") == 0) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(userInput);
        
    }
    else{
        return false;
    }
}

const EditLocation = async(req, res, next) => {
  const Location_id = req.body._id;
  var isurlCheck = isUrlValid(req.body.Location_URL);

  //check if url already exist in the DB

 let locationData =  await location.findOne({Location_URL:req.body.Location_URL}).catch((error)=>{
    console.log(error)
  return res.json({
      status: true,
      message: "something went wrong try again.",
    });
  })


  if(locationData && locationData._id != Location_id ){
    return res.json({status:true,message:'This location url already exist.'})
  }


  //end check

  if (isurlCheck == true) {
    location.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(Location_id) },
      {
        Boat_Location: req.body.Boat_Location,
        Location_URL: req.body.Location_URL,
        IsActive: true,
        Block: true,
        Current_Time: moment(Date.now()),
        Updated_Time: moment(Date.now()),
      },

      function (err, data) {
        if (err) {
          res.json({
            status: false,
            message: "AN ERROR OCCURED",
          });
        } else {
          res.json({
            status: true,
            message: "Location Details Updated Successfully",
          });
        }
      }
    );
  } else {
    res.json({
      status: true,
      message: "Invalid URL format",
    });
  }
};

const DeleteLocation = (req, res, next) => {
  const Location_id = req.body._id;
  location.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(Location_id) },
    {
      IsActive: false,
      Updated_Time: moment(Date.now()),
    },

    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          message: "Location Deleted Successfully",
        });
      }
    }
  );
};
//vinayak 6/23

//

const GetTotal_PendingAllocatedDays = (req, res, next) => {
  var arr = [];
  var totalallocateddays = 0;
  var totalbookeddays = 0;
  //    mongoose.model('Tb_OwnerBookingDays').aggregate(
  //     [
  //     {
  //     "$lookup":{
  //     "from":"tb_boatmasters",
  //     "localField": "Boat_Id",
  //     "foreignField": "_id",
  //     "as": "BoatDetails"
  //     }
  //    },
  //    {
  //     "$match": {IsActive:true}
  // },
  //     {
  //     $project:{
  //         Summer_WeekDays:1,Summer_WeekEndDays:1,Winter_WeekDays:1,Winter_WeekEndDays:1,Boat_Id:1,Owner_Id:1
  //     }
  //     }
  //     ]
  //     ).exec(function(err, BookedDays){
  OwnerBookings.find({ IsActive: true }).then((BookedDay) => {
    var BookedDays = [];
    BookedDay.map(async function (obj) {
      totalbookeddays = obj.Summer_WeekDays + obj.Summer_WeekEndDays + obj.Winter_WeekDays + obj.Winter_WeekEndDays;

      await BookedDays.push({
        Owner_Id: obj.Owner_Id,
        Boat_Id: obj.Boat_Id,
        Summer_WeekDays: obj.Summer_WeekDays,
        Summer_WeekEndDays: obj.Summer_WeekEndDays,
        Winter_WeekDays: obj.Winter_WeekDays,
        Winter_WeekEndDays: obj.Winter_WeekEndDays,
        total: totalbookeddays,
      });
    });

    ManageOwner.find({ IsActive: true }).then((OwnerAllocationDays) => {
      var AllocatedDays = [];
      OwnerAllocationDays.map(async function (objs) {
        totalallocateddays = objs.Summer_WeekDays + objs.Summer_WeekEndDays + objs.Winter_WeekDays + objs.Winter_WeekEndDays;

        await AllocatedDays.push({
          Owner_Id: objs.Owner_Id,
          Boat_Id: objs.Boat_Id,
          Summer_WeekDays: objs.Summer_WeekDays,
          Summer_WeekEndDays: objs.Summer_WeekEndDays,
          Winter_WeekDays: objs.Winter_WeekDays,
          Winter_WeekEndDays: objs.Winter_WeekEndDays,
          total: totalallocateddays,
        });
      });

      res.json({
        status: true,
        Response: { BookedDays, AllocatedDays },
      });
    });
  });
};

const GetAllBoatsDatesOverview = async(req,res)=>{


  let getAllBoatsDatesOverview = await boatmodel.find({IsActive:true},{
    Boat_Name:1,Location_Name:1,Launch_Date:1,SummerSeason_SDate:1,
    SummerSeason_EDate:1,WinterSeason_SDate:1,WinterSeason_EDate:1,
    Total_Days:1,Owners_Allowed:1
  }).catch((error)=>{
    console.log(error)
    return res.json({status:true,message:'Something went wrong try again.'})
  })

 return res.json({status:true,response:getAllBoatsDatesOverview})

}


const GetAllBoatUsageOverview = async(req,res)=>{


  let getAllBoatsData = await boatmodel.aggregate([
    {
      $lookup:{
        from:"tb_ownerbookingdays",
        localField:"_id",
        foreignField:"Boat_Id",
        as: "bookedDays"
      }
    },

    {
      $lookup:{
        from:"tb_manageowners",
        localField:"_id",
        foreignField:"Boat_Id",
        as: "allocatedDays"
      }
    },

    {
      $lookup:{
        from:"tb_addstandbybookings",
        localField:"_id",
        foreignField:"Boat_Id",
        as:"allStandByBookings"
      }

    },

    {
      $lookup:{
        from:"tb_schedules",
        localField:"_id",
        foreignField:"Boat_Id",
        as:"allDayBookings"
      }

    },
    {
      $lookup:{
        from:"tb_boatcleans",
        localField:"_id",
        foreignField:"Boat_Id",
        as:"allCleans"
      }

    },

    {$match: {IsActive:true}},
    
     
      {$project:{

        allDayBookings:{
          Total_DaysBooked:1,
          User_RoleType:1,
          start:1, 
          end:1,
          IsActive:1
        },

        allStandByBookings:{
          TotalDay_Count:1,
          User_RoleType:1
        },
        bookedDays:{
          Summer_WeekDays:1,
          Summer_WeekEndDays:1,
          Winter_WeekDays:1,
          Winter_WeekEndDays:1,
        },
        allocatedDays:{
          Summer_WeekDays:1,
          Summer_WeekEndDays:1,
          Winter_WeekDays:1,
          Winter_WeekEndDays:1,
        },

        allCleans:{
          Cleans:1,
          User_RoleType:1

        },
        Boat_Name:1,
        IsActive:1,
       
        
       

      }},

     
  ]).catch((error)=> {
    console.log(error)
    return res.json({status:true,message:"Something went wrong try again."})

  })


  let boatUsageData = [];

 


  for (const boat of getAllBoatsData) {

    //total allocated days

    let totalAllocatedSummerWeekdays = 0
    let totalAllocatedSummerWeekends = 0
    let totalAllocatedWinterWeekdays = 0
    let totalAllocatedWinterWeekends = 0

    for (const allocatedDay of boat.allocatedDays) {

      totalAllocatedSummerWeekdays += allocatedDay.Summer_WeekDays
      totalAllocatedSummerWeekends += allocatedDay.Summer_WeekEndDays
      totalAllocatedWinterWeekdays += allocatedDay.Winter_WeekDays
      totalAllocatedWinterWeekends += allocatedDay.Winter_WeekEndDays
      
    }

    // total booked days

    let totalBookedSummerWeekdays = 0
    let totalBookedSummerWeekends = 0
    let totalBookedWinterWeekdays = 0
    let totalBookedWinterWeekends = 0
   



    for (const bookedDay of boat.bookedDays){

      totalBookedSummerWeekdays += bookedDay.Summer_WeekDays
      totalBookedSummerWeekends += bookedDay.Summer_WeekEndDays
      totalBookedWinterWeekdays += bookedDay.Winter_WeekDays
      totalBookedWinterWeekends += bookedDay.Winter_WeekEndDays

    }


    //total stand by bookings

    let totalStandByBookingCount = 0;

    for (const allStandByBooking of boat.allStandByBookings) {
        if(allStandByBooking.User_RoleType === 'Owner'){
          totalStandByBookingCount += allStandByBooking.TotalDay_Count
        }
      
    }


    // total number of day only booking 

    let totalNumberOfDayOnlyBooking = 0

      //Total number of days admin booked

      let totalNumberOfDaysAdminBooked = 0

      let totalOwnerBookedHours = 0;
      let totalOwnerBookingsCount = 0
      let totalAverageBookingDurationInHr = 0
      

      let totalNumberOfBookingDaysCancellation = 0
    
    for (const allOneDayBooking of boat.allDayBookings) {


      if(!allOneDayBooking.IsActive){
        totalNumberOfBookingDaysCancellation += allOneDayBooking.Total_DaysBooked
      }

      if(allOneDayBooking.Total_DaysBooked == 1 && allOneDayBooking.User_RoleType === "Owner"){
      totalNumberOfDayOnlyBooking += allOneDayBooking.Total_DaysBooked
      }

      if(allOneDayBooking.User_RoleType === "Owner"){
        totalOwnerBookedHours += getHoursFromTwoDate(allOneDayBooking.start,allOneDayBooking.end)
        totalOwnerBookingsCount += allOneDayBooking.Total_DaysBooked
      }

      if(allOneDayBooking.User_RoleType === 'Admin'){
        totalNumberOfDaysAdminBooked += allOneDayBooking.Total_DaysBooked
      }

    }

    totalAverageBookingDurationInHr = totalOwnerBookedHours / totalOwnerBookingsCount
    if(!totalAverageBookingDurationInHr) totalAverageBookingDurationInHr = 0


    let toatalNumberofCleans = 0;

    for (const clean of boat.allCleans) {

      if(clean.User_RoleType === "Owner"){
        toatalNumberofCleans += clean.Cleans
      }

    }



    let data = {
      boatName:boat.Boat_Name,
      _id:boat._id,
      totalAllocatedSummerWeekdays,
      totalAllocatedSummerWeekends,
      totalAllocatedWinterWeekdays,
      totalAllocatedWinterWeekends,
      totalBookedSummerWeekdays,
      totalBookedSummerWeekends,
      totalBookedWinterWeekdays,
      totalBookedWinterWeekends,
      totalStandByBookingCount,
      totalNumberOfDayOnlyBooking,
      toatalNumberofCleans,
      totalNumberOfMmaintenanceDay :'Not Available',
      totalNumberOfDaysAdminBooked,
      totalAverageBookingDurationInHr,
      totalNumberOfBookingDaysCancellation,
    }


    boatUsageData.push(data)
  }


  
  return res.json({status:true,response:boatUsageData})

 
      

  
    

}


const GetAllBoatsDatesOverviewByDate = async(req,res)=>{

  return new Promise(async(resolve,reject)=>{

     //validate incoming data

        let dataValidation = await validateGetBoatDatesOverViewByDate(req.body);

        
        if (dataValidation.error) {
             let message = dataValidation.error.details[0].message.replace(/"/g, "");
            return reject({ status: false, message });
        }

        //

      let {SearchType,from,to} = req.body;

    from = moment(from,"DD-MM-YYYY").format('YYYY-MM-DD')
     to = moment(to,"DD-MM-YYYY").format('YYYY-MM-DD')


          let getAllBoatsDatesOverview = await boatmodel.find({[SearchType]:{$gte:new Date(from),$lt:new Date(to)}}
,{
    Boat_Name:1,Location_Name:1,Launch_Date:1,SummerSeason_SDate:1,
    SummerSeason_EDate:1,WinterSeason_SDate:1,WinterSeason_EDate:1,
    Total_Days:1,Owners_Allowed:1
  }).catch((error)=>{
    console.log(error)
    return res.json({status:true,message:'Something went wrong try again.'})
  })

 return resolve({status:true,response:getAllBoatsDatesOverview})

  }).then((response)=>{
        return res.json(response)
    }).catch((error)=>{
        return res.json(error)
    })

 



}

//

module.exports = {
  AddBoatType,
  GetLocation,
  GetBoatType,
  AddNewBoat,
  FileUploadSingle,
  upload1,
  upload,
  FileUploadmany,
  GetallBoatDetails,
  GetBoatDetailsById,
  EditBoat,
  DeleteBoat,
  AddSeason,
  LaunchFilter,
  GetBoatDetailsByLocation,
  GetallBoatTypeDetails,
  EditBoatType,
  DeleteBoatType,
  PostBoatDetailsByLocation,
  GetArchieveBoatDetailsInLocation,
  GetAllArchieveBoatDetails,
  GetBoatDetailsByBoatId,
  Add_Location,
  EditLocation,
  DeleteLocation,
  GetTotal_PendingAllocatedDays,
  GetAllBoatsDatesOverview,
  GetAllBoatUsageOverview,
  GetAllBoatsDatesOverviewByDate
};
