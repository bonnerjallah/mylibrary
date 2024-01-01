const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")


const bcrypt = require("bcrypt")
const saltRounds = 10


//Modules
const AdminUsers = require("./module/adminusermodel")


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"]
}))



mongoose.connect("mongodb://localhost:27017/mylibrary")



app.post("/registeradminusers", async (req, res) => {
    try {
        const{firstname, lastname, email, username, password} = req.body

        if(!firstname || !lastname || !email || !username || !password) {
            res.status(400).json({message: "All fields required"})
        }

        const hashPwd = await bcrypt.hash(password, saltRounds)

        const results = await AdminUsers.create({...req.body, password: hashPwd})

        res.json(results)

    } catch (error) {
        console.error("Error adding admin user", error)
        res.status(500).json({message: "Interna server issue"})
    }
})

app.get("/adminusers", async (req, res) => {
    try {
        const result = await AdminUsers.find().exec();
        res.json(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "An internal server issue" });
    }
});




app.listen(3001, () => {
    console.log("listening to port 3001")
})

