//AuthorName:Chitra V
//File:Days Settings Controller.js
//Module:Manage Days Settings
//Created Date:04.05.2021
//Purpose:To Manage Days Settings

/***************************************************Import Packages and ViewModels Section******************************** */
const moment = require("moment");
const mongoose = require("mongoose");
const shares = require("../models/AddNewShareModel");
const consecutive = require("../models/ConsecutiveDaysModel");
const nextbooking = require("../models/NextBookingModel");
const Boats = require("../models/AddBoatModel"); //jibin 5/22
const unavailableForAll = require("../models/AddUnAvailableDaysForAllBoatsModel");
const unavailableSingle = require("../models/AddUnAvailableDaysModel");
const PreLaunchAndLaunchBookingDays = require("../models/BookingDaysForLaunchPreLaunchModels");
const Schedule = require("../models/ScheduleModel");
const { validateAddConsecutiveDaysAndAddBookingForLaunch_PreLuanch, validateAddUnavailabledaysMultiple } = require("../validations/daysValidations");
// const { forEach } = require('async');
// const { exists } = require('../models/AddBoatModel');
/***************************************************Import Methods and Functions******************************** */
// Function for AddNewShares//
const AddNewShares = (req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  const shareid = req.body._id;
  console.log(shareid, "myiddddd");
  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }

  const Total_Days = Number(req.body.No_of_SummerWeekDays) + Number(req.body.No_of_SummerWeekEndDays) + Number(req.body.No_of_WinterWeekDays) + Number(req.body.No_of_WinterWeekEndDays);
  console.log(Total_Days);
  ////////////////////////////
  // for updating weekend days jibin 5/22
  Boats.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(boat_id) },
    {
      Summer_WeekDays: req.body.No_of_SummerWeekDays,
      Summer_WeekEndDays: req.body.No_of_SummerWeekEndDays,
      Winter_WeekDays: req.body.No_of_WinterWeekDays,
      Winter_WeekEndDays: req.body.No_of_WinterWeekEndDays,
      Total_Days: Total_Days,
    },
    { new: true },
    function (err, data) {
      console.log(data.Owners_Allowed);
    }
  );
  // for updating weekend days jibin5/22

  shares.find({ Boat_Id: boat_id, IsActive: true }).then((Checkresult) => {
    console.log(Checkresult.length, "length");
    var _LengthCheck = Checkresult.length;
    if (_LengthCheck == 0) {
      let add_Shares = new shares({
        Boat_Id: boat_id,
        Boat_Name: req.body.Boat_Name,
        No_of_Shares: req.body.No_of_Shares,
        No_of_SummerWeekDays: req.body.No_of_SummerWeekDays,
        No_of_SummerWeekEndDays: req.body.No_of_SummerWeekEndDays,
        No_of_WinterWeekDays: req.body.No_of_WinterWeekDays,
        No_of_WinterWeekEndDays: req.body.No_of_WinterWeekEndDays,
        Status: Module_status,
        Block: true,
        IsActive: true,
        Current_Time: moment(Date.now()),
        Updated_time: moment(Date.now()),
      });

      add_Shares
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "The default share allocation for this boat has been added",
            data: response,
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    } else {
      console.log(req.body);
      shares.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(shareid) },
        {
          Boat_Id: boat_id,
          Boat_Name: req.body.Boat_Name,
          No_of_Shares: req.body.No_of_Shares,
          No_of_SummerWeekDays: req.body.No_of_SummerWeekDays,
          No_of_SummerWeekEndDays: req.body.No_of_SummerWeekEndDays,
          No_of_WinterWeekDays: req.body.No_of_WinterWeekDays,
          No_of_WinterWeekEndDays: req.body.No_of_WinterWeekEndDays,
          Status: Module_status,
          Block: true,
          IsActive: true,
          Current_Time: moment(Date.now()),
          Updated_time: moment(Date.now()),
        },
        { new: true },
        function (err, data) {
          console.log(data);

          if (err) {
            res.json({
              status: false,
              message: "AN ERROR OCCURED",
            });
          } else {
            res.json({
              status: true,
              Data: data,
              message: "The default day allocation for this boat has been Updated",
            });
          }
        }
      );
    }
  });
};
// Function for AddConsecutivDays//
const AddConsecutiveDays = async (req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);

  //data validation

  let dataValidation = await validateAddConsecutiveDaysAndAddBookingForLaunch_PreLuanch(req.body);

  if (dataValidation.error) {
    let message = dataValidation.error.details[0].message.replace(/"/g, "");
    return res.json({ status: false, message });
  }

  if((req.body.Booking_Days < parseInt(req.body.No_Of_WeekDays)+parseInt(req.body.No_Of_WeekEndDays)) || (req.body.Booking_Days > parseInt(req.body.No_Of_WeekDays)+parseInt(req.body.No_Of_WeekEndDays))){

    let message = "Weekdays and Weekend days cannot less than Booking days";
    return res.json({ status: false, message });
      
  }

  //data validation end

  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }
  consecutive.find({ Boat_Id: boat_id, IsActive: true }).then((Con_result) => {
    console.log(Con_result.length, "length");
    var _Length = Con_result.length;
    if (_Length == 0) {
      let add_days = new consecutive({
        Boat_Id: boat_id,
        Boat_Name: req.body.Boat_Name,
        Summer_ConsecutiveDays: req.body.Summer_ConsecutiveDays,
        Winter_ConsecutiveDays: req.body.Winter_ConsecutiveDays,
        Status: Module_status,
        IsActive: true,
        Block: true,
        Current_Time: moment(Date.now()),
        Updated_time: moment(Date.now()),
      });
      add_days
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "Number of consecutive bookings days allowed on the boat for an Owner Booking has been successfully Added",
            data: add_days,
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    } else {
      consecutive.findOneAndUpdate(
        { Boat_Id: mongoose.Types.ObjectId(boat_id) },
        {
          Boat_Id: boat_id,
          Boat_Name: req.body.Boat_Name,
          Summer_ConsecutiveDays: req.body.Summer_ConsecutiveDays,
          Winter_ConsecutiveDays: req.body.Winter_ConsecutiveDays,
          Status: Module_status,
          IsActive: true,
          Block: true,
          Current_Time: moment(Date.now()),
          Updated_time: moment(Date.now()),
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
              message: "Number of consecutive owner bookings days allowed for the boat has been updated",
            });
          }
        }
      );
    }
  });
};
// Function for AddNextBookings//
const AddNextBookings = (req, res, next) => {
  console.log(req.body);
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  nextbooking.find({ Boat_Id: boat_id }).then((result) => {
    console.log(result.length, "length");
    var _Length = result.length;
    if (_Length == 0) {
      if (req.body.Status == "Enable") {
        var Module_status = 1;
      } else if (req.body.Status == "Disable") {
        var Module_status = 0;
      }
      let add_bookings = new nextbooking({
        Boat_Id: boat_id,
        Boat_Name: req.body.Boat_Name,
        Next_BookingDay: req.body.Next_BookingDay,
        Status: Module_status,
        Block: req.body.Block,
        IsActive: req.body.IsActive,
        Current_Time: moment(Date.now()),
        Updated_time: moment(Date.now()),
      });

      add_bookings
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "The maximum days to book in advance for the has been successfully Added",
            data: add_bookings,
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    } else {
      if (req.body.Status == "Enable") {
        var Module_status = 1;
      } else if (req.body.Status == "Disable") {
        var Module_status = 0;
      }

      nextbooking.findOneAndUpdate(
        {},
        {
          Boat_Id: boat_id,
          Boat_Name: req.body.Boat_Name,
          Next_BookingDay: req.body.Next_BookingDay,
          Status: Module_status,
          Block: req.body.Block,
          IsActive: req.body.IsActive,
          Current_Time: moment(Date.now()),
          Updated_time: moment(Date.now()),
        },

        function (err, data) {
          if (err) {
            res.json({
              status: false,
              message: "Text field is Empty or Days must be a number",
            });
          } else {
            res.json({
              status: true,
              message: "The maximum days to book in advance for the boat has been successfully updated",
            });
          }
        }
      );
    }
  });
};
// Function for EditNewShares
const EditNewShares = (req, res, next) => {
  const shareid = req.body._id;
  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }
  shares.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(shareid) },
    {
      No_of_Shares: req.body.No_of_Shares,
      No_of_SummerWeekDays: req.body.No_of_SummerWeekDays,
      No_of_SummerWeekEndDays: req.body.No_of_SummerWeekEndDays,
      No_of_WinterWeekDays: req.body.No_of_WinterWeekDays,
      No_of_WinterWeekEndDays: req.body.No_of_WinterWeekEndDays,
      Status: Module_status,
      Block: req.body.Block,
      IsActive: req.body.IsActive,
      Current_Time: req.body.Current_Time,
      Updated_time: moment(Date.now()),
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
          message: "Shares Updated Successfully",
        });
      }
    }
  );
};
// Function for EditConsecutivDays
const EditConsecutiveDays = (req, res, next) => {
  const daysid = req.body._id;
  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }
  consecutive.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(daysid) },
    {
      Summer_ConsecutiveDays: req.body.Summer_ConsecutiveDays,
      Winter_ConsecutiveDays: req.body.Winter_ConsecutiveDays,
      Status: Module_status,
      Block: req.body.Block,
      IsActive: req.body.IsActive,
      Current_Time: req.body.Current_Time,
      Updated_time: moment(Date.now()),
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
          message: "Consecutive Days Updated Successfully",
        });
      }
    }
  );
};
// Function for EditNextBookings
const EditNextBookings = (req, res, next) => {
  const bookingid = req.body._id;
  if (req.body.Status == "Enable") {
    var Module_status = 1;
  } else if (req.body.Status == "Disable") {
    var Module_status = 0;
  }
  nextbooking.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(bookingid) },
    {
      Next_BookingDay: req.body.Next_BookingDay,
      Status: Module_status,
      Block: req.body.Block,
      IsActive: req.body.IsActive,
      Current_Time: req.body.Current_Time,
      Updated_time: moment(Date.now()),
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
          message: "NextBooking Day Updated Successfully",
        });
      }
    }
  );
};
// Function for ListShares
const ViewAllShares = (req, res, next) => {
  var mysort = { _id: -1 };
  shares
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
        message: "No Data",
      });
    });
};
// Function for ListConsecutivDays
const ViewAllConsecutiveDays = (req, res, next) => {
  consecutive
    .find({ IsActive: true })
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "No Data",
      });
    });
};
// Function for ListNextBookings
const ViewAllNextBookings = (req, res, next) => {
  nextbooking
    .find({ IsActive: true })
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        status: true,
        message: "No Data",
      });
    });
};
//Function for Delete Shares
const DeleteShares = (req, res, next) => {
  const shareid = req.body._id;
  shares.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(shareid) },
    {
      IsActive: false,
      Updated_time: moment(Date.now()),
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
          message: "Share Allocation Details Deleted Successfully",
        });
      }
    }
  );
};
//Function for Delete NextBookings
const DeleteNextBooking = (req, res, next) => {
  const bookingid = req.body._id;
  nextbooking.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(bookingid) },
    {
      IsActive: false,
      Updated_time: moment(Date.now()),
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
          message: "Booking Details Deleted Successfully",
        });
      }
    }
  );
};
//Function for Delete Consecutive
const DeleteConsecutiveDays = (req, res, next) => {
  const bookingid = req.body._id;
  consecutive.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(bookingid) },
    {
      IsActive: false,
      Updated_time: moment(Date.now()),
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
          message: "Consecutive Days Details Deleted Successfully",
        });
      }
    }
  );
};
//Get Days By Boat_Id jibin 5/26

