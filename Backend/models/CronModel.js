const mongoose = require('mongoose');

let cronSchema = mongoose.Schema({

    boatId: String,
    cronExecutionTime:Date

})

const cronModel = mongoose.model('cron',cronSchema);

module.exports = cronModel;