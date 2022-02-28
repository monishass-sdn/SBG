
//AuthorName:JIBIN B RAJ
//File:logincontroller.js
//Module:Login
//Created Date:09.03.2021
//Purpose:To Save the Details of adding a new Boat in the Database.

const log1 = require('../models/LoginModel');
var loginData = require('../EmailCredentials');
const { gmail: { host, pass } } = loginData;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const async = require('async')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { Op } = require('sequelize')
const mongoose = require("mongoose")
const moment  = require('moment');
const transporter = require('../email/transporter');
const getEmailTemplate = require('../email/emailTemplate');


//SHOW ALLL
const index = (req, res, next) => {  
    log1.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}
//view using ID
const show = (req, res, next) => {
    let userid = req.body.userid
    log1.findById(userid)
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'AN ERROR OCCURED'
            })
        })
}
// Register
const Store = (req, res, next) => {
    bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }

        let Add_User = new log1({

            Email: req.body.Email,
            User_Type: req.body.User_Type,
            Password: hashedPass,
            Block: req.body.Block,
            IsActive: true,
            Current_Time:moment(Date.now()),
            Update_Time:moment(Date.now())

        })
        Add_User.save()
            .then(response => {
                res.json({
                    message: 'User Added Successfully',
                    data:Add_User
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    })
}

// login 
const Login = (req, res, next) => {
    var username = req.body.Email
    var password = req.body.Password
    
    log1.findOne({IsActive:true, $or: [{ Email: username }, { Email: username }] })
        .then(user => {           
            if (log1) {

               try
               {
                
                bcrypt.compare(password, user.Password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ name: user.Email }, 'verySecretValue', { expiresIn: '1h' })
                        res.json({
                            status:true,
                            message: ' Login Successfully',
                            data:user,
                            token
                        })
                    } else {
                        res.json({
                            status:false,
                            message:'Password does not match our records. Please try again'
                        })
                    }
                
                    })
                }
            
        
          catch(error)
          {
            res.json({
                status:false,
                message: 'No User Found'
            })
          }          
            
    }

        })
    
    
}

//forget password jibin 6/2/2021


const ResetPassword = (req, res, next) => {
    var Emailid=req.body.Email;
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            log1.findOne({"Email":{$regex :Emailid} }, (err, user) => {
                if (!user) {
                    res.json({
                        status:false,
                        info: 'No User Found'
                    })
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            const emailState =  'Successfully Registered..';
            const emailContent = `Dear Admin this is a confirmation that the password for your account ${user.Email} has just been changed.`;
            const emailDetailName = 'Registration Details'
            const emailDetails = [
              { key: 'Your password reset Token', value: token  },
            
            ];
            const emailNameAndLink = {
              name:'Login Link',
              link:`${process.env.CLIENT_URL}/Reset-Password`
            }
 

            var mailOptions = {
                from:host,
                to: user.Email,
                subject: 'SmartBoating',
                html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
            
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        status:true,
                        info: 'A password reset email has been sent to your account. Please follow the instructions to continue resetting your password. If you do not receive it then check your spam folder.'
                    })
                }
            });           

        }
    ], function (err) {
            if (err)
                return next(err);
            else {
                res.json({
                    message: 'Error'
                })
            }
    });

}

//reset Password 6/2/2021

const ChangePassword = function (req, res) {
    bcrypt.hash(req.body.Password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }

    async.waterfall([
        function (done) {
            log1.findOne({ resetPasswordToken: req.body.resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } }, function (err, user, next) {
                if (!user) {
                    res.json({
                        Status:false,
                        message: 'Invalid Token'
                    })
                }
                

                user.Password = hashedPass /*req.body.Password;*/ /*bcrypt.hash(req.body.Password, 10)*/
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save((err) => {
                    done(err, user);
                });
                
                              
            });
        },

        function (user, done) {
            // console.log('got this far 4')
           
            const emailState =  'Password Reset Successfully.';
            const emailContent = `This is a confirmation that the password for your account ${user.Email} has just been changed.`;
            const emailDetailName = 'Registration Details'
            const emailDetails = [
              { key: 'Name', value: 'Administrator' },
              //{ key: 'Email', value: user.Email},
            ];
            const emailNameAndLink = {
              name:'Login Link',
              link:`${process.env.CLIENT_URL}`
            }
 
 
 

            var mailOptions = {
                to: user.Email,
                from: host,
                subject: 'Your password has been changed',
                html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)

            };
            transporter.sendMail(mailOptions, function (err) {
                res.json({
                    Status:true,
                    message: 'Successfully send'
                })
            });
        }
    ], function (err) {
            res.json({
                message: err
            })
    });
    })
}

const ChangeAdminPassword = function (req, res) {
    const admin_id=mongoose.Types.ObjectId(req.body.Admin_Id);
    console.log(admin_id) 
    const OldPassword=req.body.OldPassword;
    bcrypt.hash(req.body.NewPassword, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        
            log1.findById({_id:mongoose.Types.ObjectId(admin_id)})
            .then(results=> {
              
                var oldpassword=results.Password;
                var Email=results.Email
                bcrypt.compare(OldPassword, oldpassword, function (err, Presult) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                console.log(hashedPass,'this')
                if(Presult)
                {
                    log1.findByIdAndUpdate({_id:mongoose.Types.ObjectId(admin_id)}, 
                    { 
                        
                        
                            Password: hashedPass,  //Added by chitra   on 13.04.2021                                            
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

                            const emailState =  'Password Changed Successfully.';
                            const emailContent = `Dear Administrator, this is a confirmation that the password for your account ${Email} has just been changed.`;
                            const emailDetailName = 'Registration Details'
                            const emailDetails = [
                              { key: 'Name', value: Administrator },
                              { key: 'Email', value: Emaill },
                            ];
                            const emailNameAndLink = {
                              name:'Login Link',
                              link:`${process.env.CLIENT_URL}/owner-login`
                            }
                 

                        
                            var mailOptions = {
                                to: Email,
                                from: "noreply.smartboatbooking@gmail.com",
                                subject: 'Your password has been changed',                               
                                html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                               
                            };
                            smtpTrans.sendMail(mailOptions, function (err) {
                              
                                res.json({
                                    Status:true,
                                    message: 'Password Updated Successfully'
                                })
                            });
                          
                                                         
                        }
                    }); 

                }
                else
                {
                    res.json({ 
                        status:false,
                        message: 'Password Doesnt Match'
                    })
                }
            })
   
    })
})
}

module.exports = {index,show, Store, Login, ResetPassword,ChangePassword,ChangeAdminPassword}//6/2/2021