const GetConsecutiveDaysByBoatId = (req, res, next) => {
  var boatid = req.body.Boat_Id;
  consecutive
    .findOne({ Boat_Id: mongoose.Types.ObjectId(boatid) })
    .then((response) => {
      res.json({
        Status: true,
        Data: response,
      });
    })
    .catch((error) => {
      res.json({
        Status: false,
        Data: "No Data",
      });
    });
};

//Get NextBooking By Boat_Id jibin 5/26

const GetNextBookingDaysByBoatId = (req, res, next) => {
  const BoatId = mongoose.Types.ObjectId(req.body.Boat_Id);
  mongoose
    .model("Tb_NextBooking")
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
          "BoatDetails.Launch_Date": 1,
          "BoatDetails.PreLaunch_Date": 1,
          Next_BookingDay: 1,
        },
      },
    ])
    .exec(function (err, response) {
      Schedule.findOne({ Boat_Id: BoatId })
        .select({ Current_Time: 1 })
        .sort({ Current_Time: 1 })
        .then((Dateresponse) => {
          console.log(response);
          res.json({
            status: true,
            currentdate: moment(),
            response,
            Dateresponse,
          });
        });
    });
};

//Add UnavailabledaysForSingle

const AddUnavailabledaysSingle = (req, res, next) => {
  var flag = 0;
  var previous = 0;
  var Boat_id = req.body.Boat_Id;
  var UnAvailableArr = req.body.UnAvailableDates;
  var arr = [...new Set(UnAvailableArr)];
  console.log(arr);
  unavailableForAll.find({ IsActive: true }).then((response) => {
    var Results = JSON.stringify(response);

    data = JSON.parse(Results);

    var array = [];
    data.forEach(function (item) {
      array.push(item.UnAvailableDates);
    });
    var merged = [].concat.apply([], array);

    let uniqueChars = [...new Set(merged)];
    console.log(uniqueChars);

    try {
      arr.forEach((e1) =>
        uniqueChars.forEach((e2) => {
          if (e1 == e2) {
            flag = 1;
          } else {
          }
        })
      );
    } catch (e) {
      console.log("looop end");
    }

    console.log(flag);
    if (flag == 0) {
      if (req.body.Status == "Enable") {
        var Module_status = 1;
      } else if (req.body.Status == "Disable") {
        var Module_status = 0;
      }

      arr.map(async function (objs) {
        var unavail_days = objs;
        console.log(unavail_days, "hiiii");
        var unAvailable_days = moment(unavail_days);
        var dif = unAvailable_days.diff(moment(), "days");
        console.log(dif);
        if (dif < 0) {
          previous = 1;
        }
      });
      if (previous != 1) {
        //$or:[{end_NoTime:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start_NoTime:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime},{$and:[{start:{$gte:start_Date}},{end:{$lte:End_final_withoutTime}}]},{$and:[{start:{$lte:start_Date}},{end:{$gte:End_final_withoutTime}}]}]
        // Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:UnAvailableArr},{end_NoTime:UnAvailableArr}]}).then(result=>
        Schedule.find({
          Boat_Id: Boat_id,
          IsActive: true,
          $or: [{ start_NoTime: UnAvailableArr }, { end_NoTime: UnAvailableArr }, { $and: [{ start_NoTime: { $gte: UnAvailableArr } }, { end_NoTime: { $lte: UnAvailableArr } }] }],
        }).then((result) => {
          console.log(result.length, "length");
          var _Length = result.length;
          if (_Length == 0) {
            console.log("hiiiiiiiiii");
            let add_UnAvailabledays = new unavailableSingle({
              Boat_Id: mongoose.Types.ObjectId(req.body.Boat_Id),
              Boat_Name: req.body.Boat_Name,
              UnAvailableDates: req.body.UnAvailableDates,
              Status: Module_status,
              Block: req.body.Block,
              IsActive: true,
              Current_Time: moment(Date.now()),
              Update_Time: moment(Date.now()),
            });

            add_UnAvailabledays
              .save()
              .then((response) => {
                res.json({
                  status: true,
                  message: "The date has been successfully added as an unavailable date across the booking system",
                  data: response,
                });
              })
              .catch((error) => {
                res.json({
                  status: false,
                  message: "cannot Add",
                });
              });
          } else {
            res.json({
              status: true,
              message: "This Date have bookings please try another date",
            });
          }
        });
      } else {
        res.json({
          status: false,
          message: "You cannot add Previous Days",
        });
      }
    } else {
      res.json({
        status: false,
        message: "Dates Not Available",
      });
    }
  });
};

