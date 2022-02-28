//AuthorName:JIBIN B RAJ
//File:Ownercontroller.js
//Module:ManageBoatOwners
//Created Date:13.03.2021
//Purpose:To Save the Details of adding a new Boat in the Database.

/***************************************************Import Packages and ViewModels Section******************************** */
const multer = require("multer");
const path = require("path");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const async = require("async");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs"); //Added By chitra on 13.04.2021
const crypto = require("crypto"); //Added By chitra on 13.04.2021


const TotalNoCancellations=require('../models/NumberOfCancellation');
const NewOwners = require("../models/AddOwnerModel");
const upload = require("../middleware/upload");
const Duration = require("../models/OwnershipDuration");
const Tranferownership = require("../models/OwnershipTransferModel");
const Boats = require("../models/AddBoatModel");
const Share = require("../models/ShareAllocationModel");
const shares = require("../models/AddNewShareModel");
const ManageOwner = require("../models/ManageOwnerModel");
const mongoose = require("mongoose");
const addseason = require("../models/SeasonModel"); //jibin
var loginData = require("../EmailCredentials");
const {
  gmail: { host, pass },
} = loginData;
const { uuid } = require("uuidv4");
const OwnerBooking_Days = require("../models/OwnerBookingDates");
const Schedule = require("../models/ScheduleModel");
const { validatemanageOwner } = require("../validations/manageownerValidations");
const { validateAddOwner,validateEditOwner,validatePhone,validatemobile } = require("../validations/ownerValidations");
const {  getHoursFromTwoDate } = require("../util/dateHelper");
const No_OfCleans=require('../models/NumberOfCleansModel');
const transporter = require('../email/transporter');
const getEmailTemplate = require('../email/emailTemplate');

/***************************************************Import Methods and Functions******************************** */
// Function for Add Owner//Modified By Chitra on 13.04.2021
const AddOwner = async (req, res, next) => {
  //console.log(req.body);

  //Data Validation

  const dataValidation = await validateAddOwner(req.body);

  if (dataValidation.error) {
    let message = dataValidation.error.details[0].message.replace(/"/g, "");
    return res.json({ status: false, message });
  }

  if(req.body.Emergency_Contact_Mobile!=""){

    const phonevalidation = await validatePhone(req.body.Emergency_Contact_Mobile);

  if(phonevalidation.status == false){

    return res.json({ status: false, message:phonevalidation.message });

  }

  }

  

  const mobilevalidation = await validatemobile(req.body.Mobile);

  if(mobilevalidation.status == false){

    return res.json({ status: false, message:mobilevalidation.message });

  }

  

  //Validation end

  /*if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }*/

  var Module_status = 1;
  var unhashedPW = req.body.Password;
  var Emailid = req.body.Email;
 
  //Added these lines by chitra for encrypting password on 13.04.2021
  bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    //{"Email":{$regex :Emailid}
    // NewOwners.findOne({Email:Emailid,IsActive:true}).then(results=>
    NewOwners.findOne({ Email: { $regex: Emailid }, IsActive: true }).then((results) => {
      if (!results) {
       
        let Add_Owner = new NewOwners({
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
          Home_Address: req.body.Home_Address,
          Email: req.body.Email,
          Password: hashedPass, //Added by chitra   on 13.04.2021
          DecryptPassword:req.body.DecryptPassword,
          Profile_Image: req.body.Profile_Image,
          Profile_ImageOriginalName: req.body.Profile_ImageOriginalName, //Added by chitra   on 20.04.2021
          Mobile: req.body.Mobile,
          Family_Name: req.body.Family_Name,
          Parking_Ability: req.body.Parking_Ability,
          Sailing_Ability: req.body.Sailing_Ability,
          Housekeeping: req.body.Housekeeping,
          Notes: req.body.Notes,
          Emergency_Contact_Name: req.body.Emergency_Contact_Name,
          Emergency_Contact_Mobile: req.body.Emergency_Contact_Mobile,
          Block: req.body.Block,
          IsActive: true,
          Status: Module_status,
          Current_Time: moment(Date.now()),
          Updated_time: moment(Date.now()),
        });

        Add_Owner.save()
          .then(async(response) => {
            //mail

            await transporter.verify().catch((error)=> console.log(error,"error in mail"))

           const emailState =  'Successfully Registered.';
           const emailContent = `Dear ${req.body.First_Name}, <p>You have invited to create an account for the Smart Boating Booking System .</p>`;
           const emailDetailName = 'Registration Details'
           const emailDetails = [
             { key: 'Owner Name', value: req.body.First_Name },
             { key: 'Password', value: unhashedPW },
           ];
           const emailNameAndLink = {
             name:'Login Link',
             link:`${process.env.CLIENT_URL}/owner-login`
           }
            var mailOptions = {
              from: "noreply.smartboatbooking@gmail.com",
              to: response.Email,
              subject: "LOGIN CREDENTIALS",
              html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
            };
            
            // text: 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            // '<a href="http://65.2.28.16/owner-login' + '">Verify your Account</a>\n\n' +
            // 'Password'+':' + unhashedPW +'\n' +
            // 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error,"mail error");
              }else {

                console.log("mail successfully send")

                res.json({
                  status: true,
                  info: "Successfully send",
                });
              }
            });

            
            const emailContentAdmin = `Dear Administrator, <p>The new Owner ${req.body.First_Name}, has been added to the booking system .</p>`;
            const emailDetailsAdmin = [
              { key: 'Owner Name', value: req.body.First_Name },
              { key: 'Email', value: req.body.Email },
            ];

            var mailOptionsAdmin = {
              from: "noreply.smartboatbooking@gmail.com",
              to: "admin@smartboating.com.au",
              subject: "Owner Added",
              html:getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetailsAdmin,emailNameAndLink)
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

            //mail

            res.json({
              status: true,
              message: "Owner Details Added Successfully",
            });
          })
          .catch((error) => {
            res.json({
              message: error,
            });
          });
      } else {
        res.json({
          status: false,
          message: "Email Already Exist",
        });
      }
    });
  });
};
// Function for EditOwner//Done By chitra on 13.04.2021
const EditOwner = async(req, res, next) => {
  const ownerid = req.body._id;
  var Emailid = req.body.Email;
  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }

    //Data Validation

    const dataValidation = await validateEditOwner(req.body);

    if (dataValidation.error) {
      let message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({ status: false, message });
    }
  
    //Validation end

  let Ownerdetails =   await NewOwners.findOne({_id: mongoose.Types.ObjectId(ownerid)}).catch((error)=> console.log(error));
  console.log(Ownerdetails.IsActive,Ownerdetails.Status);

  if(Ownerdetails &&((Ownerdetails.IsActive == false))||(Ownerdetails &&((Ownerdetails.Status!=1)&&(Ownerdetails.Status!=null)))){

    return res.json({
      status: false,
      message: "User is not Active",
    });


  }
 

  let existEmail = await NewOwners.findOne({Email:Emailid}).catch((error)=> console.log(error))
  
  if(existEmail && existEmail._id !=ownerid){
    return res.json({
     status: false,
     message: "Owner Already Exist",
   });
  }
 
  


  
  if(req.body.Password!="")
  var userpass = await bcrypt.hash(req.body.Password,10).catch((error)=>{console.log(error)});
  else
  var userpass = Ownerdetails.Password;
 
 //console.log("PDD::"+OwnerDetails.Password);
 /* bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }*/

    NewOwners.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(ownerid) },
      {
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Home_Address: req.body.Home_Address,
        Email: req.body.Email,
        Password: userpass, //Added by chitra   on 13.04.2021
        DecryptPassword:req.body.DecryptPassword,
        Profile_Image: req.body.Profile_Image,
        Profile_ImageOriginalName: req.body.Profile_ImageOriginalName, //Added by chitra   on 20.04.2021
        Mobile: req.body.Mobile,
        Family_Name: req.body.Family_Name,
        Parking_Ability: req.body.Parking_Ability,
        Sailing_Ability: req.body.Sailing_Ability,
        Housekeeping: req.body.Housekeeping,
        Notes: req.body.Notes,
        Emergency_Contact_Name: req.body.Emergency_Contact_Name,
        Emergency_Contact_Mobile: req.body.Emergency_Contact_Mobile,
        Block: req.body.Block,
        IsActive: req.body.IsActive,
        Status: Module_status,
        Current_Time: req.body.Current_Time,
        Updated_time: moment(Date.now()),
      },
      { new: true },

      function (err, data) {
        if (err) {
          res.json({
            status: false,
            message: "AN ERROR OCCURED",
          });
        } else {

           const emailState =  'Successfully Updated.';
           const emailContent = `Dear ${req.body.First_Name}, <p>You are successfully updated your profile.</p>`;
           const emailDetailName = 'Profile Updated'
           const emailDetails = [
             { key: 'Owner Name', value: req.body.First_Name },
             { key: 'Password', value: req.body.Password },
           ];
           const emailNameAndLink = {
             name:'Login Link',
             link:`${process.env.CLIENT_URL}/owner-login`
           }
            var mailOptions = {
              from: "noreply.smartboatbooking@gmail.com",
              to: req.body.Email,
              subject: "LOGIN CREDENTIALS",
              html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
            };
            
            // text: 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            // '<a href="http://65.2.28.16/owner-login' + '">Verify your Account</a>\n\n' +
            // 'Password'+':' + unhashedPW +'\n' +
            // 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error,"mail error");
              }else {

                console.log("mail successfully send")

                res.json({
                  status: true,
                  info: "Successfully send",
                });
              }
            });

          const emailStateAdmin =  'Successfully Updated.';
           const emailContentAdmin = `Dear Administrator, <p>The Owner ${req.body.First_Name},  has been edited their profile information.</p>`;
           const emailDetailNameAdmin = 'Registration Details'
           const emailDetailsAdmin = [
             { key: 'Owner Name', value: req.body.First_Name },
             { key: 'Password', value: req.body.Password },
           ];
           const emailNameAndLinkAdmin = {
             name:'Login Link',
             link:`${process.env.CLIENT_URL}/owner-login`
           }

          var mailOptionsAdmin = {
            from: "noreply.smartboatbooking@gmail.com",
            to: "admin@smartboating.com.au",
            subject: "Owner Edited",
            html: getEmailTemplate(emailStateAdmin,emailContentAdmin,emailDetailNameAdmin,emailDetailsAdmin,emailNameAndLinkAdmin)
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
          res.json({
            status: true,
            message: "Owner Details Successfully Updated",
            data: req.body,
          });
        }
      }
    );
  //});
};
//Function for Delete  Owner//Done By chitra on 14.04.2021
const DeleteOwner = (req, res, next) => {
  const ownerid = req.body._id;
  var bool = new Boolean(false);
  var date = new Date().toLocaleDateString();
  console.log(date);

  NewOwners.findById({ _id: mongoose.Types.ObjectId(ownerid) }).then((results) => {
    var ownername = results.First_Name;
    var Address = results.Home_Address;
    var Email = results.Email;
    var Contact_no = results.Emergency_Contact_Name;

    Schedule.find({ User_Id: ownerid, IsActive: true }).then((Checkresult) => {
      console.log(Checkresult.length, "length");
      var _LengthCheck = Checkresult.length;
      if (_LengthCheck == 0) {
        NewOwners.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(ownerid) },
          {
            IsActive: bool,
            Updated_time: moment(Date.now()),
          },

          function (err, data) {
            if (err) {
              res.json({
                status: false,
                message: "AN ERROR OCCURED",
              });
            } else {
              ManageOwner.updateMany(
                { Owner_Id: mongoose.Types.ObjectId(ownerid) },
                {
                  IsActive: bool,
                  Update_time: moment(Date.now()),
                },
                { new: true },
                function (err, datas) {

                  if(err){

                    res.json({
                      status: false,
                      message: "AN ERROR OCCURED",
                    });

                  }else{

                    
                    Duration.findOneAndUpdate({Owner_Id: ownerid}, {$set:{'IsActive':false,'Update_Time':moment(Date.now())}}, {new: true}, (err, duration) => {});

                    

                  }
                }
              );
              //mail

           const emailState =  'Oops! Your Account has been Deleted..';
           const emailContent = `Dear Administrator, <p>The Owner ${ownername} has been successfully Deleted.</p>`;
           const emailDetailName = 'Delete Details'
           const emailDetails = [
             { key: 'Home Address', value: Address },
             { key: 'Email', value: Email },
             { key: 'Contact No', value: Contact_no },
           ];
           const emailNameAndLink = {
             name:'Owner Name',
             link:ownername
           }

          
              var mailOptionsAdmin = {
                from: "noreply.smartboatbooking@gmail.com",
                to: "admin@smartboating.com.au",
                subject: "Owner Deleted",
                html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)

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

              //mail

              res.json({
                status: true,
                message: "Owner Deleted Successfully",
              });
            }
          }
        );
      } else {
        res.json({
          status: false,
          message: "This Owner Has a Booking",
        });
      }
    });
  });
};
//Function for Enable/Disable Owner //Done By chitra on 19.04.2021
const EnableDisableOwner = (req, res, next) => {
  const ownerid = req.body._id;
  if (req.body.Status == "Enable") {
    var Module_status = 1;
    var isActive=true;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
    var isActive=true;
  }

  else if (req.body.Status == "Archieve") {
    var Module_status = 2;
    var isActive=true;
  }
  mongoose.set('debug', true);
  NewOwners.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(ownerid) },
    {
      Status: Module_status,IsActive:isActive
    },
    {new: true},
    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        res.json({
          status: true,
          message: "Owner Status Updated Successfully",
        });
      }
    }
  );
};
//Manage Owner Table View

