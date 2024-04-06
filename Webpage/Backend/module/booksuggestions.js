const mongoose = require("mongoose")

const bookSuggestionsSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    },
    bookGenre: {
        type: [String],
        required: true
    },
    bookIsbn: {
        type: Number,
        required: true
    },
    bookDiscription: {
        type: String,
        required: true
    },
    bookPublishDate: {
        type: Date,
        required: true
    },
    aboutAuthor: {
        type: String,
        required: true
    }, 
    bookAvailability:{
        type: String,
        required: true
    },
    bookImageUrl: {
        type: String,
        required: true
    },
    authorImage:{
        type:String
    },
    Ratings: {
        type: String
    },
    reviewandrating : [{
        review: String,
        rating: Number,
        recommend: String,
        currentlyreading: String,
        reviewerId : String,
        username : String,
        profilepic : String,
        date : {
            type: Date,
            default: Date.now
        }
    }],
    comments:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "libraryUsers",
            required: true
        },
        content: String,
        userRating: Number
    }]
});

const BookSuggestions = mongoose.model("bookSuggestions", bookSuggestionsSchema);

module.exports = BookSuggestions;