//Add And Update unavailable days

const AddUnavailabledaysForAll = async (req, res, next) => {
  //check unavilable dates already book

  //get all shedules and check if it is already booked
  let unAvailablesDates = req.body.UnAvailableDates;

  //This function will push all dates between start and end dates to array and return it

  let getDaysBetweenDates = function (startDate, endDate) {
    let now = startDate.clone(),
      dates = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format("MM/DD/YYYY"));
      now.add(1, "days");
    }
    return dates;
  };

  //Find all shedules
  let allShedules = await Schedule.find().catch((error) => console.log(error));

  //looping through all shedule to check if boat is already booked to incoming unavailable day
  for (const shedule of allShedules) {
    //Get dates between start and end of the booking

    let allDatesBetweenStartAndEnd = getDaysBetweenDates(moment(shedule.start), moment(shedule.end));

    //Loop through all unAvailble dates and check allDatesBetweenStartAndEnd array if any date match send error response
    for (const unAvalilableDate of unAvailablesDates) {
      for (const date of allDatesBetweenStartAndEnd) {
        if (date == unAvalilableDate) {
          return res.json({ status: false, message: `Boat ${shedule.Boat_Name} is already booked on ${moment(unAvalilableDate).format("DD/MM/YYYY")} this date.` });
        }
      }
    }
  }

  //check unavilable dates already book finish

  //prevoius day
  var previous = 0;

  var UnAvailableArr = req.body.UnAvailableDates;
  var arr = [...new Set(UnAvailableArr)];
  arr.map(async function (objs) {
    var unavail_days = objs;
    console.log(unavail_days, "hiiii");
    var unAvailable_days = moment(unavail_days);
    var dif = unAvailable_days.diff(moment(), "days");
    console.log(dif);
    if (dif < 0) {
      previous = 1;
    }
  });
  //previousday
  if (previous != 1) {
    Schedule.find({ IsActive: true, $or: [{ start_NoTime: UnAvailableArr }, { end_NoTime: UnAvailableArr }] }).then((result) => {
      console.log(result.length, "length");
      var _Length = result.length;
      if (_Length == 0) {
        console.log("hiiiiiiiiii");

        unavailableForAll.count(function (err, count) {
          if (!err && count === 0) {
            if (req.body.Status == "Enable") {
              var Module_status = 1;
            } else if (req.body.Status == "Disable") {
              var Module_status = 0;
            }
            let add_UnAvailabledays = new unavailableForAll({
              UnAvailableDates: req.body.UnAvailableDates,
              Status: Module_status,
              Block: req.body.Block,
              IsActive: true,
              Current_Time: moment(Date.now()),
              Update_Time: moment(Date.now()),
            });
            add_UnAvailabledays
              .save()
              .then((response) => {
                res.json({
                  status: true,
                  message: "The date has been successfully added as an unavailable date across the booking system",
                  data: response,
                });
              })
              .catch((error) => {
                res.json({
                  status: false,
                  message: "cannot Add",
                });
              });
          } else {
            if (req.body.Status == "Enable") {
              var Module_status = 1;
            } else if (req.body.Status == "Disable") {
              var Module_status = 0;
            }

            unavailableForAll.findOneAndUpdate(
              {},
              {
                UnAvailableDates: req.body.UnAvailableDates,
                Status: Module_status,
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
                  res.json({
                    status: true,
                    message: "The date has been successfully added as an unavailable date across the booking system",
                  });
                }
              }
            );
          }
        });
      } else {
        res.json({
          status: true,
          message: "This Date have bookings please try another date",
        });
      }
    });
  } else {
    res.json({
      status: true,
      message: "You cannot add Previous Days",
    });
  }
};

