const Joi = require("joi");

const validateAddOwner = (data) => {
  const schema = Joi.object({
    Block: Joi.boolean().label("Block").allow(null,''),
    Email: Joi.string().email().required().label("Email"),
    //Emergency_Contact_Mobile: Joi.number().required().label("Emergency contact mobile"),
    
   
    First_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("First name should not contain any number.")
      .required()
      .label("First Name"),
    Home_Address: Joi.string().label("Home Adress").allow(null,''),
    Family_Name: Joi.string().label("Family_Name").allow(null,''),
    Emergency_Contact_Mobile: Joi.number().label("Emergency contact mobile").allow(null,''),
    Emergency_Contact_Name:Joi.string().label("Emergency_Contact_Name").allow(null,''),
    Housekeeping: Joi.string().valid("High", "Medium", "Low").required().label("Housekeeping"),
    Last_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("Last name should not contain any number.")
      .required()
      .label("Last Name"),
      Mobile: Joi.number()
      .required().label("Mobile"),
    
    Notes: Joi.string().label("Notes").allow(null,''),
    Parking_Ability: Joi.string().valid("Expert", "Intermediate", "Beginner", "Need Assistance").required().label("Parking Ability"),
    Password: Joi.string().required().label("Password"),
    DecryptPassword: Joi.string().required().allow(null,''),
    Sailing_Ability: Joi.string().valid("Expert", "Intermediate", "Beginner", "Need Assistance").required().label("Sailing Ability"),
    Profile_Image:Joi.string().label("Profile Image").allow(null,''),
    IsActive:Joi.boolean().label("Is Active").allow(null,'')
  });

  return schema.validate(data);
};


const validateEditOwner = (data)=>{
  const schema = Joi.object({
    Block: Joi.boolean().label("Block").allow(null,''),
    Email: Joi.string().email().required().label("Email"),
    /*Emergency_Contact_Mobile: Joi.number()
      .required()
      .label("Emergency contact number"),
    Emergency_Contact_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("Emergency contact name should not contain any number.")
      .required()
      .label("Emergency contact name"),
    Family_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("Family name should not contain any number.")
      .required()
      .label("Family Name"),*/
    First_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("First name should not contain any number.")
      .required()
      .label("First Name"),
    Home_Address: Joi.string().label("Home Adress").allow(null,''),
    Family_Name: Joi.string().label("Family_Name").allow(null,''),
    Emergency_Contact_Mobile: Joi.number().label("Emergency contact mobile").allow(null,''),
    Emergency_Contact_Name:Joi.string().label("Emergency_Contact_Name").allow(null,''),
    Housekeeping: Joi.string().valid("High", "Medium", "Low").required().label("Housekeeping"),
    Last_Name: Joi.string()
      .regex(/^([^0-9]*)$/)
      .message("Last name should not contain any number.")
      .required()
      .label("Last Name"),
    Mobile: Joi.number()
      .required()
      .label("Mobile"),
    Notes: Joi.string().label("Notes").allow(null,''),
    Parking_Ability: Joi.string().valid("Expert", "Intermediate", "Beginner", "Need Assistance").required().label("Parking Ability"),
    Password: Joi.string().required().allow(null,''),//Joi.string().label("Password").allow(null,''),
    DecryptPassword: Joi.string().required().allow(null,''),
    Sailing_Ability: Joi.string().valid("Expert", "Intermediate", "Beginner", "Need Assistance").required().label("Sailing Ability"),
    Profile_Image:Joi.string().label("Profile Image").allow(null,''),
    IsActive:Joi.boolean().label("Is Active").allow(null,''),
    _id:Joi.string().required().max(100).label("Owner Id")
  });

  return schema.validate(data);
}

const validatePhone = async(emergency)=>{

  let tempObj = {
    status: true
}

if(emergency.toString().length > 10)

{

  tempObj.status = false;
  
  tempObj.message="Emergency number should not exceed 10 digits";


}

   return tempObj;

}

const validatemobile = async(mobile)=>{

  let tempObj = {
    status: true
  }
 if(mobile.toString().length >10){

  tempObj.status = false;
  
  tempObj.message="Mobile number should not exceed 10 digits";


}

return tempObj;

}
 
module.exports = { validateAddOwner,validateEditOwner,validatePhone,validatemobile};
