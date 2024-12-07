require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {dbName: "consciousLibrary"})

        console.log("Connected to conscious library database")
        
    } catch (error) {
        console.log("Error connecting to database", error)
    }
}


module.exports = connectDB