//GetAll UnAvailable Days

const GetAllUnAvailableDays = (req, res, next) => {
  unavailableForAll
    .find({ IsActive: true })
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "No Data",
      });
    });
};
//Get Unavialable days of Boats
const GetUnAvailabeDaysOfBoats = (req, res, next) => {
  unavailableSingle
    .find({ IsActive: true })
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "No Data",
      });
    });
};

//get booking days between launch and pre_launch

const ViewBookingdays_LaunchPreLuanch = (req, res, next) => {
  var boatid = req.body.Boat_Id;
  PreLaunchAndLaunchBookingDays.findOne({ Boat_Id: mongoose.Types.ObjectId(boatid) })
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "No Data",
      });
    });
};

const AddBookingForLaunch_PreLuanch = async (req, res, next) => {
  //data validation

  let dataValidation = await validateAddConsecutiveDaysAndAddBookingForLaunch_PreLuanch(req.body);

  if (dataValidation.error) {
    let message = dataValidation.error.details[0].message.replace(/"/g, "");
    return res.json({ status: false, message });
  }

  if((req.body.Booking_Days < parseInt(req.body.No_Of_WeekDays)+parseInt(req.body.No_Of_WeekEndDays)) || (req.body.Booking_Days > parseInt(req.body.No_Of_WeekDays)+parseInt(req.body.No_Of_WeekEndDays))){

    let message = "Weekdays and Weekend days cannot less than Booking days";
    return res.json({ status: false, message });
      
  }

  //data validation end

  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);

  console.log(boat_id);

  PreLaunchAndLaunchBookingDays.find({ Boat_Id: boat_id, IsActive: true }).then((result) => {
    console.log(result.length, "length");
    var _Length = result.length;
    if (_Length == 0) {
      let add_bookingLaunchPreLaunch = new PreLaunchAndLaunchBookingDays({
        Boat_Id: boat_id,
        Boat_Name: req.body.Boat_Name,
        Booking_Days: req.body.Booking_Days,
        No_Of_WeekDays: req.body.No_Of_WeekDays,
        No_Of_WeekEndDays: req.body.No_Of_WeekEndDays,
        IsActive: true,
        Current_Time: moment(Date.now()),
        Updated_Time: moment(Date.now()),
      });
      add_bookingLaunchPreLaunch
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "Consecutive Days For Launch And PreLaunch Details Added Successfully",
            data: add_bookingLaunchPreLaunch,
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    } else {
      PreLaunchAndLaunchBookingDays.findOneAndUpdate(
        { Boat_Id: boat_id, IsActive: true },
        {
          Boat_Id: boat_id,
          Booking_Days: req.body.Booking_Days,
          No_Of_WeekDays: req.body.No_Of_WeekDays,
          No_Of_WeekEndDays: req.body.No_Of_WeekEndDays,
          Boat_Name: req.body.Boat_Name,
          IsActive: true,
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
              message: "Consecutive Days For Launch And PreLaunch Details Updated Successfully",
            });
          }
        }
      );
    }
  });
};

