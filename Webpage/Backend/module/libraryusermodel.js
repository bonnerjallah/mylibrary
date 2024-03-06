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
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "libraryUsers"},
        userName: {type: String, required: true},
        profilePic: {type: String}
    }], 

    following:[{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "libraryUsers"},
        userName: {type: String, required: true},
        profilePic: {type: String}
    }],

    messages:[{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "libraryUsers"},
        userName: {type: String, required: true},
        profilePic: {type: String},
        content: String
    }],

    reviewer: {
        type: Boolean,
        default: false
    }

})

const LibraryUsers = mongoose.model("libraryUsers", libraryUsersSchema)

module.exports = LibraryUsers;