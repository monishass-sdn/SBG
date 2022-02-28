const LoginModel = require("../models/LoginModel");
const { validateCreateSubAdmin , deleteAdminValidation,validateEditSubAdmin,validatePhone} = require("../validations/adminValidations");
const bcrypt = require('bcryptjs');


const CreateSubAdmin = (req,res)=>{

    return new Promise(async(resolve,reject)=>{

        //validate incoming data

        let dataValidation = await validateCreateSubAdmin(req.body);

        
        if (dataValidation.error) {
             let message = dataValidation.error.details[0].message.replace(/"/g, "");
            return reject({ status: false, message });
        }

        const phonevalidation = await validatePhone(req.body.Phone);

        if(phonevalidation.status == false){
      
          return res.json({ status: false, message:phonevalidation.message });
      
        }

        //Validation end

        let {Email,Username,Password,Permissions,Phone} = req.body;

        //check if a user in same email or username exist 

     let admin =  await LoginModel.findOne({$or:[{Email},{Username}]}).catch((error)=>{
           console.log(error)
           return reject({status:false,message:'Something went wrong try again.'})
       })

    if(admin)  return reject({status:false,message:'Admin with this email or username already exist.'})


    // hash password

     Password = await bcrypt.hash(Password,12).catch((error)=> {
            console.log(error)
            return reject({status:false,message:'Something went wrong try again.'})
        
       })

    

  let UserType = "Sub Admin";
  let Block = true;
  let IsActive = true;

    admin = await new LoginModel({
        Email,
        Username,
        Password,
        Phone,
        Permissions,
        UserType,
        Block,
        IsActive
    }).save().catch((error)=>{
        console.log(error)
        return reject({status:false,message:'Something went wrong try again.'})
    })

    return resolve({status:true,message:'Admin created successfully.'})

    }).then((response)=>{
       return res.json(response)
    }).catch((error)=>{
       return res.json(error)
    })

}


const GetAllSubAdmin = (req,res)=>{

    return new Promise(async(resolve,reject)=>{

        const allSubAdmin = await LoginModel.find({UserType:"Sub Admin",IsActive:true},{Password:0}).catch((error)=>{
            console.log(error)
            return reject({status:false,message:'Something went wrong try again.'})

        })

        return resolve({status:true,response:allSubAdmin})

    }).then((response)=>{
        return res.json(response)
     }).catch((error)=>{
        return res.json(error)
     })

}


const DeleteSubAdmin = (req,res)=>{

    return new Promise(async(resolve,reject)=>{

        //validate incoming data

        let dataValidation = await deleteAdminValidation(req.body);

        
        if (dataValidation.error) {
             let message = dataValidation.error.details[0].message.replace(/"/g, "");
            return reject({ status: false, message });
        }

        //Validation end

        let _id = req.body._id


        let updatedAdmin = await LoginModel.findOneAndUpdate({_id,UserType:"Sub Admin"},{IsActive:false},{new:true}).catch((error)=>{
            console.log(error)
            return reject({status:false,message:'Something went wrong try again.'})
        })

        if(!updatedAdmin) return reject({status:false,message:"Invalid ID."})

        return resolve({status:true,message:"Admin deleted successfully."})
        

    }).then((response)=>{
        return res.json(response)
     }).catch((error)=>{
        return res.json(error)
     })

}

const EditSubAdmin = (req,res)=>{

    return new Promise(async(resolve,reject)=>{

        let dataValidation = await validateEditSubAdmin(req.body);

        
        if (dataValidation.error) {
             let message = dataValidation.error.details[0].message.replace(/"/g, "");
            return reject({ status: false, message });
        }

        const phonevalidation = await validatePhone(req.body.Phone);

        if(phonevalidation.status == false){
      
          return res.json({ status: false, message:phonevalidation.message });
      
        }

        let {_id,Email,Username,Password,Permissions,Phone} = req.body;


         //check if a user in same email or username exist 

     let admins =  await LoginModel.find({$or:[{Email},{Username}],IsActive:true}).catch((error)=>{
           console.log(error)
           return reject({status:false,message:'Something went wrong try again.'})
       })


    for (const admin of admins) {
        if(admin._id.toString() !== _id && Email === admin.Email || admin._id.toString() !== _id && Username === admin.Username)  return reject({status:false,message:'Someone else is already using this email or username.'})
    }


    // hash password

    Password = await bcrypt.hash(Password,12).catch((error)=> {
        console.log(error)
        return reject({status:false,message:'Something went wrong try again.'})
    
   })
  
     let updatedAdmin = await LoginModel.findOneAndUpdate({_id,UserType:"Sub Admin"},{
        Email,
        Username,
        Password,
        Permissions,
        Phone

     },{new:true}).catch((error)=>{
            console.log(error)
            return reject({status:false,message:'Something went wrong try again.'})
        })

        if(!updatedAdmin) return reject({status:false,message:"Invalid ID."})

        return resolve({status:true,message:"Admin details updated successfully."})

    }).then((response)=>{
        return res.json(response)
     }).catch((error)=>{
        return res.json(error)
     })

}






module.exports = {CreateSubAdmin,GetAllSubAdmin,DeleteSubAdmin,EditSubAdmin,}