const DeleteBookingForLaunch_PreLuanch = (req, res, next) => {
  const bookingid = req.body._id;
  PreLaunchAndLaunchBookingDays.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(bookingid) },
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
          message: "Consecutive Days For Launch And PreLaunch Details Deleted Successfully",
        });
      }
    }
  );
};

const EditBookingForLaunch_PreLuanch = (req, res, next) => {
  const bookingid = req.body._id;
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_Id);
  PreLaunchAndLaunchBookingDays.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(bookingid) },
    {
      Boat_Id: boat_id,
      Booking_Days: req.body.Booking_Days,
      Boat_Name: req.body.Boat_Name,
      IsActive: true,
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
          message: "Consecutive Days For Launch And PreLaunch Details Updated Successfully",
        });
      }
    }
  );
};

const ViewAllPreLaunchAndLaunchBookingDays = (req, res, next) => {
  var mysort = { _id: -1 };
  PreLaunchAndLaunchBookingDays.find({ IsActive: true })
    .sort(mysort)
    .then((response) => {
      res.json({
        status: true,
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "No Data",
      });
    });
};

const GetShareDetailsByBoatId = (req, res, next) => {
  boatid = req.body.boatid;

  shares
    .findOne({ Boat_Id: mongoose.Types.ObjectId(boatid) })
    .then((response) => {
      Boats.findOne({ _id: mongoose.Types.ObjectId(boatid) }).then((responses) => {
        var shares = responses.Owners_Allowed;
        var SummerS_Start = new Date(responses.SummerSeason_SDate);
        var SummerS_EDate = new Date(responses.SummerSeason_EDate);
        var WinterS_SDate = new Date(responses.WinterSeason_SDate);
        var WinterS_EDate = new Date(responses.WinterSeason_EDate);
        console.log(SummerS_Start, SummerS_EDate, WinterS_SDate, WinterS_EDate);
        var W_dateDiff = Math.round((WinterS_EDate - WinterS_SDate) / (1000 * 60 * 60 * 24));
        var Winter_dateDiff = W_dateDiff;
        var S_dateDiff = Math.round((SummerS_EDate - SummerS_Start) / (1000 * 60 * 60 * 24));
        var Summer_dateDiff = S_dateDiff;
        var AllocatedDays = [];
        AllocatedDays.push({ No_Of_Shares: shares, Summer_Days: Summer_dateDiff, Winter_Days: Winter_dateDiff });

        console.log(Winter_dateDiff, Summer_dateDiff);
        res.json({
          Status: true,
          Data: { response, AllocatedDays },
        });
      });
    })
    .catch((error) => {
      res.json({
        Status: false,
      });
    });
};

