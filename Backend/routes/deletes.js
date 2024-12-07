const mongoose = require("mongoose"); 
const Book = require("../models/booksmodel");
const BookSuggestions = require("../models/booksuggestions");
const LibraryUsers = require("../models/libraryusermodel")


// Deleting books route
const bookDelete = async (req, res) => {
    console.log("received with data", req.body);
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid objectId format" });
        }

        const results = await Book.findByIdAndDelete(id); // No need for `{ _id: id }`, `id` is sufficient.

        if (!results) {
            return res.status(400).json({ message: "Error deleting book" });
        }

        return res.json(results);
    } catch (error) {
        console.log("Error deleting book from database", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Deleting book suggestions route
const suggestionsDelete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid objectId format" });
        }

        const results = await BookSuggestions.findByIdAndDelete(id); // Consistent usage

        if (!results) {
            return res.status(400).json({ message: "Suggested book deleting error" });
        }

        return res.json(results);
    } catch (error) {
        console.log("Error deleting book suggestion", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

 //Delete book form shelf
const deleteFromShelves = async (req, res) => {
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
}

//Remove book form on hold
const onHoldDelete = async (req, res) => {
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
}

//Delete messages
const deleteMessage =  async (req, res) => {
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
}


module.exports = { bookDelete, suggestionsDelete, deleteFromShelves, onHoldDelete, deleteMessage, };
