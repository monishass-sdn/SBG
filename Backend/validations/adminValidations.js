const Joi = require("joi");

const validateCreateSubAdmin = (data)=>{

    let schema = Joi.object({
        Username:Joi.string().required().max(25).label("Username"),
        Email:Joi.string().email().required().max(50).label('Email'),
        Password:Joi.string().required().max(100).label("Password"),
        Permissions:Joi.object().required().max(200),
        Phone: Joi.number()
      .required()
      .label("Phone Number"),

    })


    return schema.validate(data);
}


const deleteAdminValidation = (data)=>{

    let schema = Joi.object({
        _id:Joi.string().required().max(50).label("ID")
    })

    return schema.validate(data)
}
const validatePhone = async(emergency)=>{

    let tempObj = {
      status: true
  }
  
  if(emergency.toString().length > 10)
  
  {
  
    tempObj.status = false;
    
    tempObj.message="Phone number should not exceed 10 digits";
  
  
  }
  
     return tempObj;
  
  }

const validateEditSubAdmin = (data)=>{

    let schema = Joi.object({
        _id:Joi.string().required().max(50).label("ID"),
        Username:Joi.string().required().max(25).label("Username"),
        Email:Joi.string().email().required().max(50).label('Email'),
        Password:Joi.string().required().max(100).label("Password"),
        Permissions:Joi.object().required().max(200),
        Phone: Joi.number()
        .required()
        .label("Phone Number"),

    })


    return schema.validate(data);
}



module.exports = {validateCreateSubAdmin,deleteAdminValidation,validateEditSubAdmin,validatePhone}