// edit delete
const DeleteUnAvailableDaySingle = (req, res, next) => {
  const boat_id = mongoose.Types.ObjectId(req.body.Boat_id);
  unavailableSingle.updateMany(
    { Boat_Id: boat_id },
    {
      // UnAvailableDates:req.body.UnavailableDays,
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
        //Add
        Boats.findOne({ _id: mongoose.Types.ObjectId(boat_id) }).then((Boatresponses) => {
          let add_UnAvailabledays = new unavailableSingle({
            Boat_Id: boat_id,
            Boat_Name: Boatresponses.Boat_Name,
            UnAvailableDates: req.body.UnavailableDays,
            IsActive: true,
            Current_Time: moment(Date.now()),
            Update_Time: moment(Date.now()),
          });

          add_UnAvailabledays
            .save()
            .then((response) => {})
            .catch((error) => {});
          //Add

          res.json({
            status: true,
            message: "UnAvailable Days Details Deleted Successfully",
          });
        });
      }
    }
  );
};

const DeleteUnAvailableDayAll = (req, res, next) => {
  const UnAvail_id = req.body._id;
  unavailableForAll.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(UnAvail_id) },
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
          message: "UnAvailable Days Details Deleted Successfully",
        });
      }
    }
  );
};
const EditUnavailabledaysForAll = (req, res, next) => {
  //prevoius day
  var previous = 0;
  const UnAvail_id = req.body._id;
  var UnAvailableArr = req.body.UnAvailableDates;
  var arr = [...new Set(UnAvailableArr)];
  arr.map(async function (objs) {
    var unavail_days = objs;
    console.log(unavail_days, "hiiii");
    var unAvailable_days = moment(unavail_days);
    var dif = unAvailable_days.diff(moment(), "days");
    console.log(dif);
    if (dif < 0) {
      previous = 1;
    }
  });
  //previousday
  if (previous != 1) {
    Schedule.find({ IsActive: true, $or: [{ start_NoTime: UnAvailableArr }, { end_NoTime: UnAvailableArr }] }).then((result) => {
      console.log(result.length, "length");
      var _Length = result.length;
      if (_Length == 0) {
        console.log("hiiiiiiiiii");

        if (req.body.Status == "Enable") {
          var Module_status = 1;
        } else if (req.body.Status == "Disable") {
          var Module_status = 0;
        }
        unavailableForAll.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(UnAvail_id) },
          {
            UnAvailableDates: req.body.UnAvailableDates,
            Status: Module_status,
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
              res.json({
                status: true,
                message: "UnAvailable Days Details Updated Successfully",
              });
            }
          }
        );
      } else {
        res.json({
          status: true,
          message: "This Date have bookings please try another date",
        });
      }
    });
  } else {
    res.json({
      status: true,
      message: "You cannot add Previous Days",
    });
  }
};

