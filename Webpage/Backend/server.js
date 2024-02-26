const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")

const bcrypt = require("bcrypt")
const saltRounds = 10
const cookieParser = require("cookie-parser")

//Moduels
const LibraryUsers = require("./module/libraryusermodel")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Database Connection
mongoose.connect("mongodb://localhost:27017/mylibrary")

//jwt and refresh token
const jwtSec = process.env.VITE_jwtSecret
const refreshToken = process.env.VITE_jwtRefreshSecret

app.use(cookieParser())

app.use(cors ({
    origin: ["http://localhost:5173"],
    methods: ["POST, GET, PUT"],
    credentials: true
}))

app.post("/registerlibraryusers", async (req, res) => {
    try {
        const {firstname, lastname, birthday, address, city, state, postalcode, phonenumber, email, password} = req.body;

        if(!firstname || !lastname || !birthday || !address || !city || !state || !postalcode || !email || !password) {
            return res.status(400).json({message: "All fields Required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email address"});
        }

        const hashPwd = await bcrypt.hash(password, saltRounds)

        const newUser = await db.LibraryUsers.create({...req.body, password: hashPwd})

        return res.json(newUser)   
        
    } catch (error) {
        console.log("Error inserting register data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.get("/loginlibraryusers", async(req, res) => {
    try {
        const {username, password} = req.body

        if(!username || !password){
            return res.status(400).json({message: "All field require"})
        }

        const results = await LibraryUsers.findOne({username})

        if(results){
            const hashedPassword = results.password

            const passwordMatch = await bcrypt.compare(password, hashedPassword)

            if(passwordMatch){
                const userData = {
                    id: results._id,
                    firstName: results.firstname,
                    lastName: results.lastname,
                    userName: results.username
                }

                //Generate Jwt Token
                const accessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "15min"})
                const refresh_token = jwt.sign({user: userData}, refreshToken, {expiresIn: "1hr"})

                //Send Token to Client
                res.cookie("token", accessToken)
                res.cookie("refreshToken", refresh_token, {httpOnly: true})

                return res.status(200).json({
                    message: "Login Successfull",
                    userData: userData
                })
            } else{
                return res.status(401).json({message: "Invalid Password"})
            }
        } else {
            return res.status(404).json({message: "Invalid username"})
        }
        
    } catch (error) {
        console.log("Error loging in user", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.listen(3001, () => {
    console.log("listening to port 3001")
})