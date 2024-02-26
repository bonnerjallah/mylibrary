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
const refToken = process.env.VITE_jwtRefreshSecret

app.use(cookieParser())

app.use(cors ({
    origin: ["http://localhost:5174"],
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
                const refresh_token = jwt.sign({user: userData}, refToken, {expiresIn: "1hr"})

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

//Middleware to validate access token
const validateAccessToken = (req, res, next) => {
    const accessToken = req.cookie.token
    if(accessToken){
        return res.status(401).json({error: "Access token is missing"})
    }

    jwt.verify(accessToken, jwtSec, (err, decoded) => {
        if(err){
            console.error("Error verifying access token", err)  
            return res.status(401).json({error: "Invalid access token"})
        }

        //if token is valid, set user information in req.user
        req.user = decoded.user
        next()
    })
}

//Refresh token route
app.post("/refresh_token", (req, res) => {
    //Check if a valid refresh token is present in the request cookie
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({error: "refresh token is missing"})
    }

    //Verify refresh token
    jwt.verify(refreshToken, refToken, (err, decoded) => {
        if(err){

            //Token valid or has expire
            return res.status(401).json({error: "Invalid or expired refresh token"})
        }

        //Extract user data from the decoded refresh token payload
        const userData = decoded.user

        //Generate a new refresh token
        const newAccessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "15min"})

        //Send new refresh token to the client
        res.cookie("token", newAccessToken)
        return res.status(200).json({message: "Token refresh successfully"})
    })
})

//Get library user data
app.get("/libraryusers", async(req, res) => {
    try {
        if(req.user){
            return res.status(200).json({valid: true, user: req.user})
        }else {
            console.error("Token validation failed")
            return res.status(401).json({valid: false, error: "Unauthorized user"})
        }
    } catch (error) {
        console.log("Error fetching user", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.listen(3001, () => {
    console.log("listening to port 3001")
})