const EditUnavailabledaysSingle = (req, res, next) => {
  var flag = 0;
  var previous = 0;
  var Boat_id = req.body.Boat_Id;
  const UnAvail_id = req.body._id;
  var UnAvailableArr = req.body.UnAvailableDates;
  var arr = [...new Set(UnAvailableArr)];
  console.log(arr);
  unavailableForAll.find({ IsActive: true }).then((response) => {
    var Results = JSON.stringify(response);

    data = JSON.parse(Results);

    var array = [];
    data.forEach(function (item) {
      array.push(item.UnAvailableDates);
    });
    var merged = [].concat.apply([], array);

    let uniqueChars = [...new Set(merged)];
    console.log(uniqueChars);

    try {
      arr.forEach((e1) =>
        uniqueChars.forEach((e2) => {
          if (e1 == e2) {
            flag = 1;
          } else {
          }
        })
      );
    } catch (e) {
      console.log("looop end");
    }

    console.log(flag);
    if (flag == 0) {
      if (req.body.Status == "Enable") {
        var Module_status = 1;
      } else if (req.body.Status == "Disable") {
        var Module_status = 0;
      }

      arr.map(async function (objs) {
        var unavail_days = objs;
        console.log(unavail_days, "hiiii");
        var unAvailable_days = moment(unavail_days);
        var dif = unAvailable_days.diff(moment(), "days");
        console.log(dif);
        if (dif < 0) {
          previous = 1;
        }
      });
      if (previous != 1) {
        Schedule.find({ Boat_Id: Boat_id, IsActive: true, $or: [{ start_NoTime: UnAvailableArr }, { end_NoTime: UnAvailableArr }] }).then((result) => {
          console.log(result.length, "length");
          var _Length = result.length;
          if (_Length == 0) {
            console.log("hiiiiiiiiii");

            unavailableSingle.findByIdAndUpdate(
              { _id: mongoose.Types.ObjectId(UnAvail_id) },
              {
                Boat_Id: req.body.Boat_Id,
                Boat_Name: req.body.Boat_Name,
                UnAvailableDates: req.body.UnAvailableDates,
                Status: Module_status,
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
                  res.json({
                    status: true,
                    message: "UnAvailable Days Details Updated Successfully",
                  });
                }
              }
            );
          } else {
            res.json({
              status: true,
              message: "This Date have bookings please try another date",
            });
          }
        });
      } else {
        res.json({
          status: false,
          message: "You cannot add Previous Days",
        });
      }
    } else {
      res.json({
        status: false,
        message: "Dates Not Available",
      });
    }
  });
};

