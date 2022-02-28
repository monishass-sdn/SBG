const Joi = require("joi");

const validateGetBoatDatesOverViewByDate = (data)=>{

    let schema = Joi.object({
        SearchType:Joi.string().required().max(25).label("Serach Type"),
        from:Joi.string().required().max(50).label('From'),
        to:Joi.string().required().max(50).label('To'),
        

    })


    return schema.validate(data);
}


module.exports = {validateGetBoatDatesOverViewByDate}