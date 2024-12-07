const Book = require("../models/booksmodel")
const BookSuggestions = require("../models/booksuggestions")
const LibraryUsers = require("../models/libraryusermodel")
const path = require("path")
const fs = require("fs");
const { findById } = require("../models/adminusermodel");


const bookEdit = async (req, res) => {
   
    try {
        const { id } = req.params;
        const { bookTitle, bookAuthor, bookPublishDate, bookAvailability } = req.body;

        // Extract the uploaded image file name, if any
        const imageToEdit = req.file ? path.basename(req.file.path) : "";

        // Find the book to edit
        const itemToEdit = await Book.findById(id);

        if (!itemToEdit) {
            console.log("No item match");
            return res.status(404).json({ message: "No item matches" });
        }

        // Update fields with provided values or keep the existing ones
        itemToEdit.bookTitle = bookTitle ?? itemToEdit.bookTitle;
        itemToEdit.bookAuthor = bookAuthor ?? itemToEdit.bookAuthor;
        itemToEdit.bookPublishDate = bookPublishDate ?? itemToEdit.bookPublishDate;
        itemToEdit.bookAvailability = bookAvailability ?? itemToEdit.bookAvailability;

        // Handle image update
        if (imageToEdit) {
            // Delete previous image if it exists
            if (itemToEdit.bookImageUrl) {
                const previousImage = path.join(__dirname, "../../shared.assets/public/booksimages", itemToEdit.bookImageUrl);

                if (fs.existsSync(previousImage)) {
                    try {
                        await fs.promises.unlink(previousImage);
                        console.log("Previous image deleted");
                    } catch (error) {
                        console.log("Error deleting previous image:", error);
                    }
                } else {
                    console.log("Previous image not found");
                }
            }

            // Update to new image
            itemToEdit.bookImageUrl = imageToEdit;
        }

        // Save updated book details
        await itemToEdit.save();

        return res.status(200).json(itemToEdit);

    } catch (error) {
        console.log("Error updating book:", error);
        return res.status(500,).json({ message: "Internal server issue", error });
    }
};


const sugegestedEdit =  async (req, res) => {
    console.log('req,body', req.body)
    console.log("req.file", req.file)
    try {
        const { id } = req.params
        const {bookTitle, bookAuthor, bookPublishDate, bookAvailability} = req.body

        const suggestedImageToEdit = req.file ? path.basename(req.file.path) : "";

        const suggBookToEdit = await BookSuggestions.findById(id)

        if(!suggBookToEdit) {
            console.log("Item not found")
            return res.status(404).json({message: "No item found"})
        }

        suggBookToEdit.bookTitle = bookTitle ?? suggBookToEdit.bookTitle
        suggBookToEdit.bookAuthor = bookAuthor ?? suggBookToEdit.bookAuthor
        suggBookToEdit.bookPublishDate = bookPublishDate ?? suggBookToEdit.bookPublishDate
        suggBookToEdit.bookAvailability = bookAvailability ?? suggBookToEdit.bookAvailability

        if(suggestedImageToEdit) {
            if(suggBookToEdit.bookImageUrl) {
                const previousImage = path.join(__dirname, "../../shared.assets/public/booksimages", suggBookToEdit.bookImageUrl);

                if (fs.existsSync(previousImage)) {
                    try {
                        await fs.promises.unlink(previousImage);
                        console.log("Previous image deleted");
                    } catch (error) {
                        console.log("Error deleting previous image:", error);
                    }
                } else {
                    console.log("Previous image not found");
                }
            }
            suggBookToEdit.bookImageUrl = suggestedImageToEdit;

        }

    // Save updated book details
    await suggBookToEdit.save();

    return res.status(200).json(suggBookToEdit);

    } catch (error) {
        console.log("Error updating book suggestion data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

//Update user shelf
const updateBooksOnShelves =  async(req, res) => {
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
}


const postOptions = async (req, res) => {
    try {
        const { like, heart, laugh, sad, comment, userId, postId, posterId } = req.body

        console.log(req.body)

        personPost = await LibraryUsers.findById(posterId)

        if (!personPost) {
            return res.status(400).json({ message: "Person that poster not found" })
        }

        post = personPost.posts.find(elem => elem._id.toString() === postId)

        if (!post) {
            return res.status(400).json({ message: "Post not found" })
        }

        post.postcomments.push({
            commenter : userId,
            comment : comment
        })

        // Remove previous reactions
        if (post.postreactions.likeby) {
            post.postreactions.likeby.pull(userId);
        }
        if (post.postreactions.loveby) {
            post.postreactions.loveby.pull(userId);
        }
        if (post.postreactions.laughby) {
            post.postreactions.laughby.pull(userId);
        }
        if (post.postreactions.cryby) {
            post.postreactions.cryby.pull(userId);
        }
        

        // Add new reaction
        if (req.body.heart) {
            if (post.postreactions.loveby) {
                post.postreactions.loveby.push(userId);
            }
        } else if (req.body.like) {
            if (post.postreactions.likeby) {
                post.postreactions.likeby.push(userId);
            }
        } else if (req.body.laugh) {
            if (post.postreactions.laughby) {
                post.postreactions.laughby.push(userId);
            }
        } else if (req.body.sad) {
            if (post.postreactions.cryby) {
                post.postreactions.cryby.push(userId);
            }
        }
        
        await personPost.save()

        return res.status(200).json({ message: "Successfully inserted reaction" })

    } catch (error) {
        console.log("error inserting data", error)
        return res.status(500).json({ message: "Internal server issue" })
    }
}

//Update user data
const editUserData = async (req, res) => {
    try {
        const {userId, username, email, newpwd, address, city, state, postolcode} = req.body
        const UploadProfilePic = req.file ? path.basename(req.file.path) : ""


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
}


module.exports = {bookEdit, sugegestedEdit, updateBooksOnShelves, postOptions, editUserData}