import { useState, useEffect } from "react"
import axios from "axios"


import addbookstyle from "../styles/addbookstyle.module.css"



const AddBook = () => {

  const [bookData, setBookData] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookGenre: "",
    bookIsbn: "",
    bookDiscription: "",
    bookPublishDate: "",
    aboutAuthor: ""
  })

  const [bookAvailableCheckBox, setBookAvailableCheckBox] = useState({
    bookAvailableyes: false,
    bookAvailableno: false,
  })

  const [bookImageUrl, setBookImageUrl] = useState(null)
  const [authorImage, setAuthorImage] = useState(null)

  const handleBookImagesInput = (e) => {
    setBookImageUrl(e.target.files[0])
  }

  const handleAuthorImageInput = (e) => {
    setAuthorImage(e.target.files[0])
  }

  const handleBookInput = (e, discription) => {
    const {name, value, checked, type} = e.target

    if(type === "checkbox") {
      setBookAvailableCheckBox((prev) => ({
        ...prev, 
        [name]: checked, 
        [name + "_discription"]: checked ? discription : prev[name + "_discription"]
      }))
    } else if (name === "bookPublishDate") {
      const formatedDate = new Date(value).toISOString().split("T")[0]
      setBookData((prev) => ({
        ...prev,
        [name]: formatedDate
      }))
    } else {
      setBookData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }



  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("bookTitle", bookData.bookTitle)
    formData.append("bookAuthor", bookData.bookAuthor)
    formData.append("bookGenre", bookData.bookGenre)
    formData.append("bookIsbn", bookData.bookIsbn)
    formData.append("bookDiscription", bookData.bookDiscription)
    formData.append("bookPublishDate", bookData.bookPublishDate)
    formData.append("aboutAuthor", bookData.aboutAuthor)

    // Append availability to FormData
    const availability = bookAvailableCheckBox.bookAvailableyes ? "Yes" : (bookAvailableCheckBox.bookAvailableno ? "No" : "");
    formData.append("bookAvailability", availability);



    //Append images
    if(bookImageUrl) {
      formData.append("bookImage", bookImageUrl, bookImageUrl.name)
    }

    if(authorImage) {
      formData.append("authorImage", authorImage, authorImage.name)
    }


    try {
      const response = await axios.post("http://localhost:3001/books", formData, {
        headers: {'Content-type': 'multipart/form-data'}
      })

      if(response.status === 200) {

        setBookData({
          bookTitle: "",
          bookAuthor: "",
          bookGenre: "",
          bookIsbn: "",
          bookDiscription: "",
          bookPublishDate: "",
          aboutAuthor: ""
        })

        setBookAvailableCheckBox({
          bookAvailableyes: false,
          bookAvailableno: false,
        })

        setBookImageUrl(null)
        setAuthorImage(null)

      } else{
        console.log("Error inserting book data", response.data)
      }

    } catch (error) {
      console.error("Error inserting book data", error)
    }

  }


  return (
    <div className={addbookstyle.mainContainer} >
      <form onSubmit={handleFormSubmit} encType="multipart/form-data" method="POST">
        <h1>Add Books</h1>
        <fieldset>
          <label htmlFor="title"></label>
          <input type="text" name="bookTitle" id="title" value={bookData.bookTitle} placeholder="Book Title" required onChange={handleBookInput}  />

          <label htmlFor="author"></label>
          <input type="text" name="bookAuthor" id="author" value={bookData.bookAuthor} placeholder="Book Author" required onChange={handleBookInput} />

          <label htmlFor="genre"></label>
          <input type="text" name="bookGenre" id="genre" value={bookData.bookGenre} placeholder="Book Genre" required onChange={handleBookInput} />

          <label htmlFor="isbn"></label>
          <input type="number" name="bookIsbn" id="isbn" value={bookData.bookIsbn} placeholder="ISBN" required onChange={handleBookInput} />

          <label htmlFor="publishDate"></label>
          <input type="date" name="bookPublishDate" id="publishDate" value={bookData.bookPublishDate} placeholder="Publish Date" required onChange={handleBookInput} />

          <label htmlFor="description"></label>
          <textarea name="bookDiscription" id="description" value={bookData.bookDiscription} cols="30" rows="10" placeholder="Description" required onChange={handleBookInput}></textarea>

          <label htmlFor="bookimg" style={{display: "flex", border: "1px solid black", flexDirection: 'column', margin: ".5rem"}}> Book Image:
          <input type="file" name="bookImage" id="bookimg" accept="image/*"  placeholder="Images" required style={{cursor: 'pointer'}} onChange={handleBookImagesInput} />
          </label>
          

          <div className={addbookstyle.innerfieldset}>
              <div>
                <h3>Availability</h3>
              </div>
              
              <div className={addbookstyle.availibilityWrapper}>
                <label htmlFor="availableYes">Yes</label>
                <input type="checkbox" name="bookAvailableyes" checked={bookAvailableCheckBox.bookAvailableyes} id="availableYes" onChange={(e) => {handleBookInput(e, "Yes")}} />

                <label htmlFor="availableno">No</label>
                <input type="checkbox" name="bookAvailableno" checked={bookAvailableCheckBox.bookAvailableno} id="availableno" onChange={(e) => {handleBookInput(e, "No")}} />
              </div>
            
          </div>

          <div className={addbookstyle.textareaWrapper}>
            <label htmlFor="about">About Author:
              <textarea name="aboutAuthor" id="about" cols="30" rows="10" value={bookData.aboutAuthor}  placeholder="About Author" onChange={handleBookInput}>  </textarea>
            </label>
          </div>

          <label htmlFor="AuthImage" style={{display: "flex", border: "1px solid black", flexDirection: 'column', margin: ".5rem"}}> Author Image:
          <input type="file" name="authorImage" id="AuthImage" accept="image/*" placeholder="Images" required style={{cursor: 'pointer'}} onChange={handleAuthorImageInput} />
          </label>
          

        </fieldset>

        <div>
          <button type="submit" className={addbookstyle.addButton}>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default AddBook