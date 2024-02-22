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
const Book = require("./module/booksmodel")
const BookSuggestions = require("./module/booksuggestions")


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


mongoose.connect("mongodb://localhost:27017/mylibrary")

const jwtSec = process.env.VITE_jwtSecret
const refshToken = process.env.VITE_jwtRefreshSecret


app.use(cookieParser())


app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


//Route for books images
app.use("/booksimages", express.static(path.join(__dirname, "../../shared-assets/public/booksimages")))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../shared-assets/public/booksimages"))
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|webp/
        const mimeType = fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb("Give proper file format to upload")
    }
})

//Get book route
app.get("/books", async (req, res) => {
    try {
        const results = await Book.find().exec()
        res.json(results)
        
    } catch (error) {
        console.log("Error fetching books from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.get("/suggestions", async (req, res) => {
    try {
        const results = await BookSuggestions.find().exec()
        res.json(results)

    } catch (error) {
        console.log("Error fetching book suggestions from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Add book route
app.post("/books", upload.fields([{name: "bookImage", maxCount: 1}, {name: "authorImage", maxCount: 1}]), async (req, res) => {
    try {
        const { bookTitle, bookAuthor, bookGenre, bookIsbn, bookDiscription, bookPublishDate, aboutAuthor, bookAvailability } = req.body;

        if (!bookTitle || !bookAuthor || !bookGenre || !bookIsbn || !bookDiscription || !bookPublishDate || !aboutAuthor) {
            return res.status(400).json({ message: "All field require" });
        }

        const results = await Book.create({
            bookTitle,
            bookAuthor,
            bookGenre,
            bookIsbn,
            bookDiscription,
            bookPublishDate,
            aboutAuthor,
            bookAvailability, 
            bookImageUrl: req.files["bookImage"] ? `${req.files["bookImage"][0].filename}` : "",
            authorImage: req.files["authorImage"] ? `${req.files["authorImage"][0].filename}` : ""
        });

        res.json(results);
    } catch (error) {
        console.error("Error inserting book data", error);
        return res.status(500).json({ message: "Internal server issue", error });
    }
});

//Add suggestions book route
app.post("/suggestions", upload.fields([{name: "bookImage", maxCount: 1}, {name: "authorImage", maxCount: 1}]), async (req, res) => {

    try {
        const {bookTitle, bookAuthor, bookGenre, bookIsbn, bookDiscription, bookPublishDate, aboutAuthor, bookAvailability} = req.body

        if(!bookTitle || !bookAuthor || !bookGenre || !bookIsbn || !bookDiscription || !bookPublishDate || !aboutAuthor) {
            return res.status(400).json({message: "All field require"})
        }

        const results = await BookSuggestions.create({
            bookTitle,
            bookAuthor,
            bookGenre,
            bookIsbn,
            bookDiscription,
            bookPublishDate,
            aboutAuthor,
            bookAvailability,
            bookImageUrl: req.files["bookImage"] ? `${req.files["bookImage"][0].filename}` : "",
            authorImage: req.files["authorImage"] ? `${req.files["authorImage"][0].filename}` : ""            
        })

        res.json(results)

    } catch (error) {
        console.log("Error inserting suggested book", error)
        return res.status(500).json({message: "Internal server issue", error})
    }
})

//Update books routes
app.put("/bookEdit/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { bookTitle, bookAuthor, bookPublishDate, bookAvailability } = req.body;

        const updateObject = {
            bookTitle,
            bookAuthor,
            bookPublishDate,
            bookAvailability
        };

        const results = await Book.findByIdAndUpdate(id, updateObject, { new: true });

        if (!results) {
            console.log("Book not found");
            return res.status(400).json({ message: "Book not found" });
        }

        res.json(results);

    } catch (error) {
        console.log("Error updating book:", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

app.put("/editSuggestedBook/:id", async(req, res) => {
    try {
        const { id } = req.params

        const {bookTitle, bookAuthor, bookPublishDate, bookAvailability} = req.body

        const updateObject = {
            bookTitle,
            bookAuthor,
            bookPublishDate,
            bookAvailability
        }

        const results = await BookSuggestions.findByIdAndUpdate(id, updateObject, { new: true})

        if(!results){
            console.log("Book not found")
            return res.status(400).json({message: "Book not found"})
        }

        res.json(results)

    } catch (error) {
        console.log("Error updating book suggestion data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Deleting books routes
app.delete("/bookdelete/:id", async(req, res) => {

    console.log("received with data", req.body)
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid objectId format"})
        }

        const results = await Book.findByIdAndDelete({ _id: id})

        if(!results){
            return res.status(400).json({message: "Error deleting book"})
        }

        res.json(results)
        
    } catch (error) {
        console.log("Error deleting book form database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.delete("/deletesuggestedbook/:id", async(req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid objectId format"})
        }

        const results = await BookSuggestions.findByIdAndDelete({_id: id})

        if(!results){
            return res.status(400).json({message: "Suggested book deleting error"})
        }

        res.json(results)
        
    } catch (error) {
        console.log("Error deleting book suggested", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Admin sign up route
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

//Admin Login route
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

        //If token is valid, set the user information in req.user
        req.user = decoded.user
        next()
    })
}

//Refresh token route
app.post("/refresh_token", (req, res) => {
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
})

//Get Admin user route
app.get("/adminuser", validateAccessToken, (req, res) => {
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
})

//Admin logOut Route
app.post("/logout", (req, res) => {
    res.clearCookie("token", {httpOnly: true, sameSite: "None", secure: true})
    res.clearCookie("refreshtoken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({message: "Logged out successfully"})
})



app.listen(3001, () => {
    console.log("listening to port 3001")
})

