const Joi = require("joi");

const validateIsLOAInclued = (data)=>{

    let schema = Joi.object({
        bookingId:Joi.string().required().max(50).label("Booking ID"),
        incomingStartDate:Joi.string().required().max(150).label('Edit start date'),
        incomingEndDate:Joi.string().required().max(150).label('Edit end date'),
        

    })


    return schema.validate(data);
}


module.exports = {validateIsLOAInclued}