// edit delete

const AddUnavailabledaysMultiple = (req, res) => {
  return new Promise(async (resolve, reject) => {
    let dataValidation = await validateAddUnavailabledaysMultiple(req.body);

    if (dataValidation.error) {
      let message = dataValidation.error.details[0].message.replace(/"/g, "");
      return reject({ status: true, message });
    }

    let { AllBoats, UnAvailableDates } = req.body || {};

    //check if any of the incoming dates are previous day

    let currentDate = moment(new Date()).format("MM/DD/YYYY");

    if (UnAvailableDates.filter((unAvailableDay) => new Date(currentDate).getTime() > new Date(unAvailableDay).getTime()).length) {
      return reject({ status: true, message: "You cannot add Previous Days." });
    }

    //check if unavailable days already have a booking

    //manually creating db query to match ate and boat


    let convertedUnavailableDays = UnAvailableDates.map((unAvailableDate) => new Date(new Date(new Date(unAvailableDate).setDate(new Date(unAvailableDate).getDate())).setUTCHours(0,0,0,0)));

    let boatIdQuery = [] 
    AllBoats.map(({Boat_Id})=> boatIdQuery.push({Boat_Id}))
    console.log(convertedUnavailableDays,'Unavailable Days')
    let dateQuery = []
    convertedUnavailableDays.map((convertedUnavailableDay)=>  dateQuery.push({$or:[{$and: [{ start_NoTime: { $lte: convertedUnavailableDay } }, { end_NoTime: { $gte: convertedUnavailableDay } }]},{end_NoTime:convertedUnavailableDay}]})) 
   

        let exisitingBooking = await Schedule.find({
          IsActive: true,
          $and:[{ $or:boatIdQuery},{$or:dateQuery}]
             
        }).catch((error) => {
          console.log(error);
          return reject({ status: true, message: "Something went wrong try again." });
        });

     
        if (exisitingBooking.length) {
          return reject({ status: true, message: `One of these date have bookings on boat ${exisitingBooking[0].Boat_Name}, try another date.` });
        }

       
     

    // UnAvailableDates = UnAvailableDates.map((UnAvailableDate) => moment(UnAvailableDate, "MM-DD-YYYY").format("DD/MM/YYYY"));
  

    let convertedDocuments = [];

    for (let { Boat_Id, Boat_Name } of AllBoats) {
      convertedDocuments.push({
        Boat_Id,
        Boat_Name,
        UnAvailableDates,
      });
    }

    await unavailableSingle.insertMany(convertedDocuments).catch((error) => {
      console.log(error);
      return reject({ status: true, message: "Something went wrong try again." });
    });

    return resolve({ status: true, message: "Unavailable dates successfully added." });
  })
    .then((response) => {
      return res.json(response);
    })
    .catch((error) => {
      return res.json(error);
    });
};

module.exports = {
  AddNewShares,
  AddConsecutiveDays,
  AddNextBookings,
  EditNewShares,
  EditConsecutiveDays,
  EditNextBookings,
  DeleteShares,
  DeleteNextBooking,
  DeleteConsecutiveDays,
  ViewAllShares,
  ViewAllConsecutiveDays,
  ViewAllNextBookings,
  GetConsecutiveDaysByBoatId,
  GetNextBookingDaysByBoatId,
  AddUnavailabledaysForAll,
  AddUnavailabledaysSingle,
  GetAllUnAvailableDays,
  GetUnAvailabeDaysOfBoats,
  ViewBookingdays_LaunchPreLuanch,
  AddBookingForLaunch_PreLuanch,
  DeleteBookingForLaunch_PreLuanch,
  EditBookingForLaunch_PreLuanch,
  ViewAllPreLaunchAndLaunchBookingDays,
  GetShareDetailsByBoatId,
  DeleteUnAvailableDaySingle,
  DeleteUnAvailableDayAll,
  EditUnavailabledaysForAll,
  EditUnavailabledaysSingle,
  AddUnavailabledaysMultiple,
};

