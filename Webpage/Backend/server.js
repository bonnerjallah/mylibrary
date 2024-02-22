const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")

const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const saltRounds = 10

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/mylibrary")

app.use(cookieParser())

app.use(cors ({
    origin: ["http://localhost:5173"],
    methods: ["POST, GET, PUT"],
    credentials: true
}))

app.get("/books", async(req, res) => {
    return res.send("hello from the backend")
})

app.listen(3001, () => {
    console.log("listening to port 3001")
})