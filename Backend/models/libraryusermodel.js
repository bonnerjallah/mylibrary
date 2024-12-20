const mongoose = require("mongoose");

const libraryUsersSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },

    lastname:{
        type: String,
        required: true
    },

    birthday: {
        type: Date,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type:String,
        required: true
    },

    postalcode: {
        type: String,
        required: true
    },

    phonenumber:{
        type: String,
        default: ""
    },

    email:{
        type:String,
        required: true
    },

    username:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true,
    },

    profilepic:{
        type: String
    },

    followers:[{
        type: [String],
        default: []
    }], 

    following:[{
        type: String,
    }],

    messages:[{
        senderId: String,
        senderName: {type: String, required: true},
        senderProfilePic: String,
        content: String,
        date : {
            type: Date,
            default: Date.now
        },
        reminder: String
    }],

    reviewer: {
        type: Boolean,
        default: false
    },

    shelf:[{
        bookid: String,
        completed: String,
        inprogress: String,
        iown: String,
        forlater: String,
        placeholder: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],

    checkout: [{
        bookid: String,
        checkoutdate: String,
        expectedreturndate: String,
        datereturn: String
    }],

    fees:{
        type: Number
    },

    posts:[{
        postpic: { type: String },
        postcontent: { type: String },
        postreactions: {
            likeby: [{ type: String }],
            loveby: [{ type: String }],
            laughby: [{ type: String }],
            cryby: [{ type: String }]
        },
        postcomments:[{
            commenter: { type: String },
            comment: { type: String }
        }]
    }]
})

const LibraryUsers = mongoose.model("libraryUsers", libraryUsersSchema)

module.exports = LibraryUsers;