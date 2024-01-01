const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema({
    firstname: {
        type: String,   
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const AdminUsers = mongoose.model("adminuser", AdminUserSchema);

module.exports = AdminUsers;


