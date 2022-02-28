const Joi = require("joi");

const validatemanageOwner = (data) => {
    const schema = Joi.object({
        id :Joi.string().required().label("id"),
        Boat_Id :Joi.string().required().label("Boat_Id"),
        Owner_Id :Joi.string().required().label("Owner_Id"),
      Owner_Name: Joi.string().required().label("Owner Name"),
      Boat_Name: Joi.string().required().label("Boat Name"),
      Boat_Type: Joi.string().label("Boat_Type").allow(null,''),
        No_of_SummerWeekDays: Joi.number()
        .required()
        .label("SummerWeekDays"),
        No_of_SummerWeekEndDays: Joi.number()
        .required()
        .label("SummerWeekEndDays"),
        No_of_WinterWeekDays: Joi.number()
        .required()
        .label("WinterWeekDays"),
       No_of_WinterWeekEndDays: Joi.number().required().label("WinterWeekEndDays"),
       ShareAllocation:Joi.string().label("Share Allocation").allow(null,''),
       Owners_Allowed: Joi.number().required().label("Owners Allowed"),
     
     
    });
 
    return schema.validate(data);
  };
  
  module.exports = {validatemanageOwner};  