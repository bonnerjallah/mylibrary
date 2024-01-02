const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")


const bcrypt = require("bcrypt")
const saltRounds = 10


//Modules
const AdminUsers = require("./module/adminusermodel")


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


mongoose.connect("mongodb://localhost:27017/mylibrary")

const jwtSec = process.env.VITE_jwtSecret
const refshToken = process.env.VITE_jwtSecret


app.use(cookieParser())


app.use(cors({
    origin: ['http://localhost:5174'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))



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
        res.status(500).json({message: "Internal server issue"})
    }
})

app.post("/loginadminusers", async (req, res) => {
    try {
        const {username, password} = req.body

        if(!username || !password) {
            return res.status(400).json({ message: "Both username and password are required" });
        }

        const results = await AdminUsers.findOne({username})

        if(results) {
            const hashedPassword = results.password

            const passwordMatch = await bcrypt.compare(password, hashedPassword)

            if(passwordMatch) {
                const userData = {
                    id: results._id,
                    firstname: results.firstname,
                    lastname: results.lastname,
                    username: results.username
                }

                //Generate a JWT token
                const accessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "10m"})
                const refreshToken = jwt.sign({user: userData}, refshToken, {expiresIn: "1h"})

                //Send token to client
                res.cookie("token", accessToken)
                res.cookie("refreshToken", refreshToken, { httpOnly: true })

                return res.status(200).json({message: "Login Successful", userData:userData})

            } else {
                return res.status(401).json({message: "Invalid Password"})
            }
        } else {
            return res.status(404).json({message: "User not found"})
        }

    } catch (error) {
        console.error("Error login in user", error)
        res.status(500).json({message: "Internal server issue"})
    }
})


//Middleware to validate access token
const validateAccessToken = (req, res, next) => {
    const accessToken = req.cookies.token; //Because the token was sent with cookie
    if(!accessToken) {
        return res.status(401).json({error: "Access token is missing"})
    }

    jwt.verify(accessToken, jwtSec, (err, decoded) => {
        if(err) {
            console.error("Error verifying access token", err)
            return res.status(401).json({error: "Invalid access token"})
        }

        //Iftoken is valid, set the user information in req.user
        req.user = decoded.user
        next()
    })
}

//Refresh token route
app.post("/refresh_token", async (req, res) => {
    //Check if a valid refresh token is present in the request cookies
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({errer: "refreshtoken is missing"})
    }

    //Verify the refresh token
    jwt.verify(refreshToken, refshToken, (err, decoded) => {
        if(err) {

            //Token is valid or has expire
            return res.status(401).json({error: "Invalid or expired refresh token"})
        }

        //Extract user data form the decoded refresh token payload
        const userData = decoded.user;

        //Generate a new access token
        const newAccessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "10m"})

        //send new access token back to the client
        res.cookie("token", newAccessToken)
        res.status(200).json({message: "Token refresh successfully"})
    })
})

// app.get("/adminusers", async (req, res) => {
//     try {
//         const result = await AdminUsers.find().exec();
//         res.json(result);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ message: "An internal server issue" });
//     }
// });




app.listen(3001, () => {
    console.log("listening to port 3001")
})

