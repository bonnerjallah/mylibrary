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
        type: String,
    }], 

    following:[{
        type: String,
    }],

    messages:[{
        userId: String,
        userName: {type: String, required: true},
        profilePic: String,
        content: String
    }],

    reviewer: {
        type: Boolean,
        default: false
    },

    
    reviewandrating : [{
        bookId: String,
        review: String,
        rating: Number,
        recommend: String,
        currentlyreading: String
    }],

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
    }]

})

const LibraryUsers = mongoose.model("libraryUsers", libraryUsersSchema)

module.exports = LibraryUsers;