const GetSeasonDetailsById = (req, res, next) => {
  boatid = req.body.boatid;
  Boats.find({ _id: mongoose.Types.ObjectId(boatid) })
    .then((response) => {
      shares.find({ Boat_Id: mongoose.Types.ObjectId(boatid) }).then((ShareResponse) => {
        res.json({
          Status: true,
          Data: response,
          ShareResponse,
        });
      });
    })
    .catch((error) => {
      res.json({
        Status: false,
      });
    });
};

//Function For FileUpload
const FileUploadSingle = (req, res, next) => {
  if(req.file == undefined){
    var filetypes = /jpeg|jpg|png/;
    res.json({
      status: false,
      message: "Error: File upload only supports the " + "following filetypes - " + filetypes,
    });

  }else{

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
const Fieldsize = 8 * 1024 * 1024;

var upload1 = multer({
  storage: storage,
  limits: { fileSize: maxSize, fieldSize: Fieldsize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
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
// add Duration
const AddDuration = async(req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);
  console.log(req.body);

  const D_start = new Date(req.body.From_Date);
  var DurationS_Start = moment(D_start).format("DD-MM-YYYY");
  const D_end = new Date(req.body.To_Date);
  var DurationE_End = moment(D_end).format("DD-MM-YYYY");

  let boatDetails = await Boats.findOne({_id:boat_id}).catch((error)=> console.log(error));

  console.log(boat_id)

  if(!boatDetails) return res.json({status:true,message:"Boat doesn't exist"})

  //add one year to launch date and save

  let launcDateConverted = `${String(new Date(boatDetails.Launch_Date).getUTCDate()).padStart(2, '0')}-${String(new Date(boatDetails.Launch_Date).getUTCMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`
  
  //check if it is feb 29 if feb 29 set it to 28
  if(`${String(new Date(boatDetails.Launch_Date).getUTCDate()).padStart(2, '0')}-${String(new Date(boatDetails.Launch_Date).getUTCMonth() + 1).padStart(2, '0')}` == '29-02'){

    launcDateConverted = `28-02-${new Date().getFullYear()}`
  }
 

  console.log(launcDateConverted,"launcDateConverted")
  
let launchDateFormatted = new Date(moment(launcDateConverted,"DD-MM-YYYY"))


launchDateFormatted = new Date(launchDateFormatted.setDate(launchDateFormatted.getDate() + 1))

 
  let launchDate = launchDateFormatted.setFullYear( launchDateFormatted.getFullYear() + 1)
  

  
   let durationStartYear = parseInt(moment(D_start).format("YYYY"));
   if(D_start .getTime() < D_end.getTime())
   {
  Duration.find({ Boat_Id: boat_id, IsActive: true, Owner_Id: owner_id }, (err, response) => {
    //  boatmodel.findOne({"Boat_Number" : {$regex :BoatNumber}}, (err, response)=>{
    console.log(response.length, "length");
    var Len = response.length;

    if (Len == 0) {
      let Add_Duration = new Duration({
        Owner_Id: owner_id,
        Owner_Name: req.body.Owner_Name,
        Boat_Id: boat_id,
        Boat_Name: req.body.Boat_Name,
        Boat_Type: req.body.Boat_Type,
        From_Date: req.body.From_Date,
        Duration_SDate: DurationS_Start,
        Duration_EDate: DurationE_End,
        To_Date: req.body.To_Date,
        Block: req.body.Block,
        IsActive: true,
        Current_Time: moment(Date.now()),
        Update_Time: moment(Date.now()),
        lastResetedAnniversary: launchDate,
      });

      Add_Duration.save()
        .then((response) => {
          res.json({
            status: true,
            message: "Ownership Duration Successfully Added",
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: error,
          });
        });
    } else {
      res.json({
        status: true,
        message: "Duration For this Boat is Already Assigned..",
      });
    }
  });
}
else
{
  res.json({
    status:true,
    message: 'Duration StartDate Must be  Greater than Duration EndDate'
})
}
};

// Function for EditDuration//Done by  chitra on 15.04.2021
const EditDuration = (req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);

  const D_start = new Date(req.body.From_Date);
  var DurationS_Start = moment(D_start).format("DD-MM-YYYY");
  //var DurationS_Start=moment(D_start, "DD-MM-YYYY");
  //var DS_start = DurationS_Start.add(1, 'days').format('DD-MM-YYYY');
  const D_end = new Date(req.body.To_Date);

  var DurationE_End = moment(D_end).format("DD-MM-YYYY");
  // var DurationE_End=moment(D_end, "DD-MM-YYYY");
  // var DE_start = DurationE_End.add(1, 'days').format('DD-MM-YYYY');
  const durationid = req.body._id;
  if(D_start .getTime() < D_end.getTime())
   {
  Duration.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(durationid) },
    {
      Owner_Id: owner_id,
      Owner_Name: req.body.Owner_Name,
      Boat_Id: boat_id,
      Boat_Type: req.body.Boat_Type,
      Boat_Name: req.body.Boat_Name,
      From_Date: req.body.From_Date,
      Duration_SDate: DurationS_Start,
      Duration_EDate: DurationE_End,
      To_Date: req.body.To_Date,
      Block: req.body.Block,
      IsActive: true,
      Current_Time: moment(Date.now()),
      Update_Time: moment(Date.now()),
    },

    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: "AN ERROR OCCURED",
        });
      } else {
        Duration.findById({ _id: mongoose.Types.ObjectId(durationid) }).then((durationDetails) => {
          var date = durationDetails.Current_Time;

          Boats.findById({ _id: mongoose.Types.ObjectId(boat_id) }).then((boatDetails) => {
            var BoatName = boatDetails.Boat_Name;
            NewOwners.findById({ _id: mongoose.Types.ObjectId(owner_id) }).then((ownerDetails) => {
              var OwnerName = ownerDetails.First_Name;
              var Email_id = ownerDetails.Email;

              const emailState =  'Successfully Updated.';
              const emailContent = `Dear ${OwnerName},<p> OwnerShip on ${BoatName} on ${date} has been successfully Updated Ownership Duration.</p>`;
              const emailDetailName = 'Duration Details'
              const emailDetails = [
                { key: 'Owner Name', value: OwnerName },
                { key: 'Boat', value: BoatName },
                { key: 'Duration Date', value: date },
              ];
              const emailNameAndLink = {
                name:'Updation Link',
                link:`${process.env.CLIENT_URL}/owner-duration`
              }

              var mailOptions = {
                from: "noreply.smartboatbooking@gmail.com",
                to: Email_id,
                subject: "Ownership Duration Updation",
                html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  res.json({
                    status: true,
                    info: "Successfully send",
                  });
                }
              });

              const emailContentAdmin = `Dear Administrator, <p>OwnerShip on ${BoatName} on ${date} has been successfully Updated Ownership Duration.</p>`;
              var mailOptionsAdmin = {
                from: "noreply.smartboatbooking@gmail.com",
                to: Email_id,
                subject: "Ownership Duration Updation",
                html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
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
          });
        });

        res.json({
          status: true,
          message: "Ownership Duration Successfully Updated",
        });
      }
    }
  );
   }
   else
   {
    res.json({
      status:true,
      message: 'Duration StartDate Must be  Greater than Duration EndDate'
  })
    
   }
};

