const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const fs = require('fs')

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
const BookSuggestions = require("./module/booksuggestions")

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
    origin: ['http://localhost:5173'],
    methods: ["POST, GET, PUT, DELETE"],
    credentials: true
}))

app.use("/booksimages", express.static(path.join(__dirname, "../../shared-assets/public/booksimages")))

app.use("/libraryusersprofilepics", express.static(path.join(__dirname, "../../shared-assets/public/libraryusersprofilepics")))

app.use("/postpictures", express.static(path.join(__dirname, "../../shared-assets/public/postpictures")))

// libraryusersprofilepics multer function
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

//postpictures multer function
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb (null, path.join(__dirname, "../../shared-assests/public/postpicture"))
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const postUpload = multer({
    storage: postStorage,
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

//Get all users
app.get("/usersToFollow", async(req, res) => {
    try {
        const results = await LibraryUsers.find().select("_id username profilepic reviewer").exec()

        return res.json(results)

    } catch (error) {
        console.log("Error fetching all users form database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Update user shelf
app.put("/updatebookonshelves/:bookid/:userId", async(req, res) => {
    try {
        const {userId, bookid} = req.params
        const {Action} = req.body

        user = await LibraryUsers.findById(userId)

        user.shelf.forEach(item => {
            if(item.bookid === bookid) {
                if(Action === "Completed"){
                    item.completed = bookid;
                    item.forlater = "";
                    item.inprogress = "";
                    item.iown = "";
                    item.placeholder = ""
                } else if(Action === "In Progress") {
                    item.inprogress = bookid;
                    item.forlater = "";
                    item.completed = "";
                    item.iown = "";
                    item.placeholder = "";
                } else if(Action === "I own this") {
                    item.iown = bookid;
                    item.forlater = "";
                    item.completed = "";
                    item.inprogress = "";
                    item.placeholder = "";
                } else if(Action === "Place hold") {
                    item.placeholder = bookid;
                    item.forlater = "";
                    item.completed = "";
                    item.inprogress = "";
                    item.iown = "";
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

//Update user data
app.put("/edituserdata", upload.single("profilepic"), async (req, res) => {
    try {
        const {userId, username, email, newpwd, address, city, state, postolcode} = req.body
        const UploadProfilePic = req.file ? path.basename(req.file.path) : ""

        console.log(req.body)
        console.log(UploadProfilePic)

        user = await LibraryUsers.findById(userId)

        const previousPic = path.join(__dirname, "../../shared-assets/public/libraryusersprofilepics", user.profilepic )


        if(!user) {
            return res.status(404).json({message: "user not found"})
        }

        if(username !== "") user.username = username
        if(email !== "") user.email = email
        if(newpwd !== "") user.password = newpwd
        if(address !== "") user.address = address
        if(city !== "") user.city = city
        if(state !== "") user.state = state
        if(postolcode !== "") user.postalcode = postolcode 

        // If a new profile picture is uploaded, delete the previous one form image file and update profile pic
        if(UploadProfilePic && fs.existsSync(previousPic)) {
            const previousProfilePic = previousPic
            try {
                fs.unlink(previousProfilePic, (err) => {
                    if(err) {
                        console.log("Error deleting previous profile picture", err)
                    } else {
                        console.log("Previous profile picture file deleted successfully")
                    }
                })
            } catch (error) {
                console.error("Error deleting previous profile picture", error)
            }

            user.profilepic = UploadProfilePic
        }

        await user.save()

        return res.status(200).json({message: "User data updated successfully"})

    } catch (error) {
        console.log("error updating user data", error)
        return res.status(500).json({message : "Internal server Issue"})
    }
})

//Delete book form shelf
app.delete("/deletefromshelves/:bookid/:_id", async(req, res) => {
    try {
        const {bookid, _id} = req.params

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

//Delete messages
app.delete("/deleteMessages/:userId/:msgId", async (req, res) => {
    try {
        const {userId, msgId} = req.params

        console.log(req.params)

        if(!userId || !msgId) {
            return res.status(404).json({message: "Invalid, missing require field"})
        }

        const user = await LibraryUsers.findById(userId)

        if(!user) {
            return res.status(400).json({message: "User not found"})
        }

        user.messages = user.messages.filter(elem => elem._id.toString() !== msgId)

        const result = await user.save()

        return res.json(result)

    } catch (error) {
        console.log("error deleting message form database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

//Remove book form on hold
app.delete("/onholddelete/:elem/:_id", async (req, res) => {
    try {
        const {_id, elem} = req.params
        const bookid = elem

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({message:"Invalid objectId format"})
        }

        const user = await LibraryUsers.findById(_id)

        if(!user) {
            return res.status(404).json({message: "user not found"})
        }

        user.shelf = user.shelf.map(item => {
            if(item.placeholder === bookid) {
                item.placeholder = "",
                item.forlater = bookid
            }
            return item
        })

        const result = await user.save()

        return res.json(result)
        
    } catch (error) {
        console.log("error deleting book on hold", error)
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

//check out book
app.post("/checkoutBook", async (req, res) => {
    try {
        const {userId, bookId, checkOutDate, expectedreturnDate} = req.body

        if(!userId || !bookId || !checkOutDate || !expectedreturnDate) {
            return res.status(400).json({message: "book information missing"})
        }

        const user = await LibraryUsers.findById(userId) 

        if(!user) {
            return res.status(404).json({message: "user not found"})
        }

        const bookInCatalog = await BooksCatalog.findById(bookId)
        const bookFromSuggestion = await BooksSuggestions.findById(bookId)

        let bookAvailable = null

        if(bookInCatalog && bookInCatalog.bookAvailability === "Yes") {
            bookAvailable = bookInCatalog._id 
        } else if (bookFromSuggestion && bookFromSuggestion.bookAvailability === "Yes") {
            bookAvailable = bookFromSuggestion._id
        } else {
            return res.status(404).json({message: "Book not available"})
        }
        
        // Check if the book is already checked out
        if(user.checkout.some(elem => elem.bookid.toString() === bookAvailable.toString())) {
            return res.status(400).json({message: "You already checked out this book"})
        } 

        // Filter the shelf to remove the checked-out book
        const filteredShelf = user.shelf.filter(shelfItem => shelfItem.bookid !== bookAvailable.toString());
        user.shelf = filteredShelf;

        // Add the new checkout entry
        user.checkout.push({
            bookid : bookAvailable,
            checkoutdate : checkOutDate,
            expectedreturndate : expectedreturnDate
        })

        const updateCheckOut = await user.save()

        return res.status(200).json({message: "book checked out", updateCheckOut})
        
    } catch (error) {
        console.log("error checkingout book", error)
        return res.status(500).json({message: "Internal server issue"})
    }
})

// Set user comment on books
app.post("/usercomment", async (req, res) => {

    try {
        const {username, bookid, comment, commRate } = req.body

        console.log(req.body)
        
        if(!username || !bookid || !comment || !commRate) {
            return res.status(400).json({message: "missing require field"})
        }

        const bookExistsInCatalog = await BooksCatalog.exists({ _id: bookid });
        const bookExistsInSuggestions = await BookSuggestions.exists({ _id: bookid });

        if(!bookExistsInCatalog && !bookExistsInSuggestions) {
            return res.status(400).json({message:"book not found"})
        }

        const book = bookExistsInCatalog ? await BooksCatalog.findById(bookid) : await BooksSuggestions.findById(bookid)


        book.comments.push({
            username : username,
            content : comment,
            userRating: commRate
        })

        const updatedBook = await book.save()

        res.status(200).json({ message: "comment updated successfully", updatedBook });

    } catch (error) {
        console.log("Error inserting user comment", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

//Set user messages
app.post("/sendmessage", async (req, res) => {
    try {   
        const { senderId, senderName, senderProfilePic, message, receiverId } = req.body;
        console.log(req.body);

        if (!senderId || !senderName || !senderProfilePic || !message || !receiverId) {
            return res.status(404).json({ message: "Required field missing" });
        }

        const user = await LibraryUsers.findById(receiverId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.messages.push({
            senderId: senderId,
            senderName: senderName,
            senderProfilePic: senderProfilePic,
            content: message
        });

        const updateMessage = await user.save();

        return res.status(200).json({ message: "Message sent", updateMessage });
        
    } catch (error) {
        console.log("Error setting user message", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

//Updating book review field
app.post("/reviewerinput", async (req, res) => {
    try {
        const { review, bookId, rating, recommend, currentlyreading, userid, username, profilepic } = req.body;

        // Check if all required fields are present
        if (!review || !bookId || !rating || !recommend || !currentlyreading || !userid || !username || !profilepic) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the book exists in either BooksCatalog or BookSuggestions collection
        const bookExistsInCatalog = await BooksCatalog.exists({ _id: bookId });
        const bookExistsInSuggestions = await BookSuggestions.exists({ _id: bookId });

        // Handle the case where the book doesn't exist in either collection
        if (!bookExistsInCatalog && !bookExistsInSuggestions) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Get the book document (from either collection)
        const book = bookExistsInCatalog
            ? await BooksCatalog.findById(bookId)
            : await BookSuggestions.findById(bookId);

        // Check if the user has already rated the book
        if (book.reviewandrating.some(elem => elem.reviewerId === userid)) {
            return res.status(400).json({ message: "Already reviewed this book" });
        }

        // Update the book document
        book.reviewandrating.push({
            review: review,
            rating: rating,
            recommend: recommend,
            currentlyreading: currentlyreading,
            reviewerId: userid,
            username : username,
            profilepic : profilepic
        });

        const updatedBook = await book.save();

        res.status(200).json({ message: "Review submitted successfully", updatedBook });

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
                    shelf: results.shelf,
                    checkout: results.checkout,
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