const mongoose = require("mongoose")

const reviewerRequestSchema = new mongoose.Schema({
    userId : {type: String},
    shortbio : { type: String},
    overage : {type: String},
    avgbooksread: {type: String}
})

const ReviewRequestMsg = mongoose.model("reviewerrequestmessages", reviewerRequestSchema)

module.exports = ReviewRequestMsg