//Function for Delete Duration //Done by  chitra on 15.04.2021
const DeleteDuration = (req, res, next) => {
  const durationid = req.body._id;
  var bool = new Boolean(false);
  Duration.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(durationid) },
    {
      IsActive: bool,
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
          message: "Duration Deleted Successfully",
        });
      }
    }
  );
};
// populate DropDown
const GetOwners = (req, res, next) => {
  
  NewOwners.find({ IsActive: true })
    .select({ _id: 1, First_Name: 1, Last_Name: 1 })
    .sort({First_Name:1}) //Added by chitra on 13.04.2021
    .then((response) => {
      res.send({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};
const GetBoats = (req, res, next) => {
  Boats.find({ IsActive: true, Boat_Status: "1" }).sort({Boat_Name:1})
    .select({ _id: 1, Boat_Name: 1, Boattype_Name: 1 })
    .then((response) => {
      res.send({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

//Share Allocation
const AddShare_Allocation = (req, res, next) => {
  let Add_Share = new Share({
    Owner_Name: req.body.Owner_Name,
    Boat_name: req.body.Boat_name,
    Boat_Type: req.body.Boat_Type,
    SharePercentage: req.body.SharePercentage,
    To_Date: req.body.To_Date,
    Block: req.body.Block,
    IsActive: req.body.IsActive,
    Current_Time: req.body.Current_Time,
    Updated_time: req.body.Updated_time,
  });
  Add_Share.save()
    .then((response) => {
      res.json({
        status: true,
        message: "AddShare Added Successfully",
      });
    })
    .catch((error) => {
      res.json({
        status: false,
        message: "invalid",
      });
    });
};

//Manage Owners
const GetBoatDetailsById = (req, res, next) => {
  let userid = req.body.userid;
  Duration.findById(userid)
    .select({ Boat_Type: 1, Boat_Name: 1, _id: 0 })
    .then((response) => {
      //block

      let x = response.Boat_Name;
      console.log(x);
      Boats.find({ Boat_Name: { $regex: ".*" + x + ".*" } })
        .select({ Owners_Allowed: 1, _id: 0 })
        .then((result) => {
          const RESULTS = Object.assign({}, result, response);
          var boats = RESULTS._doc;
          var ownerallowed = RESULTS[0];

          res.send({
            Result: [(status = true), (Owners_Allowed = ownerallowed), (Boat_Details = boats)],
          });
        })

        .catch((error) => {
          res.json({
            status: false,
            message: "AN ERROR OCCURED",
          });
        });
      //block
    })

    .catch((error) => {
      res.json({
        status: false,
        message: "AN ERROR OCCURED",
      });
    });
};
//Add Mange Owner

const AddMangeOwner = (req, res, next) => {
  console.log(req.body);
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);
  console.log(req.body.Boat_Id)
  //   Boats.findByIdAndUpdate({_id:mongoose.Types.ObjectId(boat_id)},{new: true, useFindAndModify: false},
  //     {
  //     Owner_Name:req.body.Owner_Name,
  //     },
  //     function(err, data) {

  //         console.log(data.Owner_Name)

  //     });
  ManageOwner.findOne({ Boat_Id:boat_id,Owner_Id:owner_id,IsActive: true }).then((result2) => {
    if (result2 == null) {
    
      console.log(boat_id)

  Boats.findById({ _id: mongoose.Types.ObjectId(boat_id) }).then((response) => {

  

    console.log(response.Owners_Allowed);
    Owners_Allowed = response.Owners_Allowed;
    console.log(Owners_Allowed, "owners");

    NewOwners.findById({ _id: mongoose.Types.ObjectId(owner_id) }).then((results) => {
      ManageOwner.count({ Boat_Id: boat_id }, function (err, count) {
        console.log("Number of users:", count);

        if (count < Owners_Allowed) {
          let AddMange_Owner = new ManageOwner({
            Boat_Id: boat_id,
            Owner_Name: req.body.Owner_Name,
            Boat_Name: req.body.Boat_Name,
            Boat_Type: req.body.Boat_Type,
            Home_Address: results.Home_Address,
            First_Name: results.First_Name,
            Last_Name: results.Last_Name,
            Mobile: results.Mobile,
            Family_Name: results.Family_Name,
            Email: results.Email,
            Owners_Allowed: response.Owners_Allowed,
            Parking_Ability: results.Parking_Ability,
            Summer_WeekDays: req.body.No_of_SummerWeekDays,
            Summer_WeekEndDays: req.body.No_of_SummerWeekEndDays,
            Winter_WeekDays: req.body.No_of_WinterWeekDays,
            Winter_WeekEndDays: req.body.No_of_WinterWeekEndDays,
            Sailing_Ability: results.Sailing_Ability,
            Profile_Image: results.Profile_Image,
            Profile_ImageOriginalName: results.Profile_ImageOriginalName,
            ShareAllocation: req.body.ShareAllocation,
            No_PartialCancellation:5,
            Block: req.body.Block,
            IsActive: true,
            Current_Time: moment(Date.now()),
            Update_Time: moment(Date.now()),
            Owner_Id: owner_id,
          });

          AddMange_Owner.save()
            .then((response) => {
              //mail

              const emailState =  'Boat Allocation.';
              const emailContent = `Dear Administrator, <p>The Owner ${req.body.Owner_Name} has been successfully assigned to ${req.body.Boat_Name}.</p>`;
              const emailDetailName = 'Allocation Details'
              const emailDetails = [
                { key: 'Owner Name', value: req.body.Owner_Name },
                { key: 'Boat', value: req.body.Boat_Name },
                
              ];
              const emailNameAndLink = {
                name:'Updation Link',
                link:`${process.env.CLIENT_URL}`
              }

              var mailOptionsAdmin = {
                from: "noreply.smartboatbooking@gmail.com",
                to: "admin@smartboating.com.au",
                subject: "Boat Allocation",
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

              //mail

              res.json({
                status: true,
                message: "Owner Day Allocation Added Successfully",
              });
            })

            .catch((error) => {
              res.json({
                status: false,
                message: "invalid",
              });
            });
        } else {
          res.json({
            status: false,
            message: "Allowed Owner Exceeds Limit",
          });
        }
      });
    });
  });
}
else
{
  res.json({
    status: true,
    message: "Allocation Already Exist",
  });
}
})

};

//View
const ViewAllOwners = (req, res, next) => {
 
  NewOwners.find({IsActive:true})
    .sort({First_Name: 1})
    .then((response) => {    

      response = response.map((owner)=>{
       
           owner.Password = ''
          //owner.Notes = ''
          return owner
      })

      

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
const DeleteOwnersById = (req, res, next) => {
  ownerid = req.body.ownerid;
  console.log(ownerid);
  NewOwners.findByIdAndDelete(ownerid)
    .then((response) => {
      res.json({
        Status: true,
        message: "Deleted Succesfully",
      });
    })
    .catch((error) => {
      res.json({
        Status: false,
      });
    });
};

//Manage Owner Table  Details //Done by  chitra on 03.04.2021
const GetAllOwnerDetails = (req, res, next) => {
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      { $sort: { _id: -1 } },
      {
        $match: { IsActive: true },
      },

      {
        $project: {
          Owner_Name: 1,
          ShareAllocation: 1,
          Boat_Name: 1,
          Family_Name: 1,
          Mobile: 1,
          Email: 1,
          Profile_Image: 1,
          Profile_ImageOriginalName: 1,
          Home_Address: 1,
          Parking_Ability: 1,
          Sailing_Ability: 1,
          First_Name: 1,
          Last_Name: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
          Owner_Id: 1,
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          "BoatDetails.Total_Days": 1,
          "BoatDetails._id": 1,
          "BoatDetails.Owners_Allowed": 1,
        },
      },
    ])
    .exec(function (err, response) {
      mongoose
        .model("Tb_OwnerBookingDays")
        .aggregate([
          {
            $lookup: {
              from: "tb_boatmasters",
              localField: "Boat_Id",
              foreignField: "_id",
              as: "BoatDetails",
            },
          },
          { $sort: { _id: -1 } },
          {
            $project: {
              Summer_WeekDays: 1,
              Summer_WeekEndDays: 1,
              Winter_WeekDays: 1,
              Winter_WeekEndDays: 1,
              Boat_Id: 1,
              Owner_Id: 1,
            },
          },
        ])
        .exec(function (err, BookedDays) {
          console.log(response);
          res.json({
            status: true,
            response,
            BookedDays,
          });
        });
    });
};
// Function for Edit BoatDetails

const UpdateOwnerById = (req, res, next) => {
  const ownerid = req.body.ownerid;
  //Added these lines by chitra for encrypting password on 13.04.2021
  bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    NewOwners.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(ownerid) },
      {
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Home_Address: req.body.Home_Address,
        Email: req.body.Email,
        Password: hashedPass, //Added by chitra   on 13.04.2021
        Mobile: req.body.Mobile,
        Family_Name: req.body.Family_Name,
        Parking_Ability: req.body.Parking_Ability,
        Block: req.body.Block,
        IsActive: req.body.IsActive,
        Current_Time: req.body.Current_Time,
        Updated_time: req.body.Updated_time,
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
            message: "Owner Details Updated Successfully",
          });
        }
      }
    );
  });
};
//Get Owners By Boat_Id
const GetOwnerDetailsByBoatId = async(req, res, next) => {
  boatid = req.body.boatid;
  const response = await ManageOwner.aggregate([
    {
      $match:{Boat_Id:mongoose.Types.ObjectId(boatid),IsActive:true}
    },
    {
      $lookup:{
        from: "tb_addowners",
         localField: "Owner_Id",    
         foreignField: "_id",  
         as: "ownerDetails"
      }
    },
    { "$unwind": "$ownerDetails" },
    { "$addFields": { "Housekeeping": "$ownerDetails.Housekeeping", Emergency_Contact_Name:"$ownerDetails.Emergency_Contact_Name",Emergency_Contact_Mobile:"$ownerDetails.Emergency_Contact_Mobile"} },
    {
      $project:{
        ownerDetails:0,
        __v:0
      }
    }
   
  ]).catch((error)=> console.log(error))

    await No_OfCleans.find()
      .select({Owner_Id: 1,Boat_Id: 1,Cleans:1,_id: 0 })
      .then((No_OfCleans) => {
        No_OfCleans_jsonObjects = No_OfCleans.map(JSON.stringify);
      
        No_OfCleans_jsonObjects_uniqueSets = new Set(No_OfCleans_jsonObjects);
        CleaningDays= Array.from(No_OfCleans_jsonObjects_uniqueSets).map(JSON.parse);
      //no of cleans

      //data from addowner

      

      res.json({
        Status: true,
        Data: response,CleaningDays,
      });
    })

   
};
//Manage Owner Table View Details //Done by  chitra on 03.04.2021
const GetAllOwnerDetailsTableView = (req, res, next) => {
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      {
        $match: { IsActive: true },
      },

      {
        $project: {
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          Owner_Name: 1,
          ShareAllocation: 1,
          Boat_Name: 1,
          Owners_Allowed: 1,
          Boat_Id: 1,
          Owner_Id: 1,
          Boat_Type: 1,
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

//manage owner delete
const DeleteManageOwnersById = (req, res, next) => {
  const tableid = req.body.id;
  ManageOwner.findByIdAndDelete(tableid)
    .then((response) => {

      Duration.findOneAndUpdate({Owner_Id:response.Owner_Id,Boat_Id:response.Boat_Id},{IsActive:false}).then((upadetedDuration)=>{
        res.json({
          Status: true,
          message: "Deleted Succesfully",
        });

      }).catch((error) => {
        res.json({
          Status: false,
        });
      });

     
    })
    .catch((error) => {
      res.json({
        Status: false,
      });
    });
};

//edit manage owner
const UpdateManageOwnerById = (req, res, next) => {
  const tableid = req.body.id;
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);

 
  //Data Validation

  const ownerValidation = validatemanageOwner(req.body);

  if (ownerValidation.error) {
    let message = ownerValidation.error.details[0].message.replace(/"/g, "");
    return res.json({ status: false, message });
  }
 

  //Validation end

  
  Boats.findById({ _id: mongoose.Types.ObjectId(boat_id) }).then((response) => {
    console.log(response.Owners_Allowed);
    Owners_Allowed = response.Owners_Allowed;
    console.log(Owners_Allowed, "owners");

    NewOwners.findById({ _id: mongoose.Types.ObjectId(owner_id) }).then((results) => {
      ManageOwner.count({ Boat_Id: boat_id }, function (err, count) {
        console.log("Number of users:", count);

        // if(count<Owners_Allowed)
        // {
        ManageOwner.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(tableid) },
          {
            Boat_Id: boat_id,
            Owner_Name: req.body.Owner_Name,
            Boat_Name: req.body.Boat_Name,
           // Boat_Type: response.Boat_Type,
            Summer_WeekDays: req.body.No_of_SummerWeekDays,
            Summer_WeekEndDays: req.body.No_of_SummerWeekEndDays,
            Winter_WeekDays: req.body.No_of_WinterWeekDays,
            Winter_WeekEndDays: req.body.No_of_WinterWeekEndDays,
           // ShareAllocation: req.body.ShareAllocation,
            Owners_Allowed: req.body.Owners_Allowed,
            No_PartialCancellation:5,
            IsActive: true,
            Current_Time: moment(Date.now()),
            Update_Time: moment(Date.now()),
            Owner_Id: owner_id,
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
                message: "Owner Day Allocation Successfully Updated",
              });
            }
          }
        );

        // }
        // else {
        //     res.json({
        //         status:false,
        //         message: 'Allowed Owner Exceeds Limit'
        //     })
        // }
      });
    });
  });
};
//Manage Owner Table View Details //Done by chitra on 09.04.2021
const GetOwnerDetailsOneByOne = (req, res, next) => {
  const BoatId = mongoose.Types.ObjectId(req.body.boat_id);
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      {
        $match: { Boat_Id: BoatId },
      },

      {
        $project: {
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          Owner_Name: 1,
          ShareAllocation: 1,
          Boat_Name: 1,
          Owners_Allowed: 1,
          Boat_Id: 1,
          Owner_Id: 1,
          Boat_Type: 1,
          Profile_Image: 1,
          Profile_ImageOriginalName: 1,
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

//Function for Show BoatDetails using Particular Owner
//   const GetBoatDetailsByOwner = (req, res, next) => {
//     const ownerid = mongoose.Types.ObjectId(req.body._id);
//     mongoose.model('Tb_ManageOwner').aggregate(
//         [
//     //     {
//     //     "$lookup":{
//     //     "from":"tb_manageowners",
//     //     "localField": "Owner_Id",
//     //     "foreignField": "Owner_Id",
//     //     "as": "OwnerDetails"
//     //     }
//     //    },
//        {
//        "$lookup":{
//         "from":"tb_addowners",
//         "localField": "Owner_Id",
//         "foreignField": "_id",
//         "as": "OwnerDetails"
//         }
//        },
//     {
//         "$match": { Owner_Id: ownerid }
//     },

//     {
//     $project:{"OwnerDetails.First_Name":1,"OwnerDetails.Last_Name":1,
//     "OwnerDetails.Home_Address":1,"OwnerDetails.Email":1,
//     "OwnerDetails.Mobile":1,
//     "OwnerDetails.Family_Name":1,"OwnerDetails.Parking_Ability":1,
//       Boat_Name: 1,

//             Boat_Facility:1,
//             Boat_Description:1,
//             Owners_Allowed: 1,
//             Launch_Date: 1,
//             PreLaunch_Date:1,
//             Boat_Image: 1,
//             Boat_HandBook:1,
//             Boat_Status:1,
//             Total_Days:1,
//             Summer_WeekDays:1,
//             Summer_WeekEndDays:1,
//             Winter_WeekDays:1,
//             Winter_WeekEndDays:1

//     }
//     }
//     ]
//     ).exec(function(err, response){
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

// Function for Owner login // Done By chitra on 19.04.2021
const OwnerLogin = (req, res, next) => {
  var username = req.body.Email;
  var password = req.body.Password;

  NewOwners.findOne({
    $or: [
      { Email: username, IsActive: true },
      { Email: username, IsActive: true },
    ],
  }).then((user) => {
    if (user != null) {
      if (user.IsActive == true) {
        try {
          bcrypt.compare(password, user.Password, function (err, result) {
            if (err) {
              res.json({
                error: err,
              });
            }

            if (result) {
              //if(user.Status==1 || user.Status==null){

                let token = jwt.sign({ name: user.Email }, "verySecretValue", { expiresIn: "1h" });
                res.json({
                  status: true,
                  message: " Login Successfully",
                  data: user,
                  token,
                });

             /* }else{

                res.json({
                  status: false,
                  message: "User is not Active",
                });
              }*/
             
            } else {
              res.json({
                status: false,
                message: "Password does not match our records. Please try again",
              });
            }
          });
        } catch (error) {
          res.json({
            status: false,
            message: "No User Found",
          });
        }
      } else {
        res.json({
          status: false,
          message: "User Is Not Active..Please Contact Admin",
        });
      }
    } else {
      res.json({
        status: false,
        message: "No User Found",
      });
    }
  });
};
//forget password

const ForgotPasswordOwner = (req, res, next) => {
  var Emailid = req.body.Email;
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, (err, buf) => {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        //{"Email":{$regex :Emailid},IsActive:true}
        NewOwners.findOne({ Email: { $regex: Emailid }, IsActive: true }, (err, user) => {
          if (!user) {
            res.json({
              status: false,
              info: "No User Found",
            });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          
          user.save((err) => {
          
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
       
        const emailState =  'Successfully Registered.';
        const emailContent = `This is a confirmation that the password for your account ${user.Email} has just been changed.`;
        //const emailContent = `A password reset email has been sent to your account. Please follow the instructions to continue resetting your password. If you do not receive it then check your spam filter.`;
        const emailDetailName = 'Registration Details'
        const emailDetails = [
          { key: 'Your password reset Token', value: token  },
        ];
        const emailNameAndLink = {
          name:'Login Link',
          link:`${process.env.CLIENT_URL}/reset-password-owner`
        }

        var mailOptions = {
          from: "noreply.smartboatbooking@gmail.com",
          to: user.Email,
          subject: "SmartBoating",
          html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.json({
              status: true,
              info: "A password reset email has been sent to your account. Please follow the instructions to continue resetting your password. If you do not receive it then check your spam folder",
            });
          }
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      else {
        res.json({
          message: "Error",
        });
      }
    }
  );
};

//reset Password
const ChangePassword = function (req, res) {
  bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    async.waterfall(
      [
        function (done) {
          NewOwners.findOne(
            {
              resetPasswordToken: req.body.resetPasswordToken,
              // resetPasswordExpires: { $gt: Date.now()
              // }
            },
            function (err, user, next) {
              if (!user) {
                res.json({
                  Status: false,
                  message: "Invalid Token",
                });
              }
           
              user.Password = hashedPass; /*req.body.Password;*/ /*bcrypt.hash(req.body.Password, 10)*/
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save((err) => {
                done(err, user);
              });
            }
          );
        },

        function (user, done) {
          
        const emailState =  'Password Changed Successfully.';
          const emailContent = `This is a confirmation that the password for your account ${user.Email} has just been changed.`;
          const emailDetailName = 'Registration Details'
          const emailDetails = [
            { key: 'Email', value:  user.Email },
           
          ];
          const emailNameAndLink = {
            name:'Login Link',
            link:`${process.env.CLIENT_URL}/owner-login`
          }

         
          var mailOptions = {
            to: user.Email,
            from: "noreply.smartboatbooking@gmail.com",
            subject: "Your password has been changed",
            html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
          };
          transporter.sendMail(mailOptions, function (err) {
            // req.flash('success', 'Success! Your password has been changed.');
            // done(err);
            res.json({
              Status: true,
              message: "Successfully send",
            });
          });
        },
      ],
      function (err) {
        res.json({
          message: err,
        });
      }
    );
  });
};
//Get BoatDetails By Ownerid //Done by chitra on 17.05.2021
const GetBoatDetailsByOwner = (req, res, next) => {
  const OwnerId = mongoose.Types.ObjectId(req.body.owner_id);
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },

   

      {
        $lookup:
           {
             from: "tb_boatcleans",
             let: { ownerId: "$_id",boatId:"$Boat_Id" },
             pipeline: [
                { $match:
                   { $expr:
                      { $and:
                         [
                           { $eq: [ "$Owner_Id",  "$$ownerId" ] },
                           { $eq: [ "$Boat_Id",  "$$boatId" ] }

                         ]
                      }
                   }
                   
                },
            
               

                
               
             ],

             
             
            
             
             
             as: "cleans",
             
           },
           
           
      },

      {
        $match: { $and: [{ IsActive: true, Owner_Id: OwnerId }] },
      },

      {
        $project: {
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          "BoatDetails.Location_Name": 1,
          "BoatDetails.Boattype_Name": 1,
          "BoatDetails.Location_Id": 1,
          "BoatDetails.Boattype_id": 1,
          "BoatDetails.Boat_Image": 1,
          "BoatDetails.IsActive": 1,
          "BoatDetails.Boat_Status": 1,
          ShareAllocation: 1,
          Boat_Name: 1,
          Owners_Allowed: 1,
          Boat_Id: 1,
          Boat_Type: 1,
          Profile_Image: 1,
          Profile_ImageOriginalName: 1,
          Block:1,
          "BoatDetails.cleans.Cleans":1,
          "cleans":{
            Cleans:1,
            IsActive:1
            
          }
        },
      },
    ])
    .exec(function (err, response) {

    
      
      for (const owner of response) {
         
          let totalCleans = 0;
          for (const cleans of owner.cleans) {
            totalCleans += cleans.Cleans;
          }

          owner.totalCleans = totalCleans;

        
          delete owner.cleans
      
        }

      
      res.json({
        status: true,
        response,
      });
    });
};

//list api from Boat,ManageOwner

const GetAllOwnerssWithBoatDetails = async(req, res, next) => {
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },

      {
        $lookup: {
          from: "tb_addowners",
          localField: "Owner_Id",
          foreignField: "_id",
          as: "OwnerDetails",
        },
      },
      { $sort: { _id: -1 } },
      {
        $match: { IsActive: true },
      },
      {
        $project: {
          Owner_Id: 1,
          _id: 0,
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          "BoatDetails.Total_Days": 1,
          "BoatDetails._id": 1,
          "BoatDetails.Boat_Name": 1,
          "BoatDetails.IsActive": 1,
          //ownerDetails
          "OwnerDetails.First_Name": 1,
          "OwnerDetails.Last_Name": 1,
          "OwnerDetails.Home_Address": 1,
          "OwnerDetails.Email": 1,
          "OwnerDetails.Parking_Ability": 1,
          "OwnerDetails.Profile_Image": 1,
          "OwnerDetails.Family_Name": 1,
          "OwnerDetails.ShareAllocation": 1,
          "OwnerDetails.Mobile": 1,
          "OwnerDetails.Profile_ImageOriginalName": 1,
          "OwnerDetails.IsActive": 1,
          "OwnerDetails.Notes":1
        },
      },
    ])
    .exec(function (err, response) {
      // var response = responses.map(function(el){
      //     el.BoatDetails = el.BoatDetails.filter(function(x){ return x.IsActive ==true; });
      //     return el;
      // });
      jsonObject = response.map(JSON.stringify);

      uniqueSet = new Set(jsonObject);
      uniqueArray = Array.from(uniqueSet).map(JSON.parse);
      const result = uniqueArray.reduce((acc, { Owner_Id, BoatDetails, OwnerDetails }) => {
        const existing = acc.find((i) => i.Owner_Id === Owner_Id);
        if (existing) {
          existing.BoatDetails.push(BoatDetails);
        } else {
          acc.push({ Owner_Id, OwnerDetails, BoatDetails: [BoatDetails] });
        }

        return acc;
      }, []);

      console.log(result);

      ManageOwner.find()
        .select({ Owner_Id: 1, Boat_Id: 1, Summer_WeekDays: 1, Summer_WeekEndDays: 1, Winter_WeekDays: 1, Winter_WeekEndDays: 1, _id: 0 })
        .then((AllocatedDays) => {
          jsonObjects = AllocatedDays.map(JSON.stringify);

          uniqueSets = new Set(jsonObjects);
          OwnerAllocatedDays = Array.from(uniqueSets).map(JSON.parse);

          OwnerBooking_Days.find()
            .select({ Owner_Id: 1, Boat_Id: 1, Summer_WeekDays: 1, Summer_WeekEndDays: 1, Winter_WeekDays: 1, Winter_WeekEndDays: 1, _id: 0 })
            .then((BookedDays) => {
              BookedDays.push.Trial=1;
              Book_jsonObjects = BookedDays.map(JSON.stringify);

              Book_uniqueSets = new Set(Book_jsonObjects);
              OwnerBookedDaysDays = Array.from(Book_uniqueSets).map(JSON.parse);
//no of cleans

No_OfCleans.find()
.select({Owner_Id: 1,Boat_Id: 1,Cleans:1,_id: 0 })
.then((No_OfCleans) => {
  No_OfCleans_jsonObjects = No_OfCleans.map(JSON.stringify);

  No_OfCleans_jsonObjects_uniqueSets = new Set(No_OfCleans_jsonObjects);
  CleaningDays= Array.from(No_OfCleans_jsonObjects_uniqueSets).map(JSON.parse);

  TotalNoCancellations.find({Cancellationyear:parseInt( new Date().getFullYear())}).select({Owner_Id: 1,Boat_Id: 1,No_Cancellation:1}).then((PartialResult)=>{

    PartialResult_jsonObjects = PartialResult.map(JSON.stringify);

    PartialResult_jsonObjects_uniqueSets = new Set(PartialResult_jsonObjects);
    PartialDaysCount= Array.from(PartialResult_jsonObjects_uniqueSets).map(JSON.parse);

    res.json({
      status: true,
      result,
      OwnerAllocatedDays,
      OwnerBookedDaysDays,
      CleaningDays,
      PartialDaysCount,
       
    });

   })


  
//no of cleans
            
            });
          });
        });
    });
};

