const Book = require("../models/booksmodel")
const BookSuggestions = require("../models/booksuggestions")
const LibraryUsers = require("../models/libraryusermodel")

//Get book route
const getBooks = async(req, res) => {
    try {
        const results = await Book.find().exec()
        res.json(results)
        
    } catch (error) {
        console.log("Error fetching books from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const getSuggestions = async (req, res) => {
    try {
        const results = await BookSuggestions.find().exec()
        res.json(results)

    } catch (error) {
        console.log("Error fetching book suggestions from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}


/**
 *! CLIENT ROUTES BELOW
*/

//Get all users
const userToFollow =  async (req, res) => {
    try {
        const results = await LibraryUsers.find().select("_id username profilepic reviewer posts").exec()

        return res.json(results)

    } catch (error) {
        console.log("Error fetching all users form database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}



module.exports = {getBooks, getSuggestions, userToFollow}