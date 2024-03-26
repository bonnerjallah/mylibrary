const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const ObjectId = require("mongodb")

const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const bcrypt = require("bcrypt")
const saltRounds = 10

//Moduels
const LibraryUsers = require("./module/libraryusermodel")
const BooksCatalog = require("./module/bookmodel")
const BooksSuggestions = require("./module/booksuggestions")
const ReviewRequestMsg = require("./module/reviewrequest")

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
    origin: ['http://localhost:5175'],
    methods: ["POST, GET, PUT, DELETE"],
    credentials: true
}))

app.use("/booksimages", express.static(path.join(__dirname, "../../shared-assets/public/booksimages")))

app.use("/libraryusersprofilepics", express.static(path.join(__dirname, "../../shared-assets/public/libraryusersprofilepics")))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb (null, path.join(__dirname, "../../shared-assets/public/libraryusersprofilepics"))
    },
    filename: (req, file, cb) => {
        cb (null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize:5000000},
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|webp/i;
        const mimeType = fileType.test(file.mimetype);
        const extname = fileType.test(path.extname(file.originalname));

        if(mimeType && extname) {
            return cb(null, true)
        }

        cb(new Error("Give proper file format to upload"))
    }
})

//Get books form catalog
app.get("/catalogbooks", async (req, res) => {
    try {
        const results = await BooksCatalog.find().exec()

        res.json(results)

    } catch (error) {
        console.log("Error fetch books", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Get suggested books
app.get("/suggestedBooks", async (req, res) => {
    try {
        const results = await BooksSuggestions.find().exec()

        res.json(results)
        
    } catch (error) {
        console.log("Error fetching suggested books from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Get users you following
app.get("/usersToFollow", async(req, res) => {
    try {
        const results = await LibraryUsers.find().select("_id username profilepic reviewer").exec()

        return res.json(results)

    } catch (error) {
        console.log("Error fetching all users form database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.put("/updatebookonshelves/:bookid/:_id", async(req, res) => {
    try {
        const {_id, bookid} = req.params
        const {Action} = req.body

        console.log(req.body)

        user = await LibraryUsers.findById(_id)

        user.shelf.forEach(item => {
            if(item.bookid === bookid) {
                if(Action === "Completed"){
                    item.completed = bookid;
                    item.forlater = ""
                } else if(Action === "In Progress") {
                    item.inprogress = bookid;
                    item.forlater = "";
                } else if(Action === "I own this") {
                    item.iown = bookid;
                } else {
                    return
                }
            }

        })

        user.markModified('shelf');

        const result = await user.save()

        return res.json(result)

        
    } catch (error) {
        console.log("errro updating book", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

app.delete("/deletefromshelves/:bookid/:_id", async(req, res) => {
    try {
        const {bookid, _id} = req.params

        console.log(bookid)

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({message: "Invalid objectId format"})
        }

        const user = await LibraryUsers.findById(_id)

        if(!user) {
            return res.status(404).json({message: "user not found"})
        }

        user.shelf = user.shelf.filter(item => item.bookid !== bookid)

        const result = await user.save()

        return res.json(result)
        
    } catch (error) {
        console.log("error deleting book", error)
        return res.status(500).json({message: "Internal server error"})
    }

})

//Follow other users logic
app.post("/followRequest", async (req, res) => {
    const { _id, followerId } = req.body;

    try {
        // Check if the user is already following the user being followed
        const follower = await LibraryUsers.findById(followerId);

        if (follower.following.includes(_id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }
        
        const updatedFollower = await LibraryUsers.findByIdAndUpdate(
            followerId,
            { $push: { following:  _id } },
            { new: true }
        );

        const userBeingFollowed = await LibraryUsers.findByIdAndUpdate(
            _id,
            { $push: { followers:  followerId} } ,
            { new: true }
        );

        return res.status(200).json({ updatedFollower, userBeingFollowed });

    } catch (error) {
        console.log("Error following user", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

//Set user shelf
app.post("/setbookshelf", async(req, res) => {
    try {
        const {userid, bookid} = req.body

        // Check if the user exists
        const user = await LibraryUsers.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the book is already on the shelf
        const bookExists = user.shelf.some(item => item.bookid === bookid);
        if (bookExists) {
            return res.status(400).json({ message: "Book already added to your shelf" });
        }

        const result = await LibraryUsers.findByIdAndUpdate(
            userid,
            {
                $push: {
                    shelf: {
                        bookid,
                        // Initialize other fields if necessary
                        completed: "",
                        inprogress: "",
                        iown: "",
                        forlater: bookid,
                        placeholder: "",
                        date: new Date()
                    }
                }
            },
            { new: true }
        );
        

        if(!result) {
            return res.status(404).json({message: "User not found"})
        }

        return res.status(200).json({result})

    } catch (error) {
        console.log("Error inserting user books to shelf", error)
        return res.status(500).json({message:"Internal server issue"})
    }
})

//Updating multiple fields in the document
app.post("/reviewerinput", async (req, res) => {
    try {
        const { review, bookId, rating, recommend, currentlyreading, userid } = req.body;

        // Create an object to update the document
        const updateObject = {};

        // Check if the fields are present and add them to the update object accordingly
        if (review || bookId || rating || recommend || currentlyreading) {
            updateObject.$push = {
                reviewandrating: {
                    bookId: bookId,
                    review: review,
                    rating: rating,
                    recommend: recommend,
                    currentlyreading: currentlyreading
                }
            };
        }

        const alreadyReviewed = await LibraryUsers.findOne({
            _id: userid,
            reviewandrating : {$elemMatch : {bookId : bookId}}
        })

        if(alreadyReviewed) {
            return res.status(400).json({message: "Already reviewed this book"})
        }

        // Update the user document
        const updatedUser = await LibraryUsers.findByIdAndUpdate(
            userid,
            updateObject,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Review submitted successfully" });

    } catch (error) {
        console.error("Error inserting data", error);
        res.status(500).json({ message: "Internal server issue" });
    }
});

//reviewer request logic
app.post("/reviewerrequest", async (req, res) => {
    try {
        const { bio, avgbooksread, oldenough, id } = req.body;

        if (!bio || !oldenough) {
            return res.status(400).json({ message: "Fill all required fields" });
        }

        const existingRequest = await ReviewRequestMsg.findOne({ userId: id });
        if (existingRequest) {
            return res.status(400).json({ message: "Application is already under review" });
        }

        const results = await ReviewRequestMsg.create(
            {
                shortbio: bio,
                avgbooksread: avgbooksread,
                overage: oldenough,
                userId : id
            }
        );

        console.log("Updated document:", results);

        return res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
        console.log("Error inserting data", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

//register library user
app.post("/registerlibraryusers", upload.single("profilepic"), async (req, res) => {
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
})

//login library user
app.post("/loginlibraryusers", async(req, res) => {
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
                    reviewandrating: results.reviewandrating,
                    shelf: results.shelf
                }

                //Generate Jwt Token
                const accessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "5min"})
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
    const accessToken = req.cookies.token
    if(!accessToken){
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
        const newAccessToken = jwt.sign({user: userData}, jwtSec, {expiresIn: "5min"})

        //Send new refresh token to the client
        res.cookie("token", newAccessToken)
        res.status(200).json({message: "Token refresh successfully"})
    })
})

//Get library user route
app.get("/libraryusers", validateAccessToken, (req, res) => {
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
})

//Logout route
app.post("/logout", (req, res) => {
    res.clearCookie("token", {httpOnly: true, sameSite: "None", secure: true})
    res.clearCookie("refreshToken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({message: "Logged out successfully"})
})

app.listen(3001, () => {
    console.log("listening to port 3001")
})