//Manage Owner Table  Details //Done by  jibin 5/25
const GetBoatNameByOwnerId = (req, res, next) => {
  const OwnerId = mongoose.Types.ObjectId(req.body.owner_id);
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      {
        $match: { $and: [{ IsActive: true, Owner_Id: OwnerId }] },
      },
      //    {
      //     "$match": { Owner_Id: OwnerId }
      // }, 
      { $sort: { Boat_Name:1} },

      {
        $project: { _id: 0, "BoatDetails.Boat_Name": 1, "BoatDetails.Boattype_Name": 1, "BoatDetails._id": 1, "BoatDetails.IsActive": 1 },
      },
    ])
    .exec(function (err, results) {
      jsonObject = results.map(JSON.stringify);

      uniqueSet = new Set(jsonObject);
      response = Array.from(uniqueSet).map(JSON.parse);
      // var response = responses.map(function(el){
      //     el.BoatDetails = el.BoatDetails.filter(function(x){ return x.IsActive ==true; });
      //     return el;
      // });

      res.json({
        status: true,
        response,
      });
    });
};

// list Duration

//View
const ListAllDuration = (req, res, next) => {
 
  Duration.find({ IsActive: true })
    .sort({Boat_Name:1})
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

//Get Details From Manage Owner
const GetAllOwnerDetails_FromManageOwner = (req, res, next) => {
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      { $sort: { _id: -1 } },
      {
        $match: { IsActive: true },
      },
      {
        $project: {
          Owner_Name: 1,
          ShareAllocation: 1,
          Boat_Name: 1,
          Family_Name: 1,
          Mobile: 1,
          Email: 1,
          Profile_Image: 1,
          Profile_ImageOriginalName: 1,
          Home_Address: 1,
          Parking_Ability: 1,
          Sailing_Ability: 1,
          First_Name: 1,
          Last_Name: 1,
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,

          "BoatDetails._id": 1,
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
//get count of BookedDays
const GetTotalDaysAssigned = (req, res, next) => {
  var arr = [];
  var mysort = { _id: -1 };
  const boatid = req.body.Boat_id;
  ManageOwner.find({ Boat_Id: boatid })
    .sort(mysort)
    .select({ Summer_WeekDays: 1, Summer_WeekEndDays: 1, Winter_WeekDays: 1, Winter_WeekEndDays: 1, _id: 0 })
    .then((response) => {
      totalSummerDays = 0;
      totalWinterDays = 0;
      totalSummerEndDays = 0;
      totalWinterEndDays = 0;
      var i;
      for (i = 0; i < response.length; i++) {
        //loop through the array

        totalSummerDays += response[i].Summer_WeekDays;
        totalSummerEndDays += response[i].Summer_WeekEndDays;
        totalWinterDays += response[i].Winter_WeekDays;
        totalWinterEndDays += response[i].Winter_WeekEndDays;
      }

      arr.push({ Summer_WeekDays: totalSummerDays }, { Summer_WeekEndDays: totalSummerEndDays }, { Winter_WeekDays: totalWinterDays }, { Winter_WeekEndDays: totalWinterEndDays });
      res.json({
        Response: arr,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Transfer Ownership

const OwnershipTransfer = async(req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);
  const new_owner_id = mongoose.Types.ObjectId(req.body.New_Owner_Id);

 let valid =await TransferValidations(boat_id,owner_id,new_owner_id,req.body.New_Owner_Name);
   if(valid.status == false)
   return res.json({status:false,message:valid.message});
   
  let newOwner = await NewOwners.findById({_id:new_owner_id}).catch((error) => console.log(error));
  let getmangerowner = await ManageOwner.findOne({Boat_Id:boat_id,Owner_Id:owner_id}).catch((error) => console.log(error));
  let getduration = await Duration.findOne({Boat_Id:boat_id,Owner_Id:owner_id}).catch((error) => console.log(error));

   const D_start = new Date(req.body.From_Date);
  var DurationS_Start = moment(D_start).format("DD-MM-YYYY");
  const D_end = new Date(req.body.To_Date);
  var DurationE_End = moment(D_end).format("DD-MM-YYYY");
  
  /* update duration enddate of old owner*/

  const condition = { Owner_Id: owner_id,Boat_Id:boat_id };

  const update = { Duration_EDate: DurationS_Start,To_Date:req.body.From_Date,IsActive:false};

  //const update1 = { Duration_EDate: oldownerduration,To_Date:curntDate,IsActive:false};

  //const update1 = {IsActive:false};

  let updateduration = await Duration.findOneAndUpdate(condition,update).catch((error) => console.log(error));

  //let updateOwner = await ManageOwner.findOneAndUpdate(condition,update1).catch((error) => console.log(error));

  /* add ownership */
  let newnameOwner = req.body.New_Owner_Name.split(" ");
  let Add_Duration = new Duration({
    Owner_Id: new_owner_id,
    Owner_Name: newnameOwner[0],
    Boat_Id: boat_id,
    Boat_Name: getduration.Boat_Name,
    Boat_Type:getduration.Boat_Type,
    From_Date: req.body.From_Date,
    Duration_SDate: DurationS_Start,
    Duration_EDate: DurationE_End,
    To_Date: req.body.To_Date,
    Block: true,
    IsActive: true,
    Current_Time: moment(Date.now()),
    Update_Time: moment(Date.now()),
    lastResetedAnniversary: getduration.lastResetedAnniversary,
  });

  Add_Duration.save();

  /* save Transfer */

  let savetransfer = new Tranferownership({
    from_ownerid:req.body.Owner_Id,
    to_ownerid:req.body.New_Owner_Id,
    from_owner:getmangerowner.First_Name+" "+getmangerowner.Last_Name,
    to_owner:newOwner.First_Name+" "+newOwner.Last_Name,
    boat_Name:getmangerowner.Boat_Name,
    boat_type:getmangerowner.Boat_Type,
    boat_Id:req.body.Boat_Id,
    start_date:req.body.From_Date,
    end_date:req.body.To_Date,
    expire_current_owner:getduration.To_Date,
    Summer_WeekDays: req.body.No_of_SummerWeekDays,
   Summer_WeekEndDays: req.body.No_of_SummerWeekEndDays,
   Winter_WeekDays: req.body.No_of_WinterWeekDays,
   Winter_WeekEndDays: req.body.No_of_WinterWeekEndDays,

  });
  savetransfer.save();
  
/* add owner manager */

let AddMange_Owner = new ManageOwner({
  Boat_Id: boat_id,
  Owner_Name: req.body.New_Owner_Name,
  Boat_Name: getmangerowner.Boat_Name,
  Boat_Type: getmangerowner.Boat_Type,
  Home_Address: newOwner.Home_Address,
  First_Name: newOwner.First_Name,
  Last_Name: newOwner.Last_Name,
  Mobile: newOwner.Mobile,
  Family_Name: newOwner.Family_Name,
  Email: newOwner.Email,
  Owners_Allowed: getmangerowner.Owners_Allowed,
  Parking_Ability: newOwner.Parking_Ability,
  Summer_WeekDays: req.body.No_of_SummerWeekDays,
  Summer_WeekEndDays: req.body.No_of_SummerWeekEndDays,
  Winter_WeekDays: req.body.No_of_WinterWeekDays,
  Winter_WeekEndDays: req.body.No_of_WinterWeekEndDays,
  Sailing_Ability: newOwner.Sailing_Ability,
  Profile_Image: newOwner.Profile_Image,
  Profile_ImageOriginalName: newOwner.Profile_ImageOriginalName,
  ShareAllocation: getmangerowner.ShareAllocation,
  No_PartialCancellation:5,
  Block:true,
  IsActive: true,
  Current_Time: moment(Date.now()),
  Update_Time: moment(Date.now()),
  Owner_Id: new_owner_id,
  });

  AddMange_Owner.save()
    .then((response) => {
      const emailState =  'Boat Allocation.';
      const emailContent = `Dear Administrator, <p>The Owner ${req.body.Owner_Name} has been successfully assigned to ${req.body.Boat_Name}.</p>`;
      const emailDetailName = 'Allocation Details'
      const emailDetails = [
        { key: 'Owner Name', value: req.body.Owner_Name },
        { key: 'Boat', value: req.body.Boat_Name },
        
      ];
      const emailNameAndLink = {
        name:'Updation Link',
        link:`${process.env.CLIENT_URL}`
      }

      var mailOptionsAdmin = {
        from: "noreply.smartboatbooking@gmail.com",
        to: "admin@smartboating.com.au",
        subject: "Boat Allocation",
        html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
         
       
      };
      transporter.sendMail(mailOptionsAdmin, function (error, info) {
        if (error) {
          res.json({
            status: false,
            message: "Transfered succsesfully.Mail send failed",
          });
        } else {
          res.json({
            status: true,
            message: "Ownership Transfered Successfully",
          });
        }
      });

    
    })

    .catch((error) => {
      res.json({
        status: false,
        message: "Ownership transfer failed",
      });
    });

  

};

const TransferValidations = async(boat_id,owner_id,new_owner_id,New_Owner_Name)=>{

  let tempObj = {
    status: true
}

  //return new Promise(async(resolve,reject)=>{

    
    let futurebooking = await Schedule.findOne({Boat_Id:boat_id,User_Id:owner_id,"end":{$gte:new Date()},IsActive:true}).catch((error) => console.log(error));
  
if((futurebooking != null) || (futurebooking != undefined)){

  tempObj.status = false;
  tempObj.message = "You have future bookings.Cannot transfer the ownership";

  //return reject("You have future bookings.Cannot transfer the ownership");


}

let getduration = await Duration.findOne({Boat_Id:boat_id,Owner_Id:owner_id}).catch((error) => console.log(error));
if((getduration == null) || (getduration == undefined)){

  tempObj.status = false;
  tempObj.message = "Please Check Ownership Duration";


  //return reject("Please Check Ownership Duration");

}

let exitsence = await ManageOwner.findOne({Boat_Id:boat_id,Owner_Id:new_owner_id}).catch((error) => console.log(error));
if((exitsence != null) || (exitsence != undefined)){

 
 tempObj.status = false;
 tempObj.message = New_Owner_Name+" "+"has already this boat ownership";
  
 }

  return tempObj;

  //});

  



}

const GetOwnerDurationdetailsbyOwnerId = (req, res, next) => {
  const ownerid = mongoose.Types.ObjectId(req.body.Owner_Id);
  //console.log(boatid)
  mongoose
    .model("Tb_OwnershipDuration")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },

      {
        $lookup: {
          from: "tb_addowners",
          localField: "Owner_Id",
          foreignField: "_id",
          as: "OwnerDetails",
        },
      },
      {
        $match: { Owner_Id: ownerid ,IsActive:true},
      },

      {
        $project: {
          From_Date: 1,
          To_Date: 1,
          Is_Cancellation: 1,

          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          "BoatDetails.Location_Name": 1,
          "BoatDetails.Boattype_Name": 1,
          "BoatDetails.Boat_Name": 1,
          "BoatDetails.Location_Id": 1,
          "BoatDetails.Boattype_id": 1,
          "BoatDetails.Boat_Image": 1,
          "BoatDetails.IsActive": 1,
          "BoatDetails.Boat_Status": 1,
          //owner
          "OwnerDetails.First_Name": 1,
          "OwnerDetails.Last_Name": 1,
          "OwnerDetails.Home_Address": 1,
          "OwnerDetails.Email": 1,
          "OwnerDetails.Parking_Ability": 1,
          "OwnerDetails.Profile_Image": 1,
          "OwnerDetails.Family_Name": 1,
          "OwnerDetails.ShareAllocation": 1,
          "OwnerDetails.Mobile": 1,
          "OwnerDetails.Profile_ImageOriginalName": 1,
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

const GetOwnersbyBoatId = (req, res, next) => {
  const boatid = mongoose.Types.ObjectId(req.body.Boat_Id);
  console.log(boatid, "hiiiiiiiiiiiiiiiiiiiiiiiii");
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },

      {
        $lookup: {
          from: "tb_addowners",
          localField: "Owner_Id",
          foreignField: "_id",
          as: "OwnerDetails",
        },
      },
      //      {
      //       "$match": {Boat_Id:boatid}
      //   },
      {
        $match: { $and: [{ IsActive: true, Boat_Id: boatid }] },
      },

      {
        $project: {
          "OwnerDetails.First_Name": 1,
          "OwnerDetails.Email": 1,
          "OwnerDetails.IsActive": 1,
        },
      },
    ])
    .exec(function (err, response) {
      res.json({
        status: true,
        response,
      });
    });
};

//Transfer Ownership
const GetUnAssignedOwnerDetailsByBoatId = (req, res, next) => {
  boatid = req.body.boatid;
  console.log(boatid);
  let mysort = { First_Name: 1 };
  ManageOwner.find({ Boat_Id: mongoose.Types.ObjectId(boatid), IsActive: true }).sort(mysort)
    .select({ Owner_Id: 1, Owner_Name: 1 })
    .then((Manageresponse) => {
      NewOwners.find({ IsActive: true }).sort(mysort)
        .select({ _id: 1, First_Name: 1, Last_Name: 1 })
        .then((Ownerresponse) => {
          console.log(Manageresponse);
          console.log(Ownerresponse);

          jsonObjects = Manageresponse.map(JSON.stringify);

          uniqueSets = new Set(jsonObjects);
          response1 = Array.from(uniqueSets).map(JSON.parse);

          jsonObjects2 = Ownerresponse.map(JSON.stringify);

          uniqueSets2 = new Set(jsonObjects2);
          response2 = Array.from(uniqueSets2).map(JSON.parse);

          var arr = [];
          // for (var item1 in response1 )
          // {
          //     for (var item in response2 )
          //     {

          //            if((response1[item1].Owner_Id).equals(response2[item]._id))
          //            {
          //                console.log('hiiiiiiiiiiiiiiiiiiiiiiii')
          //               arr.push(response2[item])

          //            }
          //     }
          // }
          // let result = response2.filter(o1 => !response1.some(o2 =>o1._id.toString()==o2.Owner_Id.toString()));
          let result = response2.filter((o1) => !response1.some((o2) => o1._id.toString() == o2.Owner_Id.toString()));
          res.json({
            status: true,
            response: result,
          });
        });
    })
    .catch((error) => {
      res.json({
        status: false,
      });
    });
};

const GetBoatNameByOwnerId_Duration = (req, res, next) => {
  const OwnerId = mongoose.Types.ObjectId(req.body.owner_id);
  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },
      {
        $match: { $and: [{ IsActive: true, Owner_Id: OwnerId }] },
      },
      {
        $project: {
          Boat_Id: 1,
          "BoatDetails.Boat_Name": 1,
          "BoatDetails.Boattype_Name": 1,
          "BoatDetails._id": 1,
          "BoatDetails.IsActive": 1,
          "BoatDetails.Boat_Id": 1,
        },
      },
    ])
    .exec(function (err, results) {
      console.log(results);

      jsonObject = results.map(JSON.stringify);
   
      uniqueSet = new Set(jsonObject);
      response = Array.from(uniqueSet).map(JSON.parse);
      Duration.find({ IsActive: true })
        .select({ _id: 1, Boat_Id: 1, Boat_Name: 1 })
        .sort({Boat_Name:1})
        .then((shareresponse) => {
          jsonObjects2 = shareresponse.map(JSON.stringify);

          uniqueSets2 = new Set(jsonObjects2);
          response2 = Array.from(uniqueSets2).map(JSON.parse);

          var x = response.filter((o1) => o1.Boat_Id);
          console.log(x, "hihih");
          console.log(response2, "two");
          let result = response.filter((o1) => !response2.some((o2) => o1.Boat_Id.toString() == o2.Boat_Id.toString()));

          res.json({
            status: true,
            result,
          });
        });
    });
};

const ChangeNewPassword = function (req, res) {
  const owner_id = mongoose.Types.ObjectId(req.body.Owner_Id);
  console.log(owner_id);
  const OldPassword = req.body.OldPassword;
  bcrypt.hash(req.body.NewPassword, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }

    NewOwners.findById({ _id: mongoose.Types.ObjectId(owner_id) }).then((results) => {
      var oldpassword = results.Password;
      var Email = results.Email;
      var owner = results.First_Name;
      bcrypt.compare(OldPassword, oldpassword, function (err, Presult) {
        if (err) {
          res.json({
            error: err,
          });
        }
        console.log(hashedPass, "this");
        if (Presult) {
          NewOwners.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(owner_id) },
            {
              Password: hashedPass, //Added by chitra   on 13.04.2021
              Updated_time: moment(Date.now()),
            },

            function (err, data) {
              if (err) {
                res.json({
                  status: false,
                  message: "AN ERROR OCCURED",
                });
              } else {
              
                const emailState =  'Successfully Registered.';
                const emailContent = `Dear ${owner} this is a confirmation that the password for your account ${Email} has just been changed.`;
                const emailDetailName = 'Registration Details'
                const emailDetails = [
                  { key: 'Name', value: Administrator },
                  { key: 'Email ', value: Email },
                ];
                const emailNameAndLink = {
                  name:'Login Link',
                  link:`${process.env.CLIENT_URL}/owner-login`
                }
     

                var mailOptions = {
                  to: Email,
                  from: "noreply.smartboatbooking@gmail.com",
                  subject: "Your password has been changed",
                  html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                  
                
                };
                smtpTrans.sendMail(mailOptions, function (err) {
                  res.json({
                    Status: true,
                    message: "Password Updated Successfully",
                  });
                });
              }
            }
          );
        } else {
          res.json({
            status: false,
            message: "Password Doesnt Match",
          });
        }
      });
    });
  });
};

