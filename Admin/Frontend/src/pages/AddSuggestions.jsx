import { useState } from "react"
import axios from "axios"


import addsuggestionsstyle from "../styles/addsuggestionsstyle.module.css"

const AddSuggestions = () => {

    const [bookSuggestions, setBookSuggestions] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookGenre: "",
        bookIsbn: "",
        bookPublishDate: "",
        bookDiscription: "",
        aboutAuthor: "",
    })

    const [bookAvailabilityCheckBox, setBookAvailableCheckBox] = useState({
        bookAvailableyes: false,
        bookAvailableno: false
    })

    const [bookImageUrl, setBookImageUrl] = useState(null)
    const [authorImage, setAuthorImage] = useState(null)

    const handleBookImageInput = (e) => {
        setBookImageUrl(e.target.files[0])
    }
    const handleBookSuggestionAuthorImageInput = (e) => {
        setAuthorImage(e.target.files[0])
    }

    const handleInputData = (e, discription) => {
        const {name, value, checked, type} = e.target

        if(type === "checkbox") {
            setBookAvailableCheckBox((prev) => ({
                ...prev,
                [name]: checked,
                [name + "_discription"]: checked ? discription : prev[name + "_discription"]
            }))
        } else if (name === "bookPublishDate") {
            const formatedDate = new Date(value).toISOString().split("T")[0]
            setBookSuggestions((prev) => ({
                ...prev,
                [name]: formatedDate
            }))
        } else {
            setBookSuggestions((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()

        formData.append("bookTitle", bookSuggestions.bookTitle)
        formData.append("bookAuthor", bookSuggestions.bookAuthor)
        formData.append("bookGenre", bookSuggestions.bookGenre)
        formData.append("bookIsbn", bookSuggestions.bookIsbn)
        formData.append("bookPublishDate", bookSuggestions.bookPublishDate)
        formData.append("bookDiscription", bookSuggestions.bookDiscription)
        formData.append("aboutAuthor", bookSuggestions.aboutAuthor)


        //Append checkbox value
        const availability = bookAvailabilityCheckBox.bookAvailableyes ? "Yes" : (bookAvailabilityCheckBox.bookAvailableno ? "No" : "")
        formData.append("bookAvailability", availability)

        //Append images
        if(bookImageUrl) {
            formData.append("bookImage", bookImageUrl, bookImageUrl.name)
        }

        if(authorImage) {
            formData.append("authorImage", authorImage, authorImage.name)
        }


        try {
            const response = await axios.post("http://localhost:3001/suggestions", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })

            if(response.status === 200) {
                console.log("Succesfully inserted book suggestion data")

                setBookSuggestions({
                    bookTitle: "",
                    bookAuthor: "",
                    bookGenre: "",
                    bookIsbn: "",
                    bookPublishDate: "",
                    bookDiscription: "",
                    aboutAuthor: "",
                })

                setBookAvailableCheckBox({
                    bookAvailableyes: false,
                    bookAvailableno: false
                })

                setAuthorImage(null)
                setBookImageUrl(null)

            }

        } catch (error) {
            console.error("Error inserting book suggestion data", error)
        }
    }

    




    return (
        <div>
            

            <div className={addsuggestionsstyle.mainContainer} >
                <form onSubmit={handleFormSubmit} encType="multipart/form-data" method="POST">
                <h1>Add Suggestions</h1>
                <fieldset>
                    <label htmlFor="title"></label>
                    <input type="text" name="bookTitle" id="title" placeholder="Book Title" value={bookSuggestions.bookTitle} required onChange={handleInputData}  />

                    <label htmlFor="author"></label>
                    <input type="text" name="bookAuthor" id="author" placeholder="Book Author" value={bookSuggestions.bookAuthor} required onChange={handleInputData} />

                    <label htmlFor="genre"></label>
                    <input type="text" name="bookGenre" id="genre" placeholder="Book Genre" value={bookSuggestions.bookGenre} required onChange={handleInputData} />

                    <label htmlFor="isbn"></label>
                    <input type="number" name="bookIsbn" id="isbn" placeholder="ISBN" value={bookSuggestions.bookIsbn} required onChange={handleInputData} />

                    <label htmlFor="publishDate"></label>
                    <input type="date" name="bookPublishDate" id="publishDate" placeholder="Publish Date" value={bookSuggestions.bookPublishDate} required onChange={handleInputData} />

                    <label htmlFor="description"></label>
                    <textarea name="bookDiscription" id="description" cols="30" rows="10" placeholder="Description" value={bookSuggestions.bookDiscription} required onChange={handleInputData}></textarea>

                    <label htmlFor="bookimg" style={{display: "flex", border: "1px solid black", flexDirection: 'column', margin: ".5rem"}}> Book Image:
                    <input type="file" name="bookImage" id="bookimg" accept="image/*"  placeholder="Images" required style={{cursor: 'pointer'}} onChange={handleBookImageInput} />
                    </label>

                    <div className={addsuggestionsstyle.innerfieldset}>
                        <div>
                            <h3>Availability</h3>
                        </div>

                        <div className={addsuggestionsstyle.availibilityWrapper}>
                            <label htmlFor="availableYes">Yes</label>
                            <input type="checkbox" name="bookAvailableyes" checked={bookAvailabilityCheckBox.bookAvailableyes} id="availableYes" onChange={(e) => {handleInputData(e, "Yes")}} />

                            <label htmlFor="availableno">No</label>
                            <input type="checkbox" name="bookAvailableno" id="availableno" checked={bookAvailabilityCheckBox.bookAvailableno} onChange={(e) => {handleInputData(e, "No")}} />
                        </div>
                    </div>

                    <div className={addsuggestionsstyle.textareaWrapper}>
                        <label htmlFor="about">About Author:
                            <textarea name="aboutAuthor" id="about" cols="30" rows="10" value={bookSuggestions.aboutAuthor} placeholder="About Author" required onChange={handleInputData}> </textarea>
                        </label>
                    </div>

                    
                    <label htmlFor="bookimg" style={{display: "flex", border: "1px solid black", flexDirection: 'column', margin: ".5rem"}}> Author Image:
                    <input type="file" name="bookImage" id="bookimg" accept="image/*"  placeholder="Images" required style={{cursor: 'pointer'}} onChange={handleBookSuggestionAuthorImageInput} />
                    </label>

                </fieldset>

                <div>
                    <button type="submit" className={addsuggestionsstyle.addButton}>Submit</button>
                </div>
                </form>
            </div>        
        </div>
    )
}

export default AddSuggestions