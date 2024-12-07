const express = require("express")
const multer = require("multer")
const path = require("path")

const {registerAdmin, loginAdmin, refreshAdminToken, adminValidateAccessToken, getAdminUser, clientRegister, clientLogin, getLibraryUser, clientValidateAccessToken, refreshClientToken, adminLogOut, clientLogOut} = require("../controllers/controller")
const { addBooks , suggestion, checkOutBooks, posting, reviewerRequest, sendMessage, followRequest, reviwerInput, setBookShelf, userComment} = require("./posts");
const { getBooks, getSuggestions, userToFollow } = require("./gets");
const { bookDelete, suggestionsDelete, deleteFromShelves, onHoldDelete, deleteMessage } = require("./deletes");
const { bookEdit, sugegestedEdit, updateBooksOnShelves, postOptions, editUserData } = require("./updates");


const router = express.Router()



router.use(express.json())
router.use(express.urlencoded({extended: true}))

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname, "../../shared-assets/public/booksimages"))
    },
    filename:(req, file, cb) => {
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

//Profile Pic multer
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../shared-assets/public/libraryusersprofilepics"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const profilePicUpload = multer({
    storage: profileStorage,
    limits: {fileSize:5000000},
    fileFilter:(req, file, cb) => {
        const fileType = /jpeg|jpg|png|jfif|webp/i;
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
        cb (null, path.join(__dirname, "../../shared-assets/public/postpictures"))
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const postUpload = multer({
    storage: postStorage,
    limits: {fileSize:5000000},
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|jfif|webp/i;
        const mimeType = fileType.test(file.mimetype);
        const extname = fileType.test(path.extname(file.originalname));

        if(mimeType && extname) {
            return cb(null, true)
        }

        cb(new Error("Give proper file format to upload"))
    }
})

router.get("/books", getBooks)
router.get("/suggestions", getSuggestions)
router.get("/adminuser", adminValidateAccessToken, getAdminUser)
router.get("/libraryusers", clientValidateAccessToken, getLibraryUser)
router.get("/usersToFollow", userToFollow)
  
router.post("/registeradminusers", registerAdmin)
router.post("/registerlibraryusers", profilePicUpload.single("profilepic"), clientRegister)
router.post("/loginlibraryusers", clientLogin)
router.post("/loginAdmin", loginAdmin)
router.post("/refresh_token", refreshAdminToken)
router.post("/refreshClient_token", refreshClientToken)
router.post("/addBooks", upload.fields([{name: "bookImage", maxCount: 1}, {name: "authorImage", maxCount: 1}]), addBooks)
router.post("/suggestions", upload.fields([{name: "bookImage", maxCount: 1}, {name: "authorImage", maxCount: 1}]), suggestion)
router.post("/logout", adminLogOut)
router.post("/checkoutBook", checkOutBooks )
router.post("/posting", postUpload.single("imagePost"), posting)
router.post("/reviewerrequest", reviewerRequest)
router.post("/reviewerinput", reviwerInput)
router.post("/sendmessage", sendMessage)
router.post("/followRequest", followRequest)
router.post("/setbookshelf", setBookShelf )
router.post("/clientLogout", clientLogOut)
router.post("/usercomment", userComment)

router.delete("/bookdelete/:id", bookDelete)
router.delete("/deletesuggestedbook/:id", suggestionsDelete)
router.delete("/deletefromshelves/:bookid/:_id", deleteFromShelves)
router.delete("/onholddelete/:elem/:_id", onHoldDelete)
router.delete("/deleteMessages/:userId/:msgId", deleteMessage)

router.put("/bookEdit/:id", upload.single("bookImage"), bookEdit);
router.put("/editSuggestedBook/:id", upload.single("bookImage"), sugegestedEdit)
router.put("/updatebookonshelves/:bookid/:userId", updateBooksOnShelves)
router.put("/postoptions", postOptions)
router.put("/edituserdata", profilePicUpload.single("profilepic"), editUserData )


module.exports = router