//Owner Details
const OwnerProfileDetails = (req, res, next) => {

  const ownerid = mongoose.Types.ObjectId(req.body.Owner_Id);
  const boatid = mongoose.Types.ObjectId(req.body.Boat_Id);

  


  mongoose
    .model("Tb_ManageOwner")
    .aggregate([
      {
        $lookup: {
          from: "tb_boatmasters",
          localField: "Boat_Id",
          foreignField: "_id",
          as: "BoatDetails",
        },
      },

    
      {
        $lookup: {
          from: "tb_addowners",
          localField: "Owner_Id",
          foreignField: "_id",
          as: "OwnerDetails",
        },
      },
   
      {
        $match: { Owner_Id: ownerid, Boat_Id: boatid },
      },

      {
        $project: {
          Summer_WeekDays: 1,
          Summer_WeekEndDays: 1,
          Winter_WeekDays: 1,
          Winter_WeekEndDays: 1,
          "BoatDetails._id": 1,
          "BoatDetails.Summer_WeekEndDays": 1,
          "BoatDetails.Summer_WeekDays": 1,
          "BoatDetails.Winter_WeekEndDays": 1,
          "BoatDetails.Winter_WeekDays": 1,
          "BoatDetails.Location_Name": 1,
          "BoatDetails.Boattype_Name": 1,
          "BoatDetails.Boat_Name": 1,
          "BoatDetails.Location_Id": 1,
          "BoatDetails.Boattype_id": 1,
          "BoatDetails.Boat_Image": 1,
          "BoatDetails.IsActive": 1,
          "BoatDetails.Boat_Status": 1,
          "BoatDetails.SummerSeason_SDate": 1,
          "BoatDetails.SummerSeason_EDate": 1,
          "BoatDetails.WinterSeason_SDate": 1,
          "BoatDetails.WinterSeason_EDate": 1,
          "BoatDetails.Boat_Description": 1,
          "BoatDetails.Boat_Facility": 1,
          "BoatDetails.Launch_Date": 1,
          "BoatDetails.PreLaunch_Date": 1,
          //owner
          "OwnerDetails.First_Name": 1,
          "OwnerDetails.Last_Name": 1,
          "OwnerDetails.Home_Address": 1,
          "OwnerDetails.Email": 1,
          "OwnerDetails.Parking_Ability": 1,
          "OwnerDetails.Profile_Image": 1,
          "OwnerDetails.Family_Name": 1,
          "OwnerDetails.ShareAllocation": 1,
          "OwnerDetails.Mobile": 1,
          "OwnerDetails.Profile_ImageOriginalName": 1,
          
        },
      },
    ])
    .exec(function (err, response) {
      if(response){

        Duration.findOne({ Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),Owner_Id:mongoose.Types.ObjectId(req.body.Owner_Id) }).then((Ownerduration) => {

          res.json({
            status: true,
            response,Ownerduration
          });


        });
      }
     
    });

  
  

  
};


