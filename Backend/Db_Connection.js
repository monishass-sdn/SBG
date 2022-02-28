// var fileUpload = require('express-fileupload');
var fs = require("fs");
const mongoose = require("mongoose")
const express = require("express")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors');
var path = require('path');

const app = express();app.use(cors());

//project required Models 13-3-2021
require('./models/LoginModel'); //Login jibin
require('./models/BoatTypeModel'); //BoatType
require('./models/BoatLocationModel'); //Boat Loaction
require('./models/AddBoatModel'); //New Boat
require('./models/SeasonModel'); //Adding summer/winter 13-2-2021
require('./models/AddOwnerModel'); //Adding Owner 13-2-2021
require('./models/OwnershipDuration'); //Adding Owner 16-2-2021
require('./models/AddNewShareModel'); //Adding Shares 
require('./models/ConsecutiveDaysModel'); //Adding ConsecutiveDays 
require('./models/NextBookingModel'); //Adding NextBooking 
require('./models/AdminBookingModel'); //Adding AdminBooking 
require('./models/BookingMaintenanceModel'); //Adding Booking Maintenance
require('./models/ScheduleModel'); //Adding Schedule 
require('./models/OwnerBookingModel'); //Adding OwnerBooking 
//project required Models 13-3-2021

//project modules 13-3-2021
const loginRoute = require('./routes/Login')
const boatRoute = require('./routes/Boat')
const ownerRoute = require('./routes/Owner');
const dayRoute = require('./routes/DaysSettings');
const bookingRoute = require('./routes/AdminBooking');
const scheduleRoute = require('./routes/Schedule');
const ownerbookingRoute = require('./routes/OwnerBooking');
const maintenanceRoute = require('./routes/Maintenance');
//projec modules 13-3-2021


// connect with db
mongoose.connect('mongodb://SBR:S1BR73@54.201.160.69:58173:58173/SBR', { useNewUrlParser: true })

//mongoose.connect('mongodb://SBR:S1BR73@localhost:27017/SBR', { useNewUrlParser: true })

//mongoose.connect('mongodb://SBG:S1BR73@localhost:27017/SBG', { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true,useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to db"));

db.once('open', function () {
console.log("connected to DB");
})

module.exports = db;
// connect with db
app.use(bodyParser.urlencoded({limit: '50mb',extended : true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan('dev'))
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(bodyParser.json())
app.listen(9049, () => console.log(`Server running on port 9049`));

// project routes
app.use('/api/Login', loginRoute)//login 9-3-2021
app.use('/api/Boat', boatRoute)//boat 9-3-2021
app.use('/api/Owner', ownerRoute)//owner 13-3-2021
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/Days', dayRoute)//Settings 04.05.2021
app.use('/api/Booking', bookingRoute)//admin booking 27.04.2021
app.use('/api/Schedule', scheduleRoute)//Settings 11.05.2021
app.use('/api/Maintenance', maintenanceRoute)//booking maintenance 11.05.2021
app.use('/api/Ownerbooking', ownerbookingRoute)//owner booking 11.05.2021
// app.use('/api/uploads', upload)//owner 13-3-2021


// project routes

// cors
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
// cors