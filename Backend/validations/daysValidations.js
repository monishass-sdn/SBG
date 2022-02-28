const Joi = require('joi');


const validateAddConsecutiveDaysAndAddBookingForLaunch_PreLuanch = (data) =>{

    const schema = Joi.object({
        Block: Joi.boolean().required().label('Block'),
        Boat_Id: Joi.string().required().label("Boat Id"),
        Boat_Name: Joi.string().required().label("Boat Name"),
        Booking_Days: Joi.number().required().label('Booking Days'),
        IsActive: Joi.boolean().required().label("Active"),
        No_Of_WeekDays: Joi.number().required().label('No of Weekdays'),
        No_Of_WeekEndDays: Joi.number().required().label("No of Weekends"),
        Status: Joi.string().required().label("Account Status"),
        Summer_ConsecutiveDays: Joi.number().required().label("Summer ConsecutiveDays"),
        Winter_ConsecutiveDays: Joi.number().required().label("Winter ConsecutiveDays")
    })

    return schema.validate(data)
}


const validateAddUnavailabledaysMultiple = (data)=>{
    
    const schema = Joi.object({

        AllBoats:Joi.array().required().label("All boats"),
        UnAvailableDates:Joi.array().required().label("Unavailable Dates")
    })


    return schema.validate(data)
}

module.exports = {validateAddConsecutiveDaysAndAddBookingForLaunch_PreLuanch,validateAddUnavailabledaysMultiple}