//Owner Details



//Enable and disable Owner

const EnableAndDisableOwner = async(req,res) =>{

  let _id = req.body._id

  //Check user status and change

  let owner = await NewOwners.findOne({_id}).catch((error)=> {
    console.log(error)
   return res.json({
      status:false,
      message: "Can't change user status."
    })
  })

  
  if(!owner) {
    return res.json({
      status:false,
        message: "Invalid owner id."
    })
  }

  owner.Block = !owner.Block
 await owner.save().then(()=>{
  return res.json({
    status:true,
    message: "Owner status changed successfully."
   })
 }).catch((error)=>{
  console.log(error)
  return res.json({
    status:false,
      message: "Failed to save changes. Try again"
  })
  })

}


const massChangeOwnerEmails = async(req,res)=>{
let owners = await NewOwners.find().catch((error)=>{
    console.log("something went wrong.")
  })

  function getRandomWord(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

let genearatedEmails = []

  for (const owner of owners) {

 



    let randomWord = getRandomWord(6)

    genearatedEmails.push(randomWord)

    let i = 0

    while(genearatedEmails.includes(randomWord)){
      randomWord = getRandomWord(8)
      i++;
      if(i >= 100){
        break;
      }

    }


    let email = `${randomWord}@brilliantdigital.com.au`

    console.log(email)

     owner.Email = email

    await owner.save().catch((error)=>{
      console.log(error)
     })

  
    
  }


  return res.json({status:'ok',message:"All email chnaged successfully"})

}


const GetAllOwnerDetailsOverview = async(req,res)=>{

  let ownerDetails  = await NewOwners.aggregate([
   
   
    {
      $lookup:{
        from:"tb_manageowners",
        localField:"_id",
        foreignField:"Owner_Id",
        as: "boatDeatils"
      }
    },

    {
      $lookup:{
        from:"tb_ownershipdurations",
        localField:"_id",
        foreignField:"Owner_Id",
        as:"ownershipDetails"
      }

    },
   
    {$match:{IsActive:true}},



    {$project:{
      boatDeatils:{
        Boat_Name:1
      },

      ownershipDetails:{
        Duration_SDate:1,
        Duration_EDate:1,
        From_Date:1,
        To_Date:1

      },   

      First_Name:1,
      Last_Name:1,
      Family_Name:1,
      Mobile:1,
      Email:1,
      Home_Address:1,
      Sailing_Ability:1,
      Parking_Ability:1,
      Housekeeping:1,
      Notes:1,
      Emergency_Contact_Name:1,
      Emergency_Contact_Mobile:1
    }
    }
  ]).catch((error)=>{
    console.log(error)
    return res.json({status:true,message:"Something went wrong try again."})
  })


  return res.json({status:true,response:ownerDetails})
}



const GetAllOwnerUsageOverview = async(req,res)=>{

  let ownerDetails = await NewOwners.aggregate([

    {$match:{IsActive:true}},


    {
      $lookup:{
        from:"tb_manageowners",
        localField:"_id",
        foreignField:"Owner_Id",
        as:"allocatedDays"
      }
    },

    {
      $lookup:{
        from:"tb_ownerbookingdays",
        localField:"_id",
        foreignField:"Owner_Id",
        as:"bookedDays"
      }
    },

    {
      $lookup:{
        from:"tb_addstandbybookings",
        localField:"_id",
        foreignField:"User_Id",
        as:"allStandByBookings"
      }
    },

    {
      $lookup:{
        from:"tb_schedules",
        localField:"_id",
        foreignField:"User_Id",
        as:"allBookings"
      }
    },

    {
      $lookup:{
        from:"tb_specialdaybookings",
        localField:"_id",
        foreignField:"Owner_Id",
        as:"specialDays"
      }
    },
    {
      $lookup:{
        from:"tb_boatcleans",
        localField:"_id",
        foreignField:"Owner_Id",
        as:"allCleans"
      }

    },

    {
      $project:{

        specialDays:{
          start:1
        },

        allBookings:{
          Total_DaysBooked:1,
          User_RoleType:1,
          start:1,
          end:1,
          IsActive:1

        },

        allocatedDays:{
          Summer_WeekDays:1,
          Summer_WeekEndDays:1,
          Winter_WeekDays:1,
          Winter_WeekEndDays:1,
          Boat_Name:1
        },

        bookedDays:{
          Summer_WeekDays:1,
          Summer_WeekEndDays:1,
          Winter_WeekDays:1,
          Winter_WeekEndDays:1
        },

        allStandByBookings:{
          TotalDay_Count:1,
          User_RoleType:1
        },

        allCleans:{
          Cleans:1,
          User_RoleType:1

        },

        First_Name:1,
        Last_Name:1,
      }
    }

  ]).catch((error)=>{
    console.log(error)
    return res.json({status:true,message:"Something went wrong try again."})
  })


  

 let ownerUsageOverview = [];

 for (const owner of ownerDetails) {
   

  //total owner allocated days


  let totalAllocatedSummerWeekdays = 0
  let totalAllocatedSummerWeekends = 0;
  let totalAllocatedWinterWeekdays = 0;
  let totalAllocatedWinterWeekends = 0;
  let boatNames = []

  for (const allocatedDays of owner.allocatedDays) {
    totalAllocatedSummerWeekdays += allocatedDays.Summer_WeekDays;
    totalAllocatedSummerWeekends += allocatedDays.Summer_WeekEndDays;
    totalAllocatedWinterWeekdays += allocatedDays.Winter_WeekDays;
    totalAllocatedWinterWeekends += allocatedDays.Winter_WeekEndDays;
    boatNames.push(allocatedDays.Boat_Name)
  }


   // total booked days

   let totalBookedSummerWeekdays = 0
   let totalBookedSummerWeekends = 0
   let totalBookedWinterWeekdays = 0
   let totalBookedWinterWeekends = 0
  



   for (const bookedDay of owner.bookedDays){

     totalBookedSummerWeekdays += bookedDay.Summer_WeekDays
     totalBookedSummerWeekends += bookedDay.Summer_WeekEndDays
     totalBookedWinterWeekdays += bookedDay.Winter_WeekDays
     totalBookedWinterWeekends += bookedDay.Winter_WeekEndDays

   }


    //total stand by bookings

    let totalStandByBookingCount = 0;

    for (const allStandByBooking of owner.allStandByBookings) {
        if(allStandByBooking.User_RoleType === 'Owner'){
          totalStandByBookingCount += allStandByBooking.TotalDay_Count
        }
      
    }

     // total number of day only booking 

     let totalNumberOfDayOnlyBooking = 0

     

     let totalOwnerBookedHours = 0;
     let totalOwnerBookingsCount = 0
     let totalAverageBookingDurationInHr = 0
     

     let totalNumberOfBookingDaysCancellation = 0
   
     for (const booking of owner.allBookings) {


      if(!booking.IsActive){
        totalNumberOfBookingDaysCancellation += booking.Total_DaysBooked
      }
  
      if(booking.Total_DaysBooked == 1 && booking.User_RoleType === "Owner"){
      totalNumberOfDayOnlyBooking += booking.Total_DaysBooked
      }
  
      if(booking.User_RoleType === "Owner"){
        totalOwnerBookedHours += getHoursFromTwoDate(booking.start,booking.end)
        totalOwnerBookingsCount += booking.Total_DaysBooked
      }
  
  
    }

   totalAverageBookingDurationInHr = totalOwnerBookedHours / totalOwnerBookingsCount
   if(!totalAverageBookingDurationInHr) totalAverageBookingDurationInHr = 0


   //total special days used count 
   let totalSpecialDaysUsed = 0;
    for (const specialDay of owner.specialDays) {
      if(specialDay) totalSpecialDaysUsed++
      
    }


    let toatalNumberofCleans = 0;

    for (const clean of owner.allCleans) {

      if(clean.User_RoleType === "Owner"){
        toatalNumberofCleans += clean.Cleans
      }

    }

    //data

    let data = {
      _id:owner._id,
      name: `${owner.First_Name} ${owner.Last_Name}`,
      boatNames,
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
      totalAverageBookingDurationInHr,
      totalNumberOfBookingDaysCancellation,
      totalSpecialDaysUsed

    }


    ownerUsageOverview.push(data);
 }


 


  return res.json({status:true,response:ownerUsageOverview})

}

const ListOwnershipTransfer = async(req,res)=>{

  Tranferownership.find({}).then((results) => {

    if(results)

      return res.json({status:true,Data:results})

    
  });

 

}



module.exports = {
  AddOwner,
  EditOwner,
  DeleteOwner,
  AddDuration,
  GetAllOwnerDetails_FromManageOwner,
  EditDuration,
  DeleteDuration,
  GetOwners,
  GetBoats,
  AddShare_Allocation,
  AddMangeOwner,
  ViewAllOwners,
  DeleteOwnersById,
  GetBoatDetailsById,
  UpdateOwnerById,
  GetSeasonDetailsById,
  FileUploadSingle,
  upload1,
  GetAllOwnerDetails,
  GetOwnerDetailsByBoatId,
  GetAllOwnerDetailsTableView,
  DeleteManageOwnersById,
  UpdateManageOwnerById,
  GetOwnerDetailsOneByOne,
  GetBoatDetailsByOwner,
  EnableDisableOwner,
  OwnerLogin,
  ForgotPasswordOwner,
  ChangePassword,
  GetAllOwnerssWithBoatDetails,
  GetBoatNameByOwnerId,
  ListAllDuration,
  GetTotalDaysAssigned,
  OwnershipTransfer,
  GetOwnerDurationdetailsbyOwnerId,
  GetOwnersbyBoatId,
  GetUnAssignedOwnerDetailsByBoatId,
  GetBoatNameByOwnerId_Duration,
  ChangeNewPassword,
  OwnerProfileDetails,
  EnableAndDisableOwner,
  massChangeOwnerEmails,
  GetAllOwnerDetailsOverview,
  GetAllOwnerUsageOverview,
  ListOwnershipTransfer,
  TransferValidations
  
};
