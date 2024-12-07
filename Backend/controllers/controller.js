require("dotenv").config()
const bcrypt = require("bcrypt")
const path = require("path")
const saltRounds = 10
const jwt = require("jsonwebtoken")

const AdminUsers = require("../models/adminusermodel")
const LibraryUsers = require("../models/libraryusermodel")

const jwtSec = process.env.ADMIN_JWT_SECRET
const refshToken = process.env.ADMIN_JWT_REFRESH_SECRET

const cltJwtSec = process.env.CLIENT_JTW_SECRET
const cltRefshToken = process.env.CLENT_JWT_REFRESH_SECRET

// Admin sign up route
const registerAdmin = async(req, res) => {
    try {
        const{firstname, lastname, email, username, password} = req.body

        if(!firstname || !lastname || !email || !username || !password) {
           return res.status(400).json({message: "All fields required"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existingUser = await AdminUsers.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPwd = await bcrypt.hash(password, saltRounds)

        const results = await AdminUsers.create({...req.body, password: hashPwd})

        res.json(results)

    } catch (error) {
        console.error("Error adding admin user", error)
        res.status(500).json({message: "Internal server issue"})
    }
}

//Admin Login route
const loginAdmin = async (req, res) => {
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

                return res.status(200).json({
                    message: "Login Successful", 
                    userData: userData
                })

            } else {
                return res.status(401).json({message: "Invalid Password"})
            }
        } else {
            return res.status(404).json({message: "Invalid Username"})
        }

    } catch (error) {
        console.error("Error login in user", error)
        res.status(500).json({message: "Internal server issue"})
    }
}

//Refresh token route
const refreshAdminToken = async (req, res) => {
    //Check if a valid refresh token is present in the request cookies
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({error: "refresh token is missing"})
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
}

//Middleware to validate access token
const adminValidateAccessToken = (req, res, next) => {
    const accessToken = req.cookies.token; //Because the token was sent with cookie
    if(!accessToken) {
        return res.status(401).json({error: "Access token is missing"})
    }

    jwt.verify(accessToken, jwtSec, (err, decoded) => {
        if(err) {
            console.error("Error verifying access token", err)
            return res.status(401).json({error: "Invalid access token"})
        }

        //If token is valid, set the user information in req.user
        req.user = decoded.user
        next()
    })
}

//Get Admin user route
const getAdminUser = async (req, res) => {
    try {
        if(req.user) {
            return res.status(200).json({valid: true, user: req.user})
        } else {
            console.error("Token validation failed")
            return res.status(401).json({valid: false, error: "Unauthorized user"})
        }
    } catch (error) {
        console.error("Error fetching user", error)
        return res.status(500).json({error: "Internal server error"})
    }
}

//Admin logOut Route
const adminLogOut = async (req, res) => {
    res.clearCookie("token", {httpOnly: true, sameSite: "None", secure: true})
    res.clearCookie("refreshtoken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({message: "Logged out successfully"})
}

/**
 * ! CLIENT ROUTES
 */

const clientRegister = async (req, res) => {

    try {
        const {firstname, lastname, birthday, address, city, state, postalcode, phonenumber, email, username, password} = req.body;

        const profilepic = req.file ? path.basename(req.file.path) : ''; // Extracts only the file name
        
        
        if(!firstname || !lastname || !birthday || !address || !city || !state || !postalcode || !email || !username || !password) {
            return res.status(400).json({message: "All fields Required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email address"});
        }

        const hashPwd = await bcrypt.hash(password, saltRounds)

        const newUser = await LibraryUsers.create({...req.body, password: hashPwd, profilepic})

        return res.json(newUser)   
        
    } catch (error) {
        console.log("Error inserting register data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const clientLogin = async (req, res) => {
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
                    userName: results.username,
                    profilepic: results.profilepic,
                    followers: results.followers,
                    following: results.following,
                    messages: results.messages,
                    reviewer: results.reviewer,
                    shelf: results.shelf,
                    checkout: results.checkout,
                }

                //Generate Jwt Token
                const accessToken = jwt.sign({user: userData}, cltJwtSec, {expiresIn: "5min"})
                const refresh_token = jwt.sign({user: userData}, cltRefshToken, {expiresIn: "1hr"})

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
}

//Refresh token route
const refreshClientToken = async (req, res) => {
    //Check if a valid refresh token is present in the request cookie
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({error: "refresh token is missing"})
    }

    //Verify refresh token
    jwt.verify(refreshToken, cltRefshToken, (err, decoded) => {
        if(err){

            //Token valid or has expire
            return res.status(401).json({error: "Invalid or expired refresh token"})
        }

        //Extract user data from the decoded refresh token payload
        const userData = decoded.user

        //Generate a new refresh token
        const newAccessToken = jwt.sign({user: userData}, cltJwtSec, {expiresIn: "5min"})

        //Send new refresh token to the client
        res.cookie("token", newAccessToken)
        res.status(200).json({message: "Token refresh successfully"})
    })
}

//Middleware to validate access token
const clientValidateAccessToken = (req, res, next) => {
    const accessToken = req.cookies.token; //Because the token was sent with cookie
    if(!accessToken) {
        return res.status(401).json({error: "Access token is missing"})
    }

    jwt.verify(accessToken, cltJwtSec, (err, decoded) => {
        if(err) {
            console.error("Error verifying access token", err)
            return res.status(401).json({error: "Invalid access token"})
        }

        //If token is valid, set the user information in req.user
        req.user = decoded.user
        next()
    })
}

//Get Client user route
const getLibraryUser = async (req, res) => {
    try {
        if(req.user){
            return res.json({valid: true, user: req.user})
        }else {
            console.error("Token validation failed")
            return res.status(401).json({valid: false, error: "Unauthorized user"})
        }
    } catch (error) {
        console.error("Error fetching user", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

//Client Logout route
const clientLogOut =  (req, res) => {
    res.clearCookie("token", {httpOnly: true, sameSite: "None", secure: true})
    res.clearCookie("refreshToken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({message: "Logged out successfully"})
}

module.exports = {registerAdmin, loginAdmin, refreshAdminToken, adminValidateAccessToken, getAdminUser, clientRegister, clientLogin, getLibraryUser, refreshClientToken, clientValidateAccessToken, clientLogOut, adminLogOut}
