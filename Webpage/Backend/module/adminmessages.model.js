const mongoose = require("mongoose")

const adminMessageSchema = new mongoose.Schema({

    messages : [{
        userId: String,
        msg: String,
        timestamp:{type: Date, default: Date.now} 
    }],

    reviewerrequestmsgs : [{
        userId: String,
        msg: String,
        avgbooksread: Number,
        userage: Number,
        timestamp: {type: Date, default: Date.now}
    }]

})

const AdminMessages = mongoose.model("adminmessage", adminMessageSchema)

module.exports = AdminMessages