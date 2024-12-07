const Book = require("../models/booksmodel")
const BookSuggestions = require("../models/booksuggestions")
const LibraryUsers = require("../models/libraryusermodel")

const path = require("path")


//Add book route
const addBooks = async (req, res) => {
    try {
        console.log("data received", req.body)
        const { bookTitle, bookAuthor, bookGenre, bookIsbn, bookDiscription, bookPublishDate, aboutAuthor, bookAvailability, ratings } = req.body;

        if (!bookTitle || !bookAuthor || !bookGenre || !bookIsbn || !bookDiscription || !bookPublishDate || !aboutAuthor, !ratings) {
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
            ratings,
            bookImageUrl: req.files["bookImage"] ? `${req.files["bookImage"][0].filename}` : "",
            authorImage: req.files["authorImage"] ? `${req.files["authorImage"][0].filename}` : ""
        });

        res.json(results);
    } catch (error) {
        console.error("Error inserting book data", error);
        return res.status(500).json({ message: "Internal server issue", error });
    }
};


//Add suggestions book route
const suggestion = async (req, res) => {

    try {
        const {bookTitle, bookAuthor, bookGenre, bookIsbn, bookDiscription, bookPublishDate, aboutAuthor, bookAvailability, ratings} = req.body

        if(!bookTitle || !bookAuthor || !bookGenre || !bookIsbn || !bookDiscription || !bookPublishDate || !aboutAuthor || !ratings) {
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
            ratings,
            bookImageUrl: req.files["bookImage"] ? `${req.files["bookImage"][0].filename}` : "",
            authorImage: req.files["authorImage"] ? `${req.files["authorImage"][0].filename}` : ""            
        })

        res.json(results)

    } catch (error) {
        console.log("Error inserting suggested book", error)
        return res.status(500).json({message: "Internal server issue", error})
    }
}



/**
 *! CLIENT ROUTES
*/


//check out book
const checkOutBooks =  async (req, res) => {
    try {
        const {userId, bookId, checkOutDate, expectedreturnDate} = req.body

        if(!userId || !bookId || !checkOutDate || !expectedreturnDate) {
            return res.status(400).json({message: "book information missing"})
        }

        const user = await LibraryUsers.findById(userId) 

        if(!user) {
            return res.status(404).json({message: "user not found"})
        }

        const bookInCatalog = await Book.findById(bookId)
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
}

const posting =  async (req, res) => {
    try {
        const {userId, whatposted} = req.body
        const uploadedPost = req.file ? path.basename(req.file.path) : ""

        user = await LibraryUsers.findById(userId)

        if(!user) {
            return res.status(400).json({message: "user not found"})
        }

        user.posts.push({
            postpic : uploadedPost,
            postcontent : whatposted,
            postreactions: {
                likeby: [],
                loveby: [],
                laughby: [],
                cryby: []
            },
            postcomments: []
        })  

        await user.save()

        return res.status(200).json({message: "Successfully posted data"})
        
    } catch (error) {
        console.log("Error posting post data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}


//reviewer request logic
const reviewerRequest = async (req, res) => {
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
}

//Set user messages
const sendMessage = async (req, res) => {
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
}

//Follow other users logic
const followRequest = async (req, res) => {
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
}

//Updating book review field
const reviwerInput = async (req, res) => {
    try {
        const { review, bookId, rating, recommend, currentlyreading, userid, username, profilepic } = req.body;

        // Check if all required fields are present
        if (!review || !bookId || !rating || !recommend || !currentlyreading || !userid || !username || !profilepic) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the book exists in either Book or BookSuggestions collection
        const bookExistsInCatalog = await Book.exists({ _id: bookId });
        const bookExistsInSuggestions = await BookSuggestions.exists({ _id: bookId });

        // Handle the case where the book doesn't exist in either collection
        if (!bookExistsInCatalog && !bookExistsInSuggestions) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Get the book document (from either collection)
        const book = bookExistsInCatalog
            ? await Book.findById(bookId)
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
        });

        const updatedBook = await book.save();

        res.status(200).json({ message: "Review submitted successfully", updatedBook });

    } catch (error) {
        console.error("Error inserting data", error);
        res.status(500).json({ message: "Internal server issue" });
    }
}

//Set user shelf
const setBookShelf = async(req, res) => {
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
}

// Set user comment on books
const userComment = async (req, res) => {

    try {
        const {username, bookid, comment, commRate } = req.body

        console.log(req.body)
        
        if(!username || !bookid || !comment || !commRate) {
            return res.status(400).json({message: "missing require field"})
        }

        const bookExistsInCatalog = await Book.exists({ _id: bookid });
        const bookExistsInSuggestions = await BookSuggestions.exists({ _id: bookid });

        if(!bookExistsInCatalog && !bookExistsInSuggestions) {
            return res.status(400).json({message:"book not found"})
        }

        const book = bookExistsInCatalog ? await Book.findById(bookid) : await BookSuggestions.findById(bookid)


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
}



module.exports = {addBooks, suggestion, checkOutBooks, posting, reviewerRequest, sendMessage, followRequest, reviwerInput, setBookShelf, userComment}